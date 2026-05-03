#!/usr/bin/env node
// Strict audit: every interactive widget in `content/<topic>.json` must use
// the registry pattern — a `widget` block referencing a slug under
// `widgets/<slug>/` plus a paired `widget-script` block. No inline
// `<div class="widget">` markup in `raw` blocks, and no structured
// `type:"widget"` blocks lacking a `slug`.
//
// Why this audit exists: prior to this script there was no CI gate
// preventing inline `<div class="widget">` from being authored directly
// into a topic's HTML and round-tripped into `content/*.json`'s raw
// blocks. `validate-widget-params.mjs` only validates `type:"widget"`
// blocks and has no opinion on inline HTML; `test-widget-renderers.mjs`
// only checks each registered slug has ≥1 instance, which inline widgets
// don't trigger.
//
// The point of the registry:
//   1. AJV-validated `params` per slug (schema-checked at CI time).
//   2. Non-HTML frontends (React, etc.) can render the same content
//      because the widget is described as data, not DOM.
//   3. One source of truth per gesture — bug fixes land once.
// Inline widgets bypass all three.
//
// Hard-zero: the audit fails if ANY topic carries either form. The
// inline-widget-zero-baseline sweep migrated all grandfathered cases to
// per-slug verbatim renderers under widgets/<slug>/ sharing
// widgets/_shared/verbatim-renderer.mjs. New widgets must follow the
// registry pattern from the start; see widgets/README.md.

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

// ----- Helpers -----

// Count <div class="widget" ... > occurrences in a topic's `raw` HTML blocks
// — Type A inline widgets.
function countInlineMarkup(doc) {
  let n = 0;
  for (const sec of doc.sections || []) {
    for (const b of sec.blocks || []) {
      if (b.type !== 'raw') continue;
      const html = b.html || '';
      const m = html.match(/<div\s+class="widget(?:\s|"|\s+[^"]*")/g);
      if (m) n += m.length;
    }
  }
  return n;
}

// Count `type:"widget"` blocks lacking a `slug` — Type B unstructured widgets.
//
// We only check `widget` blocks here, not `widget-script`. When a widget's slug
// renderer intentionally returns an empty script (e.g. `svg-illustration`),
// its driving script lives in a sibling `widget-script` block with a
// `forWidget` back-reference and no `slug`. That is a documented pattern, not
// a registry bypass — the widget side IS registered, and render-topic.mjs
// emits the verbatim script untouched.
function countUnslugged(doc) {
  let n = 0;
  for (const sec of doc.sections || []) {
    for (const b of sec.blocks || []) {
      if (b.type === 'widget' && !b.slug) {
        n++;
      }
    }
  }
  return n;
}

// ----- Walk content/*.json -----

const contentDir = join(repoRoot, 'content');
const files = readdirSync(contentDir)
  .filter(f => f.endsWith('.json'))
  .sort();

const offenders = [];
let totalInlineMarkup = 0;
let totalUnslugged = 0;

for (const f of files) {
  const slug = basename(f, '.json');
  const doc = JSON.parse(readFileSync(join(contentDir, f), 'utf8'));
  const a = countInlineMarkup(doc);
  const b = countUnslugged(doc);
  totalInlineMarkup += a;
  totalUnslugged += b;
  if (a > 0 || b > 0) offenders.push({ slug, inlineMarkup: a, unslugged: b });
}

// ----- Report -----

console.log(
  `audit-no-inline-widgets: ${files.length} topic(s), ` +
  `${totalInlineMarkup} inline-markup widget(s), ${totalUnslugged} unslugged widget block(s).`,
);

if (offenders.length) {
  console.error('');
  console.error(`FAIL: ${offenders.length} topic(s) carry non-registry widgets.`);
  for (const o of offenders) {
    const parts = [];
    if (o.inlineMarkup) parts.push(`${o.inlineMarkup} inline <div class="widget">`);
    if (o.unslugged) parts.push(`${o.unslugged} type:"widget" without slug`);
    console.error(`  ${o.slug}: ${parts.join(', ')}`);
  }
  console.error('');
  console.error('Non-registry widgets bypass widget params validation, the React');
  console.error('frontend, and stats-coverage. Every interactive widget MUST be a');
  console.error('registry-typed `widget` block referencing widgets/<slug>/.');
  console.error('');
  console.error('To migrate: copy the HTML body and script into a new widgets/<slug>/');
  console.error('(schema.json + index.mjs + README.md). Reuse the verbatim renderer at');
  console.error('widgets/_shared/verbatim-renderer.mjs for an opaque-string slug, or');
  console.error('write a bespoke renderer that exposes semantic params. Then replace');
  console.error('the inline block with `{type:"widget", slug, params:...}` plus a');
  console.error('paired `widget-script` block. See widgets/README.md.');
  process.exit(1);
}

console.log('OK: every widget references a registry slug.');
process.exit(0);
