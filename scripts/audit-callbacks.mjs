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
// Zero dependencies.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const conceptsDir = join(repoRoot, 'concepts');

const argv = process.argv.slice(2);
const FIX = argv.includes('--fix');

// ----- Load concept graph -----
const indexPath = join(conceptsDir, 'index.json');
const topics = JSON.parse(readFileSync(indexPath, 'utf8')).topics;

// conceptId -> { topic, title, anchor }
const ownerOf = new Map();
// topic -> { page, concepts: [full entry] }
const topicData = new Map();

for (const topic of topics) {
  const p = join(conceptsDir, `${topic}.json`);
  if (!existsSync(p)) continue;
  const d = JSON.parse(readFileSync(p, 'utf8'));
  topicData.set(topic, d);
  for (const c of d.concepts || []) {
    if (ownerOf.has(c.id)) continue; // duplicates flagged elsewhere
    ownerOf.set(c.id, { topic, title: c.title, anchor: c.anchor, page: d.page || `${topic}.html` });
  }
}

// ----- Collect cross-topic edges per (host topic, host section anchor) -----
// key = `${hostTopic}::${hostAnchor}` -> Array<{ page, anchor, title, id }>
const needed = new Map();
let totalEdges = 0;
for (const [hostTopic, d] of topicData) {
  for (const c of d.concepts || []) {
    if (!c.anchor) continue;
    const key = `${hostTopic}::${c.anchor}`;
    for (const p of c.prereqs || []) {
      const owner = ownerOf.get(p);
      if (!owner) continue; // broken prereqs are validator's job
      if (owner.topic === hostTopic) continue; // same-page, skip
      if (!needed.has(key)) needed.set(key, []);
      // dedupe by anchor+page
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

function escapeRe(s) {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

// Find the "block" owned by a concept anchor. The anchor can be either a top-level
// <section id="anchor"> or a sub-heading like <h3 id="anchor"> inside a section.
//
// Returns { innerStart, innerEnd, body }:
//   innerStart = offset just after the element carrying id="anchor"
//   innerEnd   = offset of the next id="..." attribute *after* this anchor,
//                or the enclosing </section>, whichever comes first.
//   body       = slice between the two.
//
// This gives us a stable "section" even when a topic page splits a <section>
// into multiple sub-concepts via <h3 id="...">.
function findSection(html, anchor) {
  const idRe = new RegExp(`<([a-zA-Z][a-zA-Z0-9]*)([^>]*\\sid=["']${escapeRe(anchor)}["'][^>]*)>`, 'i');
  const m = idRe.exec(html);
  if (!m) return null;
  const innerStart = m.index + m[0].length;

  // Find the next concept-boundary element. We only treat <section id=> and
  // heading-level id's (<h2 id=>, <h3 id=>, <h4 id=>) as boundaries — widget
  // IDs on <div id="w-..."> or form <input id=> etc. must not truncate us.
  const nextBoundaryRe = /<(?:section|h2|h3|h4)\b[^>]*\sid=["'][^"']+["']/gi;
  nextBoundaryRe.lastIndex = innerStart;
  const nextBoundaryM = nextBoundaryRe.exec(html);

  // Find the next </section> after this one.
  const nextCloseRe = /<\/section>/gi;
  nextCloseRe.lastIndex = innerStart;
  const nextCloseM = nextCloseRe.exec(html);

  let innerEnd;
  if (nextBoundaryM && (!nextCloseM || nextBoundaryM.index < nextCloseM.index)) {
    innerEnd = nextBoundaryM.index;
  } else if (nextCloseM) {
    innerEnd = nextCloseM.index;
  } else {
    // Fallback: end of document.
    innerEnd = html.length;
  }

  return {
    innerStart,
    innerEnd,
    body: html.slice(innerStart, innerEnd),
  };
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
function insertCallback(html, anchor, links) {
  const sec = findSection(html, anchor);
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

// ----- Main -----
let pagesTouched = 0;
let hadMissing = false;
const pagesWithMissing = new Set();

for (const [hostTopic, d] of topicData) {
  const page = d.page || `${hostTopic}.html`;
  const pagePath = join(repoRoot, page);
  if (!existsSync(pagePath)) {
    missingReport.push(`${page}: file missing`);
    continue;
  }
  let html = readFileSync(pagePath, 'utf8');
  const origHtml = html;

  // CSS injection is idempotent; do it preemptively if we will insert at least one block.
  const hostKeys = (d.concepts || [])
    .filter((c) => c.anchor && needed.has(`${hostTopic}::${c.anchor}`))
    .map((c) => ({ anchor: c.anchor, id: c.id, links: needed.get(`${hostTopic}::${c.anchor}`) }));

  const localMissing = [];
  for (const { anchor, id, links } of hostKeys) {
    const sec = findSection(html, anchor);
    if (!sec) {
      localMissing.push(`  section #${anchor} (concept "${id}") not found`);
      continue;
    }
    // What is currently missing from this section?
    const presentHrefs = new Set();
    for (const hm of sec.body.matchAll(/<a[^>]+href=["']([^"']+)["']/g)) {
      presentHrefs.add(hm[1]);
    }
    // Also inspect any existing <aside class="callback"> links
    const missingLinks = links.filter((l) => {
      const t1 = `./${l.page}#${l.anchor}`;
      const t2 = `${l.page}#${l.anchor}`;
      return !presentHrefs.has(t1) && !presentHrefs.has(t2);
    });
    if (missingLinks.length > 0) {
      // count as covered if they are in an aside.callback (same test; covered above).
      localMissing.push(`  section #${anchor} (concept "${id}") missing ${missingLinks.length} callback link(s): ${missingLinks.map((l) => `${l.page}#${l.anchor}`).join(', ')}`);
    } else {
      existingCount += links.length;
    }
  }

  if (FIX) {
    // Ensure CSS is present if we'll insert anything.
    if (hostKeys.length > 0) html = ensureCallbackCss(html);
    // Iterate in reverse anchor order to avoid shifting earlier offsets.
    // (We recompute offsets per insert anyway, but reverse keeps it simple.)
    const hostAnchors = hostKeys.slice().reverse();
    for (const { anchor, links } of hostAnchors) {
      const r = insertCallback(html, anchor, links);
      html = r.html;
      if (r.note && r.note.startsWith('inserted')) {
        const n = parseInt(r.note.match(/\d+/)[0], 10);
        insertedCount += n;
      } else if (r.note && r.note.startsWith('merged')) {
        const n = parseInt(r.note.match(/\d+/)[0], 10);
        insertedCount += n;
      }
    }
    if (html !== origHtml) {
      writeFileSync(pagePath, html);
      pagesTouched++;
    }
    // After fix, re-audit for reporting: anything still missing?
    const afterHtml = html;
    for (const { anchor, id, links } of hostKeys) {
      const sec = findSection(afterHtml, anchor);
      if (!sec) {
        missingReport.push(`${page}: section #${anchor} (concept "${id}") not found`);
        hadMissing = true;
        pagesWithMissing.add(page);
        continue;
      }
      const presentHrefs = new Set();
      for (const hm of sec.body.matchAll(/<a[^>]+href=["']([^"']+)["']/g)) {
        presentHrefs.add(hm[1]);
      }
      const stillMissing = links.filter((l) => {
        const t1 = `./${l.page}#${l.anchor}`;
        const t2 = `${l.page}#${l.anchor}`;
        return !presentHrefs.has(t1) && !presentHrefs.has(t2);
      });
      if (stillMissing.length > 0) {
        hadMissing = true;
        pagesWithMissing.add(page);
        missingReport.push(`${page}: section #${anchor} (concept "${id}") still missing ${stillMissing.length} link(s) after --fix`);
      }
    }
  } else {
    if (localMissing.length > 0) {
      hadMissing = true;
      pagesWithMissing.add(page);
      missingReport.push(`${page}:\n${localMissing.join('\n')}`);
    }
  }
}

// ----- Report -----
console.log(`audit-callbacks: ${topicData.size} topic(s), ${totalEdges} cross-topic edge(s)`);
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
