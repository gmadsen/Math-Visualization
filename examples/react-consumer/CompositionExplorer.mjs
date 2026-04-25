// CompositionExplorer — a React component that renders a composition-explorer
// widget from schema-validated params.  SSR only (no hooks, no events):
// this POC exists to prove a React app can consume the widget registry, not
// to reproduce the vanilla interactivity.
import React from 'react';

const { createElement: h } = React;

function morphismPath(m, byId) {
  const src = byId.get(m.src);
  const tgt = byId.get(m.tgt);
  if (!src || !tgt) return { d: '', lx: 0, ly: 0 };
  if (m.loop || m.src === m.tgt) {
    // small loop above the object
    const cx = src.x;
    const cy = src.y - 32;
    return {
      d: `M ${src.x - 8},${src.y - 20} C ${cx - 28},${cy - 28} ${cx + 28},${cy - 28} ${src.x + 8},${src.y - 20}`,
      lx: cx,
      ly: cy - 30,
    };
  }
  const mx = (src.x + tgt.x) / 2;
  const my = (src.y + tgt.y) / 2;
  const curve = typeof m.curve === 'number' ? m.curve : 0;
  // perpendicular offset for curvature
  const dx = tgt.x - src.x;
  const dy = tgt.y - src.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * curve * 40;
  const cy = my + ny * curve * 40;
  return {
    d: `M ${src.x},${src.y} Q ${cx},${cy} ${tgt.x},${tgt.y}`,
    lx: cx,
    ly: cy - 6,
  };
}

export default function CompositionExplorer(params) {
  const {
    widgetId, svgId, outputId, resetId,
    title, hint, viewBox, width, height,
    initialOutput, resetLabel, legend,
    objects, morphisms,
  } = params;

  const byId = new Map(objects.map((o) => [o.id, o]));

  return h('div', { className: 'widget', id: widgetId, 'data-widget': 'composition-explorer' },
    h('h3', { className: 'widget-title' }, title),
    h('p',  { className: 'widget-hint' }, hint),
    h('svg', {
      id: svgId,
      viewBox,
      width,
      height,
      xmlns: 'http://www.w3.org/2000/svg',
      role: 'img',
      'aria-label': title,
    },
      // morphisms first so objects paint on top
      ...morphisms.map((m) => {
        const { d, lx, ly } = morphismPath(m, byId);
        return h(React.Fragment, { key: `m-${m.id}` },
          h('path', {
            d,
            fill: 'none',
            stroke: '#555',
            strokeWidth: 1.5,
            'data-morphism': m.id,
          }),
          h('text', {
            x: lx, y: ly,
            fontSize: 14,
            textAnchor: 'middle',
            'data-morphism-label': m.id,
          }, m.label),
        );
      }),
      ...objects.map((o) => h(React.Fragment, { key: `o-${o.id}` },
        h('circle', {
          cx: o.x, cy: o.y, r: 18,
          fill: '#fff', stroke: '#222', strokeWidth: 2,
          'data-object': o.id,
        }),
        h('text', {
          x: o.x, y: o.y + 5,
          fontSize: 16,
          textAnchor: 'middle',
          'data-object-label': o.id,
        }, o.id),
      )),
    ),
    h('pre', { id: outputId, className: 'widget-output' }, initialOutput),
    h('button', { id: resetId, type: 'button', className: 'widget-reset' }, resetLabel),
    h('p', { className: 'widget-legend' }, legend),
  );
}
