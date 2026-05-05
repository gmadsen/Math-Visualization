#!/usr/bin/env node
// Thin orchestrator for the full verification chain. Mirrors CI.
//
//   node scripts/build-concepts-bundle.mjs
//   node scripts/build-quizzes-bundle.mjs
//   node scripts/build-widgets-bundle.mjs
//   node scripts/build-search-index.mjs
//   node scripts/validate-schema.mjs
//   node scripts/validate-widget-params.mjs
//   node scripts/validate-concepts.mjs
//   node scripts/validate-katex.mjs
//   node scripts/audit-callbacks.mjs --fix
//   node scripts/inject-used-in-backlinks.mjs --fix
//   node scripts/inject-breadcrumb.mjs --fix
//   node scripts/inject-display-prefs.mjs --fix
//   node scripts/fix-a11y.mjs --fix
//   node scripts/smoke-test.mjs
//   node scripts/test-roundtrip.mjs
//   node scripts/stats-coverage.mjs
//
// Streams each child's stdout/stderr through, prints a banner per step, and
// bails on the first non-zero exit.
//
// Flags:
//   --no-fix          Run the two audits in audit-only mode (drop --fix).
//                     Useful for CI-style local checks.
//   --only <step>     Run just one step. <step> is one of:
//                       concepts, quizzes, widgets-bundle, search, schema, widget-params, validate, katex, callbacks, backlinks, breadcrumb, display-prefs, a11y, smoke, roundtrip, stats, starter
//
// Zero dependencies.

import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const scriptsDir = dirname(__filename);
const repoRoot = resolve(scriptsDir, '..');

const argv = process.argv.slice(2);
const NO_FIX = argv.includes('--no-fix');

let only = null;
const onlyIdx = argv.indexOf('--only');
if (onlyIdx !== -1) {
  only = argv[onlyIdx + 1];
  if (!only || only.startsWith('--')) {
    console.error('rebuild: --only requires a step name');
    process.exit(2);
  }
}

// Step definitions. `name` is the --only alias; `script` is the filename
// under scripts/; `fix` is whether --fix gets appended (flipped off by --no-fix).
const STEPS = [
  { name: 'concepts',   script: 'build-concepts-bundle.mjs',    fix: false },
  { name: 'quizzes',    script: 'build-quizzes-bundle.mjs',     fix: false },
  { name: 'widgets-bundle', script: 'build-widgets-bundle.mjs', fix: false },
  { name: 'search',     script: 'build-search-index.mjs',       fix: false },
  { name: 'section-indexes', script: 'build-section-indexes.mjs', fix: false },
  { name: 'schema',     script: 'validate-schema.mjs',          fix: false },
  { name: 'widget-params', script: 'validate-widget-params.mjs', fix: false },
  { name: 'widget-renderers', script: 'test-widget-renderers.mjs', fix: false },
  { name: 'widget-hydration', script: 'test-widget-hydration.mjs', fix: false },
  { name: 'multi-iife-split', script: 'test-multi-iife-split.mjs', fix: false },
  { name: 'html-walk',  script: 'test-html-walk.mjs',           fix: false },
  { name: 'find-matching-div', script: 'test-find-matching-div.mjs', fix: false },
  { name: 'ajv',        script: 'test-ajv.mjs',                 fix: false },
  { name: 'doc-drift-unit', script: 'test-doc-drift.mjs',       fix: false },
  { name: 'a11y-unit',  script: 'test-audit-accessibility.mjs', fix: false },
  { name: 'validate',   script: 'validate-concepts.mjs',        fix: false },
  { name: 'concept-latex', script: 'audit-concept-latex.mjs',   fix: false },
  { name: 'katex',      script: 'validate-katex.mjs',           fix: false },
  // Strict gate against regression: any inline `<div class="widget">` in
  // a topic's raw HTML beyond the grandfathered baseline fails CI. The
  // baseline lives at audits/inline-widgets-baseline.json and locks in
  // pre-existing legacy widgets so they don't keep accumulating.
  { name: 'no-inline-widgets', script: 'audit-no-inline-widgets.mjs', fix: false },
  { name: 'callbacks',  script: 'audit-callbacks.mjs',          fix: true  },
  { name: 'backlinks',  script: 'inject-used-in-backlinks.mjs', fix: true  },
  { name: 'breadcrumb', script: 'inject-breadcrumb.mjs',        fix: true  },
  { name: 'display-prefs', script: 'inject-display-prefs.mjs',  fix: true  },
  { name: 'index-stats', script: 'inject-index-stats.mjs',      fix: true  },
  { name: 'page-metadata', script: 'inject-page-metadata.mjs',  fix: true  },
  // toc must run AFTER any step that mutates section structure (none currently
  // do, but this leaves room) and BEFORE roundtrip so the regenerated TOC
  // propagates to HTML. In --no-fix mode the audit fails the moment a topic's
  // TOC diverges from the auto-generated form, making drift impossible.
  { name: 'toc',         script: 'inject-toc.mjs',              fix: true  },
  // Note: inject-changelog-footer.mjs is deliberately NOT in the chain —
  // its output references "most recent commit", but the commit that *adds*
  // the refreshed changelog can't reference itself, so every post-commit
  // audit would report one-commit-behind drift forever. Run manually:
  //   node scripts/inject-changelog-footer.mjs
  // before publishing, or wire into a pre-release hook.
  { name: 'a11y',       script: 'fix-a11y.mjs',                 fix: true  },
  // roundtrip runs FIRST in fix mode so smoke + topic-jsdom check the
  // regenerated HTML. Reversed order would let a content/json edit pass
  // smoke against stale HTML, leaving the failure to be caught only on
  // the next rebuild. In --no-fix mode roundtrip is strict and bails on
  // any drift, which preserves the CI invariant.
  { name: 'roundtrip',  script: 'test-roundtrip.mjs',           fix: true  },
  { name: 'smoke',      script: 'smoke-test.mjs',               fix: false },
  { name: 'topic-jsdom', script: 'test-topic-jsdom.mjs',        fix: false },
  { name: 'stats',      script: 'stats-coverage.mjs',           fix: false },
  { name: 'notation',   script: 'audit-notation.mjs',           fix: false },
  { name: 'draft-cards', script: 'audit-draft-index-cards.mjs', fix: false },
  { name: 'starter',    script: 'audit-starter-concepts.mjs',   fix: false },
  // Low-usage advisory audits — always exit 0; surface quality gaps that
  // aren't blockers (concepts without worked examples, quiz questions whose
  // wording drifts from the concept blurb). Wired in PR #102 to make the
  // signal visible on every rebuild instead of relying on out-of-band runs.
  { name: 'worked-examples', script: 'audit-worked-examples.mjs',         fix: false },
  { name: 'blurb-question',  script: 'audit-blurb-question-alignment.mjs', fix: false },
  { name: 'hint-leakage',    script: 'audit-hint-leakage.mjs',             fix: false },
  { name: 'doc-drift',  script: 'audit-doc-drift.mjs',          fix: false },
];

if (only) {
  const match = STEPS.find((s) => s.name === only);
  if (!match) {
    console.error(`rebuild: unknown --only step "${only}".`);
    console.error(`         valid: ${STEPS.map((s) => s.name).join(', ')}`);
    process.exit(2);
  }
}

function banner(n, total, step) {
  const args = step.fix && !NO_FIX ? ' --fix' : '';
  const line = `[${n}/${total}] ${step.script}${args}`;
  const bar = '─'.repeat(Math.min(line.length, 72));
  console.log(`\n${bar}\n${line}\n${bar}`);
}

function runStep(n, total, step) {
  banner(n, total, step);
  const args = [join(scriptsDir, step.script)];
  if (step.fix && !NO_FIX) args.push('--fix');
  else if (step.fix && NO_FIX && step.auditArg) args.push(step.auditArg);
  const r = spawnSync(process.execPath, args, {
    cwd: repoRoot,
    stdio: 'inherit',
  });
  if (r.error) {
    console.error(`rebuild: failed to spawn ${step.script}: ${r.error.message}`);
    process.exit(1);
  }
  if (typeof r.status === 'number' && r.status !== 0) {
    console.error(`\nrebuild: ${step.script} exited with status ${r.status}. Stopping.`);
    process.exit(r.status);
  }
  if (r.signal) {
    console.error(`\nrebuild: ${step.script} killed by signal ${r.signal}. Stopping.`);
    process.exit(1);
  }
}

const toRun = only ? STEPS.filter((s) => s.name === only) : STEPS;

console.log(`rebuild: running ${toRun.length} step(s)${NO_FIX ? ' (no-fix mode)' : ''}`);

let i = 0;
for (const step of toRun) {
  i++;
  runStep(i, toRun.length, step);
}

console.log('\nrebuild: all steps passed.');
process.exit(0);
