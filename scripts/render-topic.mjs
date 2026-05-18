#!/usr/bin/env node
/**
 * render-topic.mjs — phase 1 pilot inverse of extract-topic.mjs.
 *
 * Reads content/<topic>.json and prints the reconstructed HTML to stdout.
 * The output must be byte-identical to the source HTML so that the round
 * trip (html -> json -> html) is lossless; callers redirect stdout to a
 * file if they want to persist.
 *
 * Usage: node scripts/render-topic.mjs <topic-slug>  > path/to/out.html
 *
 * All rendering logic lives in scripts/lib/render-doc.mjs so non-CLI
 * consumers (audit-inline-links --fix and other future JSON-aware
 * injectors) can call it directly.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderDoc } from './lib/render-doc.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, '..');

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Usage: node scripts/render-topic.mjs <topic-slug>');
    process.exit(2);
  }
  const inPath = resolve(repoRoot, 'content', `${slug}.json`);
  const doc = JSON.parse(readFileSync(inPath, 'utf8'));
  const out = await renderDoc(doc);
  process.stdout.write(out);
}

main();
