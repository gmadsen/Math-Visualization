// Helper for the inline-widget migration scripts (and future re-runs):
// scaffold a `widgets/<slug>/` registry directory whose renderer re-exports
// from `widgets/_shared/verbatim-renderer.mjs`. Schema fields that depend on
// the live widget bytes (title, hint, gesture, role) are derived in
// `widget-meta-heuristics.mjs` and folded into the schema by the caller.
//
// Used by `scripts/migrate-inline-widgets-{typea,typeb}.mjs` plus
// `scripts/fixup-verbatim-widget-meta.mjs`.

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { extractTitleAndHint, deriveMeta } from './widget-meta-heuristics.mjs';

export { extractTitleAndHint };

export function makeVerbatimSchema({ slug, topic, title, bodyMarkup, bodyScript = '' }) {
  const meta = deriveMeta(bodyMarkup, bodyScript);
  return {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": `https://math-vis.local/widgets/${slug}/schema.json`,
    "title": `${slug} widget params`,
    "description": `Bespoke verbatim-renderer slug for the "${title || slug}" widget on the ${topic} topic. Carries opaque bodyMarkup + bodyScript strings; migrated from an inline widget by scripts/migrate-inline-widgets-{typea,typeb}.mjs.`,
    "meta": {
      "family": meta.family,
      "dimension": meta.dimension,
      "gesture": meta.gesture,
      "role": meta.role,
    },
    "type": "object",
    "additionalProperties": false,
    "required": ["widgetId", "title", "hint", "bodyMarkup", "bodyScript"],
    "properties": {
      "widgetId": {
        "type": "string",
        "pattern": "^[A-Za-z][A-Za-z0-9_-]*$",
        "description": "DOM id for the widget root, or the inner-id prefix when the original markup carried no outer id.",
      },
      "title": { "type": "string", "description": "Header title (rendered inside .hd > .ttl by the original markup)." },
      "hint": { "type": "string", "description": "Header hint (rendered inside .hd > .hint)." },
      "bodyMarkup": {
        "type": "string",
        "description": "Verbatim markup for the widget — full `<div class=\"widget\">…</div>` block as it appears in the source HTML.",
        "x-artifact": true,
      },
      "bodyScript": {
        "type": "string",
        "description": "Verbatim driving `<script>…</script>` block, or empty string when the widget has no driving script.",
        "x-artifact": true,
      },
    },
  };
}

export function writeVerbatimSlug({ repoRoot, slug, topic, title, hint, bodyMarkup, bodyScript = '' }) {
  const slugDir = resolve(repoRoot, 'widgets', slug);
  if (!existsSync(slugDir)) mkdirSync(slugDir, { recursive: true });

  const schemaPath = join(slugDir, 'schema.json');
  if (!existsSync(schemaPath)) {
    const schema = makeVerbatimSchema({ slug, topic, title, bodyMarkup, bodyScript });
    writeFileSync(schemaPath, JSON.stringify(schema, null, 2) + '\n');
  }

  const indexPath = join(slugDir, 'index.mjs');
  if (!existsSync(indexPath)) {
    const indexContent = `// ${slug} widget — migrated from an inline ${topic} widget by\n// scripts/migrate-inline-widgets-{typea,typeb}.mjs. Uses the shared verbatim\n// renderer (widgets/_shared/verbatim-renderer.mjs) so byte-identical round-trip\n// is preserved while clearing the inline-widget audit.\n\nexport { renderMarkup, renderScript } from '../_shared/verbatim-renderer.mjs';\n`;
    writeFileSync(indexPath, indexContent);
  }

  const readmePath = join(slugDir, 'README.md');
  if (!existsSync(readmePath)) {
    const readmeContent = `# \`${slug}\`\n\nBespoke verbatim slug for the "${title || slug}" widget on \`${topic}\`.\n\nMigrated from an inline \`<div class="widget">\` block by \`scripts/migrate-inline-widgets-{typea,typeb}.mjs\`. Uses the shared renderer at \`widgets/_shared/verbatim-renderer.mjs\` — \`bodyMarkup\` and \`bodyScript\` are emitted verbatim. See \`schema.json\` for the param shape.\n\nA future deeper migration could hoist this widget's semantic params (slider ranges, etc.) out of the opaque body strings into typed schema fields.\n`;
    writeFileSync(readmePath, readmeContent);
  }
}
