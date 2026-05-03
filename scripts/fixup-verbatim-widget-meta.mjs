#!/usr/bin/env node
// One-shot fixup for the 77 verbatim slugs minted by
// `migrate-inline-widgets-{typea,typeb}.mjs`. Addresses PR #70 review-team
// findings:
//
//   * Title/hint extraction missed `<span class="ttl">` (5 differential-forms
//     widgets shipped with empty title/hint).
//   * `meta.gesture` defaulted to `"interact"` for every widget regardless of
//     its actual shape — pollutes `stats-coverage.mjs`'s gesture rollups.
//   * Schemas missed `x-artifact: true` on the opaque `bodyMarkup` /
//     `bodyScript` fields (the rest of the corpus uses this annotation).
//   * Type-A schemas omitted the `widgetId` pattern Type-B included.
//
// What this script does:
//   1. Walks every `widgets/<slug>/` whose `index.mjs` re-exports from
//      `widgets/_shared/verbatim-renderer.mjs`.
//   2. Reads the slug's first instance from `content/<topic>.json` to recover
//      the live `bodyMarkup` / `bodyScript` strings.
//   3. Re-derives title/hint via the broadened regex in
//      `scripts/lib/widget-meta-heuristics.mjs#extractTitleAndHint`.
//   4. Re-derives `meta.{dimension,gesture,role}` via `#deriveMeta`.
//   5. Adds `x-artifact: true` to `properties.bodyMarkup` and
//      `properties.bodyScript`.
//   6. Adds the `widgetId` pattern uniformly.
//   7. Updates the schema description and the README's first paragraph if the
//      derived title differs from the stamped placeholder.

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { extractTitleAndHint, deriveMeta } from './lib/widget-meta-heuristics.mjs';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const VERBATIM_RE_EXPORT = "from '../_shared/verbatim-renderer.mjs'";

function listVerbatimSlugs() {
  const widgetsDir = join(repoRoot, 'widgets');
  const out = [];
  for (const entry of readdirSync(widgetsDir)) {
    const indexPath = join(widgetsDir, entry, 'index.mjs');
    if (!existsSync(indexPath)) continue;
    const src = readFileSync(indexPath, 'utf8');
    if (src.includes(VERBATIM_RE_EXPORT)) out.push(entry);
  }
  return out.sort();
}

function findFirstInstance(slug) {
  const contentDir = join(repoRoot, 'content');
  for (const f of readdirSync(contentDir).sort()) {
    if (!f.endsWith('.json')) continue;
    const doc = JSON.parse(readFileSync(join(contentDir, f), 'utf8'));
    for (const sec of doc.sections || []) {
      for (const b of sec.blocks || []) {
        if (b.type === 'widget' && b.slug === slug) {
          return { topic: f.replace(/\.json$/, ''), params: b.params };
        }
      }
    }
  }
  return null;
}

function findScriptInstance(slug) {
  // For widgets whose driving script lives in a separate `widget-script`
  // block paired by slug (Type B + Type A with adjacent script), recover
  // the bodyScript string.  Used by `deriveMeta` to detect interactivity.
  const contentDir = join(repoRoot, 'content');
  for (const f of readdirSync(contentDir).sort()) {
    if (!f.endsWith('.json')) continue;
    const doc = JSON.parse(readFileSync(join(contentDir, f), 'utf8'));
    for (const sec of doc.sections || []) {
      for (const b of sec.blocks || []) {
        if (b.type === 'widget-script' && b.slug === slug) {
          return b.params?.bodyScript || '';
        }
      }
    }
  }
  return '';
}

function patchSchema(slug) {
  const slugDir = join(repoRoot, 'widgets', slug);
  const schemaPath = join(slugDir, 'schema.json');
  const readmePath = join(slugDir, 'README.md');
  const inst = findFirstInstance(slug);
  if (!inst) return { slug, skipped: 'no instance' };

  const bodyMarkup = inst.params?.bodyMarkup || '';
  const widgetSideScript = inst.params?.bodyScript || '';
  const pairedScript = findScriptInstance(slug);
  const fullScript = widgetSideScript || pairedScript;

  const { title, hint } = extractTitleAndHint(bodyMarkup);
  const meta = deriveMeta(bodyMarkup, fullScript);

  const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
  const before = JSON.stringify(schema);

  const displayTitle = title || schema.title || slug;
  schema.description = `Bespoke verbatim-renderer slug for the "${displayTitle}" widget on the ${inst.topic} topic. Carries opaque bodyMarkup + bodyScript strings; migrated from an inline widget by scripts/migrate-inline-widgets-{typea,typeb}.mjs and re-derived meta by scripts/fixup-verbatim-widget-meta.mjs.`;

  schema.meta = {
    family: meta.family,
    dimension: meta.dimension,
    gesture: meta.gesture,
    role: meta.role,
  };

  if (schema.properties?.widgetId) {
    schema.properties.widgetId = {
      type: 'string',
      pattern: '^[A-Za-z][A-Za-z0-9_-]*$',
      description: schema.properties.widgetId.description ||
        'DOM id for the widget root, or the inner-id prefix when the original markup carried no outer id.',
    };
  }
  if (schema.properties?.bodyMarkup) {
    schema.properties.bodyMarkup['x-artifact'] = true;
  }
  if (schema.properties?.bodyScript) {
    schema.properties.bodyScript['x-artifact'] = true;
  }

  const after = JSON.stringify(schema);
  if (before !== after) {
    writeFileSync(schemaPath, JSON.stringify(schema, null, 2) + '\n');
  }

  // Patch README's first body paragraph if title differs from stamped placeholder.
  if (existsSync(readmePath) && title) {
    const md = readFileSync(readmePath, 'utf8');
    const newPara = `Bespoke verbatim slug for the "${title}" widget on \`${inst.topic}\`.`;
    const updated = md.replace(/Bespoke verbatim slug for the ".*?" widget on `[^`]+`\./, newPara);
    if (updated !== md) writeFileSync(readmePath, updated);
  }

  return { slug, title, ...meta, changed: before !== after };
}

const slugs = listVerbatimSlugs();
let changed = 0;
const tally = { static: 0, slider: 0, click: 0, drag: 0, input: 0, select: 0, interact: 0 };
for (const slug of slugs) {
  const r = patchSchema(slug);
  if (r.changed) changed++;
  if (r.gesture) tally[r.gesture] = (tally[r.gesture] || 0) + 1;
}
console.log(`fixup-verbatim-widget-meta: scanned ${slugs.length} verbatim slug(s); ${changed} schema(s) updated.`);
console.log(`gesture distribution after fixup: ${JSON.stringify(tally)}`);
