#!/usr/bin/env node
// Cross-check docs (PLAN.md, AGENTS.md, scripts/README.md) against git reality.
//
// Advisory audit that catches the drift class this session just exposed:
// PLAN.md listed "third-tier quiz schema" as near-term after commit 19963ca
// shipped it, and AGENTS.md's rebuild step list had gone stale vs. the STEPS
// array in scripts/rebuild.mjs. This probes a fixed set of doc↔code invariants
// that tend to rot silently, and reports anything that looks off.
//
// Checks:
//
//   1. PLAN.md "open" tasks vs. its own "Shipped recently" section.
//      Parse the `## Near-term tasks` (or `## Open on this branch …`) bullet
//      list, then check whether any open item's title also appears in the
//      hand-curated `## Shipped recently` section below it. A title that
//      shows up in *both* places is the genuine drift case: someone shipped
//      the work and listed it under "Shipped recently" but forgot to delete
//      the matching open bullet.
//
//      Why not match against `git log` token-overlap? Because a slug name
//      ("audit-callbacks", "mindmap", etc.) appears in *every* commit subject
//      that touches that area — fix-up commits, refactors, follow-ups — so
//      every open item with a slug in its title gets flagged as "shipped"
//      regardless of whether it actually shipped. The `## Shipped recently`
//      section is hand-curated and only contains things the author has
//      explicitly declared done, which is the signal that actually matters.
//
//      Decision (2026-04-25, PR #33 review item B2): switched from token-
//      overlap-against-git-log to verbatim-substring-match-against-Shipped-
//      recently. This drops false-positive volume to zero on the current
//      PLAN.md (vs. 8 false positives under the old heuristic) while still
//      catching the genuine drift case.
//
//   2. AGENTS.md script references vs. scripts/.
//      Every .mjs name AGENTS.md mentions should exist on disk. (The reverse
//      direction — every script must be mentioned — is covered by check 5
//      against scripts/README.md, which is now the canonical script catalog.)
//
//   3. scripts/README.md rebuild.mjs step list vs. STEPS array.
//      Pull the `const STEPS = [...]` literal out of rebuild.mjs, pull the
//      numbered prose list in scripts/README.md's "All-in-one verification"
//      section, diff. Any mismatch in step name or order is flagged.
//      (This list moved here in commit X — it used to live in AGENTS.md, but
//      AGENTS.md is now the agent-orientation entry point and scripts/README.md
//      is the canonical script catalog.)
//
//   4. scripts/README.md `--only` enumeration vs. STEPS names.
//      Same source-of-truth comparison, different location in scripts/README.md.
//
//   5. scripts/README.md table rows vs. scripts/ directory.
//      Mirror of check 2 against scripts/README.md. Every .mjs should appear
//      in a table row; every table row name should exist on disk.
//
// CLI:
//   node scripts/audit-doc-drift.mjs            — default report.
//   node scripts/audit-doc-drift.mjs --verbose  — extra per-finding context
//                                                 (matched commit subjects,
//                                                 step-list diff detail).
//
// Always exits 0 — this is advisory, not a gate. CI wiring is orchestrator's
// job.
//
// Zero external dependencies. Falls back gracefully if `git` is unavailable.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const scriptsDir = dirname(__filename);
const repoRoot = resolve(scriptsDir, '..');

const argv = process.argv.slice(2);
const VERBOSE = argv.includes('--verbose');

const findings = []; // [{ group, level, msg, detail? }]
const push = (group, level, msg, detail) => findings.push({ group, level, msg, detail });

// ─────────────────────────────────────────────────────────────────────────
// Readers.

function readOrNull(path) {
  try { return readFileSync(path, 'utf8'); }
  catch { return null; }
}

function listScripts() {
  if (!existsSync(scriptsDir)) return [];
  return readdirSync(scriptsDir).filter((f) => f.endsWith('.mjs')).sort();
}

// ─────────────────────────────────────────────────────────────────────────
// Check 1: PLAN.md open tasks vs PLAN.md "Shipped recently" section.

function checkPlanVsGit() {
  const plan = readOrNull(join(repoRoot, 'PLAN.md'));
  if (!plan) {
    push('PLAN.md', 'warn', 'PLAN.md not found — skipping open-vs-shipped check');
    return;
  }

  // Slice out the "open tasks" section. Historical heading was
  // "## Near-term tasks"; current convention is "## Open on this branch (PR #N)".
  // Accept either; abort gracefully if neither is present.
  const open = plan.match(
    /##\s+(Near-term tasks|Open on this branch[^\n]*)\s*\n([\s\S]*?)(?=\n##\s|$)/
  );
  if (!open) {
    push(
      'PLAN.md',
      'warn',
      'no "## Near-term tasks" or "## Open on this branch …" section found'
    );
    return;
  }
  const openHeading = open[1];
  const openBody = open[2];

  // Slice out "## Shipped recently". This is the hand-curated list of things
  // the author has explicitly declared done. Drift = a title appearing in
  // *both* the open list and the shipped list.
  const shipped = plan.match(/##\s+Shipped recently\s*\n([\s\S]*?)(?=\n##\s|$)/);
  if (!shipped) {
    push(
      'PLAN.md',
      'warn',
      'no "## Shipped recently" section found — cannot cross-check open items'
    );
    return;
  }
  const shippedBody = shipped[1];

  // Parse open-list bullets. Historically `- [ ] **Title.** body`; current
  // convention is bullet-only `- **Title.** body`. Accept both.
  const lineRe = /^-\s+(?:\[([ xX])\]\s+)?\*\*([^*]+?)\*\*\s*([^\n]*)$/gm;
  const items = [];
  let m;
  while ((m = lineRe.exec(openBody))) {
    const checked = m[1] && m[1].toLowerCase() === 'x';
    const title = m[2].replace(/\.$/, '').trim();
    items.push({ checked, title });
  }
  if (items.length === 0) {
    push('PLAN.md', 'warn', `found "${openHeading}" section but no bullet items`);
    return;
  }

  // Drift detection: an open item whose title appears verbatim (case-
  // insensitive) inside the Shipped recently section is the genuine "claimed
  // shipped but not removed from open list" case. Strip backticks so
  // `audit-callbacks` matches "audit-callbacks" in shipped prose.
  const shippedLower = shippedBody.toLowerCase();
  const stripBackticks = (s) => s.replace(/`/g, '').trim();

  for (const item of items) {
    const needle = stripBackticks(item.title).toLowerCase();
    if (needle.length < 4) continue; // too short to be a meaningful match
    if (shippedLower.includes(needle)) {
      push(
        'PLAN.md',
        'warn',
        `open item also listed under "Shipped recently": "${item.title}" (delete from open list or move out of shipped)`,
      );
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Check 2: AGENTS.md script references vs scripts/ directory.

function checkAgentsVsScripts() {
  const agents = readOrNull(join(repoRoot, 'AGENTS.md'));
  if (!agents) {
    push('AGENTS.md', 'warn', 'AGENTS.md not found — skipping script-reference check');
    return;
  }
  const mjsFiles = listScripts();

  // Every `scripts/<name>.mjs` mentioned in AGENTS.md should exist on disk.
  // (The reverse — every script must be mentioned in AGENTS.md — is no longer
  // checked: scripts/README.md is the canonical catalog and is enforced by
  // check 5 below. AGENTS.md only carries pointers + category overviews.)
  const mentioned = new Set();
  const re = /scripts\/([a-z0-9\-]+)\.mjs/gi;
  let m;
  while ((m = re.exec(agents))) mentioned.add(`${m[1]}.mjs`);
  // Also catch bare backtick references: `rebuild.mjs`
  const bareRe = /`([a-z0-9\-]+)\.mjs`/gi;
  while ((m = bareRe.exec(agents))) mentioned.add(`${m[1]}.mjs`);

  // Some bare `.mjs` names in AGENTS.md aren't top-level scripts — e.g.
  // `index.mjs` refers to widgets/<slug>/index.mjs registry files, and
  // `content-model.mjs` / `audit-utils.mjs` live under scripts/lib/. Skip
  // anything whose filename matches a widget module or scripts/lib/ entry
  // so we don't flag those as missing.
  const knownNonScriptFiles = new Set();
  const widgetsDir = join(repoRoot, 'widgets');
  if (existsSync(widgetsDir)) {
    for (const d of readdirSync(widgetsDir, { withFileTypes: true })) {
      if (!d.isDirectory()) continue;
      const sub = join(widgetsDir, d.name);
      try {
        for (const f of readdirSync(sub)) {
          if (f.endsWith('.mjs')) knownNonScriptFiles.add(f);
        }
      } catch {
        /* skip unreadable dirs */
      }
    }
  }
  const libDir = join(scriptsDir, 'lib');
  if (existsSync(libDir)) {
    try {
      for (const f of readdirSync(libDir)) {
        if (f.endsWith('.mjs')) knownNonScriptFiles.add(f);
      }
    } catch {
      /* skip */
    }
  }

  const onDisk = new Set(mjsFiles);
  for (const name of mentioned) {
    if (!onDisk.has(name) && !knownNonScriptFiles.has(name)) {
      push('AGENTS.md', 'fail', `references missing script: scripts/${name}`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Check 3 + 4: AGENTS.md rebuild step list + --only enumeration vs STEPS.

function extractStepsArray(src) {
  // Find `const STEPS = [ ... ]` (closing bracket at matching depth).
  const start = src.indexOf('const STEPS = [');
  if (start === -1) return null;
  let depth = 0;
  let end = -1;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end === -1) return null;
  const body = src.slice(start, end + 1);
  // Parse each `{ name: '…', script: '…' }` entry (preserving order).
  const names = [];
  const nameToScript = new Map();
  const re = /name:\s*['"]([a-z0-9\-]+)['"][^{}]*?script:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(body))) {
    names.push(m[1]);
    nameToScript.set(m[1], m[2]);
  }
  // Decorate the array with the map so callers can look up script filenames
  // without maintaining a parallel hard-coded table.
  names.scriptByName = nameToScript;
  return names;
}

function extractRebuildProseList(readme) {
  // The prose list lives in scripts/README.md's "All-in-one verification: the
  // rebuild step list" section, enumerated as a numbered ordered list of
  // scripts. Pull lines matching `   1. \`build-concepts-bundle.mjs\`` etc.
  // in order.
  const marker = readme.indexOf('All-in-one verification');
  if (marker === -1) return null;
  const region = readme.slice(marker, marker + 2000);
  // Match `name.mjs` or `name.mjs --fix` — the backtick may wrap the whole
  // "script + flags" string, so we allow arbitrary content before the closing
  // backtick.
  const re = /^\s*\d+\.\s+`([a-z0-9\-]+)\.mjs(?:[^`]*)`/gm;
  const names = [];
  let m;
  while ((m = re.exec(region))) names.push(m[1]);
  return names.length ? names : null;
}

function extractOnlyList(readme) {
  // The `--only` enumeration is inline after a mention of `--only <step>`. The
  // list is a comma-separated sequence of backtick-quoted step names. It may
  // appear inside parentheses, after a colon, or inline in prose — we accept
  // any of those as long as we can find the first long run of backticked
  // comma-separated names within ~800 chars of the "Valid names:" prose marker
  // (or `--only` if the marker isn't present).
  let idx = readme.indexOf('Valid names:');
  if (idx === -1) idx = readme.indexOf('--only');
  if (idx === -1) return null;
  const region = readme.slice(idx, idx + 800);
  // Match a sequence of at least 3 backticked names joined by commas.
  const run = region.match(
    /(?:`[a-z0-9\-]+`(?:\s*,\s*|\s+))+`[a-z0-9\-]+`/
  );
  if (!run) return null;
  const names = [];
  const re = /`([a-z0-9\-]+)`/g;
  let m;
  while ((m = re.exec(run[0]))) names.push(m[1]);
  return names.length ? names : null;
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function diffArrays(expected, actual) {
  const exp = new Set(expected);
  const act = new Set(actual);
  const missing = expected.filter((x) => !act.has(x));
  const extra = actual.filter((x) => !exp.has(x));
  return { missing, extra };
}

function checkRebuildStepList() {
  const rebuildSrc = readOrNull(join(scriptsDir, 'rebuild.mjs'));
  if (!rebuildSrc) {
    push('AGENTS.md', 'warn', 'scripts/rebuild.mjs not found — skipping step-list check');
    return;
  }
  const steps = extractStepsArray(rebuildSrc);
  if (!steps) {
    push('AGENTS.md', 'warn', 'could not parse STEPS array in scripts/rebuild.mjs');
    return;
  }
  // Prefer the script-field mapping parsed out of STEPS itself; fall back to
  // the hard-coded table if the new parse returned no entries (shouldn't
  // happen, but keeps the old invariant if someone rewrites the STEPS shape).
  const expectedScripts = steps.map((n) =>
    (steps.scriptByName && steps.scriptByName.get(n)) || stepNameToScript(n)
  );

  const readme = readOrNull(join(scriptsDir, 'README.md'));
  if (!readme) return;

  // Prose step list (filenames).
  const prose = extractRebuildProseList(readme);
  if (!prose) {
    push('scripts/README.md', 'warn', 'could not find the "All-in-one verification" step list');
  } else {
    // Compare scripts, ignoring `--fix` suffix.
    const proseFull = prose.map((n) => `${n}.mjs`);
    const expectedFull = expectedScripts;
    if (!arraysEqual(proseFull, expectedFull)) {
      const { missing, extra } = diffArrays(expectedFull, proseFull);
      const bits = [];
      if (missing.length) bits.push(`missing: ${missing.join(', ')}`);
      if (extra.length)   bits.push(`extra: ${extra.join(', ')}`);
      if (!bits.length)   bits.push('order differs');
      push(
        'scripts/README.md',
        'fail',
        `step list mismatch: prose shows ${prose.length} steps, STEPS array has ${steps.length} (${bits.join('; ')})`,
        VERBOSE
          ? `prose:  ${proseFull.join(' → ')}\n        array:  ${expectedFull.join(' → ')}`
          : null,
      );
    }
  }

  // --only enumeration.
  const only = extractOnlyList(readme);
  if (!only) {
    push('scripts/README.md', 'warn', 'could not find a `--only` enumeration to check');
  } else if (!arraysEqual(only, steps)) {
    const { missing, extra } = diffArrays(steps, only);
    const bits = [];
    if (missing.length) bits.push(`missing: ${missing.join(', ')}`);
    if (extra.length)   bits.push(`extra: ${extra.join(', ')}`);
    if (!bits.length)   bits.push('order differs');
    push(
      'scripts/README.md',
      'fail',
      `--only enumeration mismatch vs STEPS array (${bits.join('; ')})`,
      VERBOSE ? `--only: ${only.join(', ')}\n        STEPS:  ${steps.join(', ')}` : null,
    );
  }

  // Also check PLAN.md's step-count prose — a common stale-doc trap.
  const plan = readOrNull(join(repoRoot, 'PLAN.md'));
  if (plan) {
    const mm = plan.match(/(\d+)-step chain/i);
    if (mm && Number(mm[1]) !== steps.length) {
      push(
        'PLAN.md',
        'warn',
        `prose says "${mm[1]}-step chain" but STEPS array has ${steps.length} steps`,
      );
    }
  }
}

function stepNameToScript(name) {
  // Map short STEPS alias → full script filename. Mirrors rebuild.mjs's STEPS
  // entries; keep in sync if rebuild.mjs grows a step.
  const map = {
    concepts:   'build-concepts-bundle.mjs',
    quizzes:    'build-quizzes-bundle.mjs',
    validate:   'validate-concepts.mjs',
    katex:      'validate-katex.mjs',
    callbacks:  'audit-callbacks.mjs',
    backlinks:  'inject-used-in-backlinks.mjs',
    breadcrumb: 'inject-breadcrumb.mjs',
    a11y:       'fix-a11y.mjs',
    smoke:      'smoke-test.mjs',
  };
  return map[name] || `${name}.mjs`;
}

// ─────────────────────────────────────────────────────────────────────────
// Check 5: scripts/README.md rows vs scripts/ directory.

function checkScriptsReadme() {
  const readme = readOrNull(join(scriptsDir, 'README.md'));
  if (!readme) {
    push('scripts/README.md', 'warn', 'scripts/README.md not found — skipping row check');
    return;
  }
  const mjsFiles = listScripts();

  for (const f of mjsFiles) {
    if (!readme.includes(f)) {
      push('scripts/README.md', 'warn', `row missing: ${f}`);
    }
  }

  const mentioned = new Set();
  const re = /`([a-z0-9\-]+)\.mjs`/gi;
  let m;
  while ((m = re.exec(readme))) mentioned.add(`${m[1]}.mjs`);
  const onDisk = new Set(mjsFiles);
  for (const name of mentioned) {
    if (!onDisk.has(name)) {
      push('scripts/README.md', 'fail', `references missing script: ${name}`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Run all checks.

checkPlanVsGit();
checkAgentsVsScripts();
checkRebuildStepList();
checkScriptsReadme();

// ─────────────────────────────────────────────────────────────────────────
// Report.

const total = findings.length;
console.log(`audit-doc-drift: ${total} issue(s)`);

if (total === 0) {
  console.log('\nOK: docs look consistent with git/scripts.');
  process.exit(0);
}

// Group by group name.
const byGroup = new Map();
for (const f of findings) {
  if (!byGroup.has(f.group)) byGroup.set(f.group, []);
  byGroup.get(f.group).push(f);
}

for (const [group, items] of byGroup) {
  console.log(`\n${group}`);
  for (const f of items) {
    const mark = f.level === 'fail' ? 'x' : '!';
    console.log(`  [${mark}] ${f.msg}`);
    if (f.detail) {
      for (const line of String(f.detail).split('\n')) {
        console.log(`        ${line}`);
      }
    }
  }
}

console.log('\n(advisory; always exits 0)');
process.exit(0);
