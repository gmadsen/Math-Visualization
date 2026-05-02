#!/usr/bin/env node
// Unit tests for scripts/lib/ajv.mjs's makeAjv() factory.
//
// Three callers (validate-schema, validate-widget-params, test-widget-renderers)
// migrated to this factory. A regression where caller opts get clobbered by
// defaults (e.g. spread order reversed) would not surface until a downstream
// validator quietly starts failing on an otherwise-valid schema. These
// assertions pin the spread order and the addFormats interop dance.

import { makeAjv } from './lib/ajv.mjs';

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
// Defaults.

{
  const a = makeAjv();
  check('default: allErrors true', a.opts.allErrors === true, `${a.opts.allErrors}`);
  check('default: strict true', a.opts.strict === true, `${a.opts.strict}`);
}

// ─────────────────────────────────────────────────────────────────────────
// Caller-overridden strict.

{
  const a = makeAjv({ strict: false });
  check('override: strict false sticks', a.opts.strict === false, `${a.opts.strict}`);
  check('override: allErrors stays true', a.opts.allErrors === true, `${a.opts.allErrors}`);
}

// ─────────────────────────────────────────────────────────────────────────
// addFormats actually ran (the `addFormats.default || addFormats` interop).
// AJV 2020 + ajv-formats registers `email`, `uri`, `date`, etc. If addFormats
// silently no-op'd, none would be registered.

{
  const a = makeAjv();
  check('addFormats: email format registered',
    typeof a.formats.email !== 'undefined',
    typeof a.formats.email);
  check('addFormats: uri format registered',
    typeof a.formats.uri !== 'undefined',
    typeof a.formats.uri);
}

// ─────────────────────────────────────────────────────────────────────────
// Compiles a schema, validates a sample. End-to-end smoke.

{
  const a = makeAjv({ strict: false });
  const validate = a.compile({
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
    },
    required: ['name'],
  });
  check('compiled validator: ok on valid input',
    validate({ name: 'foo', email: 'a@b.com' }) === true);
  check('compiled validator: fails on missing required',
    validate({ email: 'a@b.com' }) === false);
  // With strict: false, additionalProperties unspecified, so true is allowed.
  check('compiled validator: rejects bad email format',
    validate({ name: 'x', email: 'not-an-email' }) === false);
}

console.log('');
if (failures.length === 0) {
  console.log(`test-ajv: all assertions passed.`);
  process.exit(0);
} else {
  console.error(`test-ajv: ${failures.length} failure(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
