#!/usr/bin/env node
// Strict audit: every interactive widget in `content/<topic>.json` must use
// the registry pattern — a `widget` block referencing a slug under
// `widgets/<slug>/` plus a paired `widget-script` block — NOT inline
// `<div class="widget">` markup buried in a `raw` block.
//
// Why this audit exists: prior to this script there was no CI gate
// preventing inline `<div class="widget">` from being authored directly
// into a topic's HTML and round-tripped into `content/*.json`'s raw
// blocks. `validate-widget-params.mjs` only validates `type:"widget"`
// blocks and has no opinion on inline HTML; `test-widget-renderers.mjs`
// only checks each registered slug has ≥1 instance, which inline widgets
// don't trigger. So the corpus accumulated 48 inline widgets across 9
// topics over time, undetected.
//
// The point of the registry:
//   1. AJV-validated `params` per slug (schema-checked at CI time).
//   2. Non-HTML frontends (React, etc.) can render the same content
//      because the widget is described as data, not DOM.
//   3. One source of truth per gesture — bug fixes land once.
// Inline widgets bypass all three.
//
// Baseline behavior:
//   - The current corpus state is captured in `audits/inline-widgets-baseline.json`
//     (a map of slug → count). The audit fails if the live count for any
//     topic EXCEEDS its baseline.
//   - New topics with no baseline entry must have count = 0.
//   - Reducing inline widgets (via migration to registry slugs) is allowed
//     and expected; an entry whose count drops to zero stays in the
//     baseline as `0` (or can be deleted) so the migration is locked in.
//
// To accept a deliberate addition (e.g. mid-migration intermediate state)
// the baseline file can be hand-edited and committed alongside the change.
// CI will reject any inline widget addition without an accompanying baseline
// bump, surfacing the architectural drift to the PR review.

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const argv = process.argv.slice(2);
const FIX = argv.includes('--fix');  // --fix updates the baseline to match current state

// ----- Helpers -----

// Count <div class="widget" ... > occurrences in a topic's `raw` HTML blocks.
// Doesn't care about whether each div has a paired script — the existence of
// the markup at all is the failure mode.
function countInlineWidgets(doc) {
  let n = 0;
  for (const sec of doc.sections || []) {
    for (const b of sec.blocks || []) {
      if (b.type !== 'raw') continue;
      const html = b.html || '';
      // Match `<div class="widget"` not preceded by anything that would
      // exclude it. The class attribute could have additional classes
      // (`<div class="widget foo">`), so match the prefix only.
      const m = html.match(/<div\s+class="widget(?:\s|"|\s+[^"]*")/g);
      if (m) n += m.length;
    }
  }
  return n;
}

// ----- Walk content/*.json -----

const contentDir = join(repoRoot, 'content');
const files = readdirSync(contentDir)
  .filter(f => f.endsWith('.json'))
  .sort();

const live = {};
for (const f of files) {
  const slug = basename(f, '.json');
  const doc = JSON.parse(readFileSync(join(contentDir, f), 'utf8'));
  const n = countInlineWidgets(doc);
  if (n > 0) live[slug] = n;
}

// ----- Compare to baseline -----

const baselinePath = join(repoRoot, 'audits', 'inline-widgets-baseline.json');
let baseline = {};
if (existsSync(baselinePath)) {
  baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
}

const errors = [];
const warns = [];

// Topics that exceeded their baseline (drift introduced)
for (const slug of Object.keys(live)) {
  const allowed = baseline[slug] || 0;
  if (live[slug] > allowed) {
    errors.push(
      `  ${slug}: ${live[slug]} inline widgets (baseline allows ${allowed}) — ` +
      `migrate the new instance(s) to a registry slug under widgets/<slug>/`
    );
  }
}

// Topics that improved (count dropped) — informational
for (const slug of Object.keys(baseline)) {
  if (!live[slug] && baseline[slug] > 0) {
    warns.push(`  ${slug}: ${baseline[slug]} → 0 (migrated)`);
  } else if (live[slug] && live[slug] < baseline[slug]) {
    warns.push(`  ${slug}: ${baseline[slug]} → ${live[slug]} (partial migration)`);
  }
}

// ----- Report / write baseline -----

const total = Object.values(live).reduce((a, b) => a + b, 0);
console.log(`audit-no-inline-widgets: ${files.length} topic(s), ${total} inline widgets across ${Object.keys(live).length} topic(s).`);

if (FIX) {
  // Sort the live map for stable output.
  const sorted = {};
  for (const k of Object.keys(live).sort()) sorted[k] = live[k];
  writeFileSync(baselinePath, JSON.stringify(sorted, null, 2) + '\n');
  console.log(`  Updated baseline: ${baselinePath}`);
  console.log(`  Tracked entries: ${Object.keys(sorted).length}`);
  process.exit(0);
}

if (warns.length) {
  console.log(`  improvements (${warns.length}):`);
  for (const w of warns) console.log(w);
}

if (errors.length) {
  console.error('');
  console.error(`FAIL: ${errors.length} topic(s) added inline widgets beyond baseline.`);
  for (const e of errors) console.error(e);
  console.error('');
  console.error('Inline `<div class="widget">` markup in content/<topic>.json bypasses');
  console.error('the widget registry: validate-widget-params.mjs and the React frontend');
  console.error("can't see it. New widgets MUST be authored as a registry-typed `widget`");
  console.error('block referencing widgets/<slug>/. See widgets/README.md.');
  console.error('');
  console.error('To migrate an inline widget: copy the HTML body and script into a new');
  console.error('widgets/<slug>/index.mjs (renderMarkup + renderScript), add a schema,');
  console.error('and replace the raw block with a {type:"widget", slug, params:...} pair.');
  console.error('');
  console.error('To accept a deliberate baseline change (e.g. a mid-migration state),');
  console.error('run `node scripts/audit-no-inline-widgets.mjs --fix` and commit the');
  console.error('updated audits/inline-widgets-baseline.json.');
  process.exit(1);
}

console.log('OK: no new inline widgets beyond baseline.');
process.exit(0);
