#!/usr/bin/env node
// One-shot migration: convert "Type B" inline widgets (structured `type:"widget"`
// blocks lacking a `slug`, paired with `type:"widget-script"` blocks carrying
// `forWidget` back-refs) into registry-driven `slug + params` blocks that pass
// `audit-no-inline-widgets.mjs` and `stats-coverage.mjs`.
//
// Affects: gauge-theory, groebner-bases, statistical-mechanics, string-theory.
// Each widget's HTML and driving script become opaque `bodyMarkup` / `bodyScript`
// strings under a per-widget slug at `widgets/<slug>/`, sharing the verbatim
// renderer at `widgets/_shared/verbatim-renderer.mjs`.
//
// Idempotent: re-running on already-migrated content is a no-op.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { extractTitleAndHint, writeVerbatimSlug } from './lib/verbatim-slug-writer.mjs';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const TYPE_B_TOPICS = {
  'gauge-theory': 'gt',
  'groebner-bases': 'gb',
  'statistical-mechanics': 'sm',
  'string-theory': 'st',
};

function slugify(s) {
  return s.replace(/^w-/, '').replace(/[^a-z0-9-]+/gi, '-').toLowerCase();
}

function makeSlug(topicPrefix, widgetId) {
  return `${topicPrefix}-${slugify(widgetId)}`;
}

function migrateTopic(topic) {
  const topicPrefix = TYPE_B_TOPICS[topic];
  const contentPath = join(repoRoot, 'content', `${topic}.json`);
  const doc = JSON.parse(readFileSync(contentPath, 'utf8'));

  let migrated = 0;
  // Build a map: forWidget id -> bodyScript (from widget-script blocks)
  const scriptByWidgetId = new Map();
  for (const sec of doc.sections || []) {
    for (const b of sec.blocks || []) {
      if (b.type === 'widget-script' && b.forWidget && !b.slug && b.html) {
        scriptByWidgetId.set(b.forWidget, b.html);
      }
    }
  }

  // Walk and transform widget + widget-script blocks
  for (const sec of doc.sections || []) {
    for (let i = 0; i < (sec.blocks || []).length; i++) {
      const b = sec.blocks[i];

      if (b.type === 'widget' && !b.slug && b.id) {
        const widgetId = b.id;
        const slug = makeSlug(topicPrefix, widgetId);
        const info = extractTitleAndHint(b.html);
        const bodyScript = scriptByWidgetId.get(widgetId) || '';

        writeVerbatimSlug({
          repoRoot, slug, topic,
          title: info.title, hint: info.hint,
          bodyMarkup: b.html, bodyScript,
        });

        // Replace block content
        sec.blocks[i] = {
          type: 'widget',
          slug,
          params: {
            widgetId,
            title: info.title,
            hint: info.hint,
            bodyMarkup: b.html,
            bodyScript: '', // intentionally empty — the script emits via paired widget-script block
          },
        };
        migrated++;
      } else if (b.type === 'widget-script' && b.forWidget && !b.slug && b.html) {
        const widgetId = b.forWidget;
        const slug = makeSlug(topicPrefix, widgetId);
        const info = { title: '', hint: '' }; // not needed for widget-script

        sec.blocks[i] = {
          type: 'widget-script',
          slug,
          params: {
            widgetId,
            title: '', // unused on script side but required by schema
            hint: '',
            bodyMarkup: '',
            bodyScript: b.html,
          },
        };
      }
    }
  }

  writeFileSync(contentPath, JSON.stringify(doc, null, 2) + '\n');
  return migrated;
}

let total = 0;
for (const topic of Object.keys(TYPE_B_TOPICS)) {
  const n = migrateTopic(topic);
  console.log(`migrated ${topic}: ${n} widget block(s) (paired script blocks updated in same pass)`);
  total += n;
}
console.log(`---\ntotal Type B widgets migrated: ${total}`);
