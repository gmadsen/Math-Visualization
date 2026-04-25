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
// Consumes the shared content model (scripts/lib/content-model.mjs): concept
// loading, HTML parsing, and section-element resolution are done once by the
// loader. Section prose is extracted via `forEachSectionProse`, which yields
// only prose TextNodes (widgets/scripts/styles/code/pre/aside/headings/<a>
// subtrees and `.katex`/`.widget` elements are skipped) and exposes each
// fragment's `masked` text — same bytes as the source, but KaTeX math spans
// ($…$, $$…$$, \(…\), \[…\]) are replaced with spaces so math tokens don't
// leak into the bag-of-words.

import { loadContentModel, forEachSectionProse } from './lib/content-model.mjs';

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
// Load the shared content model.

const model = await loadContentModel();
const { topicIds, topics, concepts } = model;

// Registered-topic iteration order: whatever index.json listed, filtered
// to topics we actually have a content record for.
const registeredTopics = topicIds.filter((t) => topics.has(t));

// ─────────────────────────────────────────────────────────────────────────
// Section prose extraction.

/**
 * Concatenate every prose TextNode under `sectionEl`, using each node's
 * `masked` view so $…$ / $$…$$ / \(…\) / \[…\] regions are blanked out.
 *
 * `forEachSectionProse` already skips <script>/<style>/<svg>/<code>/<pre>/
 * <aside>/<h1>-<h6>/<a> subtrees and elements with class `widget` or `katex`.
 * Joining with a single space keeps adjacent fragments from fusing into a
 * single token when the walker returns them separately.
 */
function collectSectionProse(sectionEl) {
  if (!sectionEl) return '';
  const parts = [];
  forEachSectionProse(sectionEl, (_n, { masked }) => {
    parts.push(masked);
  });
  return parts.join(' ');
}

/**
 * Harvest text inside <em>, <strong>, and <code> within the raw section
 * HTML. These phrases contribute weighted counts to the section bag (and
 * <code> text would otherwise be skipped entirely, since the prose walker
 * excludes <code> subtrees). Returns lowercased strings.
 */
function extractTerms(sectionHtml) {
  const weighted = [];

  const grab = (re) => {
    let m;
    while ((m = re.exec(sectionHtml))) {
      const txt = m[1].replace(/<[^>]+>/g, ' ').trim();
      if (txt) weighted.push(txt.toLowerCase());
    }
  };

  grab(/<em\b[^>]*>([\s\S]*?)<\/em>/gi);
  grab(/<strong\b[^>]*>([\s\S]*?)<\/strong>/gi);
  grab(/<code\b[^>]*>([\s\S]*?)<\/code>/gi);

  return weighted;
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
for (const topic of registeredTopics) {
  for (const cid of topics.get(topic).conceptIds) {
    const c = concepts.get(cid);
    if (!c) continue;
    for (const t of tokenize(c.title || '')) {
      const s = stem(t);
      if (!BLAND.has(s)) globalVocab.add(s);
    }
  }
}

// Also seed from topic slugs themselves (e.g. "adeles-and-ideles" contributes
// "adele" / "idele").
for (const topic of registeredTopics) {
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
for (const topic of registeredTopics) {
  for (const cid of topics.get(topic).conceptIds) {
    const c = concepts.get(cid);
    if (!c) continue;
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

for (const topic of registeredTopics) {
  const topicEntry = topics.get(topic);
  const page = topicEntry.page;
  // Null `html` means the topic's HTML page couldn't be loaded. Mirror the
  // original "loadPage returned null" branch: skip the whole topic.
  if (!topicEntry.html) continue;

  for (const cid of topicEntry.conceptIds) {
    const c = concepts.get(cid);
    if (!c) continue;
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

    // Locate section (pre-parsed via loadContentModel).
    const sectionEl = c.anchor ? c.section : null;
    if (!sectionEl) {
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

    const sectionHtml = sectionEl.innerHTML || '';
    const weighted = extractTerms(sectionHtml);
    const proseText = collectSectionProse(sectionEl);
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
  `audit-stale-blurbs: ${totalConcepts} concept(s) across ${registeredTopics.length} topic(s)`,
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
