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

// ---------- per-widget parameter sweeps ----------
//
// The hydration tests above prove each widget boots once for its declared
// fixtures. The sweeps below exercise widget-specific runtime invariants
// that only surface under user interaction (slider drags, kind switches).
// Each sweep calls `MV<Widget>.init` repeatedly with parameter combinations
// that previously surfaced bugs.

function bootWidget(slugDir, libSrcCache) {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) =>
    errors.push(`jsdomError: ${e && (e.stack || e.message || e)}`),
  );
  vc.on('error', (e) => errors.push(`error: ${e && (e.message || e)}`));
  const html = `<!doctype html><html><body><div id="w"></div></body></html>`;
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole: vc,
    url: 'file:///widget-functional-test/',
  });
  const w = dom.window;
  w.katex = { render: () => {}, renderToString: () => '' };
  w.renderMathInElement = () => {};
  const s = w.document.createElement('script');
  s.textContent = libSrcCache;
  w.document.head.appendChild(s);
  return { dom, errors, w };
}

describe('modular-arithmetic-clock: multiplication mode parameter sweep', () => {
  // Codex P1 caught 2026-04-25: when gcd(a, n) != 1, the orbit
  // k → k·a → … is rho-shaped (a tail flowing into a cycle). The original
  // multCycles() only stored cycle members, so tail nodes had
  // cycleOfIdx[k] === undefined, and the render path crashed with
  //   TypeError: Cannot read properties of undefined (reading 'length')
  // on every non-unit slider change. Fixed by back-filling tail nodes to
  // their convergent cycle index. This sweep proves no parameter
  // combination crashes in either kind.
  const libPath = libPathFor('modular-arithmetic-clock');
  if (!libPath) return;
  const libSrc = readFileSync(libPath, 'utf8');

  test('every (n, a) in n ∈ {8, 12, 15, 16} runs without error', () => {
    const { dom, errors, w } = bootWidget('modular-arithmetic-clock', libSrc);
    const totalCases = [];
    for (const n of [8, 12, 15, 16]) {
      for (let a = 0; a < n; a++) {
        totalCases.push({ n, a });
      }
    }
    let crashes = 0;
    const samples = [];
    for (const c of totalCases) {
      errors.length = 0;
      w.MVModularArithmeticClock.init('#w', {
        kind: 'multiplication',
        title: 't',
        params: { n: c.n, a: c.a },
      });
      if (errors.length) {
        crashes++;
        if (samples.length < 3) {
          samples.push({ ...c, err: errors[0].slice(0, 200) });
        }
      }
    }
    dom.window.close();
    assert.equal(
      crashes,
      0,
      `${crashes}/${totalCases.length} (n,a) cases crashed; samples:\n` +
        JSON.stringify(samples, null, 2),
    );
  });

  test('addition mode: every (n, a, b) in n=12 runs without error', () => {
    const { dom, errors, w } = bootWidget('modular-arithmetic-clock', libSrc);
    const cases = [];
    for (let a = 0; a < 12; a++) {
      for (let b = 0; b < 12; b++) {
        cases.push({ a, b });
      }
    }
    let crashes = 0;
    for (const c of cases) {
      errors.length = 0;
      w.MVModularArithmeticClock.init('#w', {
        kind: 'addition',
        title: 't',
        params: { n: 12, a: c.a, b: c.b },
      });
      if (errors.length) crashes++;
    }
    dom.window.close();
    assert.equal(crashes, 0, `${crashes}/${cases.length} addition cases crashed`);
  });
});

describe('recurrence-plotter: cobweb baseline anchored to y = 0', () => {
  // Codex P2 caught 2026-04-25: the cobweb path is documented to start at
  // (x0, 0) — the x-axis — but seeded its first point at cyScale(yMin),
  // i.e. the visible plot bottom. For ranges like quadratic's [-2, 2],
  // that drew the first vertical segment from y=-2 instead of y=0,
  // visually misrepresenting the iteration. Fixed by clamping 0 into
  // [yMin, yMax]. This test inspects the first cobweb point.
  const libPath = libPathFor('recurrence-plotter');
  if (!libPath) return;
  const libSrc = readFileSync(libPath, 'utf8');

  test('quadratic kind starts cobweb at y = 0 (range [-2, 2])', () => {
    const { dom, errors, w } = bootWidget('recurrence-plotter', libSrc);
    w.MVRecurrencePlotter.init('#w', {
      kind: 'quadratic',
      title: 't',
      params: { a: -1.4, c: 0.3, x0: 0, n: 30 },
    });
    assert.deepEqual(
      errors,
      [],
      `recurrence-plotter init surfaced errors:\n${errors.join('\n')}`,
    );
    // First cobweb polyline is the yellow one (cobweb subplot only exists
    // for one-term kinds — quadratic qualifies).
    const polylines = [
      ...w.document.querySelectorAll('polyline'),
    ].filter((p) => /yellow/i.test(p.getAttribute('stroke') || ''));
    assert.ok(
      polylines.length >= 1,
      `expected at least one yellow cobweb polyline; got ${polylines.length}`,
    );
    const firstPoint = polylines[0].getAttribute('points').split(' ')[0];
    const [, ys] = firstPoint.split(',');
    const y = Number(ys);
    // viewBox is "0 0 480 220"; margin.t = 16, plotH = 220 - 16 - 28 = 176.
    // yScale(0) = 16 + 176 * (1 - (0 - (-2)) / 4) = 16 + 176 * 0.5 = 104.
    // yScale(yMin=-2) would be 16 + 176 * (1 - 0) = 192 (the wrong value).
    assert.ok(
      Math.abs(y - 104) < 1,
      `cobweb first y should be ≈ 104 (y=0 axis); got ${y} (192 = old buggy bottom of plot)`,
    );
    dom.window.close();
  });

  test('logistic kind: range [0, 1] — cobweb still starts at y = 0', () => {
    const { dom, errors, w } = bootWidget('recurrence-plotter', libSrc);
    w.MVRecurrencePlotter.init('#w', {
      kind: 'logistic',
      title: 't',
      params: { r: 3.7, x0: 0.5, n: 40 },
    });
    assert.deepEqual(errors, []);
    // For logistic, yMin=0, so clamp(0, [0,1]) = 0. yScale(0) = 16 + 176 = 192.
    const polylines = [
      ...w.document.querySelectorAll('polyline'),
    ].filter((p) => /yellow/i.test(p.getAttribute('stroke') || ''));
    const firstPoint = polylines[0].getAttribute('points').split(' ')[0];
    const [, ys] = firstPoint.split(',');
    const y = Number(ys);
    assert.ok(
      Math.abs(y - 192) < 1,
      `logistic cobweb first y should be ≈ 192 (y=0 = bottom of [0,1] range); got ${y}`,
    );
    dom.window.close();
  });
});
