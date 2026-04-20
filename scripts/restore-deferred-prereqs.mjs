#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const conceptsDir = join(repoRoot, 'concepts');
const deferredPath = join(repoRoot, 'scripts', 'data', 'deferred-prereqs.json');

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}

if (!existsSync(deferredPath)) {
  console.error('Missing scripts/data/deferred-prereqs.json');
  process.exit(1);
}

const index = readJson(join(conceptsDir, 'index.json'));
const topics = index.topics || [];

const topicDocs = new Map();
const conceptIds = new Set();
for (const topic of topics) {
  const path = join(conceptsDir, `${topic}.json`);
  const data = readJson(path);
  topicDocs.set(topic, { path, data });
  for (const c of data.concepts || []) conceptIds.add(c.id);
}

const deferred = readJson(deferredPath);
const entries = deferred.entries || [];

let touched = 0;
let restored = 0;
let pending = 0;
const changedTopics = new Set();

for (const entry of entries) {
  const { topic, concept, deferred: deps } = entry;
  const doc = topicDocs.get(topic);
  if (!doc) {
    console.warn(`skip ${topic}:${concept} (topic not registered)`);
    continue;
  }

  const conceptNode = (doc.data.concepts || []).find((c) => c.id === concept);
  if (!conceptNode) {
    console.warn(`skip ${topic}:${concept} (concept not found)`);
    continue;
  }

  if (!Array.isArray(conceptNode.prereqs)) conceptNode.prereqs = [];
  const before = conceptNode.prereqs.slice();

  for (const dep of deps || []) {
    if (conceptIds.has(dep) && !conceptNode.prereqs.includes(dep)) {
      conceptNode.prereqs.push(dep);
      restored += 1;
    } else if (!conceptIds.has(dep)) {
      pending += 1;
    }
  }

  if (JSON.stringify(before) !== JSON.stringify(conceptNode.prereqs)) {
    touched += 1;
    changedTopics.add(topic);
  }
}

for (const topic of changedTopics) {
  const { path, data } = topicDocs.get(topic);
  writeJson(path, data);
}

console.log(`restore-deferred-prereqs: concepts=${conceptIds.size}, entries=${entries.length}`);
console.log(`restored prereq edges: ${restored}`);
console.log(`pending prereq references: ${pending}`);
console.log(`concept nodes touched: ${touched}`);
