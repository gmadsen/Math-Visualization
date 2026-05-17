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
const repoRoot = resolve(dirname(__filename), '..');

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

const registry = JSON.parse(readFileSync(join(conceptsDir, 'index.json'), 'utf8'));
const topicIds = Array.isArray(registry.topics) ? registry.topics : [];
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
const capstoneCount = Array.isArray(capstonesJson.capstones)
  ? capstonesJson.capstones.length
  : Array.isArray(capstonesJson)
    ? capstonesJson.length
    : 0;

// Verbatim slugs: those whose index.mjs delegates to the shared verbatim renderer.
const verbatimSlugs = new Set();
for (const slug of readdirSync(widgetsDir)) {
  const idxPath = join(widgetsDir, slug, 'index.mjs');
  if (!existsSync(idxPath)) continue;
  try {
    const code = readFileSync(idxPath, 'utf8');
    if (code.includes('_shared/verbatim-renderer')) verbatimSlugs.add(slug);
  } catch {
    /* ignore unreadable */
  }
}
const verbatimCount = verbatimSlugs.size;

// Widget block count across all content/<topic>.json sections.
let widgetCount = 0;
for (const f of readdirSync(contentDir)) {
  if (!f.endsWith('.json')) continue;
  try {
    const j = JSON.parse(readFileSync(join(contentDir, f), 'utf8'));
    for (const sec of j.sections || []) {
      for (const b of sec.blocks || []) {
        if (b && b.type === 'widget') widgetCount += 1;
      }
    }
  } catch {
    /* parse errors are test-roundtrip.mjs's job */
  }
}

// Quiz tier totals.
let v1Count = 0;
let hardCount = 0;
let expertCount = 0;
for (const f of readdirSync(quizzesDir)) {
  if (!f.endsWith('.json')) continue;
  try {
    const j = JSON.parse(readFileSync(join(quizzesDir, f), 'utf8'));
    const bank = j.quizzes || {};
    for (const k of Object.keys(bank)) {
      const e = bank[k];
      if (!e || typeof e !== 'object') continue;
      if (Array.isArray(e.questions)) v1Count += e.questions.length;
      if (Array.isArray(e.hard)) hardCount += e.hard.length;
      if (Array.isArray(e.expert)) expertCount += e.expert.length;
    }
  } catch {
    /* parse errors are validate-schema.mjs's job */
  }
}

// Section topic counts — currently only one section count is called out in
// PLAN.md prose (Control theory & optimization). Add more entries to
// `namedSections` if the snapshot ever calls out additional section sizes.
const sectionsJson = JSON.parse(readFileSync(join(conceptsDir, 'sections.json'), 'utf8'));
const sectionsArr = Array.isArray(sectionsJson.sections) ? sectionsJson.sections : [];
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

function patchField({ re, name, oldFromMatch, newText, driftMessage }) {
  const m = updated.match(re);
  if (!m) {
    console.error(
      `inject-plan-snapshot: pattern "${name}" not found in PLAN.md — schema drift in the bullet's prose, please review the script's regexes`
    );
    process.exit(2);
  }
  const driftMsg = driftMessage(m);
  if (driftMsg) drifts.push(driftMsg);
  updated = updated.replace(re, newText);
}

// "N topics, N concepts, N capstones"
patchField({
  re: /^- (\d+) topics, (\d+) concepts, (\d+) capstones\s*$/m,
  name: 'topics/concepts/capstones',
  oldFromMatch: (m) => [+m[1], +m[2], +m[3]],
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
  oldFromMatch: (m) => +m[1],
  newText: `- ${widgetCount} widgets, 100% registry-driven.`,
  driftMessage: (m) => (+m[1] === widgetCount ? null : `widgets ${+m[1]}→${widgetCount}`),
});

// "Quiz tiers: v1 = N, hard = N, expert = N"
patchField({
  re: /^- Quiz tiers: v1 = (\d+), hard = (\d+), expert = (\d+)/m,
  name: 'quiz tiers',
  oldFromMatch: (m) => [+m[1], +m[2], +m[3]],
  newText: `- Quiz tiers: v1 = ${v1Count}, hard = ${hardCount}, expert = ${expertCount}`,
  driftMessage: (m) => {
    const [oV, oH, oE] = [+m[1], +m[2], +m[3]];
    if (oV === v1Count && oH === hardCount && oE === expertCount) return null;
    return `quiz v1 ${oV}→${v1Count}, hard ${oH}→${hardCount}, expert ${oE}→${expertCount}`;
  },
});

// "Control theory & optimization (section 12) has N topics"
patchField({
  re: /Control theory & optimization \(section 12\) has (\d+) topics/,
  name: 'CTO section topic count',
  oldFromMatch: (m) => +m[1],
  newText: `Control theory & optimization (section 12) has ${ctoTopicCount} topics`,
  driftMessage: (m) =>
    +m[1] === ctoTopicCount ? null : `Control-theory topics ${+m[1]}→${ctoTopicCount}`,
});

// "Roughly N per-widget verbatim slugs"
patchField({
  re: /Roughly (\d+) per-widget verbatim slugs/,
  name: 'verbatim slug count',
  oldFromMatch: (m) => +m[1],
  newText: `Roughly ${verbatimCount} per-widget verbatim slugs`,
  driftMessage: (m) =>
    +m[1] === verbatimCount ? null : `verbatim slugs ${+m[1]}→${verbatimCount}`,
});

// Snapshot date — only refresh when other numbers also drifted. Avoids
// spurious CI failures on days where nothing about the corpus changed.
// Uses local date (not UTC) so the bump aligns with the human committer's
// calendar day, not the build-box's timezone.
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
