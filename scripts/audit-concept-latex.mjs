#!/usr/bin/env node
// Static guard against bare LaTeX (without $...$ delimiters) in concept-graph
// data. Such content renders as raw source wherever it lands — page nav
// anchors, SVG node labels, the capstone dropdown, hover cards — because
// KaTeX auto-render only matches inside the configured delimiters.
//
// Scans:
//   - concepts/<topic>.json: each concept's `title` and `blurb`.
//   - concepts/capstones.json: each capstone's `title` and `blurb`.
//
// A field passes if every backslash-prefixed identifier (`\Omega`,
// `\mathcal`, `\bullet`, etc.) and every `^{…}` / `_{…}` group lives inside
// matched `$...$`, `$$...$$`, `\(...\)`, or `\[...\]` delimiters.
//
// Exits 0 clean / 1 if any field has bare LaTeX. Wired into rebuild.

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const conceptsDir = join(repoRoot, 'concepts');

// Strip every balanced delimiter pair, then any leftover `\foo` or `^{...}`
// is bare LaTeX leaking outside the math context.
function stripDelimited(s) {
  return s
    .replace(/\$\$[\s\S]*?\$\$/g, '')
    .replace(/\$[^$\n]+?\$/g, '')
    .replace(/\\\([\s\S]*?\\\)/g, '')
    .replace(/\\\[[\s\S]*?\\\]/g, '');
}

function bareLatexHit(s) {
  if (typeof s !== 'string' || s.length === 0) return null;
  const stripped = stripDelimited(s);
  // \alpha, \mathbb, \mathrm, \to — any backslash followed by 1+ ASCII letters
  const cmd = stripped.match(/\\[a-zA-Z]+/);
  if (cmd) return cmd[0];
  // ^{...} / _{...} bare grouping (a heuristic for caret/subscript notation)
  const grp = stripped.match(/[\^_]\{[^}]+\}/);
  if (grp) return grp[0];
  return null;
}

const issues = [];

function scanConceptsFile(file) {
  const abs = join(conceptsDir, file);
  let data;
  try {
    data = JSON.parse(readFileSync(abs, 'utf8'));
  } catch (e) {
    issues.push({ file, kind: 'parse-error', detail: e.message });
    return;
  }
  // index.json has a different shape (list of registered topic names) — skip.
  if (file === 'index.json' || file === 'sections.json') return;

  if (file === 'capstones.json') {
    const list = Array.isArray(data?.capstones) ? data.capstones : [];
    for (const c of list) {
      for (const field of ['title', 'blurb']) {
        const hit = bareLatexHit(c[field]);
        if (hit) {
          issues.push({
            file,
            kind: 'capstone',
            id: c.id || c.goal || '<unknown>',
            field,
            hit,
            value: (c[field] || '').slice(0, 120),
          });
        }
      }
    }
    return;
  }

  // Topic concept files: array of { id, title, blurb, anchor, prereqs }
  const list = Array.isArray(data) ? data : [];
  for (const c of list) {
    for (const field of ['title', 'blurb']) {
      const hit = bareLatexHit(c[field]);
      if (hit) {
        issues.push({
          file,
          kind: 'concept',
          id: c.id || '<unknown>',
          field,
          hit,
          value: (c[field] || '').slice(0, 120),
        });
      }
    }
  }
}

const files = readdirSync(conceptsDir)
  .filter((f) => f.endsWith('.json'))
  .sort();

for (const f of files) scanConceptsFile(f);

const total = files.length;
console.log(`audit-concept-latex: scanned ${total} concept JSON file(s)`);

if (issues.length === 0) {
  console.log('OK: every backslash-LaTeX run is inside $...$ delimiters.');
  process.exit(0);
}

console.log(`\nFAIL: ${issues.length} field(s) contain bare LaTeX without $…$ delimiters.`);
console.log('Pages render this as raw source (nav anchors, pathway SVG nodes,');
console.log('capstone dropdown, hover cards). Wrap the LaTeX run in $…$.\n');

for (const x of issues) {
  if (x.kind === 'parse-error') {
    console.log(`  [parse-error] ${x.file}: ${x.detail}`);
    continue;
  }
  console.log(
    `  ${x.file} :: ${x.kind} "${x.id}" :: ${x.field} :: leaked "${x.hit}"`,
  );
  console.log(`    value: ${x.value}`);
}
console.log('');
process.exit(1);
