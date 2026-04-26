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
// Scope.  Four idempotent JSON mutations:
//   - upsertFencedBlock  insert/replace a fenced raw-HTML block inside a
//                        named section's blocks[]
//   - stripFencedBlock   remove a fenced raw block by name
//   - ensureCss          ensure a CSS rule lives inside doc.rawHead's
//                        <style> block (add-only — see updateCss for an
//                        update-aware sibling)
//   - updateCss          insert/replace a fenced CSS region inside
//                        doc.rawHead's <style> block (rule-update aware)
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

function escapeRe(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Compiled-once regex table per fence name — keeps the substring-vs-regex
// behaviour predictable across calls.
const fenceBeginReCache = new Map();
function fenceBeginRe(name) {
  let re = fenceBeginReCache.get(name);
  if (!re) {
    // Match the literal HTML-comment form only.  We deliberately do NOT
    // match HTML-encoded variants (`&lt;!-- … --&gt;`) because those are
    // text content (e.g. a topic page documenting the fence syntax), not
    // active fences.
    re = new RegExp('<!--\\s*' + escapeRe(name) + '-auto-begin\\s*-->');
    fenceBeginReCache.set(name, re);
  }
  return re;
}

// Match the entire fenced region (begin token, body, end token) so callers
// can locate the exact bytes the fence occupies inside a host raw block.
const fenceRegionReCache = new Map();
function fenceRegionRe(name) {
  let re = fenceRegionReCache.get(name);
  if (!re) {
    re = new RegExp(
      '<!--\\s*' + escapeRe(name) + '-auto-begin\\s*-->[\\s\\S]*?<!--\\s*' +
        escapeRe(name) + '-auto-end\\s*-->',
    );
    fenceRegionReCache.set(name, re);
  }
  return re;
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

// Anchored on the actual HTML-comment form of the begin token.  Substring
// matching here would false-positive on any prose that documents the fence
// syntax (HTML-encoded `&lt;!-- callback-auto-begin --&gt;` text content
// does NOT match — only a live HTML comment does).
function blockHasFence(block, name) {
  return block && block.type === 'raw' && typeof block.html === 'string' &&
    fenceBeginRe(name).test(block.html);
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
 * Auto-explode behaviour (Issue 1).  When the existing fence sits inside
 * a host `raw` block alongside other bytes — the steady state for ~110 of
 * 243 callback fences in the current corpus, where the fence shares a
 * block with a neighbouring `</section>`, an adjacent backlinks fence, or
 * inter-fence prose — naively replacing the whole host block's `html`
 * would silently drop those surrounding bytes.  Instead, this function
 * splits the host into up to three sibling `raw` blocks (before-fence /
 * fence / after-fence), each carrying its own substring of the original
 * `html`, and replaces only the middle one.
 *
 *   - Preserved: every byte outside the fence region (whitespace, prose,
 *     adjacent fences, structural HTML).
 *   - Lost: nothing — the byte concatenation of the three new blocks is
 *     exactly the original host block's `html` minus the old fence region
 *     plus the new wrapped fence region.
 *   - When the fence already occupies the entire host block (no
 *     surrounding bytes), no explosion happens; the `html` is updated in
 *     place and the block count is unchanged.
 *
 * The same auto-explode pattern is used by the inject-used-in-backlinks
 * consumer (`explodeFencedBacklinks`); centralising it here lets new
 * callers reach for the obvious entry point without working around a
 * footgun.
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

    // Detect the surrounded-by-other-bytes case.  Locate the fence region
    // inside `existing.html`; anything outside that region is host content
    // we must preserve.
    const regionRe = fenceRegionRe(fenceName);
    const m = regionRe.exec(existing.html);
    if (!m) {
      // blockHasFence said yes but the full region didn't match — fence
      // begin is present but end is missing or malformed.  Treat as a
      // wholesale replace (the caller can repair the partial fence).
      section.blocks[existingIdx] = { ...existing, html: wrapped };
      return { changed: true, action: 'replaced' };
    }
    const before = existing.html.slice(0, m.index);
    const after = existing.html.slice(m.index + m[0].length);

    if (before.length === 0 && after.length === 0) {
      // Fence occupies the whole host block — wholesale replace is safe.
      section.blocks[existingIdx] = { ...existing, html: wrapped };
      return { changed: true, action: 'replaced' };
    }

    // Auto-explode: split the host into up to three sibling raw blocks so
    // the surrounding bytes survive intact.
    const replacement = [];
    if (before.length > 0) replacement.push({ type: 'raw', html: before });
    replacement.push({ type: 'raw', html: wrapped });
    if (after.length > 0) replacement.push({ type: 'raw', html: after });
    section.blocks.splice(existingIdx, 1, ...replacement);
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
 * **This is an add-only convenience.**  If the selector is already
 * present, the existing rule's *content* is left alone — there is no way
 * to update it through this API.  If you need the rule to track an
 * authoritative source (i.e. updates should overwrite an existing rule,
 * not silently no-op), use {@link updateCss} instead, which operates on
 * a CSS-comment-fenced region.
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

// ---------------------------------------------------------------------------
// Fenced CSS region — rule-update aware.
// ---------------------------------------------------------------------------

function cssFenceBegin(name) {
  return `/* ${name}-auto-begin */`;
}
function cssFenceEnd(name) {
  return `/* ${name}-auto-end */`;
}

const cssFenceRegionReCache = new Map();
function cssFenceRegionRe(name) {
  let re = cssFenceRegionReCache.get(name);
  if (!re) {
    re = new RegExp(
      '/\\*\\s*' + escapeRe(name) + '-auto-begin\\s*\\*/[\\s\\S]*?/\\*\\s*' +
        escapeRe(name) + '-auto-end\\s*\\*/',
    );
    cssFenceRegionReCache.set(name, re);
  }
  return re;
}

/**
 * Insert or update a fenced CSS region inside `doc.rawHead`'s <style>
 * block.  Mirrors {@link upsertFencedBlock} but uses CSS-comment fences
 * (`/* fenceName-auto-begin *​/ … /* fenceName-auto-end *​/`) so the
 * tokens are valid inside a `<style>` element.
 *
 * Behaviour:
 *
 *   - If the fenced region already exists in `doc.rawHead`, replace its
 *     contents with `cssText` (wrapped between the begin/end fence
 *     comments).  Returns action `'updated'` on byte change, `'noop'` on
 *     idempotent re-run.
 *   - If the fenced region is absent, splice the wrapped block in
 *     immediately before the first `</style>`, followed by a newline.
 *     Returns action `'inserted'`.
 *
 * Unlike {@link ensureCss}, callers do NOT pass a selector regex — the
 * fence name itself is the identity, so the rule's selector list and
 * body can change freely between runs without leaving the previous rule
 * orphaned in the head.
 *
 * Returns `{ changed, action }` with `action ∈ 'inserted' | 'updated' |
 * 'noop'` and `changed === false` iff `action === 'noop'`.
 *
 * Throws if `doc.rawHead` is not a string, `fenceName` is empty, or the
 * insert path is taken and `doc.rawHead` has no `</style>` tag.
 */
export function updateCss(doc, fenceName, cssText) {
  if (!doc || typeof doc.rawHead !== 'string') {
    throw new Error('updateCss: doc.rawHead must be a string');
  }
  if (typeof fenceName !== 'string' || !fenceName) {
    throw new Error('updateCss: fenceName must be a non-empty string');
  }
  if (typeof cssText !== 'string') {
    throw new Error('updateCss: cssText must be a string');
  }

  const wrapped = `${cssFenceBegin(fenceName)}\n${cssText}\n${cssFenceEnd(fenceName)}`;

  const regionRe = cssFenceRegionRe(fenceName);
  const m = regionRe.exec(doc.rawHead);
  if (m) {
    if (m[0] === wrapped) {
      return { changed: false, action: 'noop' };
    }
    doc.rawHead =
      doc.rawHead.slice(0, m.index) + wrapped + doc.rawHead.slice(m.index + m[0].length);
    return { changed: true, action: 'updated' };
  }

  // Detect a malformed/orphan fence: begin token present but no matching end.
  // Without this guard, the function would silently fall through to the
  // insert path below and splice a fresh fence pair, leaving the orphan
  // begin behind — turning a malformed input into corrupt output.
  // Surface it to the caller so the malformation is visible.
  const beginRe = new RegExp(`\\/\\*\\s*${escapeRe(fenceName)}-auto-begin\\s*\\*\\/`);
  const endRe = new RegExp(`\\/\\*\\s*${escapeRe(fenceName)}-auto-end\\s*\\*\\/`);
  if (beginRe.test(doc.rawHead) || endRe.test(doc.rawHead)) {
    throw new Error(
      `updateCss: malformed fence — '${fenceName}' has a begin or end token but not both (or they're out of order). Refusing to write to avoid leaving the orphan token in place. Clean rawHead manually before calling updateCss.`
    );
  }

  const closeIdx = doc.rawHead.search(/<\/style>/i);
  if (closeIdx < 0) {
    throw new Error('updateCss: doc.rawHead has no </style>');
  }
  doc.rawHead =
    doc.rawHead.slice(0, closeIdx) + wrapped + '\n' + doc.rawHead.slice(closeIdx);
  return { changed: true, action: 'inserted' };
}
