#!/usr/bin/env node
// Unit tests for js/progress.js — the mastery store that backs every
// progress ring, pathway node, and meta-page badge in the notebook.
//
// The module is browser code (an IIFE that assigns window.MVProgress), so we
// load it under a localStorage + window stub and exercise the public API.
// The focus is the compatibility surface — coerce()'s handling of every
// historical storage shape — and masteredSet() (PR #520), which six meta
// pages depend on being byte-identical to the hand-rolled loops it replaced.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { test } from 'node:test';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = readFileSync(join(repoRoot, 'js', 'progress.js'), 'utf8');

// Fresh MVProgress over an in-memory localStorage seeded with `store`.
function load(store) {
  let raw = JSON.stringify(store);
  const localStorage = {
    getItem: (k) => (k === 'mvnb.progress.v1' ? raw : null),
    setItem: (k, v) => { if (k === 'mvnb.progress.v1') raw = v; },
    removeItem: (k) => { if (k === 'mvnb.progress.v1') raw = null; },
  };
  const win = { localStorage };
  const fn = new Function('window', 'localStorage', SRC + '\nreturn window.MVProgress;');
  return fn(win, localStorage);
}

// Every historical storage shape, with its canonical v1/hard/expert truth.
const SHAPES = {
  legacyTrue:     [true,                         { v1: true,  hard: false, expert: false }],
  legacyAt:       [{ at: 123 },                  { v1: true,  hard: false, expert: false }],
  emptyObject:    [{},                           { v1: true,  hard: false, expert: false }], // no tier keys → legacy
  v1True:         [{ v1: true },                 { v1: true,  hard: false, expert: false }],
  v1False:        [{ v1: false },                { v1: false, hard: false, expert: false }],
  hardOnly:       [{ hard: true },               { v1: false, hard: true,  expert: false }], // no v1 key → v1 false
  tieredFull:     [{ v1: true, hard: true, expert: true }, { v1: true, hard: true, expert: true }],
  falseVal:       [false,                        { v1: false, hard: false, expert: false }],
};

test('masteredSet(v1) matches per-shape v1 truth', () => {
  const store = {};
  for (const [name, [raw]] of Object.entries(SHAPES)) store[name] = raw;
  const set = load(store).masteredSet('v1');
  for (const [name, [, truth]] of Object.entries(SHAPES)) {
    assert.equal(set.has(name), truth.v1, `${name} v1`);
  }
});

test('masteredSet(hard) and (expert) filter by tier', () => {
  const store = {};
  for (const [name, [raw]] of Object.entries(SHAPES)) store[name] = raw;
  const mv = load(store);
  const hard = mv.masteredSet('hard');
  const expert = mv.masteredSet('expert');
  for (const [name, [, truth]] of Object.entries(SHAPES)) {
    assert.equal(hard.has(name), truth.hard, `${name} hard`);
    assert.equal(expert.has(name), truth.expert, `${name} expert`);
  }
});

test("masteredSet() defaults to v1 and returns a real Set", () => {
  const mv = load({ a: true, b: { v1: false } });
  const s = mv.masteredSet();
  assert.ok(s instanceof Set);
  assert.deepEqual([...s], ['a']);
});

test('masteredSet is empty on an empty store', () => {
  assert.equal(load({}).masteredSet('v1').size, 0);
});

test('masteredSet agrees with isMastered per id (the equivalence callers rely on)', () => {
  const store = {};
  for (const [name, [raw]] of Object.entries(SHAPES)) store[name] = raw;
  const mv = load(store);
  const set = mv.masteredSet('v1');
  for (const name of Object.keys(SHAPES)) {
    assert.equal(set.has(name), mv.isMastered(name, 'v1'), `${name} set-vs-isMastered`);
  }
});

console.log('test-progress: all suites passed');
