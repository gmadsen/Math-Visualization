#!/usr/bin/env node
// One-shot migration: convert "Type A" inline widgets (raw HTML
// `<div class="widget">…</div>` blocks buried inside `raw` blocks of
// `content/<topic>.json`, paired with an immediately-following `<script>…</script>`)
// into registry-driven `widget` + `widget-script` blocks with `slug + params`.
//
// Affects 9 topics carrying 48 inline widgets per
// `audits/inline-widgets-baseline.json`. Each widget gets its own slug
// `<topic-prefix>-<id-or-index>` under `widgets/<slug>/` sharing
// `widgets/_shared/verbatim-renderer.mjs` so byte-identical round-trip is
// preserved.
//
// Idempotent on already-migrated topics (no `<div class="widget"` in raw blocks
// → no-op).

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const TYPE_A_TOPICS = {
  'computational-number-theory': 'cnt',
  'differential-forms': 'df',
  'elliptic-curves': 'ec',
  'fixed-point-theorems': 'fpt',
  'frobenius-and-reciprocity': 'fr',
  'galois': 'gal',
  'geometric-and-combinatorial-group-theory': 'gcg',
  'spectral-theory': 'spec',
  'wavelets': 'wav',
};

function findBalanced(html, openIdx) {
  // From `<div ` at openIdx, find the matching `</div>` such that nesting
  // is balanced. Returns the index just past the matching `</div>`.
  const openTagEnd = html.indexOf('>', openIdx);
  if (openTagEnd < 0) return -1;
  let depth = 1;
  let pos = openTagEnd + 1;
  const openRe = /<div\b/gi;
  const closeRe = /<\/div>/gi;
  while (pos < html.length) {
    openRe.lastIndex = pos;
    closeRe.lastIndex = pos;
    const o = openRe.exec(html);
    const c = closeRe.exec(html);
    if (!c) return -1;
    if (o && o.index < c.index) {
      depth++;
      pos = o.index + 4;
    } else {
      depth--;
      if (depth === 0) return c.index + '</div>'.length;
      pos = c.index + '</div>'.length;
    }
  }
  return -1;
}

function findFollowingScript(html, fromIdx) {
  // Find an immediately-following `<script>...</script>` after fromIdx,
  // allowing whitespace between. Returns { scriptStart, scriptEnd, gap }
  // where gap is the whitespace span between fromIdx and scriptStart.
  let i = fromIdx;
  while (i < html.length && /\s/.test(html[i])) i++;
  if (!html.startsWith('<script', i)) return null;
  // Skip to end of opening tag (no attributes typically)
  const tagEnd = html.indexOf('>', i);
  if (tagEnd < 0) return null;
  const closeIdx = html.indexOf('</script>', tagEnd);
  if (closeIdx < 0) return null;
  return {
    scriptStart: i,
    scriptEnd: closeIdx + '</script>'.length,
    gap: html.slice(fromIdx, i),
  };
}

function extractAttr(tag, name) {
  const re = new RegExp(`\\s${name}="([^"]*)"`, 'i');
  const m = tag.match(re);
  return m ? m[1] : '';
}

// When a widget div has no `id` attribute, derive a stable widgetId from the
// most-common id prefix among its inner elements. e.g. inner ids
// ["mr-n", "mr-a", "mr-go"] → prefix "mr".  Falls back to <topicPrefix>-w<N>
// when no inner ids share a common prefix.
function deriveWidgetIdFromInnerIds(markup, topicPrefix, fallbackIndex) {
  const innerIds = [...markup.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  // Bucket by prefix-up-to-first-dash.
  const counts = {};
  for (const id of innerIds) {
    const dash = id.indexOf('-');
    if (dash <= 0) continue;
    const pre = id.slice(0, dash);
    counts[pre] = (counts[pre] || 0) + 1;
  }
  // Use the most-common dashed-prefix even if it appears only once — for
  // verbatim slugs the widgetId is metadata; the only constraints are that
  // it be non-empty and unique per slug.
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (ranked.length) return ranked[0][0];
  return `${topicPrefix}-w${fallbackIndex}`;
}

function extractTitleAndHint(html) {
  const titleMatch = html.match(/<div class="ttl">([\s\S]*?)<\/div>/);
  const hintMatch = html.match(/<div class="hint">([\s\S]*?)<\/div>/);
  return {
    title: titleMatch ? titleMatch[1] : '',
    hint: hintMatch ? hintMatch[1] : '',
  };
}

function writeSlugFiles(slug, topic, info, hasScript) {
  const slugDir = join(repoRoot, 'widgets', slug);
  if (!existsSync(slugDir)) mkdirSync(slugDir, { recursive: true });

  const schemaPath = join(slugDir, 'schema.json');
  if (!existsSync(schemaPath)) {
    const schema = {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": `https://math-vis.local/widgets/${slug}/schema.json`,
      "title": `${slug} widget params`,
      "description": `Bespoke verbatim-renderer slug for the "${info.title || slug}" widget on the ${topic} topic. Carries opaque bodyMarkup + bodyScript strings; migrated from a Type-A inline widget by scripts/migrate-inline-widgets-typea.mjs.`,
      "meta": {
        "family": "verbatim",
        "dimension": "2d",
        "gesture": "interact",
        "role": "interactive",
      },
      "type": "object",
      "additionalProperties": false,
      "required": ["widgetId", "title", "hint", "bodyMarkup", "bodyScript"],
      "properties": {
        "widgetId": {
          "type": "string",
          "description": "DOM id for the widget root, or empty string when the original markup carried no id.",
        },
        "title": { "type": "string", "description": "Header title (rendered inside .hd > .ttl by the original markup)." },
        "hint": { "type": "string", "description": "Header hint (rendered inside .hd > .hint)." },
        "bodyMarkup": { "type": "string", "description": "Verbatim markup for the widget — the full `<div class=\"widget\">…</div>` block as it appears in the source HTML." },
        "bodyScript": { "type": "string", "description": "Verbatim driving `<script>…</script>` block, or empty string when the widget has no driving script." },
      },
    };
    writeFileSync(schemaPath, JSON.stringify(schema, null, 2) + '\n');
  }

  const indexPath = join(slugDir, 'index.mjs');
  if (!existsSync(indexPath)) {
    const indexContent = `// ${slug} widget — migrated from inline ${topic} widget by\n// scripts/migrate-inline-widgets-typea.mjs. Uses the shared verbatim renderer\n// (widgets/_shared/verbatim-renderer.mjs) so byte-identical round-trip is\n// preserved while clearing the inline-widget audit.\n\nexport { renderMarkup, renderScript } from '../_shared/verbatim-renderer.mjs';\n`;
    writeFileSync(indexPath, indexContent);
  }

  const readmePath = join(slugDir, 'README.md');
  if (!existsSync(readmePath)) {
    const readmeContent = `# \`${slug}\`\n\nBespoke verbatim slug for the "${info.title || slug}" widget on \`${topic}\`.\n\nMigrated from inline \`<div class="widget">\` markup (Type A: raw HTML buried in a \`raw\` block) by \`scripts/migrate-inline-widgets-typea.mjs\`. Uses the shared renderer at \`widgets/_shared/verbatim-renderer.mjs\` — \`bodyMarkup\` and \`bodyScript\` are emitted verbatim. See \`schema.json\` for the param shape.\n\nA future deeper migration could hoist this widget's semantic params (slider ranges, etc.) out of the opaque body strings into typed schema fields.\n`;
    writeFileSync(readmePath, readmeContent);
  }
}

function migrateTopic(topic) {
  const topicPrefix = TYPE_A_TOPICS[topic];
  const contentPath = join(repoRoot, 'content', `${topic}.json`);
  const doc = JSON.parse(readFileSync(contentPath, 'utf8'));

  let widgetCounter = 0;
  let migrated = 0;

  for (const sec of doc.sections || []) {
    const newBlocks = [];
    for (const b of sec.blocks || []) {
      if (b.type !== 'raw' || !(b.html || '').includes('<div class="widget')) {
        newBlocks.push(b);
        continue;
      }

      // This raw block contains one or more inline widgets. Walk it.
      let html = b.html;
      let cursor = 0;
      while (cursor < html.length) {
        const widgetIdx = html.indexOf('<div class="widget', cursor);
        if (widgetIdx < 0) {
          // No more widgets — emit remainder as raw
          if (cursor < html.length) {
            const remainder = html.slice(cursor);
            if (remainder.length > 0) newBlocks.push({ type: 'raw', html: remainder });
          }
          break;
        }

        // Emit pre-widget raw (if non-empty)
        if (widgetIdx > cursor) {
          newBlocks.push({ type: 'raw', html: html.slice(cursor, widgetIdx) });
        }

        // Find balanced </div> for the widget
        const widgetEnd = findBalanced(html, widgetIdx);
        if (widgetEnd < 0) {
          throw new Error(`unbalanced widget div in ${topic} section ${sec.id}`);
        }

        const widgetMarkup = html.slice(widgetIdx, widgetEnd);

        // Determine widgetId: prefer the outer div's `id` attribute; otherwise
        // derive from inner-element id prefix (or fall back to a synthetic).
        const openTag = widgetMarkup.slice(0, widgetMarkup.indexOf('>') + 1);
        widgetCounter++;
        const outerId = extractAttr(openTag, 'id');
        const widgetId = outerId || deriveWidgetIdFromInnerIds(widgetMarkup, topicPrefix, widgetCounter);

        // Slug = widgetId, prefixed with topic abbrev unless it already starts
        // with the prefix or already contains a dash that suggests a unique id.
        const slug = widgetId.startsWith(`${topicPrefix}-`)
          ? widgetId
          : `${topicPrefix}-${widgetId}`.replace(/-+/g, '-').toLowerCase();

        const info = extractTitleAndHint(widgetMarkup);

        // Look for immediately-following <script>
        const scriptInfo = findFollowingScript(html, widgetEnd);

        let scriptBytes = '';
        let cursorAfter = widgetEnd;

        if (scriptInfo) {
          // Emit gap (whitespace) as raw if non-empty, then widget block, then widget-script block
          if (scriptInfo.gap.length > 0) {
            // Push widget block first
            newBlocks.push({
              type: 'widget',
              slug,
              params: {
                widgetId,
                title: info.title,
                hint: info.hint,
                bodyMarkup: widgetMarkup,
                bodyScript: '',
              },
            });
            // Gap as raw
            newBlocks.push({ type: 'raw', html: scriptInfo.gap });
            scriptBytes = html.slice(scriptInfo.scriptStart, scriptInfo.scriptEnd);
            // widget-script block
            newBlocks.push({
              type: 'widget-script',
              slug,
              params: {
                widgetId,
                title: '',
                hint: '',
                bodyMarkup: '',
                bodyScript: scriptBytes,
              },
            });
            cursorAfter = scriptInfo.scriptEnd;
          } else {
            scriptBytes = html.slice(scriptInfo.scriptStart, scriptInfo.scriptEnd);
            newBlocks.push({
              type: 'widget',
              slug,
              params: {
                widgetId,
                title: info.title,
                hint: info.hint,
                bodyMarkup: widgetMarkup,
                bodyScript: '',
              },
            });
            newBlocks.push({
              type: 'widget-script',
              slug,
              params: {
                widgetId,
                title: '',
                hint: '',
                bodyMarkup: '',
                bodyScript: scriptBytes,
              },
            });
            cursorAfter = scriptInfo.scriptEnd;
          }
        } else {
          // No following script in this raw block — driving script lives
          // elsewhere (typically in a page-bottom <script> bundle inside
          // rawBodySuffix that handles all widgets together). Migrate just
          // the markup; bodyScript stays empty for this slug.
          newBlocks.push({
            type: 'widget',
            slug,
            params: {
              widgetId,
              title: info.title,
              hint: info.hint,
              bodyMarkup: widgetMarkup,
              bodyScript: '',
            },
          });
          cursorAfter = widgetEnd;
        }

        writeSlugFiles(slug, topic, info, !!scriptInfo);
        migrated++;
        cursor = cursorAfter;
      }
    }
    sec.blocks = newBlocks;
  }

  writeFileSync(contentPath, JSON.stringify(doc, null, 2) + '\n');
  return migrated;
}

let total = 0;
for (const topic of Object.keys(TYPE_A_TOPICS)) {
  const n = migrateTopic(topic);
  console.log(`migrated ${topic}: ${n} inline widget(s)`);
  total += n;
}
console.log(`---\ntotal Type A widgets migrated: ${total}`);
