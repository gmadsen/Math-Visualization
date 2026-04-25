#!/usr/bin/env node
// Unit tests for the widget registry renderers.
//
// For every slug under widgets/<slug>/:
//   - Schema is valid JSON, declares draft 2020-12, names a `meta` block.
//   - index.mjs exports renderMarkup and renderScript as functions.
//   - For each `{type:"widget", slug, params}` instance found in content/*.json:
//       - params validate against the slug's schema (also covered by
//         validate-widget-params.mjs but reasserted here for unit isolation).
//       - renderMarkup(params) returns a non-empty string that contains the
//         widget's DOM id.
//       - renderScript(params) returns a string (may be empty for static
//         widgets).
//       - renderMarkup is pure (called twice with the same params, identical
//         output).
//
// Run via:
//   node --test scripts/test-widget-renderers.mjs
//
// Wired into rebuild.mjs as the `widget-renderers` step.

import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const __filename = fileURLToPath(import.meta.url);
const scriptsDir = dirname(__filename);
const repoRoot = resolve(scriptsDir, '..');
const widgetsDir = join(repoRoot, 'widgets');
const contentDir = join(repoRoot, 'content');

function listSlugs() {
  return readdirSync(widgetsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => existsSync(join(widgetsDir, name, 'schema.json')))
    .sort();
}

function walkBlocks(node, visit) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const x of node) walkBlocks(x, visit);
    return;
  }
  if (node.type === 'widget') visit(node);
  for (const v of Object.values(node)) walkBlocks(v, visit);
}

function loadInstancesPerSlug() {
  const bySlug = Object.create(null);
  if (existsSync(contentDir)) {
    for (const f of readdirSync(contentDir).sort()) {
      if (!f.endsWith('.json')) continue;
      const topic = f.replace(/\.json$/, '');
      const data = JSON.parse(readFileSync(join(contentDir, f), 'utf8'));
      walkBlocks(data, (block) => {
        if (!block.slug) return;
        if (!bySlug[block.slug]) bySlug[block.slug] = [];
        bySlug[block.slug].push({ topic, params: block.params || {} });
      });
    }
  }
  // Fixture fallback: widgets/<slug>/example.json (or examples/*.json) lets a
  // newly-registered slug ship with tested infrastructure before any topic
  // page adopts it. The fixture is loaded for tests but never emitted into
  // a topic page automatically — content authors still wire it in by hand
  // once they have a use case.
  for (const slug of listSlugs()) {
    const single = join(widgetsDir, slug, 'example.json');
    if (existsSync(single)) {
      const params = JSON.parse(readFileSync(single, 'utf8'));
      if (!bySlug[slug]) bySlug[slug] = [];
      bySlug[slug].push({ topic: 'fixture:example.json', params });
    }
    const examplesDir = join(widgetsDir, slug, 'examples');
    if (existsSync(examplesDir)) {
      for (const f of readdirSync(examplesDir).sort()) {
        if (!f.endsWith('.json')) continue;
        const params = JSON.parse(readFileSync(join(examplesDir, f), 'utf8'));
        if (!bySlug[slug]) bySlug[slug] = [];
        bySlug[slug].push({ topic: `fixture:examples/${f}`, params });
      }
    }
  }
  return bySlug;
}

const slugs = listSlugs();
const instancesPerSlug = loadInstancesPerSlug();
const ajv = new Ajv2020({ strict: false, allErrors: true });
addFormats.default ? addFormats.default(ajv) : addFormats(ajv);

for (const slug of slugs) {
  describe(`widget: ${slug}`, () => {
    const slugDir = join(widgetsDir, slug);
    const schemaPath = join(slugDir, 'schema.json');
    const indexPath = join(slugDir, 'index.mjs');

    let schema;
    let validate;
    let mod;

    before(async () => {
      schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
      validate = ajv.compile(schema);
      mod = await import(pathToFileURL(indexPath).href);
    });

    test('schema declares draft 2020-12', () => {
      assert.equal(
        schema.$schema,
        'https://json-schema.org/draft/2020-12/schema',
        'schema.json must declare $schema as draft 2020-12',
      );
    });

    test('schema has meta block (family/dimension/gesture/role)', () => {
      assert.ok(schema.meta, 'schema.json must include a `meta` block');
      for (const key of ['family', 'dimension', 'gesture', 'role']) {
        assert.ok(
          typeof schema.meta[key] === 'string' && schema.meta[key].length > 0,
          `schema.meta.${key} must be a non-empty string`,
        );
      }
    });

    test('index.mjs exports renderMarkup and renderScript as functions', () => {
      assert.equal(typeof mod.renderMarkup, 'function');
      assert.equal(typeof mod.renderScript, 'function');
    });

    const instances = instancesPerSlug[slug] || [];

    test(`has ≥1 instance in content/ (found ${instances.length})`, () => {
      assert.ok(
        instances.length > 0,
        `slug "${slug}" has no instances in content/*.json — register one or remove the slug`,
      );
    });

    for (const { topic, params } of instances) {
      const widgetId = params.widgetId || '<no-id>';
      describe(`instance ${topic}/${widgetId}`, () => {
        test('params include widgetId', () => {
          assert.ok(
            typeof params.widgetId === 'string' && params.widgetId.length > 0,
            'every widget instance must carry a non-empty widgetId so the host div gets a DOM id',
          );
        });

        test('params validate against schema', () => {
          const ok = validate(params);
          assert.ok(
            ok,
            `params for ${topic}/${widgetId} fail schema:\n${JSON.stringify(validate.errors, null, 2)}`,
          );
        });

        test('renderMarkup returns non-empty string containing widgetId', () => {
          const out = mod.renderMarkup(params);
          assert.equal(typeof out, 'string');
          assert.ok(out.length > 0, 'renderMarkup must return non-empty output');
          assert.ok(
            out.includes(params.widgetId),
            `renderMarkup output must contain widgetId "${params.widgetId}"`,
          );
        });

        test('renderScript returns a string (may be empty)', () => {
          const out = mod.renderScript(params);
          assert.equal(typeof out, 'string');
        });

        test('renderMarkup is pure (same params → same output)', () => {
          const a = mod.renderMarkup(params);
          const b = mod.renderMarkup(params);
          assert.equal(a, b);
        });

        test('renderScript is pure (same params → same output)', () => {
          const a = mod.renderScript(params);
          const b = mod.renderScript(params);
          assert.equal(a, b);
        });
      });
    }
  });
}
