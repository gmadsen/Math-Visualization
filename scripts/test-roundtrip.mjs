#!/usr/bin/env node
// Round-trip smoke test: for each content/<topic>.json, render it via
// render-topic.mjs and verify the output is byte-identical to <topic>.html.
//
// Enforces the invariant that structured content and its rendered form do
// not drift. Edit the JSON → re-render the HTML, or edit neither.
//
// Skips silently when content/ is empty or absent, so topics that have not
// been migrated to the structured pipeline don't fail CI.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const scriptsDir = dirname(__filename);
const repoRoot = resolve(scriptsDir, '..');
const contentDir = join(repoRoot, 'content');

if (!existsSync(contentDir)) {
  console.log('test-roundtrip: no content/ directory; nothing to check.');
  process.exit(0);
}

const contentFiles = readdirSync(contentDir)
  .filter((f) => f.endsWith('.json'))
  .sort();

if (contentFiles.length === 0) {
  console.log('test-roundtrip: content/ is empty; nothing to check.');
  process.exit(0);
}

const md5 = (buf) => createHash('md5').update(buf).digest('hex');
const errors = [];
let pass = 0;

for (const f of contentFiles) {
  const slug = f.replace(/\.json$/, '');
  const htmlPath = join(repoRoot, `${slug}.html`);
  if (!existsSync(htmlPath)) {
    errors.push(`${slug}: no matching ${slug}.html at repo root`);
    continue;
  }
  const r = spawnSync(
    process.execPath,
    [join(scriptsDir, 'render-topic.mjs'), slug],
    { cwd: repoRoot, encoding: 'buffer' }
  );
  if (r.status !== 0) {
    const stderr = r.stderr ? r.stderr.toString().slice(0, 200) : '';
    errors.push(`${slug}: render-topic exited ${r.status}${stderr ? ` — ${stderr}` : ''}`);
    continue;
  }
  const rendered = r.stdout;
  const original = readFileSync(htmlPath);
  if (Buffer.compare(rendered, original) !== 0) {
    errors.push(
      `${slug}: drift — rendered ${md5(rendered)} (${rendered.length}B) vs on-disk ${md5(original)} (${original.length}B)`
    );
    continue;
  }
  pass++;
}

if (errors.length) {
  for (const e of errors) console.error(`  ${e}`);
  console.error(`test-roundtrip: FAIL — ${pass} ok, ${errors.length} drifted`);
  process.exit(1);
}

console.log(
  `test-roundtrip: ${pass} content file(s) render byte-identical to their on-disk HTML.`
);
process.exit(0);
