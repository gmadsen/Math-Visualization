#!/usr/bin/env node
// Interaction tests for the shared gesture engines — the self-contained
// registry renderers whose engine code is emitted by renderScript() rather
// than shipped as a js/widget-<slug>.js runtime library. Because they have no
// library, scripts/test-widget-hydration.mjs skips them entirely, and
// scripts/test-topic-jsdom.mjs only proves their host pages *boot*: nothing
// exercised the actual gesture (pointer drag, click-seed, sketch, scrub)
// until this test.
//
// Two tiers:
//   - DRIVERS  — the multi-home engines get a gesture driver: we boot every
//     content/*.json instance in jsdom, drive the gesture with synthetic
//     pointer events, and assert an observable state change.
//   - BOOT_ONLY — every other self-contained gesture engine gets a boot test
//     per instance (script runs clean, host populated). Promote a slug to
//     DRIVERS when it grows homes or a regression motivates it.
// A guard test detects self-contained engines adopted by ≥2 topics that are
// in neither tier, so the 8th multi-home engine can't ship untested.
//
// The jsdom boots with the canonical page-global helper block ($ / SVG /
// drawArrow …, extracted from category-theory.html so the test exercises the
// real helpers). jsdom has no SVG geometry, so getScreenCTM/createSVGPoint
// are polyfilled — with a NON-identity affine map (client = S·viewBox + E),
// and the ptr() dispatcher converts driver viewBox coordinates to client
// coordinates through the same map. An engine that forgets .inverse() or
// skips matrixTransform() therefore lands wildly off-target and fails, which
// an identity polyfill would mask. Engines that use raw client *deltas*
// (surface-3d) just see uniformly scaled deltas.
//
// Run via:
//   node scripts/test-gesture-engines.mjs        (node:test, exit ≠ 0 on failure)

import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { contentInstancesBySlug, loadInstances } from './lib/widget-instances.mjs';

const __filename = fileURLToPath(import.meta.url);
const scriptsDir = dirname(__filename);
const repoRoot = resolve(scriptsDir, '..');
const widgetsDir = join(repoRoot, 'widgets');
const jsDir = join(repoRoot, 'js');

const { JSDOM, VirtualConsole } = await import(
  pathToFileURL(join(scriptsDir, 'node_modules', 'jsdom', 'lib', 'api.js')).href
);

// ---------------------------------------------------------------------------
// Canonical page-global helpers ($, SVG, ensureArrow, drawArrow, drawNode):
// the first <script> inside <body> of category-theory.html. Engines and
// author bodyScripts assume these globals; failing loudly here beats a
// confusing ReferenceError inside every widget test.
// ---------------------------------------------------------------------------
const HELPERS = (() => {
  const page = readFileSync(join(repoRoot, 'category-theory.html'), 'utf8');
  const bodyAt = page.indexOf('<body');
  const m = bodyAt >= 0 && page.slice(bodyAt).match(/<script>([\s\S]*?)<\/script>/);
  if (!m || !m[1].includes('const SVG')) {
    throw new Error(
      'test-gesture-engines: could not extract the page-global helper block ' +
        '(first <body> <script> defining `const SVG`) from category-theory.html'
    );
  }
  return m[1];
})();

// ---------------------------------------------------------------------------
// SVG geometry polyfill: a non-identity affine screen CTM,
//   client = CTM_SCALE · viewBox + (CTM_EX, CTM_EY).
// Engines map pointer→viewBox via createSVGPoint + getScreenCTM().inverse();
// drivers dispatch through toClient() below, so only an engine that applies
// the inverse correctly receives the coordinates the driver intended.
// ---------------------------------------------------------------------------
const CTM_SCALE = 2;
const CTM_EX = 35;
const CTM_EY = 17;
const toClient = (x, y) => ({ x: CTM_SCALE * x + CTM_EX, y: CTM_SCALE * y + CTM_EY });

function polyfillSvgGeometry(w) {
  const fwd = { a: CTM_SCALE, e: CTM_EX, f: CTM_EY };
  const inv = { a: 1 / CTM_SCALE, e: -CTM_EX / CTM_SCALE, f: -CTM_EY / CTM_SCALE };
  fwd.inverse = () => inv;
  inv.inverse = () => fwd;
  w.SVGElement.prototype.getScreenCTM = function () {
    return fwd;
  };
  const svgProto = (w.SVGSVGElement || w.SVGElement).prototype;
  svgProto.createSVGPoint = function () {
    return {
      x: 0,
      y: 0,
      matrixTransform(m) {
        return { x: m.a * this.x + m.e, y: m.a * this.y + m.f };
      },
    };
  };
}

function bootInstance(params, mod) {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => errors.push(`jsdomError: ${e && (e.stack || e.message || e)}`));
  vc.on('error', (e) => errors.push(`error: ${e && (e.message || e)}`));
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole: vc,
    url: 'file:///gesture-engine-test/',
  });
  const w = dom.window;
  const doc = w.document;
  w.katex = { render: () => {}, renderToString: () => '' };
  w.renderMathInElement = () => {};
  w.MVProgress = {
    isMastered: () => false,
    isMasteredTier: () => false,
    setMastered: () => {},
    list: () => [],
  };
  polyfillSvgGeometry(w);

  const helpers = doc.createElement('script');
  helpers.textContent = HELPERS;
  doc.body.appendChild(helpers);

  const holder = doc.createElement('div');
  holder.innerHTML = mod.renderMarkup(params);
  doc.body.appendChild(holder);

  const scriptHtml = mod.renderScript(params);
  // Greedy on purpose: renderScript emits exactly one <script> wrapper, and a
  // bodyScript can in principle contain "<\/script>"-adjacent strings; greedy
  // grabs the full body where the sibling tests' lazy match would truncate.
  const m = scriptHtml.match(/<script>([\s\S]*)<\/script>/);
  assert.ok(m, 'renderScript must wrap output in <script>…</script>');
  const inner = doc.createElement('script');
  inner.textContent = m[1];
  doc.body.appendChild(inner);

  return { dom, w, doc, errors };
}

// Dispatch a pointer-family event. x/y are VIEWBOX coordinates; they are
// converted to client coordinates through the polyfilled CTM.
function ptr(w, target, type, x, y) {
  const c = toClient(x, y);
  target.dispatchEvent(
    new w.MouseEvent(type, { bubbles: true, cancelable: true, view: w, clientX: c.x, clientY: c.y })
  );
}

// viewBox of the *rendered* svg — what the engines themselves read at init.
function parseViewBox(svg) {
  const vb = String(svg.getAttribute('viewBox') || '')
    .split(/\s+/)
    .map(Number);
  assert.equal(vb.length, 4, `svg #${svg.id} should carry a 4-number viewBox`);
  return { x: vb[0], y: vb[1], w: vb[2], h: vb[3] };
}

// ---------------------------------------------------------------------------
// Per-engine gesture drivers. Each receives a booted instance and must throw
// (assert) unless the gesture produced an observable state change.
// ---------------------------------------------------------------------------
const DRIVERS = {
  // Drag a handle: pointerdown on the circle, pointermove on window, assert
  // the handle's cx/cy followed (the engine re-renders handles after draw()).
  'draggable-points-2d'({ w, doc, params }) {
    const svg = doc.getElementById(params.svgId);
    const handles = [...svg.querySelectorAll('circle')].filter(
      (c) => c.style && c.style.cursor === 'grab'
    );
    assert.equal(
      handles.length,
      params.points.length,
      'one grab-cursor handle per params.points entry'
    );
    const vb = parseViewBox(svg);
    const cx = vb.x + vb.w / 2;
    const cy = vb.y + vb.h / 2;
    let moved = false;
    for (let i = 0; i < params.points.length && !moved; i++) {
      const p = params.points[i];
      if (p.lockX && p.lockY) continue;
      const h = handles[i];
      const hx = Number(h.getAttribute('cx'));
      const hy = Number(h.getAttribute('cy'));
      // drag 30px toward the viewBox centre so per-point clamps don't bite
      const nx = p.lockX ? hx : hx + Math.sign(cx - hx || 1) * 30;
      const ny = p.lockY ? hy : hy + Math.sign(cy - hy || 1) * 30;
      ptr(w, h, 'pointerdown', hx, hy);
      ptr(w, w, 'pointermove', nx, ny);
      ptr(w, w, 'pointerup', nx, ny);
      const dx = Number(h.getAttribute('cx')) - hx;
      const dy = Number(h.getAttribute('cy')) - hy;
      if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
    }
    assert.ok(moved, 'at least one handle should follow a 30px drag');
  },

  // Build the graph: click empty space (adds a vertex), then drag between two
  // vertices (toggles an edge). Assert the author redraw changed the SVG.
  'graph-edit-2d'({ w, doc, params }) {
    const svg = doc.getElementById(params.svgId);
    const vb = parseViewBox(svg);
    const PAD = params.pad != null ? params.pad : 24;
    const R = params.nodeRadius != null ? params.nodeRadius : 16;
    const clampX = (x) => Math.max(PAD, Math.min(vb.w - PAD, x));
    const clampY = (y) => Math.max(PAD, Math.min(vb.h - PAD, y));
    const nodes = (params.initialNodes || []).map(([x, y]) => [clampX(x), clampY(y)]);

    // find an empty spot ≥ 2.5R from every node
    let spot = null;
    outer: for (let gx = PAD + 4; gx < vb.w - PAD; gx += 23) {
      for (let gy = PAD + 4; gy < vb.h - PAD; gy += 19) {
        if (nodes.every(([nx, ny]) => (nx - gx) ** 2 + (ny - gy) ** 2 > (2.5 * R) ** 2)) {
          spot = [gx, gy];
          break outer;
        }
      }
    }
    assert.ok(spot, 'found an empty spot to add a vertex');

    const before = svg.innerHTML;
    ptr(w, svg, 'pointerdown', spot[0], spot[1]);
    ptr(w, w, 'pointerup', spot[0], spot[1]);
    assert.notEqual(svg.innerHTML, before, 'click on empty space should add a vertex and redraw');

    // drag between two vertices to toggle an edge
    const [a, b] = nodes.length >= 2 ? [nodes[0], nodes[1]] : [nodes[0] || spot, spot];
    if (a && b && (a[0] !== b[0] || a[1] !== b[1])) {
      const mid = svg.innerHTML;
      ptr(w, svg, 'pointerdown', a[0], a[1]);
      ptr(w, w, 'pointermove', (a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
      ptr(w, w, 'pointermove', b[0], b[1]);
      ptr(w, w, 'pointerup', b[0], b[1]);
      assert.notEqual(svg.innerHTML, mid, 'vertex→vertex drag should toggle an edge and redraw');
    }
  },

  // Click-seed a trajectory inside the data box; the engine writes a
  // "seed (x, y) → …" message to the readout.
  'vector-field-flow-2d'({ w, doc, params }) {
    const svg = doc.getElementById(params.svgId);
    const out = doc.getElementById(params.outputId);
    const vb = parseViewBox(svg);
    const padL = params.padL != null ? params.padL : 40;
    const padR = params.padR != null ? params.padR : 20;
    const padT = params.padT != null ? params.padT : 20;
    const padB = params.padB != null ? params.padB : 36;
    const bx0 = vb.x + padL;
    const bx1 = vb.x + vb.w - padR;
    const by1 = vb.y + padT;
    const by0 = vb.y + vb.h - padB;
    // off-centre so we don't seed exactly on a symmetric fixed point
    const x = bx0 + 0.37 * (bx1 - bx0);
    const y = by1 + 0.41 * (by0 - by1);
    ptr(w, svg, 'click', x, y);
    assert.match(
      out.innerHTML,
      /^seed \(/,
      'click inside the box should seed a trajectory and report it'
    );
  },

  // Sketch a stroke across the plot: pointerdown + pointermove set sampled
  // columns and call the author's draw(ys); assert the widget re-rendered.
  'sketch-curve-2d'({ w, doc, params }) {
    const svg = doc.getElementById(params.svgId);
    const host = doc.getElementById(params.widgetId);
    const vb = parseViewBox(svg);
    const padL = params.padL != null ? params.padL : 48;
    const padR = params.padR != null ? params.padR : 24;
    const padT = params.padT != null ? params.padT : 24;
    const padB = params.padB != null ? params.padB : 40;
    const bx0 = padL;
    const bx1 = vb.w - padR;
    const by1 = padT;
    const by0 = vb.h - padB;
    const before = host.innerHTML;
    ptr(w, svg, 'pointerdown', bx0 + 0.3 * (bx1 - bx0), by1 + 0.25 * (by0 - by1));
    ptr(w, w, 'pointermove', bx0 + 0.55 * (bx1 - bx0), by1 + 0.6 * (by0 - by1));
    ptr(w, w, 'pointerup', bx0 + 0.55 * (bx1 - bx0), by1 + 0.6 * (by0 - by1));
    assert.notEqual(host.innerHTML, before, 'sketching a stroke should re-render the widget');
  },

  // Drag the puck across the pad; the engine reports the live (x, y) + regime.
  'xy-parameter-pad'({ w, doc, params }) {
    const svg = doc.getElementById(params.svgId);
    const out = doc.getElementById(params.outputId);
    const vb = parseViewBox(svg);
    // pads are hard-coded in the engine (padL=52, padR=16, padT=16, padB=44);
    // if the engine's numbers drift, the clicks below land outside the pad,
    // the readout stays put, and this test fails loudly — acceptable coupling.
    const bx0 = 52;
    const bx1 = vb.w - 16;
    const by1 = 16;
    const by0 = vb.h - 44;
    const before = out.innerHTML;
    ptr(w, svg, 'pointerdown', bx0 + 0.27 * (bx1 - bx0), by1 + 0.66 * (by0 - by1));
    const afterDown = out.innerHTML;
    assert.notEqual(afterDown, before, 'pointerdown on the pad should update the readout');
    assert.match(afterDown, /<b>/, 'readout should report the live coordinates');
    ptr(w, w, 'pointermove', bx0 + 0.48 * (bx1 - bx0), by1 + 0.33 * (by0 - by1));
    ptr(w, w, 'pointerup', bx0 + 0.48 * (bx1 - bx0), by1 + 0.33 * (by0 - by1));
    assert.notEqual(out.innerHTML, afterDown, 'dragging the puck should keep updating the readout');
  },

  // Scrub the timeline (deterministic, no rAF) and toggle Play/Pause labels.
  'animated-svg-2d'({ w, doc, params }) {
    const host = doc.getElementById(params.widgetId);
    const scrub = doc.getElementById(`${params.widgetId}-scrub`);
    const playBtn = doc.getElementById(`${params.widgetId}-play`);
    const steps = params.steps != null ? params.steps : 120;
    const scrubTo = (k) => {
      scrub.value = String(k);
      scrub.dispatchEvent(new w.Event('input', { bubbles: true }));
    };
    const at0 = host.innerHTML;
    const k1 = Math.max(1, Math.round(steps / 2));
    scrubTo(k1);
    const atHalf = host.innerHTML;
    assert.notEqual(atHalf, at0, 'scrubbing to mid-timeline should re-render frame(t)');
    // a second, distinct scrub catches a frame(t) that ignores t after the
    // first render; steps can be as small as 3, so pick an adjacent tick
    const k2 = k1 < steps ? k1 + 1 : k1 - 1;
    if (k2 > 0 && k2 !== k1) {
      scrubTo(k2);
      assert.notEqual(host.innerHTML, atHalf, 'scrubbing one tick further should re-render again');
    }
    const playLabel = params.playLabel || '▶ Play';
    const pauseLabel = params.pauseLabel || '⏸ Pause';
    playBtn.click();
    assert.equal(playBtn.textContent, pauseLabel, 'Play click should flip the button to Pause');
    playBtn.click();
    assert.equal(playBtn.textContent, playLabel, 'Pause click should flip the button back');
  },

  // Drag to rotate: yaw/pitch integrate raw client deltas; assert both the
  // projected mesh and the yaw/pitch readout responded.
  'surface-3d'({ w, doc, params }) {
    const svg = doc.getElementById(params.svgId);
    const host = doc.getElementById(params.widgetId);
    const vb = parseViewBox(svg);
    const x = vb.x + vb.w / 2;
    const y = vb.y + vb.h / 2;
    const meshBefore = svg.innerHTML;
    ptr(w, svg, 'pointerdown', x, y);
    ptr(w, w, 'pointermove', x + 40, y + 25);
    ptr(w, w, 'pointerup', x + 40, y + 25);
    // no readout assertion: a custom readoutText() may legitimately be static
    assert.notEqual(svg.innerHTML, meshBefore, 'rotating should re-project the mesh');
    assert.ok(host.children.length > 0, 'host stays populated after the drag');
  },
};

// ---------------------------------------------------------------------------
// Boot-only tier: every other self-contained gesture engine. One test per
// content instance — script runs without errors, host div populated. Promote
// to DRIVERS when a slug grows homes or a regression motivates a driver.
// ---------------------------------------------------------------------------
const BOOT_ONLY = [
  'algorithm-stepper',
  'bloch-sphere-drag',
  'ramsey-two-coloring',
  'bayes-mass-updater',
  'belief-grid-localization',
  'best-response-explorer-2d',
  'bifurcation-1d',
  'build-a-formula',
  'complex-map-2d',
  'continuity-band-2d',
  'contour-residue-2d',
  'cup-product-grid',
  'eigenvector-explorer-2d',
  'elliptic-group-law-2d',
  'fold-the-polygon',
  'functional-equation-mirror',
  'grid-world-mdp',
  'knot-crossing-toggle',
  'linear-transform-2d',
  'osculating-circle-2d',
  'q-learning-grid-world',
  'sampling-box',
  'shatter-arena',
  'three-body-launcher',
  'torus-orbit-explorer',
  'unroll-the-cover',
  'weight-ladder-sl2',
];

// The classic pre-program renderer families: self-contained too, but not
// gesture engines — they are exercised per-instance by test-widget-renderers
// and per-page by test-topic-jsdom, and their gestures are plain DOM controls
// (buttons / range sliders / clicks) rather than pointer-coordinate plumbing.
// Exempt from the guard below; don't add new gesture engines here.
const CLASSIC_FAMILIES = new Set([
  'button-stepper',
  'slider-svg-2d',
  'clickable-diagram',
  'clickable-graph',
  'parametric-plot',
  'svg-illustration',
  'declarative-host',
  'surface-viewer',
]);

// ---------------------------------------------------------------------------
// Guard: a self-contained engine (registry slug with no js/widget-<slug>.js
// runtime library and no verbatim-renderer delegation) adopted by ≥2 distinct
// topics must be covered here — either with a gesture driver or, explicitly,
// boot-only. Keeps the next multi-home engine from shipping untested.
// ---------------------------------------------------------------------------
test('every multi-home self-contained engine is covered (DRIVERS or BOOT_ONLY)', () => {
  const covered = new Set([...Object.keys(DRIVERS), ...BOOT_ONLY, ...CLASSIC_FAMILIES]);
  const offenders = [];
  for (const [slug, instances] of contentInstancesBySlug()) {
    if (covered.has(slug)) continue;
    if (existsSync(join(jsDir, `widget-${slug}.js`))) continue; // hydration-tested
    const idxPath = join(widgetsDir, slug, 'index.mjs');
    if (!existsSync(idxPath)) continue;
    const src = readFileSync(idxPath, 'utf8');
    if (src.includes('_shared/')) continue; // verbatim/shared-family renderers
    const topics = new Set(instances.map((i) => i.topic));
    if (topics.size >= 2) offenders.push(`${slug} (${topics.size} topics)`);
  }
  assert.deepEqual(
    offenders,
    [],
    `self-contained engines adopted by ≥2 topics but not covered by this test: ` +
      `${offenders.join(', ')} — add a gesture driver to DRIVERS (preferred for ` +
      `multi-home engines) or, with justification, list the slug in BOOT_ONLY`
  );
});

// ---------------------------------------------------------------------------
// Test matrix.
// ---------------------------------------------------------------------------
function defineSuite(slug, driver) {
  const indexUrl = pathToFileURL(join(widgetsDir, slug, 'index.mjs')).href;
  const instances = loadInstances(slug);

  describe(`gesture engine: ${slug}${driver ? '' : ' (boot only)'}`, () => {
    let mod;
    before(async () => {
      mod = await import(indexUrl);
    });

    test(`${slug} has at least one instance or fixture`, () => {
      assert.ok(
        instances.length > 0,
        `no content instance and no fixture found for ${slug} — if the engine was ` +
          `retired, drop it from this test; if it lost its last home, add an example.json`
      );
    });

    for (const { topic, params } of instances) {
      const label = driver ? 'boots and answers its gesture' : 'boots clean';
      test(`${topic}/${params.widgetId} ${label}`, () => {
        const ctx = bootInstance(params, mod);
        try {
          assert.deepEqual(ctx.errors, [], `boot surfaced errors:\n${ctx.errors.join('\n')}`);
          const host = ctx.doc.getElementById(params.widgetId);
          assert.ok(host && host.children.length > 0, 'host div should be populated');
          if (driver) {
            driver(Object.assign(ctx, { params }));
            assert.deepEqual(
              ctx.errors,
              [],
              `gesture surfaced errors:\n${ctx.errors.join('\n')}`
            );
          }
        } finally {
          ctx.dom.window.close();
        }
      });
    }
  });
}

for (const slug of Object.keys(DRIVERS).sort()) defineSuite(slug, DRIVERS[slug]);
for (const slug of BOOT_ONLY) defineSuite(slug, null);
