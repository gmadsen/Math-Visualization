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

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContentModel } from './lib/content-model.mjs';

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

const model = await loadContentModel();
const registeredTopics = model.topicIds.slice();

// On-disk-but-unregistered scan (model doesn't expose this).
let onDiskTopicFiles = [];
try {
  onDiskTopicFiles = readdirSync(conceptsDir)
    .filter(
      (f) =>
        f.endsWith('.json') &&
        f !== 'index.json' &&
        f !== 'sections.json' &&
        f !== 'capstones.json' &&
        f !== 'tags.json'
    )
    .map((f) => f.replace(/\.json$/, ''));
} catch (e) {
  err(`concepts/: cannot list directory: ${e.message}`);
}

// Sections coverage: re-read concepts/sections.json for raw field validation
// (model only surfaces the normalized topic→section map, so missing fields
// on a raw section entry wouldn't be flagged by it).
const sectionsPath = join(conceptsDir, 'sections.json');
if (!existsSync(sectionsPath)) {
  err(`concepts/sections.json is missing — every registered topic must be assigned to a subject`);
} else {
  const r = readJson(sectionsPath);
  if (!r.ok) {
    err(`concepts/sections.json: ${r.error}`);
  } else if (!r.data || !Array.isArray(r.data.sections)) {
    err(`concepts/sections.json: expected { "sections": [...] }`);
  } else {
    const seenTopics = new Set();
    const dups = [];
    for (const s of r.data.sections) {
      if (!s || typeof s !== 'object') continue;
      if (!s.id || typeof s.id !== 'string')
        err(`concepts/sections.json: section missing string "id"`);
      if (!s.title || typeof s.title !== 'string')
        err(`concepts/sections.json: section "${s.id}" missing string "title"`);
      if (!Array.isArray(s.topics))
        err(`concepts/sections.json: section "${s.id}" missing "topics" array`);
      for (const t of s.topics || []) {
        if (seenTopics.has(t)) dups.push(t);
        seenTopics.add(t);
      }
    }
    for (const t of dups) err(`concepts/sections.json: topic "${t}" appears in more than one section`);
    for (const t of registeredTopics) {
      if (!seenTopics.has(t))
        err(`concepts/sections.json: registered topic "${t}" is not assigned to any section`);
    }
    for (const t of seenTopics) {
      if (!registeredTopics.includes(t))
        warn(`concepts/sections.json: "${t}" is listed but is not registered in concepts/index.json`);
    }
  }
}

// Missing (registered) and unregistered (on-disk) topic files.
for (const topic of registeredTopics) {
  if (!existsSync(join(conceptsDir, `${topic}.json`))) {
    err(`concepts/index.json lists "${topic}" but concepts/${topic}.json is missing`);
  }
}
for (const topic of onDiskTopicFiles) {
  if (!registeredTopics.includes(topic)) {
    warn(`concepts/${topic}.json exists on disk but is not registered in concepts/index.json`);
  }
}

// Levels-map drift detection. The `levels` field in concepts/index.json is
// the single source of truth for topic difficulty (read by pathway.html and
// audit-starter-concepts.mjs). Every registered topic must have an entry;
// every entry must reference a registered topic; every value must be one
// of the four valid level tokens.
//
// Also drift-checks the `newArc` array (read by audit-starter-concepts.mjs
// for its THIN-NEW pass): every entry must reference a registered topic, and
// the field must be an array of strings if present. The `newArc` field is
// optional — when empty/absent, the THIN-NEW pass becomes inert.
{
  const indexPath = join(conceptsDir, 'index.json');
  const r = readJson(indexPath);
  if (r.ok && r.data && typeof r.data === 'object') {
    const levels = r.data.levels;
    if (levels === undefined) {
      err(`concepts/index.json: missing required "levels" map (topic-difficulty classification)`);
    } else if (!levels || typeof levels !== 'object' || Array.isArray(levels)) {
      err(`concepts/index.json: "levels" must be an object mapping topic id → level`);
    } else {
      const VALID_LEVELS = new Set(['prereq', 'standard', 'advanced', 'capstone']);
      const registeredSet = new Set(registeredTopics);
      const levelKeys = Object.keys(levels);
      for (const t of registeredTopics) {
        if (!(t in levels)) {
          err(`concepts/index.json: registered topic "${t}" has no entry in "levels"`);
        }
      }
      for (const t of levelKeys) {
        if (!registeredSet.has(t)) {
          err(`concepts/index.json: "levels" references unregistered topic "${t}"`);
        }
        const v = levels[t];
        if (typeof v !== 'string' || !VALID_LEVELS.has(v)) {
          err(`concepts/index.json: "levels.${t}" = ${JSON.stringify(v)} (must be one of ${[...VALID_LEVELS].join(', ')})`);
        }
      }
    }

    if ('newArc' in r.data) {
      const newArc = r.data.newArc;
      if (!Array.isArray(newArc)) {
        err(`concepts/index.json: "newArc" must be an array of topic ids`);
      } else {
        const registeredSet = new Set(registeredTopics);
        const seen = new Set();
        for (const t of newArc) {
          if (typeof t !== 'string' || !t) {
            err(`concepts/index.json: "newArc" entry ${JSON.stringify(t)} is not a non-empty string`);
            continue;
          }
          if (seen.has(t)) {
            err(`concepts/index.json: "newArc" lists topic "${t}" more than once`);
          }
          seen.add(t);
          if (!registeredSet.has(t)) {
            err(`concepts/index.json: "newArc" references unregistered topic "${t}"`);
          }
        }
      }
    }
  }
}

// Build duplicate-aware conceptsById by walking each topic's raw JSON — the
// model's first-writer-wins `concepts` map hides duplicates and the model
// doesn't surface per-entry required-field gaps.
const conceptsById = new Map(); // id -> [{ topic, entry }]

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
    if (!conceptsById.has(c.id)) conceptsById.set(c.id, []);
    conceptsById.get(c.id).push({ topic, entry: c });
  }
}

// Duplicates across topics (or within a single file).
for (const [id, entries] of conceptsById) {
  if (entries.length > 1) {
    err(`duplicate concept id "${id}" declared in: ${entries.map((e) => e.topic).join(', ')}`);
  }
}

// Required fields.
for (const [id, entries] of conceptsById) {
  for (const { topic, entry } of entries) {
    for (const field of ['title', 'anchor', 'blurb']) {
      if (typeof entry[field] !== 'string' || !entry[field]) {
        err(`concepts/${topic}.json: concept "${id}" missing "${field}"`);
      }
    }
  }
}

// Tag vocabulary: optional `tags` array on each concept must draw from
// concepts/tags.json. Untagged concepts are allowed; unknown tags are not.
{
  const tagsPath = join(conceptsDir, 'tags.json');
  if (existsSync(tagsPath)) {
    const r = readJson(tagsPath);
    if (!r.ok) {
      err(`concepts/tags.json: ${r.error}`);
    } else if (!r.data || !Array.isArray(r.data.tags)) {
      err(`concepts/tags.json: expected { "tags": [...] }`);
    } else {
      const vocab = new Set();
      for (const t of r.data.tags) {
        if (!t || typeof t !== 'object') continue;
        if (typeof t.id !== 'string' || !t.id) {
          err(`concepts/tags.json: tag entry missing string "id"`);
          continue;
        }
        if (vocab.has(t.id)) {
          err(`concepts/tags.json: duplicate tag id "${t.id}"`);
        }
        vocab.add(t.id);
        for (const field of ['title', 'blurb']) {
          if (typeof t[field] !== 'string' || !t[field]) {
            err(`concepts/tags.json: tag "${t.id}" missing "${field}"`);
          }
        }
      }
      for (const [id, entries] of conceptsById) {
        for (const { topic, entry } of entries) {
          if (!('tags' in entry)) continue;
          if (!Array.isArray(entry.tags)) {
            err(`concepts/${topic}.json: concept "${id}" "tags" must be an array`);
            continue;
          }
          const seen = new Set();
          for (const tag of entry.tags) {
            if (typeof tag !== 'string' || !tag) {
              err(`concepts/${topic}.json: concept "${id}" has invalid tag entry ${JSON.stringify(tag)}`);
              continue;
            }
            if (seen.has(tag)) {
              err(`concepts/${topic}.json: concept "${id}" lists tag "${tag}" more than once`);
            }
            seen.add(tag);
            if (!vocab.has(tag)) {
              err(`concepts/${topic}.json: concept "${id}" uses unknown tag "${tag}" (not in concepts/tags.json)`);
            }
          }
        }
      }
    }
  }
}

// Prereq resolution. Support bare id and "topic:id".
function resolvePrereq(p) {
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

// adjacency for cycle detection: id -> list of prereq ids (resolved, bare)
const adj = new Map();
for (const [id, entries] of conceptsById) {
  adj.set(id, []);
  const { topic, entry } = entries[0]; // duplicate? take first; already errored.
  const prereqs = Array.isArray(entry.prereqs) ? entry.prereqs : [];
  for (const p of prereqs) {
    const r = resolvePrereq(p);
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

// Cycle detection: Kahn's identifies the cyclic residue; DFS with back-edge
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

  for (const n of leftover) if (color.get(n) === WHITE) dfs(n);
  return cycles;
}

for (const cyc of findCycles()) {
  err(`prereq cycle detected: ${cyc.join(' -> ')}`);
}

// Capstones. Model preloads `capstones` as the raw array; re-read the JSON
// only if we need to distinguish "file missing" from "empty list" (we don't —
// validation runs only when the array is non-empty or the file is on disk).
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
        const resolved = resolvePrereq(c.goal);
        if (resolved.kind === 'missing') {
          err(`concepts/capstones.json: capstone "${c.id}" goal "${c.goal}" does not resolve to any concept`);
        } else if (resolved.kind === 'ambiguous') {
          warn(`concepts/capstones.json: capstone "${c.id}" goal "${c.goal}" is ambiguous (in ${resolved.topics.join(', ')})`);
        }
      }
    }
  }
}

// Report
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
