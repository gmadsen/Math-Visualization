#!/usr/bin/env node
// Validate the concept graph under ../concepts.
//
// Checks:
//   - JSON parse errors per file
//   - Registered topics in concepts/index.json all exist on disk
//   - Extra concepts/*.json files on disk that are not registered (warning)
//   - Duplicate concept ids across topics
//   - Missing anchor/title/blurb on concept entries
//   - Prereqs that don't resolve (supports both "id" and "topic:id" forms)
//   - Ambiguous bare prereqs (same id exists in more than one topic) (warning)
//   - Cycles in the prereq graph (prints one concrete cycle)
//   - Capstone goal ids that don't resolve, and missing capstone title/blurb
//
// Exit 0 if clean, 1 if any error. Warnings never flip the exit code.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const conceptsDir = join(repoRoot, 'concepts');

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

function readJson(absPath) {
  try {
    const raw = readFileSync(absPath, 'utf8');
    try {
      return { ok: true, data: JSON.parse(raw) };
    } catch (e) {
      return { ok: false, error: `parse error: ${e.message}` };
    }
  } catch (e) {
    return { ok: false, error: `read error: ${e.message}` };
  }
}

// 1. Load index.json
const indexPath = join(conceptsDir, 'index.json');
let registeredTopics = [];
{
  const r = readJson(indexPath);
  if (!r.ok) {
    err(`concepts/index.json: ${r.error}`);
  } else if (!r.data || !Array.isArray(r.data.topics)) {
    err(`concepts/index.json: expected { "topics": [...] }`);
  } else {
    registeredTopics = r.data.topics.slice();
  }
}

// 2. Find on-disk topic files (excluding index.json and capstones.json)
let onDiskTopicFiles = [];
try {
  onDiskTopicFiles = readdirSync(conceptsDir)
    .filter((f) => f.endsWith('.json') && f !== 'index.json' && f !== 'capstones.json')
    .map((f) => f.replace(/\.json$/, ''));
} catch (e) {
  err(`concepts/: cannot list directory: ${e.message}`);
}

// Report registered-but-missing (error) and on-disk-but-unregistered (warning).
for (const topic of registeredTopics) {
  const p = join(conceptsDir, `${topic}.json`);
  if (!existsSync(p) || !statSync(p).isFile()) {
    err(`concepts/index.json lists "${topic}" but concepts/${topic}.json is missing`);
  }
}
for (const topic of onDiskTopicFiles) {
  if (!registeredTopics.includes(topic)) {
    warn(`concepts/${topic}.json exists on disk but is not registered in concepts/index.json`);
  }
}

// 3. Load every registered topic file, build concept map
const conceptsById = new Map(); // bare id -> [{ topic, entry }]
const topicConcepts = new Map(); // topic -> [concept ids]

for (const topic of registeredTopics) {
  const p = join(conceptsDir, `${topic}.json`);
  if (!existsSync(p)) continue;
  const r = readJson(p);
  if (!r.ok) {
    err(`concepts/${topic}.json: ${r.error}`);
    continue;
  }
  const data = r.data;
  if (!data || !Array.isArray(data.concepts)) {
    err(`concepts/${topic}.json: expected { "concepts": [...] }`);
    continue;
  }
  const ids = [];
  for (let i = 0; i < data.concepts.length; i++) {
    const c = data.concepts[i];
    if (!c || typeof c !== 'object') {
      err(`concepts/${topic}.json: concept #${i} is not an object`);
      continue;
    }
    if (typeof c.id !== 'string' || !c.id) {
      err(`concepts/${topic}.json: concept #${i} missing string "id"`);
      continue;
    }
    ids.push(c.id);
    if (!conceptsById.has(c.id)) conceptsById.set(c.id, []);
    conceptsById.get(c.id).push({ topic, entry: c });
  }
  topicConcepts.set(topic, ids);
}

// 4. Duplicates across topics
for (const [id, entries] of conceptsById) {
  if (entries.length > 1) {
    const where = entries.map((e) => e.topic).join(', ');
    err(`duplicate concept id "${id}" declared in: ${where}`);
  }
}

// 5. Required fields on concept entries
for (const [id, entries] of conceptsById) {
  for (const { topic, entry } of entries) {
    for (const field of ['title', 'anchor', 'blurb']) {
      if (typeof entry[field] !== 'string' || !entry[field]) {
        err(`concepts/${topic}.json: concept "${id}" missing "${field}"`);
      }
    }
  }
}

// 6. Prereq resolution. Support bare id and "topic:id".
function resolvePrereq(p, fromTopic) {
  if (typeof p !== 'string' || !p) return { kind: 'bad', reason: 'non-string prereq' };
  if (p.includes(':')) {
    const [t, rawId] = p.split(':', 2);
    const entries = conceptsById.get(rawId);
    if (!entries) return { kind: 'missing' };
    const match = entries.find((e) => e.topic === t);
    if (!match) return { kind: 'missing' };
    return { kind: 'ok', id: rawId, topic: t };
  }
  const entries = conceptsById.get(p);
  if (!entries || entries.length === 0) return { kind: 'missing' };
  if (entries.length > 1) {
    return { kind: 'ambiguous', id: p, topics: entries.map((e) => e.topic) };
  }
  return { kind: 'ok', id: p, topic: entries[0].topic };
}

// adjacency for cycle detection: node id -> list of prereq ids (resolved, bare)
const adj = new Map();
for (const [id, entries] of conceptsById) {
  adj.set(id, []);
  const { topic, entry } = entries[0]; // if duplicate, pick first; duplicates already errored
  const prereqs = Array.isArray(entry.prereqs) ? entry.prereqs : [];
  for (const p of prereqs) {
    const r = resolvePrereq(p, topic);
    if (r.kind === 'bad') {
      err(`concepts/${topic}.json: concept "${id}" has invalid prereq entry ${JSON.stringify(p)}`);
    } else if (r.kind === 'missing') {
      err(`concepts/${topic}.json: concept "${id}" has unresolved prereq "${p}"`);
    } else if (r.kind === 'ambiguous') {
      warn(`concepts/${topic}.json: concept "${id}" prereq "${p}" is ambiguous (declared in ${r.topics.join(', ')}); using "${r.topics[0]}"`);
      adj.get(id).push(r.id);
    } else {
      adj.get(id).push(r.id);
    }
  }
}

// 7. Cycle detection: Kahn's identifies the cyclic residue; DFS with back-edge
// tracking enumerates every distinct cycle (canonicalized to dedup rotations).
function findCycles() {
  const indeg = new Map();
  for (const n of adj.keys()) indeg.set(n, 0);
  for (const [, outs] of adj) for (const o of outs) {
    if (indeg.has(o)) indeg.set(o, indeg.get(o) + 1);
  }
  const queue = [];
  for (const [n, d] of indeg) if (d === 0) queue.push(n);
  const removed = new Set();
  while (queue.length) {
    const n = queue.shift();
    removed.add(n);
    for (const o of adj.get(n) || []) {
      if (!indeg.has(o)) continue;
      indeg.set(o, indeg.get(o) - 1);
      if (indeg.get(o) === 0) queue.push(o);
    }
  }
  const leftover = [...adj.keys()].filter((n) => !removed.has(n));
  if (leftover.length === 0) return [];
  const leftSet = new Set(leftover);

  const cycles = [];
  const cycleSigs = new Set();
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map();
  for (const n of leftover) color.set(n, WHITE);
  const pathIdx = new Map();
  const path = [];

  function canonical(cyc) {
    let minIdx = 0;
    for (let i = 1; i < cyc.length; i++) if (cyc[i] < cyc[minIdx]) minIdx = i;
    return cyc.slice(minIdx).concat(cyc.slice(0, minIdx)).join('|');
  }

  function dfs(u) {
    color.set(u, GRAY);
    pathIdx.set(u, path.length);
    path.push(u);
    for (const v of adj.get(u) || []) {
      if (!leftSet.has(v)) continue;
      if (color.get(v) === GRAY) {
        const startIdx = pathIdx.get(v);
        const cyc = path.slice(startIdx);
        const sig = canonical(cyc);
        if (!cycleSigs.has(sig)) {
          cycleSigs.add(sig);
          cycles.push([...cyc, v]);
        }
      } else if (color.get(v) === WHITE) {
        dfs(v);
      }
    }
    color.set(u, BLACK);
    pathIdx.delete(u);
    path.pop();
  }

  for (const n of leftover) {
    if (color.get(n) === WHITE) dfs(n);
  }
  return cycles;
}

const cycles = findCycles();
for (const cyc of cycles) {
  err(`prereq cycle detected: ${cyc.join(' -> ')}`);
}

// 8. Capstones
const capstonesPath = join(conceptsDir, 'capstones.json');
if (existsSync(capstonesPath)) {
  const r = readJson(capstonesPath);
  if (!r.ok) {
    err(`concepts/capstones.json: ${r.error}`);
  } else if (!r.data || !Array.isArray(r.data.capstones)) {
    err(`concepts/capstones.json: expected { "capstones": [...] }`);
  } else {
    const seen = new Set();
    for (let i = 0; i < r.data.capstones.length; i++) {
      const c = r.data.capstones[i];
      if (!c || typeof c !== 'object') {
        err(`concepts/capstones.json: capstone #${i} is not an object`);
        continue;
      }
      if (typeof c.id !== 'string' || !c.id) {
        err(`concepts/capstones.json: capstone #${i} missing string "id"`);
      } else if (seen.has(c.id)) {
        err(`concepts/capstones.json: duplicate capstone id "${c.id}"`);
      } else {
        seen.add(c.id);
      }
      for (const field of ['title', 'blurb']) {
        if (typeof c[field] !== 'string' || !c[field]) {
          err(`concepts/capstones.json: capstone "${c.id ?? `#${i}`}" missing "${field}"`);
        }
      }
      if (typeof c.goal !== 'string' || !c.goal) {
        err(`concepts/capstones.json: capstone "${c.id ?? `#${i}`}" missing "goal"`);
      } else {
        const resolved = resolvePrereq(c.goal, null);
        if (resolved.kind === 'missing') {
          err(`concepts/capstones.json: capstone "${c.id}" goal "${c.goal}" does not resolve to any concept`);
        } else if (resolved.kind === 'ambiguous') {
          warn(`concepts/capstones.json: capstone "${c.id}" goal "${c.goal}" is ambiguous (in ${resolved.topics.join(', ')})`);
        }
      }
    }
  }
}

// 9. Report
function section(title, items) {
  if (items.length === 0) return;
  console.log(`${title} (${items.length}):`);
  for (const m of items) console.log(`  - ${m}`);
  console.log('');
}

console.log(`validate-concepts: ${registeredTopics.length} registered topic(s), ${conceptsById.size} concept id(s)`);
console.log('');
section('ERRORS', errors);
section('WARNINGS', warnings);

if (errors.length === 0) {
  console.log('OK: concept graph is clean.');
  process.exit(0);
} else {
  console.log(`FAIL: ${errors.length} error(s) found.`);
  process.exit(1);
}
