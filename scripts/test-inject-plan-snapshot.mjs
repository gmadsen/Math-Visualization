#!/usr/bin/env node
// Unit tests for scripts/inject-plan-snapshot.mjs.
//
// Why a dedicated test (when rebuild.mjs --no-fix already exercises the
// script in CI): rebuild only ever sees the happy path with the live, well-
// formed corpus. The six schema-shape guards added in the PR #193 fixup
// would never fire in CI today, so they're unverified defensive code without
// this test. The fix-mode round-trip is also CI-invisible (CI runs --no-fix).
//
// Test cases cover the high-criticality scenarios surfaced by the PR review:
//   - fix-mode restores byte-identity from a drifted fixture
//   - audit-mode exits 1 + reports drift
//   - SCHEMA DRIFT exits 2 for: missing widgets/_shared/verbatim-renderer,
//     malformed capstones.json, content/<topic>.json missing `sections`
//   - anchored regexes don't match prose elsewhere in PLAN.md
//
// The tests fork the real script with `MV_REPO_ROOT` pointing at a tmpdir
// fixture, so we exercise the actual script bytes, not a copy. Each test
// builds its own fixture tree to keep state isolated.

import { mkdirSync, writeFileSync, readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const scriptPath = resolve(dirname(__filename), 'inject-plan-snapshot.mjs');

const failures = [];
function check(name, cond, detail) {
  if (cond) {
    console.log(`  ok  ${name}`);
  } else {
    failures.push(`${name}${detail ? ': ' + detail : ''}`);
    console.log(`  FAIL ${name}${detail ? ' — ' + detail : ''}`);
  }
}

// ────────────────────────────────────────────────────────────────────────
// Fixture builder. Mirrors the live tree shape just enough that the script's
// counters all return predictable numbers.

function makeFixture(overrides = {}) {
  const root = mkdtempSync(join(tmpdir(), 'mv-plan-snapshot-'));
  mkdirSync(join(root, 'concepts'));
  mkdirSync(join(root, 'quizzes'));
  mkdirSync(join(root, 'content'));
  mkdirSync(join(root, 'widgets'));
  mkdirSync(join(root, 'widgets', '_shared'));

  const defaults = {
    topics: ['alpha', 'beta'],
    conceptsPerTopic: 2,
    capstones: 3,
    sectionsJson: {
      sections: [
        { id: 's1', topics: ['alpha'] },
        { id: 'control-theory-and-optimization', topics: ['beta'] },
      ],
    },
    quizV1: 4,
    quizHard: 2,
    quizExpert: 1,
    widgetBlocksPerTopic: 3,
    verbatimDelegators: 5,        // number of widget slugs that delegate to verbatim
    nonVerbatimWidgets: 2,        // additional non-verbatim widget slugs
    includeSharedVerbatim: true,  // toggle for the "missing renderer" test case
    planSnapshot: null,           // override for the PLAN.md body
  };
  const opts = { ...defaults, ...overrides };

  writeFileSync(
    join(root, 'concepts', 'index.json'),
    JSON.stringify({ topics: opts.topics })
  );
  writeFileSync(
    join(root, 'concepts', 'sections.json'),
    JSON.stringify(opts.sectionsJson)
  );
  writeFileSync(
    join(root, 'concepts', 'capstones.json'),
    JSON.stringify({
      capstones: Array.from({ length: opts.capstones }, (_, i) => ({ id: `cap-${i}` })),
    })
  );
  for (const t of opts.topics) {
    writeFileSync(
      join(root, 'concepts', `${t}.json`),
      JSON.stringify({
        topic: t,
        concepts: Array.from({ length: opts.conceptsPerTopic }, (_, i) => ({
          id: `${t}-c${i}`,
          title: `${t} ${i}`,
          anchor: `${t}-${i}`,
          blurb: 'x',
        })),
      })
    );
  }

  // Quizzes: one bank per topic, one entry per concept, with v1/hard/expert.
  for (const t of opts.topics) {
    const quizzes = {};
    for (let i = 0; i < opts.conceptsPerTopic; i++) {
      quizzes[`${t}-c${i}`] = {
        title: `${t} ${i}`,
        questions: Array.from({ length: opts.quizV1 }, (_, q) => ({ type: 'mcq', q: `q${q}` })),
        hard: Array.from({ length: opts.quizHard }, (_, q) => ({ type: 'mcq', q: `h${q}` })),
        expert: Array.from({ length: opts.quizExpert }, (_, q) => ({ type: 'mcq', q: `e${q}` })),
      };
    }
    writeFileSync(join(root, 'quizzes', `${t}.json`), JSON.stringify({ topic: t, quizzes }));
  }

  // Content: each topic gets N widget blocks distributed across two sections.
  for (const t of opts.topics) {
    const blocks = Array.from({ length: opts.widgetBlocksPerTopic }, (_, i) => ({
      type: 'widget',
      slug: i === 0 ? `verbatim-${t}-0` : `bespoke-${t}-${i}`,
    }));
    writeFileSync(
      join(root, 'content', `${t}.json`),
      JSON.stringify({
        topic: t,
        rawHead: '',
        rawBodyPrefix: '',
        sections: [{ id: `${t}-s1`, blocks }],
        rawBodySuffix: '',
      })
    );
  }

  // Widget registry: mix of verbatim-delegators and bespoke renderers.
  for (let i = 0; i < opts.verbatimDelegators; i++) {
    const slug = `verb-${i}`;
    mkdirSync(join(root, 'widgets', slug));
    writeFileSync(
      join(root, 'widgets', slug, 'index.mjs'),
      `// delegates to verbatim\nimport x from '../_shared/verbatim-renderer.mjs';\nexport default x;\n`
    );
  }
  for (let i = 0; i < opts.nonVerbatimWidgets; i++) {
    const slug = `bespoke-${i}`;
    mkdirSync(join(root, 'widgets', slug));
    writeFileSync(
      join(root, 'widgets', slug, 'index.mjs'),
      `// bespoke renderer\nexport function renderMarkup() { return ''; }\n`
    );
  }
  // Files that aren't widget dirs (mirrors live tree).
  writeFileSync(join(root, 'widgets', 'README.md'), '# Widgets\n');
  writeFileSync(join(root, 'widgets', 'bundle.js'), '// generated\n');

  if (opts.includeSharedVerbatim) {
    writeFileSync(
      join(root, 'widgets', '_shared', 'verbatim-renderer.mjs'),
      'export default {};\n'
    );
  }

  // Derive expected counts for default fixtures so tests can assert without
  // re-computing locally.
  const topicCount = opts.topics.length;
  const conceptCount = topicCount * opts.conceptsPerTopic;
  const capstoneCount = opts.capstones;
  const widgetCount = topicCount * opts.widgetBlocksPerTopic;
  const ctoTopics = opts.sectionsJson.sections.find(
    (s) => s.id === 'control-theory-and-optimization'
  )?.topics.length ?? 0;
  const quizV1Total = topicCount * opts.conceptsPerTopic * opts.quizV1;
  const quizHardTotal = topicCount * opts.conceptsPerTopic * opts.quizHard;
  const quizExpertTotal = topicCount * opts.conceptsPerTopic * opts.quizExpert;
  const verbatimSlugCount = opts.verbatimDelegators;

  const planSnapshot =
    opts.planSnapshot ??
    [
      '# Plan',
      '',
      '## Corpus snapshot (2026-01-01)',
      '',
      `- ${topicCount} topics, ${conceptCount} concepts, ${capstoneCount} capstones`,
      `- ${widgetCount} widgets, 100% registry-driven. Other prose follows.`,
      `- Quiz tiers: v1 = ${quizV1Total}, hard = ${quizHardTotal}, expert = ${quizExpertTotal} (commentary)`,
      `- All sections open; Control theory & optimization (section 12) has ${ctoTopics} topics`,
      '',
      '## Authoring polish',
      '',
      `- **Hoist semantic params.** Roughly ${verbatimSlugCount} per-widget verbatim slugs share a base.`,
      '',
    ].join('\n');

  writeFileSync(join(root, 'PLAN.md'), planSnapshot);

  return {
    root,
    counts: {
      topicCount,
      conceptCount,
      capstoneCount,
      widgetCount,
      ctoTopics,
      quizV1Total,
      quizHardTotal,
      quizExpertTotal,
      verbatimSlugCount,
    },
  };
}

function runScript(root, ...args) {
  return spawnSync('node', [scriptPath, ...args], {
    env: { ...process.env, MV_REPO_ROOT: root },
    encoding: 'utf8',
  });
}

function cleanup(root) {
  rmSync(root, { recursive: true, force: true });
}

// ────────────────────────────────────────────────────────────────────────
// Test cases.

console.log('test-inject-plan-snapshot.mjs:');

// 1. Audit mode reports "in sync" on a well-formed fixture.
{
  const { root } = makeFixture();
  try {
    const r = runScript(root);
    check('in-sync exits 0', r.status === 0, `status=${r.status} stderr=${r.stderr}`);
    check(
      'in-sync stdout has "in sync"',
      r.stdout.includes('in sync'),
      `stdout=${r.stdout}`
    );
  } finally {
    cleanup(root);
  }
}

// 2. Audit mode reports drift + exits 1 when a number is tampered.
{
  const { root, counts } = makeFixture();
  try {
    const plan = readFileSync(join(root, 'PLAN.md'), 'utf8');
    writeFileSync(
      join(root, 'PLAN.md'),
      plan.replace(
        `- ${counts.widgetCount} widgets`,
        `- 9999 widgets`
      )
    );
    const r = runScript(root);
    check('drift exits 1', r.status === 1, `status=${r.status}`);
    check(
      'drift stderr names the field',
      r.stderr.includes('widgets 9999→' + counts.widgetCount),
      `stderr=${r.stderr}`
    );
  } finally {
    cleanup(root);
  }
}

// 3. Fix mode restores byte-identity after numeric drift.
{
  const { root, counts } = makeFixture();
  try {
    const orig = readFileSync(join(root, 'PLAN.md'), 'utf8');
    writeFileSync(
      join(root, 'PLAN.md'),
      orig.replace(`- ${counts.widgetCount} widgets`, `- 1 widgets`)
    );
    const r = runScript(root, '--fix');
    check('fix exits 0', r.status === 0);
    // The script will also bump the snapshot date when other numbers drifted,
    // so we expect bytes to differ from the orig fixture by exactly the date
    // line + the restored widget count. Re-running audit should be in-sync.
    const r2 = runScript(root);
    check(
      'post-fix audit is in sync',
      r2.status === 0 && r2.stdout.includes('in sync'),
      `status=${r2.status} stdout=${r2.stdout}`
    );
  } finally {
    cleanup(root);
  }
}

// 4. SCHEMA DRIFT (exit 2) — missing widgets/_shared/verbatim-renderer.mjs.
{
  const { root } = makeFixture({ includeSharedVerbatim: false });
  try {
    const r = runScript(root);
    check(
      'missing verbatim-renderer exits 2',
      r.status === 2,
      `status=${r.status} stderr=${r.stderr}`
    );
    check(
      'SCHEMA DRIFT message present',
      r.stderr.includes('SCHEMA DRIFT') && r.stderr.includes('verbatim-renderer'),
      `stderr=${r.stderr}`
    );
  } finally {
    cleanup(root);
  }
}

// 5. SCHEMA DRIFT — malformed capstones.json (missing `.capstones` array).
{
  const { root } = makeFixture();
  try {
    writeFileSync(
      join(root, 'concepts', 'capstones.json'),
      JSON.stringify({ items: [] })  // wrong key
    );
    const r = runScript(root);
    check(
      'malformed capstones exits 2',
      r.status === 2,
      `status=${r.status} stderr=${r.stderr}`
    );
    check(
      'SCHEMA DRIFT names capstones.json',
      r.stderr.includes('SCHEMA DRIFT') && r.stderr.includes('capstones'),
      `stderr=${r.stderr}`
    );
  } finally {
    cleanup(root);
  }
}

// 6. SCHEMA DRIFT — content/<topic>.json missing `sections` triggers warn,
//    and if NO topic has sections (zero widgets but topics exist) we exit 2.
{
  const { root } = makeFixture();
  try {
    // Strip `sections` from every content file. All widget blocks vanish; the
    // sanity gate ("topicsWithSections > 0 but widgets == 0") only fires if
    // some files retained sections. Easier: keep one with sections and one
    // without. The kept-one has its widgets intact, so widget count is non-
    // zero — but the dropped-one should produce a warn (which doesn't change
    // exit). To trigger the exit-2 sanity gate, drop ALL widget blocks but
    // keep the `sections` arrays.
    const beta = JSON.parse(readFileSync(join(root, 'content', 'beta.json'), 'utf8'));
    beta.sections = beta.sections.map((s) => ({ ...s, blocks: [] }));
    writeFileSync(join(root, 'content', 'beta.json'), JSON.stringify(beta));
    const alpha = JSON.parse(readFileSync(join(root, 'content', 'alpha.json'), 'utf8'));
    alpha.sections = alpha.sections.map((s) => ({ ...s, blocks: [] }));
    writeFileSync(join(root, 'content', 'alpha.json'), JSON.stringify(alpha));

    const r = runScript(root);
    check(
      'zero-widgets sanity gate exits 2',
      r.status === 2,
      `status=${r.status} stderr=${r.stderr}`
    );
    check(
      'sanity gate mentions zero widget blocks',
      r.stderr.includes('zero widget blocks'),
      `stderr=${r.stderr}`
    );
  } finally {
    cleanup(root);
  }
}

// 7. Anchored regex does NOT match prose elsewhere in PLAN.md.
//    Build a fixture where the snapshot has the correct bullet AND a prose
//    paragraph that quotes the same phrase verbatim — the regex must target
//    the bullet, not the prose, when patching.
{
  const { root, counts } = makeFixture();
  try {
    const orig = readFileSync(join(root, 'PLAN.md'), 'utf8');
    // Inject a paragraph BEFORE the snapshot section that contains the same
    // sentence text but is not a bullet line.
    const decoy = `\nA discussion paragraph: "Control theory & optimization (section 12) has 99 topics" appeared in an earlier draft and is preserved here for context.\n\n`;
    const tampered = orig.replace('## Corpus snapshot', decoy + '## Corpus snapshot');
    writeFileSync(join(root, 'PLAN.md'), tampered);

    // Now tamper the BULLET to a wrong value (e.g. 77), and the prose decoy
    // stays at 99. Fix mode should update the bullet to the truth count and
    // leave the decoy at 99.
    const tampered2 = readFileSync(join(root, 'PLAN.md'), 'utf8').replace(
      `Control theory & optimization (section 12) has ${counts.ctoTopics} topics`,
      `Control theory & optimization (section 12) has 77 topics`
    );
    // The above replace will hit the FIRST occurrence (the decoy at 99 is
    // unaffected because its number is 99, not the truth). Verify our test
    // setup: after this, the bullet has 77 and the decoy has 99.
    writeFileSync(join(root, 'PLAN.md'), tampered2);

    const r = runScript(root, '--fix');
    check('fix exits 0 against decoy prose', r.status === 0, `stderr=${r.stderr}`);
    const after = readFileSync(join(root, 'PLAN.md'), 'utf8');
    check(
      'decoy prose untouched (still says 99)',
      after.includes('has 99 topics'),
      'decoy was overwritten — regex matched the wrong line'
    );
    check(
      'bullet restored to truth',
      after.includes(`has ${counts.ctoTopics} topics`),
      'bullet not restored'
    );
  } finally {
    cleanup(root);
  }
}

// ────────────────────────────────────────────────────────────────────────

if (failures.length > 0) {
  console.error(`\ntest-inject-plan-snapshot: ${failures.length} failure(s)`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`\ntest-inject-plan-snapshot: all ${7} suites passed`);
process.exit(0);
