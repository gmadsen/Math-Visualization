// Per-section structural stats — single source of truth.
//
// Computes per-section concept counts, intra-section prereq edges, and
// cross-section "out" / "in" edge counts for the whole corpus, plus a
// density metric (cross-out per concept). Section ordering follows
// `concepts/sections.json`.
//
// Used by:
//   - scripts/build-concepts-bundle.mjs (Node, build-time): computes once
//     and embeds the result in `__MVConcepts.sectionStats` so browser
//     consumers don't need to recompute or duplicate the algorithm.
//   - scripts/audit-starter-concepts.mjs (Node): calls directly to
//     populate the `audits/starter-concepts.md` per-section table.
//   - mindmap.html (browser): reads `__MVConcepts.sectionStats` instead
//     of recomputing — that's what eliminates the previous duplicated-
//     algorithm-with-subtle-divergence risk that was flagged in PR review.
//
// Input shape — keep this loose and library-friendly:
//   topics       Object|Map  topicId → { concepts: [{ id, prereqs?: string[] }, ...] }
//   topicSection Object      topicId → sectionTitle
//   sectionOrder string[]    canonical section ordering (output table follows this)
//
// Output:
//   {
//     sectionOrder: string[],
//     stats: { [sectionTitle]: { concepts, intra, crossOut, crossIn, density } }
//   }
//
// Symmetry invariant: total crossOut === total crossIn (every cross-edge
// appears once on each side). The audit script asserts this implicitly
// by reporting both sums.

export function computeSectionStats({ topics, topicSection, sectionOrder }) {
  // Build the concept→topic map once.
  const ownerOf = new Map();
  const topicEntries = topics instanceof Map ? topics : new Map(Object.entries(topics || {}));
  for (const [t, d] of topicEntries) {
    if (!d || !Array.isArray(d.concepts)) continue;
    for (const c of d.concepts) {
      if (c && typeof c.id === 'string') ownerOf.set(c.id, t);
    }
  }

  const stats = Object.create(null);
  for (const sec of sectionOrder) {
    stats[sec] = { concepts: 0, intra: 0, crossOut: 0, crossIn: 0, density: 0 };
  }

  for (const [t, d] of topicEntries) {
    const sec = topicSection[t];
    if (!sec || !stats[sec]) continue;
    if (!d || !Array.isArray(d.concepts)) continue;
    for (const c of d.concepts) {
      stats[sec].concepts++;
      const prereqs = Array.isArray(c.prereqs) ? c.prereqs : [];
      for (const p of prereqs) {
        const pTopic = ownerOf.get(p);
        if (!pTopic) continue;
        const pSec = topicSection[pTopic];
        if (!pSec || !stats[pSec]) continue;
        if (pSec === sec) {
          stats[sec].intra++;
        } else {
          stats[sec].crossOut++;
          stats[pSec].crossIn++;
        }
      }
    }
  }

  for (const sec of sectionOrder) {
    const r = stats[sec];
    r.density = r.concepts > 0 ? r.crossOut / r.concepts : 0;
  }

  return { sectionOrder: [...sectionOrder], stats };
}

// Convenience: derive `topicSection` from `concepts/sections.json`'s shape
// so callers can do
//
//   const { stats } = computeSectionStats({
//     topics, sectionOrder, topicSection: topicSectionFromSectionsJson(sectionsJson)
//   });
//
// without rebuilding the lookup map themselves.
export function topicSectionFromSectionsJson(sectionsJson) {
  const out = Object.create(null);
  if (!sectionsJson || !Array.isArray(sectionsJson.sections)) return out;
  for (const s of sectionsJson.sections) {
    if (!s || !Array.isArray(s.topics)) continue;
    for (const t of s.topics) out[t] = s.title;
  }
  return out;
}
