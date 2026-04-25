#!/usr/bin/env node
// DOM-hydration tests for widget registry entries that ship with a runtime
// `js/widget-<slug>.js` library. Complements scripts/test-widget-renderers.mjs:
// the renderer tests check that renderMarkup/renderScript are pure strings
// containing the right widgetId; this test boots a jsdom, runs the library
// and the rendered <script>, and asserts the host div actually got
// populated.
//
// For every slug under widgets/<slug>/:
//   - Skip if there is no js/widget-<slug>.js (legacy / page-bespoke widgets).
//   - Pull every fixture (example.json + examples/*.json) and every instance
//     in content/*.json that points at this slug.
//   - For each (slug, params): boot jsdom, load the library, append the
//     renderMarkup output into <body>, eval the renderScript output, give
//     scripts a tick, then assert:
//       * no jsdomError / window.error events
//       * the host div with id=params.widgetId has ≥1 child element
//         (chrome — header, controls, SVG, etc. — built by the library)
//
// KaTeX comes from a CDN we don't reach in CI, so we pre-stub
// window.katex / window.renderMathInElement before running scripts.
//
// Run via:
//   node --test scripts/test-widget-hydration.mjs

import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const scriptsDir = dirname(__filename);
const repoRoot = resolve(scriptsDir, '..');
const widgetsDir = join(repoRoot, 'widgets');
const contentDir = join(repoRoot, 'content');
const jsDir = join(repoRoot, 'js');

const { JSDOM, VirtualConsole } = await import(
  pathToFileURL(join(scriptsDir, 'node_modules', 'jsdom', 'lib', 'api.js')).href
);

function listSlugs() {
  return readdirSync(widgetsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => existsSync(join(widgetsDir, name, 'schema.json')))
    .sort();
}

function libPathFor(slug) {
  const direct = join(jsDir, `widget-${slug}.js`);
  if (existsSync(direct)) return direct;
  return null;
}

function walkBlocks(node, visit) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const x of node) walkBlocks(x, visit);
    return;
  }
  if (node.type === 'widget') visit(node);
  for (const v of Object.values(node)) walkBlocks(v, visit);
}

function loadInstances(slug) {
  const out = [];
  if (existsSync(contentDir)) {
    for (const f of readdirSync(contentDir).sort()) {
      if (!f.endsWith('.json')) continue;
      const topic = f.replace(/\.json$/, '');
      const data = JSON.parse(readFileSync(join(contentDir, f), 'utf8'));
      walkBlocks(data, (b) => {
        if (b.slug === slug) out.push({ topic, params: b.params || {} });
      });
    }
  }
  const single = join(widgetsDir, slug, 'example.json');
  if (existsSync(single)) {
    out.push({ topic: 'fixture:example.json', params: JSON.parse(readFileSync(single, 'utf8')) });
  }
  const examplesDir = join(widgetsDir, slug, 'examples');
  if (existsSync(examplesDir)) {
    for (const f of readdirSync(examplesDir).sort()) {
      if (!f.endsWith('.json')) continue;
      out.push({
        topic: `fixture:examples/${f}`,
        params: JSON.parse(readFileSync(join(examplesDir, f), 'utf8')),
      });
    }
  }
  return out;
}

function makeDom(libSrc) {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => errors.push(`jsdomError: ${e && (e.stack || e.message || e)}`));
  vc.on('error', (e) => errors.push(`error: ${e && (e.message || e)}`));

  // Minimal page shell: <body> only. Pre-stub KaTeX + a no-op MVProgress so
  // libraries that probe for them don't blow up.
  const html = `<!doctype html><html><body></body></html>`;
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole: vc,
    url: 'file:///widget-hydration-test/',
  });

  const w = dom.window;
  w.katex = { render: () => {}, renderToString: () => '' };
  w.renderMathInElement = () => {};
  w.MVProgress = {
    isMastered: () => false,
    isMasteredTier: () => false,
    setMastered: () => {},
    list: () => [],
  };

  // Load the runtime library by injecting a script tag with raw source.
  // Wrapping in an IIFE-ish runScripts via document.write would re-write the
  // body, so we use createElement instead.
  const script = w.document.createElement('script');
  script.textContent = libSrc;
  w.document.head.appendChild(script);

  return { dom, errors };
}

const slugs = listSlugs();

for (const slug of slugs) {
  const libPath = libPathFor(slug);
  if (!libPath) continue;
  const libSrc = readFileSync(libPath, 'utf8');
  const indexUrl = pathToFileURL(join(widgetsDir, slug, 'index.mjs')).href;
  const instances = loadInstances(slug);

  describe(`widget hydration: ${slug}`, () => {
    let mod;
    before(async () => {
      mod = await import(indexUrl);
    });

    for (const { topic, params } of instances) {
      const widgetId = params.widgetId || '<no-id>';
      test(`${topic}/${widgetId} hydrates`, () => {
        const markup = mod.renderMarkup(params);
        const scriptHtml = mod.renderScript(params);

        const { dom, errors } = makeDom(libSrc);
        const w = dom.window;
        const doc = w.document;

        // Append the widget host div.
        const holder = doc.createElement('div');
        holder.innerHTML = markup;
        doc.body.appendChild(holder);

        // Extract the inner JS from the <script>...</script> wrapper and run it.
        const m = scriptHtml.match(/<script>([\s\S]*?)<\/script>/);
        assert.ok(m, 'renderScript must wrap output in <script>…</script>');
        const inner = doc.createElement('script');
        inner.textContent = m[1];
        doc.body.appendChild(inner);

        assert.deepEqual(
          errors,
          [],
          `script execution surfaced errors:\n${errors.join('\n')}`,
        );

        const host = doc.getElementById(params.widgetId);
        assert.ok(host, `host div #${params.widgetId} should exist after markup`);
        assert.ok(
          host.children.length > 0,
          `host div #${params.widgetId} should have ≥1 child after init (library hydration); ` +
            `found ${host.children.length}`,
        );

        dom.window.close();
      });
    }
  });
}
