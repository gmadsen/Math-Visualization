// three-body-lagrange-points widget — bespoke registry entry for the §2
// effective-potential / Lagrange-points illustration on the
// `three-body-problem` topic.
//
// The widget exposes a mass-ratio slider $\mu = m_2/(m_1+m_2)$ with an inline
// `<span class="small">` readout, two checkboxes (equipotential contours,
// Hill-region highlight), an SVG showing the rotating-frame configuration
// with $L_1$–$L_5$ marked, and a final readout listing the five Lagrange-point
// coordinates. The slider+span+checkbox-row layout doesn't fit any shared
// slug; this slug captures it as one unit.
//
// Exports:
//   renderMarkup(params) -> <div class="widget"> ... </div>
//   renderScript(params) -> <script>\n(function(){ ... })();\n</script>

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, bodyMarkup } = params;
  return (
    `<div class="widget"` + (widgetId ? ` id="${widgetId}"` : "") + `>\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div><div class="hint">${escapeHtml(hint)}</div></div>\n` +
    `${bodyMarkup}\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { sectionComment, bodyScript } = params;
  const commentLine = sectionComment ? `/* ${sectionComment} */\n` : '';
  return (
    `<script>\n` +
    commentLine +
    `(function(){\n` +
    `${bodyScript}\n` +
    `})();\n` +
    `</script>`
  );
}
