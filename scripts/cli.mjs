#!/usr/bin/env node
// Single entry point for everything under scripts/. Thin router.
//
// Filename convention: the CLI form is just the script filename with
// hyphens treated as spaces.
//
//   scripts/rebuild.mjs                     → node scripts/cli.mjs rebuild
//   scripts/audit-backlinks.mjs             → node scripts/cli.mjs audit backlinks
//   scripts/validate-concepts.mjs           → node scripts/cli.mjs validate concepts
//   scripts/inject-used-in-backlinks.mjs    → node scripts/cli.mjs inject used-in-backlinks
//                                        OR  node scripts/cli.mjs inject used in backlinks
//
// Longest-prefix match: the router tries all prefix lengths from longest
// to shortest, so `inject used in backlinks --fix` resolves to
// `inject-used-in-backlinks` plus the trailing `--fix`.
//
// Runs the resolved script as a child process, inheriting stdio, and exits
// with the child's status code. The individual scripts remain directly
// callable (`node scripts/audit-backlinks.mjs`) for CI and tool
// integrations — this CLI is purely an ergonomic front door.

import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const scriptsDir = dirname(__filename);
const EXCLUDE = new Set(['cli.mjs']);

function listScripts() {
  return readdirSync(scriptsDir)
    .filter((f) => f.endsWith('.mjs') && !EXCLUDE.has(f))
    .map((f) => f.replace(/\.mjs$/, ''))
    .sort();
}

function resolve(args) {
  const scripts = new Set(listScripts());
  // Longest-prefix first so `inject used in backlinks` matches the 4-word
  // script name before falling back to the 1-word family prefix.
  for (let i = args.length; i >= 1; i--) {
    const candidate = args.slice(0, i).join('-');
    if (scripts.has(candidate)) {
      return { name: candidate, rest: args.slice(i) };
    }
  }
  return null;
}

function printHelp() {
  const scripts = listScripts();
  const byFamily = new Map();
  for (const s of scripts) {
    const firstHyphen = s.indexOf('-');
    const family = firstHyphen === -1 ? '(singleton)' : s.slice(0, firstHyphen);
    if (!byFamily.has(family)) byFamily.set(family, []);
    byFamily.get(family).push(s);
  }
  const orderedFamilies = [...byFamily.keys()].sort((a, b) => {
    if (a === '(singleton)') return -1;
    if (b === '(singleton)') return 1;
    return a.localeCompare(b);
  });

  console.log('Usage: node scripts/cli.mjs <command...> [args]');
  console.log('');
  console.log('Commands (space-separated form of the script filename):');
  console.log('');
  for (const family of orderedFamilies) {
    console.log(`  ${family}`);
    for (const s of byFamily.get(family).sort()) {
      const cmd = s.replace(/-/g, ' ');
      console.log(`    ${cmd.padEnd(42)}→ scripts/${s}.mjs`);
    }
    console.log('');
  }
  console.log('Examples:');
  console.log('  node scripts/cli.mjs rebuild --no-fix');
  console.log('  node scripts/cli.mjs audit backlinks');
  console.log('  node scripts/cli.mjs validate concepts');
  console.log('  node scripts/cli.mjs inject breadcrumb --fix');
  console.log('  node scripts/cli.mjs render topic category-theory > /tmp/out.html');
}

const argv = process.argv.slice(2);

if (argv.length === 0 || argv[0] === 'help' || argv[0] === '--help' || argv[0] === '-h' || argv[0] === 'list') {
  printHelp();
  process.exit(0);
}

const match = resolve(argv);
if (!match) {
  console.error(`cli: no script matches "${argv.join(' ')}"`);
  console.error(`Run \`node scripts/cli.mjs help\` to see available commands.`);
  process.exit(2);
}

const scriptPath = join(scriptsDir, `${match.name}.mjs`);
const r = spawnSync(process.execPath, [scriptPath, ...match.rest], {
  cwd: process.cwd(),
  stdio: 'inherit',
});
if (r.error) {
  console.error(`cli: failed to spawn ${match.name}.mjs: ${r.error.message}`);
  process.exit(1);
}
process.exit(typeof r.status === 'number' ? r.status : 1);
