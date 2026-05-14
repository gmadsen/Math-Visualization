# differential-geometry — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** smooth-manifolds, riemannian-geometry

## Summary
The page is overall strong: rich worked widgets through §§1–8 (curves, surfaces, Gauss map, curvature heatmap, defect, geodesics, Gauss–Bonnet, polyhedra, holonomy), tone matches the canonical conversational-but-precise voice, and the helper block + widget chrome are clean. Drift concentrates in the abstract sections §§9–10, which are widget-free and reuse symbols differently from the section peers, plus a handful of minor cosmetic notation differences.

## Findings

### Notation drift
- **`R` overloaded as both Riemann tensor and scalar curvature** (semantic drift, high priority). §10 writes the Riemann tensor as `R^l_{ijk}` and `R_{ijkl}`, then later defines scalar curvature as `R = g^{ij}\mathrm{Ric}_{ij}`. `riemannian-geometry.html` §5/§9 deliberately uses `S` for scalar curvature precisely to avoid this collision. A reader landing on differential-geometry §10 sees both `R(X,Y)Z`, `R^l_{ijk}`, and `R = g^{ij}\mathrm{Ric}_{ij}` within ten lines.
- `R^l_{ijk}` (lowercase l) in differential-geometry §10 vs `R^\ell_{ijk}` (script ell) in riemannian-geometry §5. Cosmetic.
- `\mathrm{Ric}` in differential-geometry §10 vs `\operatorname{Ric}` in riemannian-geometry §5/§9. Both render similarly; pick one.
- `\mathrm{id}` (differential-geometry §8 recap and §5 "shape operator equals (1/R)·id") vs `\operatorname{id}` in smooth-manifolds §5. Cosmetic.
- Tensor product notation: differential-geometry §10 writes `g = g_{ij}(x)\,dx^i\,dx^j` (juxtaposition); riemannian-geometry §2 writes `g = g_{ij}\, dx^i\otimes dx^j` (explicit `\otimes`). Cosmetic, but two different conventions for the same formula appear in adjacent pages.
- Bold-vs-non-bold for embedded vector quantities. Differential-geometry §3–§5 uses `\mathbf{x}` for the parametrization and `\mathbf{n}` for the unit normal; smooth-manifolds and riemannian-geometry don't use bold for vectors at all. Defensible because the surface story is in `\mathbb{R}^3` so distinguishing 3-vectors helps, but be aware it's local to this page.
- Sectional curvature formula: differential-geometry §10 gives `K(\sigma) = g(R(u,v)v, u)` (no denominator), assuming orthonormal `u,v`. Riemannian-geometry §5 gives the general `K(\Pi) = g(R(u,v)v,u) / (g(u,u)g(v,v) - g(u,v)^2)`. Both correct; the target's compressed form is fine in context but a reader cross-referencing will momentarily wonder.
- En-dash vs hyphen inconsistency for compound names within differential-geometry itself: "Gauss–Bonnet" in headings and most prose, but "Gauss-Bonnet" (ASCII hyphen) appears in §10 and the §11 recap. "Levi-Civita" is ASCII-hyphenated; riemannian-geometry uses ASCII "Levi-Civita" too — consistent across pages but worth picking one form per name. "Atiyah-Singer" (target §11) vs "Atiyah&ndash;Singer" (riemannian-geometry §11) — same name, two renderings.

### Undefined jargon
- "Levi-Civita connection" first appears in §8: "This is the **holonomy** of the Levi-Civita connection; on a flat surface it would be zero…". The connection is not defined until §10. There is no callback or forward-pointer; the term is dropped in passing two sections early.
- "Christoffel symbols" appear in the Brioschi paragraph in §6 ("via the Christoffel symbols $\Gamma^k_{ij}$ (which themselves only depend on $I$)"), but the symbols are not defined until §7's geodesic-equation note. A one-line forward-pointer ("see §7") would close the gap.
- "developable" introduced in passing in §4 ("this is why cylinders are *developable* surfaces") without a definition; the term means "has a flat first fundamental form" but the reader has to infer this from the surrounding sentence.
- "Riemann curvature tensor" mentioned in §6 ("$K = R_{1212}/(EG - F^2)$, where $R_{ijkl}$ is the Riemann curvature tensor built from $\Gamma$") but the tensor isn't actually defined until §10. Same forward-reference structure as Christoffels.
- "Mercator … (conformal)" in §6 — "conformal" is used as an explanatory parenthetical without a definition. Likely OK for the assumed audience, but worth flagging.

### Tone mismatches
- Tone is consistently good across §§1–8 — narrative ("to his own astonishment", "Curvature is the throughline", "An ant walking in a 'straight line'…"), worked widgets, intuition-first. This matches category-theory.html and the two reference pages well.
- §9 ("Abstract smooth manifolds") drifts into pure-textbook mode: definition, list, list, list of examples, two-sentence Whitney aside, end of section. No worked example, no widget, no narrative hook. Smooth-manifolds.html spends 11 sections doing this material with widgets every step; here it's compressed into half a page that reads like a reminder rather than an introduction.
- §10 ("Riemannian manifolds") similarly drops into textbook voice: stack of definitions (metric, Levi-Civita, Riemann, sectional, Ricci, scalar) with no toy. Riemannian-geometry.html unpacks each of these across its own dedicated section with a widget. The target page's §10 is essentially "here are the formulas; see riemannian-geometry for the story" without saying so.

### Missing worked examples
- §9 (Abstract smooth manifolds) — no widget, no concrete computation. The closest the section gets is the sentence "$S^7$ has exotic smooth structures (Milnor, 1956)". Even a tiny diagram (e.g., one stereographic chart pair on $S^2$, à la smooth-manifolds §1's `w-charts`) would justify the section's existence on this page rather than punting to smooth-manifolds.
- §10 (Riemannian manifolds) — no widget, no worked example. A reader who hasn't read riemannian-geometry.html sees a wall of formulas (metric, Christoffels, Riemann, Ricci, scalar) in three paragraphs. Even a minimal "compute $\Gamma^k_{ij}$ for the round sphere" pinned-out example, or a callback aside pointing to riemannian-geometry's geodesic-shooter / metric-visualizer / sectional-curvature widgets, would make the section pull its weight.
- §11 (Coda) — fine that it's prose-only, but the running list of "future notebook page: <slug>.html" markers (`lie-groups.html`, `symplectic.html`, `complex-geometry.html`) are stale: `lie-groups.html` now exists, and the others are roadmap items. Not a worked-example issue, just stale forward links worth a sweep.

### KaTeX macros / formatting
- No new macros are introduced locally; the macro block is the canonical `\Spec, \Gal, \Hom, \tr, \ad, \ind` set, identical to category-theory.html, smooth-manifolds.html, and riemannian-geometry.html. Good.
- Delimiters: `$…$` and `$$…$$` only; no invented delimiters. Good.
- `\mathrm{sech}\,u` in §3's parametrization table — non-standard operator (KaTeX has no `\sech`), but `\mathrm{sech}` is the conventional workaround and renders cleanly.
- A handful of display equations are wrapped in `<p style="text-align:center">$…$</p>` rather than `$$…$$`. Functionally equivalent and used throughout the target (e.g., §1, §3, §5, §10), but the canonical pattern in category-theory.html and the reference pages is `$$…$$`. Cosmetic; all three pages do this occasionally so it isn't strictly a target-only drift.
- `\dddot\gamma` in §1 is standard LaTeX and supported by KaTeX; no issue.
- Helper block (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`, plus 3D extras `vsub`/`vadd`/`vscl`/`vdot`/`vlen`/`vnorm`/`vcross`/`proj3`/`curvColor`/`make3DDraggable`) is the canonical 2D+3D pair, byte-equivalent to the helper this page is documented in `AGENTS.md` as the source of. No deviations.
- Widget chrome: every widget uses `.widget / .hd / .ttl / .hint / .readout / .row / .note / .ok / .bad` correctly. One minor table-class drift: target uses `<table class="simple">` for its surface-parametrization tables in §3, where smooth-manifolds.html and riemannian-geometry.html use `<table class="plain">` for analogous tables. The `.simple` class is defined in this page's `<style>` block, so it works, but consolidating on `.plain` would remove a per-page class.

## Severity
minor polish

---
*Orchestrator note: run `node scripts/rebuild.mjs` after any content edits.*
