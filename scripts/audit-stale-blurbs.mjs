#!/usr/bin/env node
// Audit concept blurbs against their owning section prose, flag drift.
//
// Advisory pass over the notebook: for each concept in concepts/<topic>.json,
// locate its owning <section> (via `anchor`) on the topic HTML and apply
// cheap lexical heuristics that flag likely stale or off-topic blurbs.
//
// Heuristics (all lexical, no NLP):
//
//   LENGTH   blurb is too terse (< 20 chars) or too long (> 280 chars).
//   MATCH    blurb mentions zero technical terms that appear in the section
//            prose (heavily suggests the blurb is off-topic).
//   RECALL   the most-frequent technical terms in the section do not appear
//            in the blurb or the concept title.
//   OFFPAGE  technical terms named only in the blurb, absent from the section
//            (blurb references content not on the page).
//   DUP      two or more concepts share an identical blurb string (trim +
//            lowercase).
//
// "Technical term" here means: a lowercased alphanumeric token of length ≥ 5,
// not in the stop-word list. Terms harvested from <em>, <strong>, inline
// <code>, and multi-word capitalized phrases count extra in the section
// inventory but the overlap check is applied against the union of plain-text
// tokens from the section.
//
// Output: grouped by topic, then by concept; each flagged concept lists the
// heuristic codes and a short excerpt. Ends with totals per heuristic.
//
// CLI:
//   node scripts/audit-stale-blurbs.mjs            - default report.
//   node scripts/audit-stale-blurbs.mjs --verbose  - also show per-concept
//                                                    offending tokens.
//
// Always exits 0 (this is an advisory audit, not a CI gate).
//
// Zero external dependencies.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const conceptsDir = join(repoRoot, 'concepts');

const argv = process.argv.slice(2);
const VERBOSE = argv.includes('--verbose');

// ─────────────────────────────────────────────────────────────────────────
// Thresholds.

const MIN_BLURB = 20;   // chars
const MAX_BLURB = 280;  // chars
const MIN_TOKEN_LEN = 5;
const TOP_SECTION_TERMS = 5;        // how many top terms must the blurb hit
const TOP_SECTION_TERMS_NEEDED = 1; // blurb must hit ≥ this many of top-N
// OFFPAGE: we only care about technical terms (names that appear in some
// other concept's title/blurb in the whole notebook). Anything else is
// probably prose drift, not content drift.
const OFFPAGE_MIN_TECH_TOKENS = 3;

// ─────────────────────────────────────────────────────────────────────────
// Stop-word list — English articles/prepositions + math connectives + KaTeX
// noise words that would otherwise dominate the token inventory.

const STOP = new Set([
  // articles / pronouns / aux
  'about', 'above', 'after', 'again', 'against', 'along', 'among', 'around',
  'because', 'before', 'below', 'between', 'beyond', 'during', 'every',
  'other', 'under', 'until', 'which', 'while', 'within', 'without',
  'their', 'there', 'these', 'those', 'where', 'whether',
  'would', 'could', 'should', 'might', 'shall',
  'being', 'been', 'have', 'having', 'does', 'doing', 'made', 'make',
  'some', 'such', 'same', 'more', 'most', 'many', 'much', 'also',
  'into', 'onto', 'from', 'this', 'that', 'with', 'than', 'then',
  // math connective / filler
  'given', 'thus', 'hence', 'moreover', 'furthermore', 'however',
  'therefore', 'whenever', 'because', 'consider', 'let', 'take',
  'note', 'observe', 'recall', 'here', 'above', 'below', 'thus',
  'suppose', 'assume', 'define', 'defined', 'denote', 'denoted',
  'called', 'namely', 'really', 'simply', 'clearly', 'similarly',
  'example', 'examples', 'theorem', 'theorems', 'lemma', 'lemmas',
  'proof', 'proofs', 'remark', 'remarks', 'corollary', 'corollaries',
  'standard', 'general', 'generally', 'specific', 'specifically',
  'since', 'because',
  // notebook-specific bland vocabulary
  'section', 'sections', 'widget', 'widgets', 'picture', 'pictures',
  'slider', 'button', 'click', 'below', 'above', 'diagram', 'diagrams',
  'click', 'drag', 'figure', 'figures', 'write', 'writes', 'writing',
  'reader', 'readers', 'first', 'second', 'third', 'finally', 'often',
  'whose', 'where', 'which', 'whose', 'these', 'those', 'everything',
  'something', 'nothing', 'anything', 'always', 'never', 'really',
]);

// Extra bland tokens common across math prose (don't flag on these).
// Stem form (singulars).
const BLAND = new Set([
  'object', 'arrow', 'structure',
  'notion', 'idea', 'concept', 'result', 'setting', 'proper', 'properly',
  'standard', 'natural', 'naturally', 'trivial', 'trivially',
  'useful', 'usefully', 'simple', 'simply',
  // general verbs/prose — these are the common OFFPAGE false positives.
  'carry', 'carrie', 'produc', 'provide', 'exhibit', 'describe', 'illustrate',
  'reflect', 'record', 'package', 'share', 'yield', 'promote', 'combine',
  'connect', 'distinguish', 'expres', 'extend', 'reduce', 'refine',
  'capture', 'recover', 'suffice', 'require', 'satisfy', 'enforce',
  'replace', 'present', 'contain', 'create', 'appear', 'arise', 'treat',
  'work', 'form', 'use', 'used', 'using', 'make', 'makes', 'allow', 'allows',
  'give', 'gives', 'show', 'shows', 'turn', 'turns', 'put', 'puts',
  'exactly', 'roughly', 'essentially', 'basically', 'precisely',
  'class', 'classes', 'pattern', 'patterns', 'visible', 'particular',
  'common', 'general', 'specific', 'unique', 'distinct', 'certain',
  'large', 'larger', 'small', 'smaller', 'finite', 'infinite', 'partial',
  'total', 'complete', 'correct', 'simple', 'rigorous', 'explicit',
  'concrete', 'abstract', 'direct', 'indirect', 'reverse', 'forward',
  'single', 'double', 'pair', 'triple', 'quadruple',
  'versu', 'against', 'along', 'within', 'beside',
  'modern', 'classical', 'recent', 'current', 'historical',
  'important', 'essential', 'major', 'minor', 'basic', 'core', 'central',
  'sketch', 'outline', 'overview', 'introduction', 'preview', 'summary',
  'language', 'framework', 'tool', 'tools', 'perspective', 'viewpoint',
  'component', 'componentwise', 'element', 'elementwise', 'entry', 'item',
  'step', 'steps', 'case', 'cases', 'kind', 'kinds', 'type', 'types',
  'side', 'sides', 'half', 'whole', 'part', 'parts', 'bit', 'piece',
  'above', 'below', 'alongside', 'among',
  'value', 'values', 'input', 'output', 'setting', 'settings',
  'readout', 'control', 'widget', 'slider', 'toggle',
]);

// ─────────────────────────────────────────────────────────────────────────
// Load concept graph.

const indexPath = join(conceptsDir, 'index.json');
const topics = JSON.parse(readFileSync(indexPath, 'utf8')).topics;

const topicData = new Map(); // topic -> parsed JSON

for (const topic of topics) {
  const p = join(conceptsDir, `${topic}.json`);
  if (!existsSync(p)) continue;
  const d = JSON.parse(readFileSync(p, 'utf8'));
  topicData.set(topic, d);
}

// ─────────────────────────────────────────────────────────────────────────
// Section extraction. Same anchor-boundary trick as audit-callbacks.mjs,
// with a conservative prose extractor: drop <script>, <style>, <svg>,
// <aside>, <pre>, <code>, all widget <div>s, KaTeX math spans, and then
// strip remaining tags to leave plaintext.

function escapeRe(s) {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function findSectionBody(html, anchor) {
  const idRe = new RegExp(
    `<([a-zA-Z][a-zA-Z0-9]*)([^>]*\\sid=["']${escapeRe(anchor)}["'][^>]*)>`,
    'i',
  );
  const m = idRe.exec(html);
  if (!m) return null;
  const innerStart = m.index + m[0].length;

  const nextBoundaryRe = /<(?:section|h2|h3|h4)\b[^>]*\sid=["'][^"']+["']/gi;
  nextBoundaryRe.lastIndex = innerStart;
  const nb = nextBoundaryRe.exec(html);

  const nextCloseRe = /<\/section>/gi;
  nextCloseRe.lastIndex = innerStart;
  const nc = nextCloseRe.exec(html);

  let innerEnd;
  if (nb && (!nc || nb.index < nc.index)) innerEnd = nb.index;
  else if (nc) innerEnd = nc.index;
  else innerEnd = html.length;

  return html.slice(innerStart, innerEnd);
}

function stripTag(body, tag) {
  const re = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?</${tag}\\s*>`, 'gi');
  return body.replace(re, ' ');
}

function extractTerms(sectionBody) {
  // Terms that carry extra weight: inside <em>, <strong>, inline <code>,
  // and multi-word Capitalized phrases in plain prose.
  const weighted = []; // lowercased strings

  const grab = (re) => {
    let m;
    while ((m = re.exec(sectionBody))) {
      const txt = m[1].replace(/<[^>]+>/g, ' ').trim();
      if (txt) weighted.push(txt.toLowerCase());
    }
  };

  grab(/<em\b[^>]*>([\s\S]*?)<\/em>/gi);
  grab(/<strong\b[^>]*>([\s\S]*?)<\/strong>/gi);
  grab(/<code\b[^>]*>([\s\S]*?)<\/code>/gi);

  return weighted;
}

function extractProseTokens(sectionBody) {
  // Strip fully-skipped containers.
  let b = sectionBody;
  for (const t of ['script', 'style', 'svg', 'aside', 'pre', 'code']) {
    b = stripTag(b, t);
  }
  // Widget divs. Cheap skip: any <div class="widget" …>…</div> — since
  // <div> nests we use a simple balanced pass.
  {
    const openRe = /<div\b[^>]*\bclass=["'][^"']*\bwidget\b[^"']*["'][^>]*>/gi;
    let out = '';
    let cursor = 0;
    let m;
    while ((m = openRe.exec(b))) {
      out += b.slice(cursor, m.index);
      // balance-scan from m.index
      let depth = 1;
      let i = m.index + m[0].length;
      const divO = /<div\b[^>]*>/gi;
      const divC = /<\/div\s*>/gi;
      divO.lastIndex = i;
      divC.lastIndex = i;
      let end = b.length;
      while (depth > 0) {
        divO.lastIndex = Math.max(divO.lastIndex, divC.lastIndex - 1);
        const o = divO.exec(b);
        const c = divC.exec(b);
        if (!c) break;
        if (o && o.index < c.index) {
          depth++;
          divC.lastIndex = o.index + o[0].length;
        } else {
          depth--;
          if (depth === 0) {
            end = c.index + c[0].length;
            break;
          }
          divO.lastIndex = c.index + c[0].length;
        }
      }
      cursor = end;
      openRe.lastIndex = end;
    }
    out += b.slice(cursor);
    b = out;
  }

  // KaTeX math spans: $$…$$, $…$, \(…\), \[…\].
  b = b.replace(/\$\$[\s\S]*?\$\$/g, ' ');
  b = b.replace(/(^|[^\\])\$[^$\n]*?\$/g, '$1 ');
  b = b.replace(/\\\([\s\S]*?\\\)/g, ' ');
  b = b.replace(/\\\[[\s\S]*?\\\]/g, ' ');

  // Strip remaining tags.
  const text = b.replace(/<[^>]+>/g, ' ');

  return text;
}

// Tokenize: lowercase alphanumeric runs; hyphen-glued words split (treat
// 'cross-reference' as two tokens). Drop short tokens and stop words.
function tokenize(text) {
  const raw = text.toLowerCase().split(/[^a-z0-9]+/);
  const out = [];
  for (const t of raw) {
    if (!t) continue;
    if (t.length < MIN_TOKEN_LEN) continue;
    if (/^\d+$/.test(t)) continue;
    if (STOP.has(t)) continue;
    out.push(t);
  }
  return out;
}

// Loose normalization: kill common English suffixes so "functor"/"functors",
// "scale"/"scaling", "rotate"/"rotation" collapse. Precision > recall is the
// goal, but mismatching rotate/rotation and scheme/schemes was creating
// noisy MATCH/OFFPAGE flags. We apply the most-specific rules first.
function stem(tok) {
  // Plurals first — otherwise "schemes" (→ "schem" via the -es rule) won't
  // collapse to "scheme".
  if (tok.length > 5 && tok.endsWith('ies')) return tok.slice(0, -3) + 'y';
  if (tok.length > 4 && tok.endsWith('ves')) return tok.slice(0, -3) + 'f'; // sheaves → sheaf
  if (tok.length > 6 && tok.endsWith('sses')) return tok.slice(0, -2);
  if (tok.length > 5 && tok.endsWith('s') && !tok.endsWith('ss')) {
    tok = tok.slice(0, -1);
  }
  // Suffixes that change stem shape.
  if (tok.length > 7 && tok.endsWith('ization')) return tok.slice(0, -7);
  if (tok.length > 6 && tok.endsWith('ation')) return tok.slice(0, -5);
  if (tok.length > 6 && tok.endsWith('tion')) return tok.slice(0, -4);
  if (tok.length > 6 && tok.endsWith('sion')) return tok.slice(0, -4);
  if (tok.length > 6 && tok.endsWith('ness')) return tok.slice(0, -4);
  if (tok.length > 6 && tok.endsWith('ment')) return tok.slice(0, -4);
  if (tok.length > 6 && tok.endsWith('ing')) return tok.slice(0, -3);
  if (tok.length > 6 && tok.endsWith('ed')) return tok.slice(0, -2);
  return tok;
}

function toBag(text) {
  const bag = new Map(); // stem -> count
  for (const t of tokenize(text)) {
    const s = stem(t);
    if (BLAND.has(s)) continue;
    bag.set(s, (bag.get(s) || 0) + 1);
  }
  return bag;
}

function normalizeBlurb(blurb) {
  // Strip KaTeX math so $X$ tokens don't leak into token comparisons.
  let b = blurb || '';
  b = b.replace(/\$\$[\s\S]*?\$\$/g, ' ');
  b = b.replace(/(^|[^\\])\$[^$\n]*?\$/g, '$1 ');
  b = b.replace(/\\\([\s\S]*?\\\)/g, ' ');
  b = b.replace(/\\\[[\s\S]*?\\\]/g, ' ');
  return b;
}

// ─────────────────────────────────────────────────────────────────────────
// Build global "technical vocabulary": the set of token stems that appear
// somewhere in concept titles across the notebook. This gives us a cheap
// way to distinguish "real math term" from "prose verb/filler" when
// assessing OFFPAGE. (A blurb using "factor" can only be flagged off-page
// if some other concept title also uses "factor" — i.e. it really is a
// term of art in this corpus.)

const globalVocab = new Set();
for (const [, d] of topicData) {
  for (const c of d.concepts || []) {
    for (const t of tokenize(c.title || '')) {
      const s = stem(t);
      if (!BLAND.has(s)) globalVocab.add(s);
    }
    // Also pull tokens from OTHER concepts' blurbs that appear repeatedly —
    // but titles are the cleanest canonical source, so keep it simple.
  }
}

// Also seed from topic slugs themselves (e.g. "adeles-and-ideles" contributes
// "adele" / "idele").
for (const topic of topicData.keys()) {
  for (const tok of topic.split(/[^a-z0-9]+/i)) {
    if (tok.length >= MIN_TOKEN_LEN) {
      const s = stem(tok.toLowerCase());
      if (!BLAND.has(s)) globalVocab.add(s);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Build duplicate-blurb map up front.

const blurbSeen = new Map(); // normalized blurb -> [{topic,id}]
for (const [topic, d] of topicData) {
  for (const c of d.concepts || []) {
    const key = (c.blurb || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (!key) continue;
    if (!blurbSeen.has(key)) blurbSeen.set(key, []);
    blurbSeen.get(key).push({ topic, id: c.id });
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Main scan.

const flags = []; // { topic, id, title, codes[], detail, excerpt }
const counters = {
  LENGTH: 0,
  MATCH: 0,
  RECALL: 0,
  OFFPAGE: 0,
  DUP: 0,
  SECTION_NOT_FOUND: 0,
};

let totalConcepts = 0;
const pageCache = new Map();

function loadPage(page) {
  if (pageCache.has(page)) return pageCache.get(page);
  const p = join(repoRoot, page);
  if (!existsSync(p)) {
    pageCache.set(page, null);
    return null;
  }
  const html = readFileSync(p, 'utf8');
  pageCache.set(page, html);
  return html;
}

for (const [topic, d] of topicData) {
  const page = d.page || `${topic}.html`;
  const html = loadPage(page);
  if (!html) continue;

  for (const c of d.concepts || []) {
    totalConcepts++;
    const codes = [];
    const notes = [];

    const blurb = (c.blurb || '').trim();
    const titleTokens = toBag(c.title || '');
    const blurbNorm = normalizeBlurb(blurb);
    const blurbBag = toBag(blurbNorm);

    // 1. LENGTH
    if (blurb.length < MIN_BLURB) {
      codes.push('LENGTH');
      notes.push(`blurb is ${blurb.length} chars (< ${MIN_BLURB})`);
    } else if (blurb.length > MAX_BLURB) {
      codes.push('LENGTH');
      notes.push(`blurb is ${blurb.length} chars (> ${MAX_BLURB})`);
    }

    // 5. DUP (can fire regardless of section discoverability)
    const dupKey = blurb.toLowerCase().replace(/\s+/g, ' ');
    const dupList = blurbSeen.get(dupKey) || [];
    if (dupList.length > 1) {
      codes.push('DUP');
      const others = dupList
        .filter((x) => !(x.topic === topic && x.id === c.id))
        .map((x) => `${x.topic}:${x.id}`);
      notes.push(`duplicate blurb shared with ${others.join(', ')}`);
    }

    // Locate section.
    const sectionBody = c.anchor ? findSectionBody(html, c.anchor) : null;
    if (!sectionBody) {
      // Still record size/dup flags but skip term-based ones.
      if (c.anchor) {
        counters.SECTION_NOT_FOUND++;
        notes.push(`section #${c.anchor} not located on ${page}`);
      }
      for (const code of codes) counters[code]++;
      if (codes.length > 0) {
        flags.push({
          topic, id: c.id, title: c.title, codes, notes,
          excerpt: blurb.slice(0, 120),
        });
      }
      continue;
    }

    const weighted = extractTerms(sectionBody);
    const proseText = extractProseTokens(sectionBody);
    const proseBag = toBag(proseText);

    // Add weighted mentions (em/strong/code) with extra weight.
    for (const phrase of weighted) {
      for (const tok of tokenize(phrase)) {
        const s = stem(tok);
        if (BLAND.has(s)) continue;
        proseBag.set(s, (proseBag.get(s) || 0) + 3);
      }
    }

    // If the section is basically empty (no tokens) skip term heuristics.
    if (proseBag.size === 0) {
      for (const code of codes) counters[code]++;
      if (codes.length > 0) {
        flags.push({
          topic, id: c.id, title: c.title, codes, notes,
          excerpt: blurb.slice(0, 120),
        });
      }
      continue;
    }

    // 2. MATCH — if blurb is non-empty and contains none of the section's
    //    vocabulary (and the blurb actually has tokens to test), flag.
    if (blurbBag.size > 0) {
      let overlap = 0;
      for (const k of blurbBag.keys()) if (proseBag.has(k)) overlap++;
      if (overlap === 0) {
        codes.push('MATCH');
        notes.push('blurb shares zero technical terms with section prose');
      }
    }

    // 3. RECALL — top-N most frequent section terms should appear in blurb
    //    OR title. Missing them all is suspicious.
    const topTerms = [...proseBag.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, TOP_SECTION_TERMS)
      .map(([k]) => k);
    let hits = 0;
    const missing = [];
    for (const t of topTerms) {
      if (blurbBag.has(t) || titleTokens.has(t)) hits++;
      else missing.push(t);
    }
    if (topTerms.length >= TOP_SECTION_TERMS && hits < TOP_SECTION_TERMS_NEEDED) {
      codes.push('RECALL');
      notes.push(
        `top section terms not reflected in blurb/title: ${missing.join(', ')}`,
      );
    }

    // 4. OFFPAGE — **technical** terms mentioned in the blurb but absent
    //    from the section. "Technical" means the token stem also appears in
    //    the notebook-wide title vocabulary. This heavily trims prose-verb
    //    false positives ("carry", "produce", …) that are absent from the
    //    section merely because the author phrased it differently.
    const offPage = [];
    for (const k of blurbBag.keys()) {
      if (proseBag.has(k)) continue;
      if (titleTokens.has(k)) continue;
      if (!globalVocab.has(k)) continue; // must be a real term-of-art
      offPage.push(k);
    }
    if (offPage.length >= OFFPAGE_MIN_TECH_TOKENS) {
      codes.push('OFFPAGE');
      notes.push(`blurb-only technical terms: ${offPage.slice(0, 6).join(', ')}`);
    }

    for (const code of codes) counters[code]++;
    if (codes.length > 0) {
      flags.push({
        topic, id: c.id, title: c.title, codes, notes,
        excerpt: blurb.slice(0, 120),
      });
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Report.

const pagesFlagged = new Set(flags.map((f) => f.topic));

console.log(
  `audit-stale-blurbs: ${totalConcepts} concept(s) across ${topicData.size} topic(s)`,
);
console.log(`  flagged concepts: ${flags.length}`);
console.log(`  affected topics:  ${pagesFlagged.size}`);
console.log('');
console.log('Per-heuristic totals:');
for (const k of ['LENGTH', 'MATCH', 'RECALL', 'OFFPAGE', 'DUP']) {
  console.log(`  ${k.padEnd(8)} ${counters[k]}`);
}
if (counters.SECTION_NOT_FOUND > 0) {
  console.log(`  (section-not-found: ${counters.SECTION_NOT_FOUND})`);
}
console.log('');

// Group by topic -> list concepts.
const byTopic = new Map();
for (const f of flags) {
  if (!byTopic.has(f.topic)) byTopic.set(f.topic, []);
  byTopic.get(f.topic).push(f);
}

const topicKeys = [...byTopic.keys()].sort();
for (const topic of topicKeys) {
  const list = byTopic.get(topic);
  console.log(`${topic}  (${list.length} flag${list.length === 1 ? '' : 's'})`);
  for (const f of list) {
    const tag = `[${f.codes.join(',')}]`;
    console.log(`  - ${f.id} ${tag}`);
    console.log(`      title:   ${f.title}`);
    console.log(`      blurb:   ${f.excerpt}${f.excerpt.length >= 120 ? '…' : ''}`);
    if (VERBOSE) {
      for (const n of f.notes) console.log(`      note:    ${n}`);
    } else if (f.notes.length > 0) {
      // Print only the first note for brevity.
      console.log(`      note:    ${f.notes[0]}`);
    }
  }
}

console.log('');
console.log('Advisory — no CI gate. Review flagged blurbs and rewrite where stale.');
process.exit(0);
