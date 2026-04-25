#!/usr/bin/env node
// Audit cross-page "See also" callbacks.
//
// Semantics:
//   - Every concept entry in concepts/<topic>.json has a bare-id `prereqs` array.
//     Some of those ids belong to other topics (cross-topic edges). Each such
//     edge should manifest on the host topic's HTML page as an
//     <aside class="callback"> block inside the section that owns the concept,
//     linking to `<other-topic>.html#<anchor>` with the target concept's title.
//
//   - A prereq id that resolves to a concept in the *same* topic file is an
//     intra-page link; no callback needed (the sidetoc already covers it).
//
// Modes:
//   default           Scan + print a report; exit 1 if any missing callback.
//   --fix             Insert missing <aside class="callback"> blocks in place,
//                     just before the section's closing </section> (or before
//                     the section's quiz placeholder if one exists).
//                     Never duplicates an existing identical href.
//   --dry-run         Alias for default (scan-only).
//
// Re-runnable: safe to run repeatedly. Treats the union of existing
// <a href="other.html#anchor"> inside the section as covered.
//
// Consumes the shared content model (scripts/lib/content-model.mjs) to avoid
// re-parsing concept JSON and HTML pages. Section-element lookup uses the
// pre-parsed DOM (sections map / getElementById); host-range offsets are
// derived from element `.range` metadata so the --fix writer can still do
// byte-identical raw-HTML string splicing.

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseHtml } from 'node-html-parser';
import { escapeRe } from './lib/audit-utils.mjs';
import { loadContentModel } from './lib/content-model.mjs';

const argv = process.argv.slice(2);
const FIX = argv.includes('--fix');

const model = await loadContentModel();
const { repoRoot, topics, concepts, ownerOf } = model;

// ----- Collect cross-topic edges per (host topic, host section anchor) -----
// key = `${hostTopic}::${hostAnchor}` -> Array<{ page, anchor, title, id }>
const needed = new Map();
let totalEdges = 0;
for (const topic of topics.values()) {
  for (const conceptId of topic.conceptIds) {
    const c = concepts.get(conceptId);
    if (!c || !c.anchor) continue;
    if (c.topic !== topic.id) continue; // first-writer-wins — skip overrides
    const key = `${topic.id}::${c.anchor}`;
    for (const p of c.prereqs) {
      const owner = ownerOf.get(p);
      if (!owner) continue; // broken prereqs are validator's job
      if (owner.topic === topic.id) continue; // same-page, skip
      if (!needed.has(key)) needed.set(key, []);
      const arr = needed.get(key);
      if (!arr.some((e) => e.page === owner.page && e.anchor === owner.anchor)) {
        arr.push({
          page: owner.page,
          anchor: owner.anchor,
          title: owner.title,
          id: p,
        });
        totalEdges++;
      }
    }
  }
}

// ----- Sort link lists deterministically -----
for (const arr of needed.values()) {
  arr.sort((a, b) => (a.page + a.anchor).localeCompare(b.page + b.anchor));
}

// ----- Scan pages -----
const missingReport = [];
let insertedCount = 0;
let existingCount = 0;

// Find the "block" owned by a concept anchor. The anchor can be either a top-level
// <section id="anchor"> or a sub-heading like <h3 id="anchor"> inside a section.
//
// Returns { innerStart, innerEnd, body }, shape-compatible with the prior
// regex-based implementation:
//   innerStart = offset just after the element carrying id="anchor"
//   innerEnd   = offset of the next heading-with-id (<h2|h3|h4 id=...>) or
//                nested <section id=...> after this anchor, or the enclosing
//                </section>, whichever comes first.
//   body       = raw-HTML slice between the two.
//
// Uses the pre-parsed DOM from loadContentModel() to locate the anchor
// element and the next boundary element, then derives byte offsets from
// element `.range` metadata so downstream --fix splicing stays byte-exact.
function findSection(topic, rawHtml, anchor) {
  // 1. Resolve the element that carries id="anchor".
  let anchorEl = topic.sections.get(anchor) || null;
  if (!anchorEl && topic.html && typeof topic.html.getElementById === 'function') {
    anchorEl = topic.html.getElementById(anchor);
  }
  if (!anchorEl || !anchorEl.range) return null;

  // 2. innerStart = position just after the element's opening tag.
  const [elStart] = anchorEl.range;
  const gt = rawHtml.indexOf('>', elStart);
  if (gt < 0) return null;
  const innerStart = gt + 1;

  // 3. Find the next boundary element.
  //    - If anchorEl is <section>: the next concept-boundary is a nested
  //      <h2|h3|h4 id=...> or <section id=...> inside it (walk descendants).
  //    - If anchorEl is <h2|h3|h4>: walk its *following siblings* inside the
  //      same parent <section>, looking for the next heading-with-id or
  //      nested section-with-id.
  //    Fallback for both: end of enclosing <section> (just before </section>).
  const tag = (anchorEl.rawTagName || '').toLowerCase();
  let boundaryStart = -1;

  if (tag === 'section') {
    // First descendant heading-with-id or nested section-with-id.
    const cand = anchorEl.querySelector('h2[id],h3[id],h4[id],section[id]');
    if (cand && cand !== anchorEl && cand.range) {
      boundaryStart = cand.range[0];
    }
  } else {
    // Heading anchor: scan following siblings for a concept-boundary.
    const parent = anchorEl.parentNode;
    if (parent && Array.isArray(parent.childNodes)) {
      const kids = parent.childNodes;
      const idx = kids.indexOf(anchorEl);
      for (let i = idx + 1; i < kids.length; i++) {
        const n = kids[i];
        if (!n || n.nodeType !== 1) continue;
        const t = (n.rawTagName || '').toLowerCase();
        if ((t === 'h2' || t === 'h3' || t === 'h4' || t === 'section') && n.id && n.range) {
          boundaryStart = n.range[0];
          break;
        }
      }
    }
  }

  // 4. Close fallback: end of enclosing <section> (minus </section>).
  let sectionEnd = -1;
  const enclosing = tag === 'section' ? anchorEl : findEnclosingSection(anchorEl);
  if (enclosing && enclosing.range) {
    const [, rEnd] = enclosing.range;
    const closeTag = `</${(enclosing.rawTagName || 'section').toLowerCase()}>`;
    const closeStart = rawHtml.lastIndexOf(closeTag, rEnd);
    if (closeStart >= 0 && closeStart >= innerStart) sectionEnd = closeStart;
  }

  let innerEnd;
  if (boundaryStart >= 0 && (sectionEnd < 0 || boundaryStart < sectionEnd)) {
    innerEnd = boundaryStart;
  } else if (sectionEnd >= 0) {
    innerEnd = sectionEnd;
  } else {
    innerEnd = rawHtml.length;
  }

  return {
    innerStart,
    innerEnd,
    body: rawHtml.slice(innerStart, innerEnd),
  };
}

function findEnclosingSection(el) {
  let cur = el && el.parentNode;
  while (cur) {
    if ((cur.rawTagName || '').toLowerCase() === 'section') return cur;
    cur = cur.parentNode;
  }
  return null;
}

// Build an ad-hoc topic-like view ({ html, sections }) from a raw HTML string.
// Used after --fix mutates a page so findSection() gets fresh element offsets
// aligned with the new rawHtml.
function reparseTopicView(rawHtml) {
  const root = parseHtml(rawHtml, {
    blockTextElements: { script: true, noscript: true, style: true, pre: true },
  });
  const sections = new Map();
  for (const sec of root.querySelectorAll('section[id]')) {
    if (sec.id) sections.set(sec.id, sec);
  }
  return { html: root, sections };
}

function buildCallbackHtml(links) {
  const lis = links
    .map((l) => `    <li><a href="./${l.page}#${l.anchor}">${l.title}</a></li>`)
    .join('\n');
  return `<aside class="callback">
  <div class="ttl">See also</div>
  <ul>
${lis}
  </ul>
</aside>`;
}

// CSS rule injected once per page into <style> block.
const CALLBACK_CSS = `  aside.callback{
    margin:1.2rem 0;padding:.7rem 1rem;
    background:rgba(88,196,221,0.05);
    border-left:3px solid rgba(88,196,221,0.55);
    border-radius:0 6px 6px 0;
    font-size:.93rem;
  }
  aside.callback .ttl{
    font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;
    color:var(--mute,#8c9aa6);margin-bottom:.3rem;font-weight:600;
  }
  aside.callback ul{margin:0;padding-left:1.1rem}
  aside.callback ul li{margin:.15rem 0}
  aside.callback a{color:inherit}`;

function ensureCallbackCss(html) {
  if (/aside\.callback\s*\{/.test(html)) return html;
  // insert just before </style> of the first <style> block
  const styleCloseRe = /<\/style>/i;
  const m = styleCloseRe.exec(html);
  if (!m) return html;
  return html.slice(0, m.index) + CALLBACK_CSS + '\n' + html.slice(m.index);
}

// Insert callback block inside a section's body at the best spot:
//   - if a <div class="quiz" data-concept="..."> is present, insert BEFORE it
//   - else, insert right before </section>
function insertCallback(topic, html, anchor, links) {
  const sec = findSection(topic, html, anchor);
  if (!sec) return { html, note: `section #${anchor} not found` };
  const body = sec.body;

  // already-present links? filter out anything already linked inside this section.
  const presentHrefs = new Set();
  for (const hm of body.matchAll(/<a[^>]+href=["']([^"']+)["']/g)) {
    presentHrefs.add(hm[1]);
  }
  const missingLinks = links.filter((l) => {
    const target = `./${l.page}#${l.anchor}`;
    const bare = `${l.page}#${l.anchor}`;
    return !presentHrefs.has(target) && !presentHrefs.has(bare);
  });

  // Also: if the section already has an <aside class="callback">, merge with it
  const existingAsideRe = /<aside\s+class=["']callback["'][^>]*>([\s\S]*?)<\/aside>/i;
  const asideMatch = body.match(existingAsideRe);

  if (missingLinks.length === 0) return { html, note: 'already covered' };

  if (asideMatch) {
    // Merge into existing aside: append missing <li>s before </ul>
    const asideStart = sec.innerStart + asideMatch.index;
    const asideEnd = asideStart + asideMatch[0].length;
    const asideHtml = asideMatch[0];
    const ulCloseIdx = asideHtml.lastIndexOf('</ul>');
    if (ulCloseIdx < 0) return { html, note: `malformed existing aside in #${anchor}` };
    const newLis = missingLinks
      .map((l) => `    <li><a href="./${l.page}#${l.anchor}">${l.title}</a></li>`)
      .join('\n');
    const newAside = asideHtml.slice(0, ulCloseIdx) + newLis + '\n  ' + asideHtml.slice(ulCloseIdx);
    const newHtml = html.slice(0, asideStart) + newAside + html.slice(asideEnd);
    return { html: newHtml, note: `merged ${missingLinks.length} link(s) into existing aside` };
  }

  // Find insertion point: the position of the first <div class="quiz" data-concept=...
  // inside the section body, else position of </section>.
  const quizRe = /<div[^>]*class=["'][^"']*\bquiz\b[^"']*["'][^>]*\bdata-concept=["'][^"']+["'][^>]*>[^<]*<\/div>/;
  const qm = body.match(quizRe);
  let insertAt;
  if (qm) {
    insertAt = sec.innerStart + qm.index;
  } else {
    insertAt = sec.innerEnd;
  }

  const callback = buildCallbackHtml(missingLinks) + '\n\n';
  const newHtml = html.slice(0, insertAt) + callback + html.slice(insertAt);
  return { html: newHtml, note: `inserted ${missingLinks.length} link(s)` };
}

// Compute missing links for each anchor. Returns:
//   { anchor, id, missing: string[] | null }
//   `missing` = null when the section element itself can't be found.
function computeMissing(view, html, hostKeys) {
  const results = [];
  for (const { anchor, id, links } of hostKeys) {
    const sec = findSection(view, html, anchor);
    if (!sec) { results.push({ anchor, id, missing: null, links }); continue; }
    const presentHrefs = new Set();
    for (const hm of sec.body.matchAll(/<a[^>]+href=["']([^"']+)["']/g)) {
      presentHrefs.add(hm[1]);
    }
    const missing = links.filter((l) => {
      const t1 = `./${l.page}#${l.anchor}`;
      const t2 = `${l.page}#${l.anchor}`;
      return !presentHrefs.has(t1) && !presentHrefs.has(t2);
    });
    results.push({ anchor, id, missing, links });
  }
  return results;
}

// ----- Main -----
let pagesTouched = 0;
let hadMissing = false;
const pagesWithMissing = new Set();

for (const topic of topics.values()) {
  const page = topic.page;
  const pagePath = join(repoRoot, page);
  let html;
  try {
    html = readFileSync(pagePath, 'utf8');
  } catch {
    missingReport.push(`${page}: file missing`);
    continue;
  }
  const origHtml = html;

  // Collect host keys with cross-topic edges for this topic.
  const hostKeys = [];
  for (const conceptId of topic.conceptIds) {
    const c = concepts.get(conceptId);
    if (!c || !c.anchor || c.topic !== topic.id) continue;
    const key = `${topic.id}::${c.anchor}`;
    if (needed.has(key)) {
      hostKeys.push({ anchor: c.anchor, id: c.id, links: needed.get(key) });
    }
  }

  // Initial scan against the un-mutated page.
  const scan = computeMissing(topic, html, hostKeys);
  const localMissing = [];
  for (const { anchor, id, missing, links } of scan) {
    if (missing === null) {
      localMissing.push(`  section #${anchor} (concept "${id}") not found`);
    } else if (missing.length > 0) {
      localMissing.push(`  section #${anchor} (concept "${id}") missing ${missing.length} callback link(s): ${missing.map((l) => `${l.page}#${l.anchor}`).join(', ')}`);
    } else {
      existingCount += links.length;
    }
  }

  if (FIX) {
    if (hostKeys.length > 0) html = ensureCallbackCss(html);
    // Iterate in reverse anchor order so later-doc inserts don't shift
    // earlier-doc anchors. Re-parse the DOM whenever `html` has been mutated
    // so element ranges stay aligned with the current `html` string.
    let view = html === origHtml ? topic : reparseTopicView(html);
    let viewHtml = html;
    for (const { anchor, links } of hostKeys.slice().reverse()) {
      if (viewHtml !== html) { view = reparseTopicView(html); viewHtml = html; }
      const r = insertCallback(view, html, anchor, links);
      html = r.html;
      const m = r.note && r.note.match(/^(inserted|merged) (\d+)/);
      if (m) insertedCount += parseInt(m[2], 10);
    }
    if (html !== origHtml) {
      writeFileSync(pagePath, html);
      pagesTouched++;
    }
    // Re-audit after fix.
    const afterView = html === origHtml ? topic : reparseTopicView(html);
    for (const { anchor, id, missing } of computeMissing(afterView, html, hostKeys)) {
      if (missing === null) {
        missingReport.push(`${page}: section #${anchor} (concept "${id}") not found`);
        hadMissing = true;
        pagesWithMissing.add(page);
      } else if (missing.length > 0) {
        hadMissing = true;
        pagesWithMissing.add(page);
        missingReport.push(`${page}: section #${anchor} (concept "${id}") still missing ${missing.length} link(s) after --fix`);
      }
    }
  } else if (localMissing.length > 0) {
    hadMissing = true;
    pagesWithMissing.add(page);
    missingReport.push(`${page}:\n${localMissing.join('\n')}`);
  }
}

// ----- Report -----
console.log(`audit-callbacks: ${topics.size} topic(s), ${totalEdges} cross-topic edge(s)`);
if (FIX) {
  console.log(`  pages touched: ${pagesTouched}`);
  console.log(`  links inserted: ${insertedCount}`);
}
console.log(`  links already present: ${existingCount}`);
console.log('');

if (missingReport.length === 0) {
  console.log('OK: every cross-topic prereq is reflected by a callback link on its host section.');
  process.exit(0);
}

console.log(`MISSING (${pagesWithMissing.size} page(s)):`);
for (const line of missingReport) console.log(`  - ${line}`);
console.log('');
if (hadMissing) {
  console.log(`FAIL: ${pagesWithMissing.size} page(s) missing callback links.`);
  process.exit(1);
}
process.exit(0);
