// Shared helpers for mutating `content/<topic>.json` (the JSON-source-of-truth
// equivalent of html-injector.mjs).
//
// Background.  Every `<topic>.html` is regenerated from its sibling
// `content/<topic>.json` by `scripts/test-roundtrip.mjs --fix`.  Several
// `inject-*` and `audit-* --fix` scripts still mutate the HTML directly; on
// the next rebuild that work is silently clobbered.  This module gives those
// scripts a way to mutate the JSON instead, so their output survives the
// round-trip.
//
// Scope.  Three idempotent JSON mutations:
//   - upsertFencedBlock  insert/replace a fenced raw-HTML block inside a
//                        named section's blocks[]
//   - stripFencedBlock   remove a fenced raw block by name
//   - ensureCss          ensure a CSS rule lives inside doc.rawHead's
//                        <style> block
// Plus thin loaders/savers (`loadTopicContent`, `saveTopicContent`) that
// match the on-disk byte format (`JSON.stringify(doc, null, 2) + '\n'`).
//
// Zero external deps.  The module is intentionally narrow — block
// *construction* and *which section to target* stay in callers; this just
// owns the fence wrap, the placement rules, and the write-if-changed
// boilerplate.

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ---------------------------------------------------------------------------
// Disk I/O.
// ---------------------------------------------------------------------------

/**
 * Read content/<topic>.json from disk.  No caching — callers manage their
 * own caching if needed.  Returns the parsed JSON document.
 */
export function loadTopicContent(topic, repoRoot) {
  const path = resolve(repoRoot, 'content', `${topic}.json`);
  return JSON.parse(readFileSync(path, 'utf8'));
}

/**
 * Serialize `doc` and write to content/<topic>.json only if the bytes
 * differ.  Matches the on-disk format (2-space indent + trailing newline)
 * exactly, so a no-op load+save is byte-identical.
 *
 * Returns `true` if the file was written, `false` otherwise.
 */
export function saveTopicContent(topic, doc, repoRoot) {
  const path = resolve(repoRoot, 'content', `${topic}.json`);
  const next = JSON.stringify(doc, null, 2) + '\n';
  let prev = null;
  try {
    prev = readFileSync(path, 'utf8');
  } catch {
    // File doesn't exist — write it.
  }
  if (prev === next) return false;
  writeFileSync(path, next);
  return true;
}

// ---------------------------------------------------------------------------
// Section lookup.
// ---------------------------------------------------------------------------

/**
 * Locate the section whose `id` field equals `anchor` (the same value that
 * appears as `<section id="...">` in the rendered HTML and as `concept.anchor`
 * in concepts/<topic>.json).
 *
 * Returns `{ sectionIdx, section }` or `null`.
 */
export function findSection(doc, anchor) {
  if (!doc || !Array.isArray(doc.sections)) return null;
  const sectionIdx = doc.sections.findIndex((s) => s && s.id === anchor);
  if (sectionIdx < 0) return null;
  return { sectionIdx, section: doc.sections[sectionIdx] };
}

// ---------------------------------------------------------------------------
// Fence helpers (HTML-comment style only — JSON raw blocks always carry
// HTML, and the fences live inside that HTML).
// ---------------------------------------------------------------------------

function fenceBegin(name) {
  return `<!-- ${name}-auto-begin -->`;
}
function fenceEnd(name) {
  return `<!-- ${name}-auto-end -->`;
}

/**
 * Wrap `contentHtml` with the named fence:
 *   <!-- name-auto-begin -->
 *   ...content...
 *   <!-- name-auto-end -->
 *
 * The wrap puts the fence tokens and the content on their own lines so the
 * shape stays predictable for diff review.  No trailing newline outside the
 * end-fence — callers can splice surrounding whitespace as needed.
 */
function wrapFence(name, contentHtml) {
  return `${fenceBegin(name)}\n${contentHtml}\n${fenceEnd(name)}`;
}

function blockHasFence(block, name) {
  return block && block.type === 'raw' && typeof block.html === 'string' &&
    block.html.includes(fenceBegin(name));
}

// ---------------------------------------------------------------------------
// Position resolution.
// ---------------------------------------------------------------------------

// Returns the insertion index inside section.blocks for the given position
// spec.  Throws if the spec references something that doesn't exist (e.g.
// `before-quiz` on a section with no quiz block) — the caller can decide
// how to recover.
function resolveInsertIndex(section, position) {
  const blocks = section.blocks;
  if (!Array.isArray(blocks)) {
    throw new Error(`section "${section.id}" has no blocks array`);
  }

  if (position === 'before-section-end') {
    return blocks.length;
  }
  if (position === 'before-quiz' || position === 'after-quiz') {
    const quizIdx = blocks.findIndex((b) => b && b.type === 'quiz');
    if (quizIdx < 0) {
      throw new Error(
        `position "${position}" requested in section "${section.id}" but ` +
        `the section has no quiz block`,
      );
    }
    return position === 'before-quiz' ? quizIdx : quizIdx + 1;
  }
  if (
    typeof position === 'string' &&
    (position.startsWith('after-fence:') || position.startsWith('before-fence:'))
  ) {
    const before = position.startsWith('before-fence:');
    const prefix = before ? 'before-fence:' : 'after-fence:';
    const otherFence = position.slice(prefix.length);
    if (!otherFence) {
      throw new Error(`malformed position "${position}"`);
    }
    const fenceIdx = blocks.findIndex((b) => blockHasFence(b, otherFence));
    if (fenceIdx < 0) {
      throw new Error(
        `position "${position}" requested in section "${section.id}" but ` +
        `no fence "${otherFence}" was found`,
      );
    }
    return before ? fenceIdx : fenceIdx + 1;
  }
  throw new Error(`unknown position spec "${position}"`);
}

// ---------------------------------------------------------------------------
// Fenced-block upsert / strip.
// ---------------------------------------------------------------------------

/**
 * Insert (or replace) a fenced raw block inside the section identified by
 * `anchor`.
 *
 * Idempotency rule: if any `raw` block in the target section already
 * contains the fence's begin token, that block's `html` is replaced with the
 * new fenced block.  Otherwise a new `raw` block is inserted at the
 * resolved position.
 *
 * Args:
 *   doc          — content document (mutated in place)
 *   anchor       — section.id to target
 *   fenceName    — fence label, e.g. 'callback', 'backlinks'
 *   contentHtml  — the inner HTML to wrap with the fence
 *   options.position — 'before-quiz' | 'after-quiz'
 *                    | 'before-section-end'
 *                    | 'after-fence:<other>' | 'before-fence:<other>'
 *
 * Returns `{ changed, action }`:
 *   action ∈ 'inserted' | 'replaced' | 'noop'
 *   changed === false iff action === 'noop'
 *
 * Throws on invalid args (missing section, unknown position, etc.) so
 * caller bugs surface fast.
 */
export function upsertFencedBlock(doc, anchor, fenceName, contentHtml, options = {}) {
  if (typeof fenceName !== 'string' || !fenceName) {
    throw new Error('upsertFencedBlock: fenceName must be a non-empty string');
  }
  const { position } = options;
  if (!position) {
    throw new Error('upsertFencedBlock: options.position is required');
  }

  const found = findSection(doc, anchor);
  if (!found) {
    throw new Error(`upsertFencedBlock: no section with id "${anchor}"`);
  }
  const { section } = found;
  if (!Array.isArray(section.blocks)) {
    throw new Error(`section "${anchor}" has no blocks array`);
  }

  const wrapped = wrapFence(fenceName, contentHtml);

  // Idempotent replace path.
  const existingIdx = section.blocks.findIndex((b) => blockHasFence(b, fenceName));
  if (existingIdx >= 0) {
    const existing = section.blocks[existingIdx];
    if (existing.html === wrapped) {
      return { changed: false, action: 'noop' };
    }
    section.blocks[existingIdx] = { ...existing, html: wrapped };
    return { changed: true, action: 'replaced' };
  }

  // Insert path.
  const insertIdx = resolveInsertIndex(section, position);
  const newBlock = { type: 'raw', html: wrapped };
  section.blocks.splice(insertIdx, 0, newBlock);
  return { changed: true, action: 'inserted' };
}

/**
 * Remove the fenced raw block named `fenceName` from the section identified
 * by `anchor`.  No-op if the block is absent.
 *
 * Returns `{ changed }`.
 */
export function stripFencedBlock(doc, anchor, fenceName) {
  if (typeof fenceName !== 'string' || !fenceName) {
    throw new Error('stripFencedBlock: fenceName must be a non-empty string');
  }
  const found = findSection(doc, anchor);
  if (!found) {
    throw new Error(`stripFencedBlock: no section with id "${anchor}"`);
  }
  const { section } = found;
  if (!Array.isArray(section.blocks)) {
    throw new Error(`section "${anchor}" has no blocks array`);
  }
  const idx = section.blocks.findIndex((b) => blockHasFence(b, fenceName));
  if (idx < 0) return { changed: false };
  section.blocks.splice(idx, 1);
  return { changed: true };
}

// ---------------------------------------------------------------------------
// rawHead CSS injection.
// ---------------------------------------------------------------------------

/**
 * Ensure a CSS rule is present in `doc.rawHead`'s <style> block.
 *
 * If `selectorRegex` already matches anywhere in `doc.rawHead`, no-op.
 * Otherwise splice `cssText` immediately before the first `</style>`,
 * followed by a single newline.  Mutates `doc.rawHead` in place.
 *
 * Returns `{ changed }`.
 *
 * Throws if `doc.rawHead` is missing a `</style>` tag — that would be a
 * malformed source document, not a writer-input issue.
 */
export function ensureCss(doc, selectorRegex, cssText) {
  if (!doc || typeof doc.rawHead !== 'string') {
    throw new Error('ensureCss: doc.rawHead must be a string');
  }
  if (!(selectorRegex instanceof RegExp)) {
    throw new Error('ensureCss: selectorRegex must be a RegExp');
  }
  if (selectorRegex.test(doc.rawHead)) {
    return { changed: false };
  }
  const closeIdx = doc.rawHead.search(/<\/style>/i);
  if (closeIdx < 0) {
    throw new Error('ensureCss: doc.rawHead has no </style>');
  }
  doc.rawHead =
    doc.rawHead.slice(0, closeIdx) + cssText + '\n' + doc.rawHead.slice(closeIdx);
  return { changed: true };
}
