#!/usr/bin/env node
// Refresh `PLAN.md`'s "Corpus snapshot" and the verbatim-slug count in the
// "Authoring polish" bullet to match the live corpus. Idempotent — re-running
// with no drift produces no diff. Mirrors the pattern of inject-index-stats.mjs.
//
// What this manages (auto-refreshes from source-of-truth JSON):
//   - "Corpus snapshot (YYYY-MM-DD)" header date (only bumped when some
//     other number also drifted — keeps CI clean when content didn't change)
//   - "N topics, N concepts, N capstones"
//   - "N widgets, 100% registry-driven" (count of type=widget blocks across
//     all content/<topic>.json sections)
//   - "Quiz tiers: v1 = N, hard = N, expert = N"
//   - "Control theory & optimization (section 12) has N topics" — derived
//     from concepts/sections.json; same construction works for any section
//     whose count the bullet calls out by name
//   - "Roughly N per-widget verbatim slugs" in the Authoring polish bullet
//     (counts slugs under widgets/ whose index.mjs delegates to
//     widgets/_shared/verbatim-renderer.mjs)
//
// What this does NOT manage (still requires manual sync — these depend on
// audit scripts whose outputs are themselves derived):
//   - "N concepts lack a widget" — see audits/coverage-stats.md
//   - "Tag coverage: 99.1%"     — see audits/coverage-stats.md
//   - "N narrative-tour story pages, all wired into Tours 1-N"
//   - "N color-only references" / "N inputs still flagged" — from
//     audit-accessibility.mjs output
//
// CLI:
//   node scripts/inject-plan-snapshot.mjs        — audit (exit 1 if stale)
//   node scripts/inject-plan-snapshot.mjs --fix  — rewrite in place
//
// Zero external deps.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeIfChanged } from './lib/html-injector.mjs';

const __filename = fileURLToPath(import.meta.url);
// `MV_REPO_ROOT` env override lets tests point the script at a fixture tree
// without copying the script. Production callers don't set it.
const repoRoot = process.env.MV_REPO_ROOT
  ? resolve(process.env.MV_REPO_ROOT)
  : resolve(dirname(__filename), '..');

const FIX = process.argv.slice(2).includes('--fix');
const planPath = join(repoRoot, 'PLAN.md');
const conceptsDir = join(repoRoot, 'concepts');
const quizzesDir = join(repoRoot, 'quizzes');
const contentDir = join(repoRoot, 'content');
const widgetsDir = join(repoRoot, 'widgets');

if (!existsSync(planPath)) {
  console.error('inject-plan-snapshot: PLAN.md not found');
  process.exit(2);
}

// ---------------------------------------------------------------------------
// Compute live counts
// ---------------------------------------------------------------------------
//
// This script auto-rewrites PLAN.md numbers in --fix mode. If a count
// silently drops (schema change, file rename, parse failure), the rewrite
// would codify the wrong number with no signal. So every source is checked
// for *shape* before being counted — schema mismatches exit 2 with a clear
// "SCHEMA DRIFT" message rather than defaulting to a smaller value.

function schemaExit(msg) {
  console.error(`inject-plan-snapshot: SCHEMA DRIFT: ${msg}`);
  process.exit(2);
}

const registry = JSON.parse(readFileSync(join(conceptsDir, 'index.json'), 'utf8'));
if (!Array.isArray(registry?.topics)) {
  schemaExit('concepts/index.json missing `topics` array');
}
const topicIds = registry.topics;
const topicCount = topicIds.length;

let conceptCount = 0;
for (const t of topicIds) {
  const p = join(conceptsDir, `${t}.json`);
  if (!existsSync(p)) continue;
  try {
    const j = JSON.parse(readFileSync(p, 'utf8'));
    if (Array.isArray(j.concepts)) conceptCount += j.concepts.length;
  } catch {
    /* parse errors are validate-concepts.mjs's job */
  }
}

const capstonesJson = JSON.parse(readFileSync(join(conceptsDir, 'capstones.json'), 'utf8'));
if (!Array.isArray(capstonesJson?.capstones)) {
  schemaExit(
    'concepts/capstones.json missing `capstones` array — defaulting to 0 would silently overwrite PLAN.md'
  );
}
const capstoneCount = capstonesJson.capstones.length;

// Verbatim slugs: those whose index.mjs delegates to the shared verbatim
// renderer. Check the renderer file itself exists so an accidental rename of
// `_shared/verbatim-renderer.mjs` doesn't silently zero the count.
const verbatimRendererPath = join(widgetsDir, '_shared', 'verbatim-renderer.mjs');
if (!existsSync(verbatimRendererPath)) {
  schemaExit(
    'widgets/_shared/verbatim-renderer.mjs not found — verbatim-slug detection broken'
  );
}
const verbatimSlugs = new Set();
for (const entry of readdirSync(widgetsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;  // skip widgets/README.md, widgets/bundle.js
  const slug = entry.name;
  if (slug.startsWith('_')) continue;  // _shared, etc.
  const idxPath = join(widgetsDir, slug, 'index.mjs');
  if (!existsSync(idxPath)) {
    console.warn(`inject-plan-snapshot: widgets/${slug}/index.mjs missing — half-scaffolded?`);
    continue;
  }
  try {
    const code = readFileSync(idxPath, 'utf8');
    if (code.includes('_shared/verbatim-renderer')) verbatimSlugs.add(slug);
  } catch {
    console.warn(`inject-plan-snapshot: widgets/${slug}/index.mjs unreadable — skipped`);
  }
}
const verbatimCount = verbatimSlugs.size;

// Widget block count across all content/<topic>.json sections. Schema-assert
// `sections` is an array so a renamed top-level key doesn't silently zero
// the count (test-roundtrip.mjs only checks byte-identity, not schema shape).
let widgetCount = 0;
let topicsWithSections = 0;
for (const f of readdirSync(contentDir)) {
  if (!f.endsWith('.json')) continue;
  let j;
  try {
    j = JSON.parse(readFileSync(join(contentDir, f), 'utf8'));
  } catch {
    continue;  // parse errors are test-roundtrip.mjs's job
  }
  if (!Array.isArray(j.sections)) {
    console.warn(`inject-plan-snapshot: content/${f} has no \`sections\` array — skipped`);
    continue;
  }
  topicsWithSections += 1;
  for (const sec of j.sections) {
    for (const b of sec.blocks || []) {
      if (b && b.type === 'widget') widgetCount += 1;
    }
  }
}
// Sanity: if zero topics contributed any widgets, something's wrong upstream.
if (widgetCount === 0 && topicsWithSections > 0) {
  schemaExit(
    `${topicsWithSections} content files have \`sections\` arrays but produced zero widget blocks — block-type detection broken`
  );
}

// Quiz tier totals. Warn on each malformed entry rather than silently dropping.
let v1Count = 0;
let hardCount = 0;
let expertCount = 0;
for (const f of readdirSync(quizzesDir)) {
  if (!f.endsWith('.json')) continue;
  let j;
  try {
    j = JSON.parse(readFileSync(join(quizzesDir, f), 'utf8'));
  } catch {
    continue;  // parse errors are validate-schema.mjs's job
  }
  const bank = j.quizzes;
  if (!bank || typeof bank !== 'object') {
    console.warn(`inject-plan-snapshot: quizzes/${f} missing \`quizzes\` object — skipped`);
    continue;
  }
  for (const k of Object.keys(bank)) {
    const e = bank[k];
    if (!e || typeof e !== 'object') {
      console.warn(`inject-plan-snapshot: quizzes/${f} concept "${k}" is not an object — skipped`);
      continue;
    }
    if (Array.isArray(e.questions)) v1Count += e.questions.length;
    if (Array.isArray(e.hard)) hardCount += e.hard.length;
    if (Array.isArray(e.expert)) expertCount += e.expert.length;
  }
}

// Section topic counts — currently only one section count is called out in
// PLAN.md prose (Control theory & optimization). Add more entries if the
// snapshot ever calls out additional section sizes.
const sectionsJson = JSON.parse(readFileSync(join(conceptsDir, 'sections.json'), 'utf8'));
if (!Array.isArray(sectionsJson?.sections)) {
  schemaExit('concepts/sections.json missing `sections` array');
}
const sectionsArr = sectionsJson.sections;
function sectionTopicCount(id) {
  const s = sectionsArr.find((x) => x.id === id);
  return s && Array.isArray(s.topics) ? s.topics.length : 0;
}
const ctoTopicCount = sectionTopicCount('control-theory-and-optimization');

// ---------------------------------------------------------------------------
// Patch PLAN.md
// ---------------------------------------------------------------------------

const original = readFileSync(planPath, 'utf8');
let updated = original;
const drifts = [];

function patchField({ re, name, newText, driftMessage }) {
  const m = updated.match(re);
  if (!m) {
    schemaExit(
      `pattern "${name}" not found in PLAN.md — bullet prose changed, please update the script's regex`
    );
  }
  const driftMsg = driftMessage(m);
  if (driftMsg) drifts.push(driftMsg);
  // `newText` may be a plain string or a function of the match (used when the
  // regex captures a prose prefix that must be preserved). Function replacer
  // form avoids `$&`/`$1` interpretation regardless of which we pass.
  const finalText = typeof newText === 'function' ? newText(m) : newText;
  updated = updated.replace(re, () => finalText);
}

// "N topics, N concepts, N capstones"
patchField({
  re: /^- (\d+) topics, (\d+) concepts, (\d+) capstones\s*$/m,
  name: 'topics/concepts/capstones',
  newText: `- ${topicCount} topics, ${conceptCount} concepts, ${capstoneCount} capstones`,
  driftMessage: (m) => {
    const [oT, oC, oCap] = [+m[1], +m[2], +m[3]];
    if (oT === topicCount && oC === conceptCount && oCap === capstoneCount) return null;
    return `topics ${oT}→${topicCount}, concepts ${oC}→${conceptCount}, capstones ${oCap}→${capstoneCount}`;
  },
});

// "N widgets, 100% registry-driven." (with optional trailing prose)
patchField({
  re: /^- (\d+) widgets, 100% registry-driven\./m,
  name: 'widget count',
  newText: `- ${widgetCount} widgets, 100% registry-driven.`,
  driftMessage: (m) => (+m[1] === widgetCount ? null : `widgets ${+m[1]}→${widgetCount}`),
});

// "Quiz tiers: v1 = N, hard = N, expert = N"
patchField({
  re: /^- Quiz tiers: v1 = (\d+), hard = (\d+), expert = (\d+)/m,
  name: 'quiz tiers',
  newText: `- Quiz tiers: v1 = ${v1Count}, hard = ${hardCount}, expert = ${expertCount}`,
  driftMessage: (m) => {
    const [oV, oH, oE] = [+m[1], +m[2], +m[3]];
    if (oV === v1Count && oH === hardCount && oE === expertCount) return null;
    return `quiz v1 ${oV}→${v1Count}, hard ${oH}→${hardCount}, expert ${oE}→${expertCount}`;
  },
});

// "Control theory & optimization (section 12) has N topics" — anchored to
// bullet line via `^- .*` so a quote of this phrase in surrounding prose
// can't match accidentally. The captured prefix is preserved verbatim.
patchField({
  re: /(^- .*?)Control theory & optimization \(section 12\) has (\d+) topics/m,
  name: 'CTO section topic count',
  newText: (m) =>
    `${m[1]}Control theory & optimization (section 12) has ${ctoTopicCount} topics`,
  driftMessage: (m) =>
    +m[2] === ctoTopicCount ? null : `Control-theory topics ${+m[2]}→${ctoTopicCount}`,
});

// "Roughly N per-widget verbatim slugs" — anchored similarly.
patchField({
  re: /(^- .*?)Roughly (\d+) per-widget verbatim slugs/m,
  name: 'verbatim slug count',
  newText: (m) => `${m[1]}Roughly ${verbatimCount} per-widget verbatim slugs`,
  driftMessage: (m) =>
    +m[2] === verbatimCount ? null : `verbatim slugs ${+m[2]}→${verbatimCount}`,
});

// Snapshot date — only refresh when other numbers also drifted. Avoids
// spurious CI failures on days where nothing about the corpus changed and
// makes the date semantically tied to corpus change rather than build time
// (it's a deliberately lagging indicator — hand-edits to non-numeric
// snapshot prose won't bump it).
//
// Uses local date (not UTC) so the bump aligns with the human committer's
// calendar day. Trade-off: CI runs in UTC, so a late-night commit (e.g.
// 23:30 PT → 06:30 UTC next day) could in principle see a one-day skew
// between local fix-mode and CI audit-mode. The "only-bump-on-other-drift"
// guard absorbs this in practice: the date only refreshes when content
// actually changed, and the local-vs-UTC discrepancy is invisible unless
// some other field also moved within the same UTC day boundary.
if (drifts.length > 0) {
  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const dateRe = /## Corpus snapshot \((\d{4}-\d{2}-\d{2})\)/;
  const m = updated.match(dateRe);
  if (m && m[1] !== today) {
    drifts.push(`snapshot date ${m[1]}→${today}`);
    updated = updated.replace(dateRe, `## Corpus snapshot (${today})`);
  }
}

// ---------------------------------------------------------------------------
// Report / apply
// ---------------------------------------------------------------------------

if (drifts.length === 0) {
  console.log(
    `inject-plan-snapshot: in sync (${topicCount} topics, ${conceptCount} concepts, ${capstoneCount} capstones, ${widgetCount} widgets, v1=${v1Count}/hard=${hardCount}/expert=${expertCount}, CTO=${ctoTopicCount}, verbatim=${verbatimCount})`
  );
  process.exit(0);
}

if (!FIX) {
  for (const d of drifts) console.error(`  PLAN.md: ${d}`);
  console.error('inject-plan-snapshot: drift detected — run with --fix');
  process.exit(1);
}

writeIfChanged(planPath, original, updated);
console.log(
  `inject-plan-snapshot: updated PLAN.md (${drifts.length} field(s): ${drifts.join('; ')})`
);
process.exit(0);
