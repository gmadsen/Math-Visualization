#!/usr/bin/env node
// jsdom DOM-execution test for topic pages. Each topic HTML is loaded into
// jsdom with scripts allowed to run, then asserted on:
//
//   - No `jsdomError` events while scripts execute (script-level crashes,
//     reference errors, etc.).
//   - The page-global helper script ran (window.$ / window.SVG defined).
//   - aside.sidetoc has ≥1 anchor (TOC populated by helper).
//   - At least one .widget host on the page.
//   - For each .widget that the page boots via an `MV<Lib>.init(…)` call
//     pointing at an `id` we can resolve, the host has ≥1 child element.
//   - For each .quiz[data-concept] placeholder, after MVQuiz.init runs we
//     see a header (`.hd .ttl`) with non-empty text.
//
// KaTeX is loaded over CDN, which is unreachable in CI, so we pre-stub
// `window.katex` and `window.renderMathInElement`. That means we cannot
// assert that math actually rendered visually (no real auto-render pass);
// instead we assert that the page registered enough state for KaTeX to
// have rendered if it had run — `renderMathInElement` is *invoked* on the
// quiz title host (catches the bug class where `quiz.title` ends up in
// innerHTML but never reaches typeset()).
//
// Local libs (js/*, quizzes/bundle.js, etc.) are loaded by reading them off
// disk and replacing matched <script src> tags with inline scripts — jsdom's
// `resources: 'usable'` would issue real HTTP requests against `file://`
// which hits jsdom's same-origin restrictions for cross-protocol fetches.
//
// Run via:
//   node --test scripts/test-topic-jsdom.mjs                    # all topics
//   node --test scripts/test-topic-jsdom.mjs -- --only foo,bar  # subset
//   TOPIC_JSDOM_ONLY=foo,bar node --test scripts/test-topic-jsdom.mjs

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const scriptsDir = dirname(__filename);
const repoRoot = resolve(scriptsDir, '..');

const { JSDOM, VirtualConsole } = await import(
  pathToFileURL(join(scriptsDir, 'node_modules', 'jsdom', 'lib', 'api.js')).href
);

// Pages we don't jsdom-boot the same way as topic pages. Capstone "story"
// pages are narrative-only (no sidetoc, no widgets); search.html is a UI
// shell with no concept anchors. They have their own correctness criteria.
const SKIP = new Set([
  'index.html',
  'pathway.html',
  'widgets.html',
  'review.html',
  'search.html',
  'capstone-bsd-story.html',
  'capstone-flt-story.html',
  'capstone-satotate-story.html',
]);

const onlyEnv = process.env.TOPIC_JSDOM_ONLY;
const onlyArg = (() => {
  const i = process.argv.indexOf('--only');
  return i !== -1 ? process.argv[i + 1] : null;
})();
const onlyList = (onlyEnv || onlyArg || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const onlySet = onlyList.length ? new Set(onlyList.map((s) => s.replace(/\.html$/, ''))) : null;

const htmlFiles = readdirSync(repoRoot)
  .filter((f) => f.endsWith('.html') && !SKIP.has(f))
  .filter((f) => !onlySet || onlySet.has(f.replace(/\.html$/, '')))
  .sort();

if (htmlFiles.length === 0) {
  console.log('test-topic-jsdom: no topic HTML files found (after --only filter).');
  process.exit(0);
}

// Read once, cache.
const fileCache = new Map();
function readUtf8(absPath) {
  if (!fileCache.has(absPath)) {
    fileCache.set(absPath, existsSync(absPath) ? readFileSync(absPath, 'utf8') : null);
  }
  return fileCache.get(absPath);
}

// Inline every <script src="./js/..."> or <script src="./quizzes/bundle.js">
// (or relative variants) by reading the file off disk. Drop CDN scripts
// (KaTeX) — we stub their globals.
const LOCAL_SRC_RE = /<script\b[^>]*\bsrc=["'](\.\/?[^"']+)["'][^>]*>\s*<\/script>/gi;
const CDN_SRC_RE = /<script\b[^>]*\bsrc=["']https?:\/\/[^"']+["'][^>]*>\s*<\/script>/gi;
const CDN_LINK_RE = /<link\b[^>]*\bhref=["']https?:\/\/[^"']+["'][^>]*>/gi;

function inlineLocalScripts(html) {
  let out = html.replace(LOCAL_SRC_RE, (full, src) => {
    const clean = src.replace(/^\.\//, '');
    const abs = join(repoRoot, clean);
    const body = readUtf8(abs);
    if (body == null) {
      return `<!-- missing local script: ${src} -->`;
    }
    return `<script>${body}</script>`;
  });
  // Drop CDN scripts/links so jsdom doesn't try to fetch them.
  out = out.replace(CDN_SRC_RE, '<!-- cdn script dropped -->');
  out = out.replace(CDN_LINK_RE, '<!-- cdn link dropped -->');
  return out;
}

function rawDelimiterCount(text) {
  // Count `$...$` pairs that look like LaTeX (contain a backslash). KaTeX,
  // when it runs, replaces the delimiter pair with rendered math so the
  // count drops to zero. We use this only as a soft check — we stub KaTeX
  // out, so the count being non-zero is *expected*; we just want to make
  // sure it isn't astronomically larger than the un-stubbed count would be
  // (catches double-escaping and similar drift).
  const re = /\$[^\$\n]*\\[a-zA-Z]+[^\$\n]*\$/g;
  const m = text.match(re);
  return m ? m.length : 0;
}

for (const file of htmlFiles) {
  describe(`topic jsdom: ${file}`, () => {
    test('boots without script errors and exposes expected hooks', async () => {
      const abs = join(repoRoot, file);
      const html = readFileSync(abs, 'utf8');
      const inlined = inlineLocalScripts(html);

      const errors = [];
      const vc = new VirtualConsole();
      vc.on('jsdomError', (e) =>
        errors.push(`jsdomError: ${e && (e.stack || e.message || e)}`),
      );
      vc.on('error', (e) => errors.push(`error: ${e && (e.message || e)}`));

      const dom = new JSDOM(inlined, {
        runScripts: 'dangerously',
        pretendToBeVisual: true,
        virtualConsole: vc,
        url: `file://${abs}`,
        beforeParse(window) {
          // Stubs for KaTeX (CDN-blocked here).
          window.katex = {
            render: () => {},
            renderToString: () => '',
          };
          let typesetCount = 0;
          window.renderMathInElement = (el) => {
            typesetCount++;
            // Mimic auto-render behaviour: strip $...$ pairs from text nodes
            // so downstream `rawDelimiterCount` reflects "what KaTeX would
            // have hidden."
            if (!el || !el.querySelectorAll) return;
            const walker = window.document.createTreeWalker(
              el,
              window.NodeFilter.SHOW_TEXT,
              null,
            );
            const targets = [];
            let n;
            while ((n = walker.nextNode())) targets.push(n);
            for (const node of targets) {
              const v = node.nodeValue;
              if (!v || !v.includes('$')) continue;
              node.nodeValue = v
                .replace(/\$\$([^\$]+)\$\$/g, '«math»')
                .replace(/\$([^\$\n]+?)\$/g, '«math»');
            }
          };
          window.__renderMathCalls = () => typesetCount;

          // Storage stubs are unnecessary — jsdom ships localStorage. We
          // do clear it per-page to avoid mastery from a previous test
          // bleeding in.
          try {
            window.localStorage.clear();
          } catch {}

          // jsdom 22 doesn't implement IntersectionObserver; pages that use
          // it (e.g. lazy-loading panes) reference-error otherwise.
          if (typeof window.IntersectionObserver !== 'function') {
            window.IntersectionObserver = class {
              constructor() {}
              observe() {}
              unobserve() {}
              disconnect() {}
              takeRecords() { return []; }
            };
          }
          if (typeof window.ResizeObserver !== 'function') {
            window.ResizeObserver = class {
              constructor() {}
              observe() {}
              unobserve() {}
              disconnect() {}
            };
          }
          if (typeof window.matchMedia !== 'function') {
            window.matchMedia = (q) => ({
              matches: false,
              media: q,
              onchange: null,
              addListener: () => {},
              removeListener: () => {},
              addEventListener: () => {},
              removeEventListener: () => {},
              dispatchEvent: () => false,
            });
          }
        },
      });

      // Give scripts a turn. The page-global helpers and most widget libs
      // run synchronously at parse time; defer-loaded CDN scripts are
      // dropped, so a single microtask is enough.
      await new Promise((r) => setTimeout(r, 50));

      const w = dom.window;
      const doc = w.document;

      assert.deepEqual(
        errors,
        [],
        `script execution surfaced errors:\n${errors.slice(0, 5).join('\n')}` +
          (errors.length > 5 ? `\n…(${errors.length - 5} more)` : ''),
      );

      // The page-global helper script declares `$` / `SVG` with `const`, so
      // they don't attach to window even in a real browser. Use side-effects
      // instead: sidetoc population proves the helper ran end-to-end.
      const sidetocLinks = doc.querySelectorAll('aside.sidetoc a');
      assert.ok(
        sidetocLinks.length > 0,
        `aside.sidetoc has no anchors — helper script's TOC build failed (likely a script error before the build pass)`,
      );

      // Nav-anchor LaTeX guard: each <a href="#…"> in nav.toc gets copied
      // verbatim into aside.sidetoc. Since we ran our stubbed
      // renderMathInElement on document.body, anything KaTeX would have
      // typeset is now rewritten to «math». A nav anchor whose label still
      // contains a bare `\foo` (or `^{…}` outside `$…$` delimiters) means
      // the author wrote raw LaTeX without delimiters, and KaTeX
      // auto-render skipped it — both nav strip and sidetoc render the raw
      // source.
      const navAnchors = doc.querySelectorAll('nav.toc a[href^="#"]');
      for (const a of navAnchors) {
        const text = (a.textContent || '');
        const stripped = text.replace(/«math»/g, '');
        // bare `\foo` or `^_{…}` outside delimiters means raw LaTeX leaked
        if (/\\[a-zA-Z]+/.test(stripped) || /\^\{|\_\{/.test(stripped)) {
          assert.fail(
            `nav.toc anchor "${a.getAttribute('href')}" contains bare LaTeX without $…$ delimiters: "${text.trim().slice(0, 80)}"`,
          );
        }
      }

      // ≥ 1 widget on a content page.
      const widgets = doc.querySelectorAll('.widget');
      assert.ok(widgets.length > 0, `no .widget elements on page`);

      // Widget hosts that are direct registry hosts (empty before script
      // runs, hydrated by `MV<Lib>.init`) should now have child elements.
      // We can't tell hydrated-by-library hosts from author-built widgets
      // without parsing; the looser assertion is just that *some* widget
      // has children.
      const hydrated = [...widgets].filter((w) => w.children.length > 0);
      assert.ok(
        hydrated.length > 0,
        `no .widget host on the page has any child elements — widget libraries did not hydrate`,
      );

      // Quiz placeholders: if any, MVQuiz.init must have stamped a `.hd .ttl`.
      const quizPlaceholders = doc.querySelectorAll('.quiz[data-concept]');
      if (quizPlaceholders.length > 0) {
        assert.equal(
          typeof w.MVQuiz,
          'object',
          'page has .quiz placeholders but window.MVQuiz is undefined (js/quiz.js missing or failed)',
        );
        // MVQuiz.init reads MVQuizBank synchronously when the bundle is loaded
        // (which it is, since we inlined it). After that the placeholders
        // should each have a `.hd .ttl` child.
        for (const ph of quizPlaceholders) {
          const ttl = ph.querySelector('.hd .ttl');
          assert.ok(
            ttl && ttl.textContent && ttl.textContent.trim().length > 0,
            `quiz placeholder data-concept="${ph.getAttribute('data-concept')}" never got a header — MVQuiz.init may have errored`,
          );
          // Quiz titles often carry KaTeX. After our stubbed
          // renderMathInElement runs on the title, the raw `$…$` should
          // have been rewritten to `«math»`. If a `$\foo$` survives in the
          // header, the typeset call on the title was missed (this is the
          // bug class js/quiz.js renderQuiz had pre-fix).
          const stillRaw = rawDelimiterCount(ttl.textContent);
          assert.equal(
            stillRaw,
            0,
            `quiz header for "${ph.getAttribute('data-concept')}" still contains raw LaTeX delimiters — typeset() not called on the title`,
          );
        }
      }

      dom.window.close();
    });
  });
}
