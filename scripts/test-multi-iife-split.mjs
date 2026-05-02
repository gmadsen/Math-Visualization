#!/usr/bin/env node
// Unit tests for splitMultiIife() in scripts/repair-widget-scripts.mjs.
//
// PR #45 commit a208609 shipped 6 broken bodyScripts before the off-by-one
// in this function was caught. The state machine handles strings (`"`, `'`,
// `` ` ``), line comments, block comments, and brace depth; every branch
// deserves a fixture so a regression on any one of them surfaces here
// rather than in a content/json round-trip diff weeks later.
//
// Exit 0 on all-pass, 1 on any failure.

import { splitMultiIife } from './repair-widget-scripts.mjs';

const failures = [];
function check(name, cond, detail) {
  if (cond) {
    console.log(`  ok  ${name}`);
  } else {
    failures.push(`${name}${detail ? ': ' + detail : ''}`);
    console.log(`  FAIL ${name}${detail ? ' — ' + detail : ''}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Fixture 1 — single IIFE: should not split.

{
  const input = `
(function(){
  console.log('only one');
})();
`;
  const r = splitMultiIife(input);
  check('single IIFE → noop', r.kind === 'noop', `got kind=${r.kind}`);
}

// ─────────────────────────────────────────────────────────────────────────
// Fixture 2 — two clean IIFEs separated by a blank line.

{
  const input = `
(function(){
  const a = 1;
})();

(function(){
  const b = 2;
})();
`;
  const r = splitMultiIife(input);
  check('two clean IIFEs → split', r.kind === 'split');
  check('two clean IIFEs → 2 chunks', r.kind === 'split' && r.chunks.length === 2,
    r.kind === 'split' ? `got ${r.chunks.length} chunks` : '');
  if (r.kind === 'split') {
    check('two-clean: chunks.length === 2',
      r.chunks.length === 2, `got ${r.chunks.length}`);
    check('chunk[0] body has `const a = 1;`', r.chunks[0].body.includes('const a = 1;'));
    check('chunk[1] body has `const b = 2;`', r.chunks[1].body.includes('const b = 2;'));
    check('chunk[0] body excludes `const b`', !r.chunks[0].body.includes('const b'));
    check('chunk[1] body excludes `const a`', !r.chunks[1].body.includes('const a'));
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Fixture 3 — block-comment banner before each IIFE.

{
  const input = `
/* SECTION 1 — Hopf bundle */
(function(){
  const a = 1;
})();
/* SECTION 2 — exterior algebra */
(function(){
  const b = 2;
})();
`;
  const r = splitMultiIife(input);
  check('banners → split', r.kind === 'split');
  if (r.kind === 'split') {
    check('chunk[0].comment = SECTION 1 banner',
      r.chunks[0].comment && r.chunks[0].comment.includes('SECTION 1 — Hopf bundle'),
      JSON.stringify(r.chunks[0].comment));
    check('chunk[1].comment = SECTION 2 banner',
      r.chunks[1].comment && r.chunks[1].comment.includes('SECTION 2 — exterior algebra'),
      JSON.stringify(r.chunks[1].comment));
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Fixture 4 — braces inside a string literal must not bump depth.

{
  const input = `
(function(){
  const tmpl = "abc { def } ghi";
  const more = 'a } b { c';
})();
(function(){
  const second = "}}}";
})();
`;
  const r = splitMultiIife(input);
  check('braces inside strings → split', r.kind === 'split',
    r.kind === 'split' ? '' : 'expected split, got ' + r.kind);
  if (r.kind === 'split') {
    check('strings preserved in chunk[0]', r.chunks[0].body.includes('"abc { def } ghi"'));
    check('strings preserved in chunk[1]', r.chunks[1].body.includes('"}}}"'));
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Fixture 5 — braces inside a template literal must not bump depth.

{
  const input = `
(function(){
  const x = \`one \${'two'} three\`;
})();
(function(){
  const y = \`closing }\`;
})();
`;
  const r = splitMultiIife(input);
  check('template literal braces → split', r.kind === 'split',
    r.kind === 'split' ? '' : 'expected split, got ' + r.kind);
  if (r.kind === 'split') {
    check('chunk[0] body contains template', r.chunks[0].body.includes('`one'));
    check('chunk[1] body contains second template', r.chunks[1].body.includes('`closing }`'));
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Fixture 6 — line comment + block comment between two IIFEs (should not
// trip up the brace-depth scanner).

{
  const input = `
(function(){
  // first
  const a = 1;
})();
// padding line comment
/* and a block comment with } and { in it */
(function(){
  /* inner block comment } */
  const b = 2; // trailing comment }
})();
`;
  const r = splitMultiIife(input);
  check('comments between IIFEs → split', r.kind === 'split',
    r.kind === 'split' ? '' : 'expected split, got ' + r.kind);
  if (r.kind === 'split') {
    check('chunk[0] body intact through line comment',
      r.chunks[0].body.includes('// first') && r.chunks[0].body.includes('const a = 1;'));
    check('chunk[1] body intact through inline comments',
      r.chunks[1].body.includes('/* inner block comment } */') &&
      r.chunks[1].body.includes('const b = 2;'));
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Fixture 7 — IIFE with empty body (hardens against the
// `replace(/^\n|\n$/g, '')` body trim eating the only chars).

{
  const input = `(function(){})();(function(){})();`;
  const r = splitMultiIife(input);
  check('empty-body IIFEs → split', r.kind === 'split');
  if (r.kind === 'split') {
    check('empty-body: chunks.length === 2',
      r.chunks.length === 2, `got ${r.chunks.length}`);
    check('chunk[0].body === ""', r.chunks[0].body === '',
      JSON.stringify(r.chunks[0].body));
    check('chunk[1].body === ""', r.chunks[1].body === '',
      JSON.stringify(r.chunks[1].body));
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Fixture 7b — malformed input: unterminated string literal. The state
// machine returns 'noop' on `depth !== 0`, not throw.

{
  const unterminated = '(function(){const a = "never closes';
  const r = splitMultiIife(unterminated);
  check('unterminated string → noop (no throw)',
    r.kind === 'noop',
    JSON.stringify(r));
}

// ─────────────────────────────────────────────────────────────────────────
// Fixture 7c — leading `(function(){` with no matching `)();`. The fall-
// through path at line 150 sets `i = bodyStart` and continues looking;
// a second `(function(){` with proper close should still be picked up.

{
  // Just one bogus opener — no real IIFEs found, returns noop.
  const justOpener = `(function(){const a = 1;`;
  const r = splitMultiIife(justOpener);
  check('opener without close → noop', r.kind === 'noop',
    JSON.stringify(r));
}

// ─────────────────────────────────────────────────────────────────────────
// Fixture 8 — contract pinning. Variants that are intentionally NOT
// supported should return noop, not throw or split incorrectly.

{
  // Missing trailing semicolon.
  const noSemi = `(function(){const a=1})()`;
  check('no-semi IIFE → noop (not supported)',
    splitMultiIife(noSemi).kind === 'noop');
}
{
  // Crockford form `(function(){...}())` (paren around invocation).
  const crockford = `(function(){const a=1}());(function(){const b=2}());`;
  check('Crockford form → noop (not supported)',
    splitMultiIife(crockford).kind === 'noop');
}
{
  // Named function expression.
  const named = `(function name1(){const a=1})();(function name2(){const b=2})();`;
  check('named function expressions → noop (not supported)',
    splitMultiIife(named).kind === 'noop');
}
{
  // Async IIFE.
  const asyncIife = `(async function(){})();(async function(){})();`;
  check('async IIFE → noop (not supported)',
    splitMultiIife(asyncIife).kind === 'noop');
}
{
  // Arrow IIFE.
  const arrow = `(()=>{})();(()=>{})();`;
  check('arrow IIFE → noop (not supported)',
    splitMultiIife(arrow).kind === 'noop');
}

// ─────────────────────────────────────────────────────────────────────────
// Bonus — escaped quote inside a string literal must not close the string
// prematurely. Regression case for the `\\` handling at line ~126.

{
  const input = `
(function(){
  const s = "she said \\"hi\\" {nope}";
})();
(function(){
  const t = 'a\\'b{c}';
})();
`;
  const r = splitMultiIife(input);
  check('escaped quotes → split', r.kind === 'split',
    r.kind === 'split' ? '' : 'expected split, got ' + r.kind);
  if (r.kind === 'split' && r.chunks.length >= 2) {
    check('chunk[0] preserves escaped quotes', r.chunks[0].body.includes('\\"hi\\"'));
    check('chunk[1] preserves escaped single-quote', r.chunks[1].body.includes("\\'b"));
  }
}

console.log('');
if (failures.length === 0) {
  console.log(`test-multi-iife-split: all assertions passed.`);
  process.exit(0);
} else {
  console.error(`test-multi-iife-split: ${failures.length} failure(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
