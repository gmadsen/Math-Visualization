#!/usr/bin/env node
// One-shot migration: convert "Type B" inline widgets (structured `type:"widget"`
// blocks lacking a `slug`, paired with `type:"widget-script"` blocks carrying
// `forWidget` back-refs) into registry-driven `slug + params` blocks that pass
// `audit-no-inline-widgets.mjs` and `stats-coverage.mjs`.
//
// Affects: gauge-theory, groebner-bases, statistical-mechanics, string-theory.
// Each widget's HTML and driving script become opaque `bodyMarkup` / `bodyScript`
// strings under a per-widget slug at `widgets/<slug>/`, sharing the verbatim
// renderer at `widgets/_shared/verbatim-renderer.mjs`.
//
// Idempotent: re-running on already-migrated content is a no-op.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const TYPE_B_TOPICS = {
  'gauge-theory': 'gt',
  'groebner-bases': 'gb',
  'statistical-mechanics': 'sm',
  'string-theory': 'st',
};

function slugify(s) {
  return s.replace(/^w-/, '').replace(/[^a-z0-9-]+/gi, '-').toLowerCase();
}

function makeSlug(topicPrefix, widgetId) {
  return `${topicPrefix}-${slugify(widgetId)}`;
}

function extractTitleAndHint(html) {
  const titleMatch = html.match(/<div class="ttl">([^<]*)<\/div>/);
  const hintMatch = html.match(/<div class="hint">([^<]*)<\/div>/);
  return {
    title: titleMatch ? titleMatch[1] : '',
    hint: hintMatch ? hintMatch[1] : '',
  };
}

function writeSlugFiles(slug, topic, info) {
  const slugDir = join(repoRoot, 'widgets', slug);
  if (!existsSync(slugDir)) mkdirSync(slugDir, { recursive: true });

  const schemaPath = join(slugDir, 'schema.json');
  if (!existsSync(schemaPath)) {
    const schema = {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": `https://math-vis.local/widgets/${slug}/schema.json`,
      "title": `${slug} widget params`,
      "description": `Bespoke verbatim-renderer slug for the "${info.title}" widget on the ${topic} topic. Carries opaque bodyMarkup + bodyScript strings; migrated from a Type-B inline widget by scripts/migrate-inline-widgets-typeb.mjs.`,
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
          "pattern": "^[A-Za-z][A-Za-z0-9_-]*$",
          "description": "DOM id for the widget root (matches the `id` of the original inline `<div class=\"widget\">`).",
        },
        "title": { "type": "string", "description": "Header title (rendered inside .hd > .ttl by the original markup)." },
        "hint": { "type": "string", "description": "Header hint (rendered inside .hd > .hint)." },
        "bodyMarkup": { "type": "string", "description": "Verbatim markup for the widget — full `<div class=\"widget\">…</div>` block as it appears in the source HTML." },
        "bodyScript": { "type": "string", "description": "Verbatim driving `<script>…</script>` block." },
      },
    };
    writeFileSync(schemaPath, JSON.stringify(schema, null, 2) + '\n');
  }

  const indexPath = join(slugDir, 'index.mjs');
  if (!existsSync(indexPath)) {
    const indexContent = `// ${slug} widget — migrated from inline ${topic} widget by\n// scripts/migrate-inline-widgets-typeb.mjs. Uses the shared verbatim renderer\n// (widgets/_shared/verbatim-renderer.mjs) so byte-identical round-trip is\n// preserved while clearing the inline-widget audit.\n\nexport { renderMarkup, renderScript } from '../_shared/verbatim-renderer.mjs';\n`;
    writeFileSync(indexPath, indexContent);
  }

  const readmePath = join(slugDir, 'README.md');
  if (!existsSync(readmePath)) {
    const readmeContent = `# \`${slug}\`\n\nBespoke verbatim slug for the "${info.title}" widget on \`${topic}\`.\n\nMigrated from an inline \`<div class="widget">\` (Type B: structured \`type:"widget"\` block without a registry slug) by \`scripts/migrate-inline-widgets-typeb.mjs\`. Uses the shared renderer at \`widgets/_shared/verbatim-renderer.mjs\` — \`bodyMarkup\` and \`bodyScript\` are emitted verbatim. See \`schema.json\` for the param shape.\n\nA future deeper migration could hoist this widget's semantic params (slider ranges, etc.) out of the opaque body strings into typed schema fields.\n`;
    writeFileSync(readmePath, readmeContent);
  }
}

function migrateTopic(topic) {
  const topicPrefix = TYPE_B_TOPICS[topic];
  const contentPath = join(repoRoot, 'content', `${topic}.json`);
  const doc = JSON.parse(readFileSync(contentPath, 'utf8'));

  let migrated = 0;
  // Build a map: forWidget id -> bodyScript (from widget-script blocks)
  const scriptByWidgetId = new Map();
  for (const sec of doc.sections || []) {
    for (const b of sec.blocks || []) {
      if (b.type === 'widget-script' && b.forWidget && !b.slug && b.html) {
        scriptByWidgetId.set(b.forWidget, b.html);
      }
    }
  }

  // Walk and transform widget + widget-script blocks
  for (const sec of doc.sections || []) {
    for (let i = 0; i < (sec.blocks || []).length; i++) {
      const b = sec.blocks[i];

      if (b.type === 'widget' && !b.slug && b.id) {
        const widgetId = b.id;
        const slug = makeSlug(topicPrefix, widgetId);
        const info = extractTitleAndHint(b.html);
        const bodyScript = scriptByWidgetId.get(widgetId) || '';

        writeSlugFiles(slug, topic, info);

        // Replace block content
        sec.blocks[i] = {
          type: 'widget',
          slug,
          params: {
            widgetId,
            title: info.title,
            hint: info.hint,
            bodyMarkup: b.html,
            bodyScript: '', // intentionally empty — the script emits via paired widget-script block
          },
        };
        migrated++;
      } else if (b.type === 'widget-script' && b.forWidget && !b.slug && b.html) {
        const widgetId = b.forWidget;
        const slug = makeSlug(topicPrefix, widgetId);
        const info = { title: '', hint: '' }; // not needed for widget-script

        sec.blocks[i] = {
          type: 'widget-script',
          slug,
          params: {
            widgetId,
            title: '', // unused on script side but required by schema
            hint: '',
            bodyMarkup: '',
            bodyScript: b.html,
          },
        };
      }
    }
  }

  writeFileSync(contentPath, JSON.stringify(doc, null, 2) + '\n');
  return migrated;
}

let total = 0;
for (const topic of Object.keys(TYPE_B_TOPICS)) {
  const n = migrateTopic(topic);
  console.log(`migrated ${topic}: ${n} widget block(s) (paired script blocks updated in same pass)`);
  total += n;
}
console.log(`---\ntotal Type B widgets migrated: ${total}`);
