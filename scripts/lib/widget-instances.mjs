// Shared loader for widget-registry *instances* — every `{ type: "widget",
// slug, params }` block across content/<topic>.json, plus the per-slug test
// fixtures (widgets/<slug>/example.json and widgets/<slug>/examples/*.json).
//
// Used by the widget test suite (test-widget-renderers.mjs,
// test-widget-hydration.mjs, test-gesture-engines.mjs), which previously
// carried three identical copies of this walk. Distinct from
// lib/content-model.mjs on purpose: the content model normalizes concepts /
// quizzes / parsed topic HTML for audits, while this module returns the raw
// `params` objects that renderer tests must feed back through
// renderMarkup/renderScript unchanged.
//
// Fixture semantics: a fixture lets a newly-registered slug ship with tested
// infrastructure before any topic page adopts it. Fixtures are loaded for
// tests but never emitted into a topic page automatically — content authors
// still wire widgets in by hand once they have a use case.
//
// The content sweep is memoized per process with no refresh option (unlike
// loadContentModel's { refresh: true }) — test processes never mutate
// content/ mid-run. Returned instance arrays/objects are shared: read-only.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
// scripts/lib/widget-instances.mjs → repo root is two levels up.
const repoRoot = resolve(dirname(__filename), '..', '..');
const widgetsDir = join(repoRoot, 'widgets');
const contentDir = join(repoRoot, 'content');

// JSON.parse with the failing file named — a bare SyntaxError from a sweep
// over 200+ files is otherwise unattributable.
function parseJsonFile(absPath, label) {
  try {
    return JSON.parse(readFileSync(absPath, 'utf8'));
  } catch (e) {
    e.message = `${label}: ${e.message}`;
    throw e;
  }
}

/** Every registered widget slug (a widgets/<slug>/ dir with a schema.json). */
export function listRegisteredSlugs() {
  return readdirSync(widgetsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => existsSync(join(widgetsDir, name, 'schema.json')))
    .sort();
}

/** Depth-first visit of every `{ type: "widget" }` block in a content doc. */
export function walkWidgetBlocks(node, visit) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const x of node) walkWidgetBlocks(x, visit);
    return;
  }
  if (node.type === 'widget') visit(node);
  for (const v of Object.values(node)) walkWidgetBlocks(v, visit);
}

// One sweep of content/ per process; instance arrays are shared, so callers
// must treat them as read-only.
let _contentBySlug = null;

/**
 * Map<slug, Array<{topic, params}>> of every widget block across content/,
 * in sorted topic order. Content instances only — no fixtures.
 */
export function contentInstancesBySlug() {
  if (_contentBySlug) return _contentBySlug;
  const map = new Map();
  if (existsSync(contentDir)) {
    for (const f of readdirSync(contentDir).sort()) {
      if (!f.endsWith('.json')) continue;
      const topic = f.replace(/\.json$/, '');
      const data = parseJsonFile(join(contentDir, f), `content/${f}`);
      walkWidgetBlocks(data, (b) => {
        if (!b.slug) return;
        if (!map.has(b.slug)) map.set(b.slug, []);
        map.get(b.slug).push({ topic, params: b.params || {} });
      });
    }
  }
  _contentBySlug = map;
  return map;
}

/** Fixture instances for one slug: example.json then examples/*.json sorted. */
export function fixtureInstances(slug) {
  const out = [];
  const single = join(widgetsDir, slug, 'example.json');
  if (existsSync(single)) {
    out.push({
      topic: 'fixture:example.json',
      params: parseJsonFile(single, `widgets/${slug}/example.json`),
    });
  }
  const examplesDir = join(widgetsDir, slug, 'examples');
  if (existsSync(examplesDir)) {
    for (const f of readdirSync(examplesDir).sort()) {
      if (!f.endsWith('.json')) continue;
      out.push({
        topic: `fixture:examples/${f}`,
        params: parseJsonFile(join(examplesDir, f), `widgets/${slug}/examples/${f}`),
      });
    }
  }
  return out;
}

/** Content instances followed by fixtures for one slug. */
export function loadInstances(slug) {
  return [...(contentInstancesBySlug().get(slug) || []), ...fixtureInstances(slug)];
}

/**
 * Map<slug, Array<{topic, params}>> of content instances + fixtures for every
 * registered slug (slugs with neither stay absent from the map).
 */
export function loadInstancesPerSlug() {
  const map = new Map();
  for (const [slug, list] of contentInstancesBySlug()) map.set(slug, [...list]);
  for (const slug of listRegisteredSlugs()) {
    const fixtures = fixtureInstances(slug);
    if (!fixtures.length) continue;
    if (!map.has(slug)) map.set(slug, []);
    map.get(slug).push(...fixtures);
  }
  return map;
}
