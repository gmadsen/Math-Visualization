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
//   1. PLAN.md "Near-term tasks" vs. recent git log.
//      Parse the `## Near-term tasks` checklist, match each `- [ ] **Title.**`
//      item against `git log --oneline -100`. A title whose keyword fragments
//      appear in a recent commit message is flagged as "unchecked but likely
//      shipped". A `[x]` item with zero recent commit evidence is flagged as
//      "possibly stale completion".
//
//   2. AGENTS.md script references vs. scripts/.
//      Every .mjs in scripts/ should be mentioned at least once in AGENTS.md.
//      Every .mjs name AGENTS.md mentions should exist on disk.
//
//   3. AGENTS.md rebuild.mjs step list vs. STEPS array.
//      Pull the `const STEPS = [...]` literal out of rebuild.mjs, pull the
//      numbered prose list in AGENTS.md's "Registering a new page" section,
//      diff. Any mismatch in step name or order is flagged.
//
//   4. AGENTS.md `--only` enumeration vs. STEPS names.
//      Same source-of-truth comparison, different location in AGENTS.md.
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
import { spawnSync } from 'node:child_process';
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

function gitLog() {
  const r = spawnSync('git', ['log', '--oneline', '-100'], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  if (r.error || r.status !== 0) return null;
  return r.stdout
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^([0-9a-f]+)\s+(.*)$/);
      return m ? { hash: m[1], subject: m[2] } : null;
    })
    .filter(Boolean);
}

// ─────────────────────────────────────────────────────────────────────────
// Check 1: PLAN.md near-term tasks vs git log.

// Drop common English stopwords when keyword-matching task titles to commit
// subjects; also drop 1–3 char tokens (too ambiguous).
const STOP = new Set([
  'the', 'and', 'for', 'with', 'from', 'into', 'that', 'this',
  'are', 'its', 'their', 'them', 'a', 'an', 'of', 'to', 'in',
  'on', 'at', 'by', 'or', 'as', 'is', 'be', 'has', 'have',
  'new', 'add', 'added', 'adds', 'use', 'used', 'using',
  'per', 'not', 'all', 'any', 'but', 'via', 'each',
]);

function tokensOf(s) {
  // Split on whitespace AND hyphens so "third-tier" → ["third", "tier"].
  // Keep tokens of length ≥ 4 that aren't English stopwords.
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\- ]+/g, ' ')
    .split(/[\s\-]+/)
    .filter((t) => t.length >= 4 && !STOP.has(t));
}

function checkPlanVsGit() {
  const plan = readOrNull(join(repoRoot, 'PLAN.md'));
  if (!plan) {
    push('PLAN.md', 'warn', 'PLAN.md not found — skipping near-term-tasks check');
    return;
  }

  // Slice out the "## Near-term tasks" section (up to the next ## heading).
  const near = plan.match(/##\s+Near-term tasks\s*\n([\s\S]*?)(?=\n##\s|$)/);
  if (!near) {
    push('PLAN.md', 'warn', 'no "## Near-term tasks" section found');
    return;
  }
  const body = near[1];

  // Parse checklist lines: `- [ ] **Title.** body...` or `- [x] **Title.** body`.
  const lineRe = /^-\s+\[([ xX])\]\s+\*\*([^*]+?)\*\*\s*([^\n]*)$/gm;
  const items = [];
  let m;
  while ((m = lineRe.exec(body))) {
    const checked = m[1].toLowerCase() === 'x';
    const title = m[2].replace(/\.$/, '').trim();
    const rest = m[3].trim();
    items.push({ checked, title, rest });
  }
  if (items.length === 0) {
    push('PLAN.md', 'warn', 'found "Near-term tasks" section but no checklist items');
    return;
  }

  const log = gitLog();
  if (!log) {
    push('PLAN.md', 'warn', 'git log unavailable — skipping commit-match check');
    return;
  }

  // Heuristic: for each unchecked item, collect ≥4-char keyword tokens from the
  // title (+ first words of rest). A commit whose subject contains ≥ 2 of them
  // (or 1 if there's only 1 in the title) counts as a likely match.
  for (const item of items) {
    const keyTokens = tokensOf(item.title + ' ' + item.rest.split('.')[0]);
    if (keyTokens.length === 0) continue;
    const threshold = keyTokens.length >= 3 ? 2 : 1;

    const matches = [];
    for (const { hash, subject } of log) {
      const subjTokens = new Set(tokensOf(subject));
      const hits = keyTokens.filter((t) => subjTokens.has(t));
      if (hits.length >= threshold) {
        matches.push({ hash, subject, hits });
      }
    }

    if (!item.checked && matches.length > 0) {
      const top = matches[0];
      push(
        'PLAN.md',
        'warn',
        `unchecked but likely shipped: "${item.title}" — commit ${top.hash}`,
        VERBOSE
          ? `matched tokens [${top.hits.join(', ')}] in "${top.subject}"` +
            (matches.length > 1 ? `\n        + ${matches.length - 1} more commit(s)` : '')
          : null,
      );
    }
    if (item.checked && matches.length === 0) {
      push(
        'PLAN.md',
        'warn',
        `checked but no recent commit evidence: "${item.title}" (possibly stale completion)`,
        VERBOSE ? `keywords searched: [${keyTokens.join(', ')}]` : null,
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

  // Every .mjs in scripts/ should be mentioned at least once in AGENTS.md.
  for (const f of mjsFiles) {
    if (!agents.includes(f)) {
      push('AGENTS.md', 'warn', `undocumented script: scripts/${f}`);
    }
  }

  // Every `scripts/<name>.mjs` mentioned in AGENTS.md should exist on disk.
  const mentioned = new Set();
  const re = /scripts\/([a-z0-9\-]+)\.mjs/gi;
  let m;
  while ((m = re.exec(agents))) mentioned.add(`${m[1]}.mjs`);
  // Also catch bare backtick references: `rebuild.mjs`
  const bareRe = /`([a-z0-9\-]+)\.mjs`/gi;
  while ((m = bareRe.exec(agents))) mentioned.add(`${m[1]}.mjs`);

  // Some bare `.mjs` names in AGENTS.md aren't scripts — e.g. `index.mjs`
  // refers to the widgets/<slug>/index.mjs registry file. Skip anything
  // whose filename is present under widgets/ so we don't flag widget
  // module references as missing scripts.
  const widgetModuleFiles = new Set();
  const widgetsDir = join(repoRoot, 'widgets');
  if (existsSync(widgetsDir)) {
    for (const d of readdirSync(widgetsDir, { withFileTypes: true })) {
      if (!d.isDirectory()) continue;
      const sub = join(widgetsDir, d.name);
      try {
        for (const f of readdirSync(sub)) {
          if (f.endsWith('.mjs')) widgetModuleFiles.add(f);
        }
      } catch {
        /* skip unreadable dirs */
      }
    }
  }

  const onDisk = new Set(mjsFiles);
  for (const name of mentioned) {
    if (!onDisk.has(name) && !widgetModuleFiles.has(name)) {
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
  // Parse `name: 'foo'` entries (preserving order).
  const names = [];
  const re = /name:\s*['"]([a-z0-9\-]+)['"]/g;
  let m;
  while ((m = re.exec(body))) names.push(m[1]);
  return names;
}

function extractAgentsRebuildProseList(agents) {
  // The prose list lives inside the "Registering a new page" section, introduced
  // by "All-in-one verification: `node scripts/rebuild.mjs` runs the full chain
  // in order" and enumerated as a numbered ordered list of scripts.
  //
  // Pull lines matching `   1. \`build-concepts-bundle.mjs\`` etc. in order.
  const marker = agents.indexOf('All-in-one verification');
  if (marker === -1) return null;
  const region = agents.slice(marker, marker + 2000);
  // Match `name.mjs` or `name.mjs --fix` — the backtick may wrap the whole
  // "script + flags" string, so we allow arbitrary content before the closing
  // backtick.
  const re = /^\s*\d+\.\s+`([a-z0-9\-]+)\.mjs(?:[^`]*)`/gm;
  const names = [];
  let m;
  while ((m = re.exec(region))) names.push(m[1]);
  return names.length ? names : null;
}

function extractAgentsOnlyList(agents) {
  // The `--only` enumeration is inline after a mention of `--only <step>` — the
  // list appears as backtick-quoted single words separated by commas inside
  // parentheses, possibly crossing a paren boundary.
  //
  // Find the first `--only` mention and scan forward for the first parenthetical
  // group that looks like `\`a\`, \`b\`, ...`.
  const idx = agents.indexOf('--only');
  if (idx === -1) return null;
  const region = agents.slice(idx, idx + 800);
  const paren = region.match(/\(([^)]*`[a-z0-9\-]+`[^)]*)\)/);
  if (!paren) return null;
  const names = [];
  const re = /`([a-z0-9\-]+)`/g;
  let m;
  while ((m = re.exec(paren[1]))) names.push(m[1]);
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
  const expectedScripts = steps.map((n) => stepNameToScript(n));

  const agents = readOrNull(join(repoRoot, 'AGENTS.md'));
  if (!agents) return;

  // Prose step list (filenames).
  const prose = extractAgentsRebuildProseList(agents);
  if (!prose) {
    push('AGENTS.md', 'warn', 'could not find the "All-in-one verification" step list');
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
        'AGENTS.md',
        'fail',
        `step list mismatch: prose shows ${prose.length} steps, STEPS array has ${steps.length} (${bits.join('; ')})`,
        VERBOSE
          ? `prose:  ${proseFull.join(' → ')}\n        array:  ${expectedFull.join(' → ')}`
          : null,
      );
    }
  }

  // --only enumeration.
  const only = extractAgentsOnlyList(agents);
  if (!only) {
    push('AGENTS.md', 'warn', 'could not find a `--only` enumeration to check');
  } else if (!arraysEqual(only, steps)) {
    const { missing, extra } = diffArrays(steps, only);
    const bits = [];
    if (missing.length) bits.push(`missing: ${missing.join(', ')}`);
    if (extra.length)   bits.push(`extra: ${extra.join(', ')}`);
    if (!bits.length)   bits.push('order differs');
    push(
      'AGENTS.md',
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
    backlinks:  'insert-used-in-backlinks.mjs',
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
