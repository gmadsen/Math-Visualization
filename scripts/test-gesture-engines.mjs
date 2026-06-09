#!/usr/bin/env node
// Interaction tests for the shared gesture engines — the self-contained
// registry renderers whose engine code is emitted by renderScript() rather
// than shipped as a js/widget-<slug>.js runtime library. Because they have no
// library, scripts/test-widget-hydration.mjs skips them entirely, and
// scripts/test-topic-jsdom.mjs only proves their host pages *boot*: nothing
// exercised the actual gesture (pointer drag, click-seed, sketch, scrub)
// until this test.
//
// For every content/*.json instance of each engine below, we boot a jsdom
// with the canonical page-global helper block ($ / SVG / drawArrow …,
// extracted from category-theory.html so the test exercises the real
// helpers), render the widget, run its script, then drive the engine's
// gesture with synthetic pointer events and assert an observable state
// change (a handle followed the drag, the readout reported a seeded
// trajectory, the canvas re-rendered, …).
//
// jsdom has no SVG geometry: getScreenCTM/createSVGPoint are polyfilled with
// the identity transform, so synthetic clientX/clientY ARE viewBox
// coordinates. That suits the engines exactly — they only use the CTM to map
// pointer→viewBox, and all clamping/hit-testing happens in viewBox space.
//
// Run via:
//   node scripts/test-gesture-engines.mjs        (node:test, exit ≠ 0 on failure)

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
  for (const f of readdirSync(contentDir).sort()) {
    if (!f.endsWith('.json')) continue;
    const topic = f.replace(/\.json$/, '');
    const data = JSON.parse(readFileSync(join(contentDir, f), 'utf8'));
    walkBlocks(data, (b) => {
      if (b.slug === slug) out.push({ topic, params: b.params || {} });
    });
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

// Identity-CTM polyfill: clientX/clientY map 1:1 onto viewBox coordinates.
function polyfillSvgGeometry(w) {
  const identity = {
    inverse() {
      return identity;
    },
  };
  w.SVGElement.prototype.getScreenCTM = function () {
    return identity;
  };
  const svgProto = (w.SVGSVGElement || w.SVGElement).prototype;
  svgProto.createSVGPoint = function () {
    return {
      x: 0,
      y: 0,
      matrixTransform() {
        return { x: this.x, y: this.y };
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
  const m = scriptHtml.match(/<script>([\s\S]*)<\/script>/);
  assert.ok(m, 'renderScript must wrap output in <script>…</script>');
  const inner = doc.createElement('script');
  inner.textContent = m[1];
  doc.body.appendChild(inner);

  return { dom, w, doc, errors };
}

function ptr(w, target, type, x, y) {
  target.dispatchEvent(
    new w.MouseEvent(type, { bubbles: true, cancelable: true, view: w, clientX: x, clientY: y })
  );
}

function parseViewBox(params, fallback) {
  const vb = String(params.viewBox || fallback)
    .split(/\s+/)
    .map(Number);
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
    const vb = parseViewBox(params, '0 0 640 400');
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
    const vb = parseViewBox(params, '0 0 640 380');
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
    const vb = parseViewBox(params, '0 0 640 420');
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
    const vb = parseViewBox(params, '0 0 640 380');
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
    const vb = parseViewBox(params, '0 0 560 440');
    // engine-fixed pads
    const bx0 = 52;
    const bx1 = vb.w - 16;
    const by1 = 16;
    const by0 = vb.h - 44;
    const before = out.innerHTML;
    ptr(w, svg, 'pointerdown', bx0 + 0.27 * (bx1 - bx0), by1 + 0.66 * (by0 - by1));
    ptr(w, w, 'pointermove', bx0 + 0.31 * (bx1 - bx0), by1 + 0.58 * (by0 - by1));
    ptr(w, w, 'pointerup', bx0 + 0.31 * (bx1 - bx0), by1 + 0.58 * (by0 - by1));
    assert.notEqual(out.innerHTML, before, 'dragging the puck should update the readout');
    assert.match(out.innerHTML, /<b>/, 'readout should report the live coordinates');
  },

  // Scrub the timeline (deterministic, no rAF) and toggle Play/Pause labels.
  'animated-svg-2d'({ w, doc, params }) {
    const host = doc.getElementById(params.widgetId);
    const scrub = doc.getElementById(`${params.widgetId}-scrub`);
    const playBtn = doc.getElementById(`${params.widgetId}-play`);
    const steps = params.steps != null ? params.steps : 120;
    const before = host.innerHTML;
    scrub.value = String(Math.round(steps / 2));
    scrub.dispatchEvent(new w.Event('input', { bubbles: true }));
    assert.notEqual(host.innerHTML, before, 'scrubbing to t=0.5 should re-render frame(t)');
    const playLabel = params.playLabel || '▶ Play';
    const pauseLabel = params.pauseLabel || '⏸ Pause';
    playBtn.click();
    assert.equal(playBtn.textContent, pauseLabel, 'Play click should flip the button to Pause');
    playBtn.click();
    assert.equal(playBtn.textContent, playLabel, 'Pause click should flip the button back');
  },
};

// ---------------------------------------------------------------------------
// Test matrix: every content instance (plus any fixtures) of every engine.
// ---------------------------------------------------------------------------
for (const slug of Object.keys(DRIVERS).sort()) {
  const indexUrl = pathToFileURL(join(widgetsDir, slug, 'index.mjs')).href;
  const instances = loadInstances(slug);

  describe(`gesture engine: ${slug}`, () => {
    let mod;
    before(async () => {
      mod = await import(indexUrl);
    });

    test(`${slug} has at least one instance or fixture`, () => {
      assert.ok(
        instances.length > 0,
        `no content instance and no fixture found for ${slug} — if the engine was ` +
          `retired, drop it from DRIVERS; if it lost its last home, add an example.json`
      );
    });

    for (const { topic, params } of instances) {
      test(`${topic}/${params.widgetId} boots and answers its gesture`, () => {
        const ctx = bootInstance(params, mod);
        try {
          assert.deepEqual(
            ctx.errors,
            [],
            `boot surfaced errors:\n${ctx.errors.join('\n')}`
          );
          const host = ctx.doc.getElementById(params.widgetId);
          assert.ok(host && host.children.length > 0, 'host div should be populated');
          DRIVERS[slug](Object.assign(ctx, { params }));
          assert.deepEqual(
            ctx.errors,
            [],
            `gesture surfaced errors:\n${ctx.errors.join('\n')}`
          );
        } finally {
          ctx.dom.window.close();
        }
      });
    }
  });
}
