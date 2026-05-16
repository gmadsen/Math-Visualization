# topological-data-analysis.html — math correctness audit

## Verified claims (sections)

- **§1 Filtrations.** Čech complex condition (common-intersection of ε-balls) and Vietoris–Rips condition (`diam(σ) ≤ 2ε`) are stated correctly. The sandwich `Č_ε ⊆ VR_ε ⊆ Č_{√2 ε}` is correct in Euclidean space (Jung's theorem: a diameter-2ε set in R^d has enclosing ball of radius ≤ √2·ε for d≥2; the constant is sharp only in the limit but √2 is the standard quoted bound). Nerve theorem invocation is appropriate.
- **§2 Simplicial homology.** Boundary formula `∂[v_0,…,v_n] = Σ(−1)^i [v_0,…,v̂_i,…,v_n]`, the identity `∂² = 0`, and `H_n = ker∂_n / im∂_{n+1}` are textbook-correct. F_2 coefficients trivialise sign, correct.
- **§3 Persistence.** Persistence module as an N-indexed sequence of vector spaces with linear maps, persistent homology `H_k^{i,j} = im(H_k(K_i) → H_k(K_j))`, birth/death definitions, and the persistence diagram as multiset on `{b<d}` ∪ diagonal — all standard and correctly stated. CSEH 2007 attribution correct.
- **§4 Stability.** Bottleneck distance definition (partial matching with unmatched points to nearest diagonal point, L^∞ cost) is standard. Stability theorem `W_∞(Dgm(f),Dgm(g)) ≤ ‖f−g‖_∞` for tame functions (CSEH 2007) correct. Hausdorff ⇒ bottleneck for Rips (Chazal–de Silva–Oudot) correct. Algebraic stability via ε-interleaving correct in spirit.
- **§5 Structure theorem.** Interval-module decomposition for pointwise-finite persistence modules over R — Crawley-Boevey 2015 attribution correct; Zomorodian–Carlsson 2005 covers the finitely-presented graded k[t] case, also correct. The PID argument over k[t] is the right algebraic backbone. Multi-parameter "no analogous structure theorem" / "wild" is correct.
- **§6 Mapper.** Algorithm correctly described: filter, cover with overlap, cluster preimages, edges from shared points (nerve of clustered cover). Singh–Mémoli–Carlsson 2007 attribution correct. Caveat that Mapper output depends on filter+cover correct.
- **§7 Cohomology / zigzag.** `H^k ≅ H_k^*` over a field for finite K (so same bars) correct. Circular coordinates from 1-cocycles via S^1-lift correct. Zigzag persistence attribution to Carlsson–de Silva 2010 correct; A_n-quiver / Gabriel correct. Multi-parameter wildness correct. Reeb graph / merge-tree relation correct.

## Wrong / dubious claims (with file:line)

- **L:849** — "Nicolau–Levine–Carlsson type-II diabetes paper, 2011" is wrong. The 2011 NLC PNAS paper is on **breast cancer** ("Topology based data analysis identifies a subgroup of breast cancers with a unique mutational profile and excellent survival"). The diabetes-subtypes Mapper paper is Li et al. 2015 (Sci Transl Med). Misattribution of subject matter.
- **L:342–345** — Code comment justifies dropping β_2 with "no 2-sphere can be triangulated by 2D vertices". This is **mathematically wrong reasoning**: the VR complex is an *abstract* simplicial complex; the ambient dimension of the points imposes no restriction on its Betti numbers (e.g. 6 points placed at octahedron-like distances in R^2 can yield β_2 > 0 in VR_ε at appropriate ε). The numerical clamp `max(0, …)` happens to mask this on the specific datasets used, but the explanatory comment is incorrect.
- **L:1005** — "Ripser (Bauer 2019)". Ripser was released c. 2015–2016; the canonical paper "Ripser: efficient computation of Vietoris–Rips persistence barcodes" is **2021** (J. Appl. Comput. Topol.). 2019 is neither the release nor the publication year. Minor citation slip.

## Underspecified or unverifiable claims

- **L:704** — Bottleneck `inf_γ sup_p ‖p − γ(p)‖_∞` is technically the correct formula but skips the convention that `‖·‖_∞` here is the L^∞ on R^2 of (birth, death) coordinates and that diagonal-matching cost uses the perpendicular distance `(d−b)/2` projected to L^∞. Reader has to import the convention.
- **L:764** — "Chazal–de Silva–Glisse–Oudot 2009" for algebraic stability: the 2009 *proximity* paper is Chazal–Cohen-Steiner–Glisse–Guibas–Oudot; the cleaner CdSGO algebraic-stability statement appears in the 2016 *Structure and Stability of Persistence Modules* monograph (with a 2012/2013 arXiv preprint). The attribution conflates two papers; close enough to be defensible, not airtight.
- **L:988** — "Persistent cohomology is also strictly faster in practice" is an empirical claim from dSMVJ 2011 and remains true on standard benchmarks; "strictly" overstates what was proved (constant-factor speedup, dataset-dependent).
- **Absent from page** (in scope per prompt but not covered, so unverifiable here): alpha complexes; Klein bottle worked example; cubic-in-#simplices complexity bound for the standard reduction algorithm; discrete Morse theory connection (Forman / Mischaikow–Nanda); Mayer–Vietoris-style decompositions; statistical inference / confidence sets for persistence (Fasy et al. 2014). Page mentions Alpha complexes only in a software-list bullet (L:1006).

## Severity

**Minor.** All core mathematical statements (definitions, stability, structure theorem, Mapper algorithm, cohomology duality) are correct. Two factual slips: (a) misattributed Nicolau–Levine–Carlsson application domain (breast cancer, not diabetes), and (b) a wrong-reasoning code comment about VR β_2 in R^2 that doesn't affect output but mis-teaches if read. One citation-year drift on Ripser. No claim is mathematically harmful to a learner.
