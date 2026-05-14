# etale-cohomology — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** sheaf-cohomology, etale-fundamental-group

## Summary
`etale-cohomology.html` is one of the strongest pages in the section — every numbered section ships a worked widget, the voice is brisk and well-narrated, and the helper block / widget chrome are byte-clean copies of the canonical templates. The drift is concentrated in two places: a semantic notation split with `etale-fundamental-group.html` over how to write `π_1^ét`, and a cluster of dense terms in §§4–5 (Witt vectors, period rings, Brauer-kernel pathology, Sato–Tate, motivic) that arrive without callback links or glossary leads.

## Findings

### Notation drift
- **Semantic — `π_1^ét` glyph drift across sibling pages.** `etale-cohomology.html` writes `\pi_1^{\text{ét}}(X,\bar x)` in its only mention of the étale fundamental group (line 282 in the §1 note: *"the **étale fundamental group** $\pi_1^{\text{ét}}(X,\bar x)$ classifies finite étale covers"*). The dedicated reference page `etale-fundamental-group.html` uses `\pi_1^{\acute{e}t}(X, \bar{x})` everywhere (e.g. line 482 *"$\pi_1^{\acute{e}t}(X, \bar{x}) \;:=\; \mathrm{Aut}(F_{\bar{x}})$"*, line 559, 626 sidetoc anchors). Both render but produce visibly different superscripts; a reader following the callback from the §1 note will see two different glyphs for the same object across the two tabs. The sheaf-cohomology audit already recommended `\text{ét}`; the target is on the right side of that decision, so the fix belongs on `etale-fundamental-group.html` rather than here. Flagged as **semantic** because it's the same mathematical object getting two notations.
- **Cosmetic — `\mathrm{Tr}` vs `\operatorname{Tr}` mixed in target.** Target line 471 *"$(\Gamma_f\cdot\Delta)_{X\times X} \;=\; \sum_{i=0}^{2\dim X}(-1)^i\,\mathrm{Tr}\!\big(\dots\big)$"* and line 475 use `\mathrm{Tr}`, while line 688 uses `\operatorname{Tr}` (*"$\exp(-\operatorname{Tr}\log(1-tA))$"*) and line 696 uses `\operatorname{Frob}_q`. Both render acceptably, but the page-internal mix suggests the macro list (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind` — line 37–43) could grow a `\Tr` and `\Frob` entry to make the choice uniform across the étale arc. Sheaf-cohomology does not use `Tr`; etale-fundamental-group writes `\mathrm{Frob}_q` (line 637), so adopting `\operatorname{…}` here would also normalize across siblings.
- **Cosmetic — `\bar x` vs `\bar{x}` brace style.** Target line 282 writes `\pi_1^{\text{ét}}(X,\bar x)`; `etale-fundamental-group.html` line 482 writes `\pi_1^{\acute{e}t}(X, \bar{x})`. KaTeX renders both identically; flagged for source-readability uniformity only.
- **Cosmetic — Unicode in SVG text strings.** Inline SVG text uses `𝔾ₘ` (line 259–260), `μ_n` (line 276), `ℙ²` / `ℙⁿ` (line 382, 522, 583, etc.), `𝐅̄_p` / `𝔽_q` / `𝐐̄` (line 522, 957–973), `ℤ/`, `ℤ_ℓ` (line 430, 434). This matches the convention in `sheaf-cohomology.html` widget data (`H⁰(ℤ) = ℤ` LES stepper) and is not a defect, just a consistent choice — flagged so a future macro pass treats SVG glyph strings as a separate channel from KaTeX prose.

### Undefined jargon
- **"Grothendieck site" used without a forward link.** §1 note line 282: *"Étale morphisms $U\to X$ with jointly-surjective families as covers form a Grothendieck **site**; sheaves on it are the primary objects."* The word "site" is not defined on the page and the cross-page callback in §1 (lines 309–317) lists *"Presheaves and sheaf condition"* but not the dedicated `grothendieck-topologies-sites.html` page. The reverse-direction "Used in" backlink on line 326 actually does point there, but a forward `<a>` link inside the note would cost nothing.
- **"Witt vectors $W(k)$" introduced cold in §5.** Line 933: *"$H^i_{\text{cris}}(X/W)$ is a module over the Witt vectors $W(k)$ with a semi-linear Frobenius."* No prior gloss, no callback. The widget readout (line 967, 973) then uses `H^i_cris(X/W(𝐅̄_p)) ⊗ ℚ` and `H^i_cris(X_k/W(k)) ⊗ K_0` — `K_0` is the fraction field of $W(k)$ but never spelled out. A one-clause parenthetical (e.g. *"the unique char-0 lift of $k$ to a complete DVR"*) or a callback to a future `crystalline-cohomology.html` would help.
- **"Period rings $B_{\text{dR}}, B_{\text{cris}}, B_{\text{st}}$" listed without unpacking.** §5 line 933: *"a family of period rings $B_{\text{dR}}, B_{\text{cris}}, B_{\text{st}}$ that relate $H^i_{\text{ét}}(X_{\bar K},\mathbb{Q}_p)$ to $H^i_{\text{dR}}(X/K)$ and $H^i_{\text{cris}}$"*. Three undefined ring symbols on first appearance, plus an unexplained subscript convention. This is intentionally a coda-flavoured paragraph, but compare `etale-fundamental-group.html`'s §6 "What goes wrong in characteristic $p$" (line 685) which names Artin–Schreier and immediately gives the equation `y^p − y = f` — the target's analogous breadth-first sweep here doesn't pause to anchor any of the three rings.
- **"Sato–Tate" first appears mid-paragraph at line 765.** *"for a non-CM elliptic curve, Sato–Tate predicts $\tfrac2\pi\sin^2\theta\,d\theta$."* This is the first mention; the §4 widget then plots the histogram against the same curve. The page has no forward callback to `sato-tate.html` (which exists per the audits/ directory listing). A `<a href="./sato-tate.html#…">` here would close the loop.
- **"Cycle class map" mentioned and dropped (§2 line 347).** *"the expected formalism: Künneth, Poincaré duality, a Lefschetz trace formula, a cycle class map."* The first three are invoked elsewhere on the page; the cycle class map is name-dropped only here. Acceptable for an "advanced/capstone" page, but worth a parenthetical.
- **"Picard rank" used in the §2 sanity check (line 408) without prior gloss.** *"matching the classical Picard rank (27 lines, rank 7)."* `Pic` is not even defined on this page; the closest reference is `sheaf-cohomology.html` §8 (`H^1(X, \mathcal{O}_X^\times)`), but no callback bridges the two.
- **"Frobenius-kernel pathology" line 347.** *"$H^i_{\text{ét}}(X,\mathbb{Z}/p^n)$ sees Frobenius-kernel pathology and is handled by crystalline cohomology instead."* Evocative but undefined; a reader without commutative-group-scheme background will not know what the "kernel" is. One sentence (e.g. *"the kernel of $F$ on $\mu_p$ is a non-reduced group scheme that the étale topology cannot detect"*) would land it.
- **§5 "Hodge theory refines the singular side with the $(p,q)$-decomposition."** Line 931. `(p,q)` Hodge type appears once with no gloss; reasonable for an advanced page, flagged as a minor.

### Tone mismatches
- **§1–§4 voice is exactly on-brand** — *"The warning bell in char $p$ is Frobenius"* (line 234), *"Out falls the identity driving the Weil conjectures"* (line 477), *"Three striking consequences are the **Weil conjectures**, proved by a team spanning Dwork, Grothendieck, and Deligne"* (line 692). Brisk, conversational, anchors big results in concrete moves. Matches `category-theory.html` voice and `sheaf-cohomology.html`'s rhythm.
- **§5 "Motivic shadow" note (line 994) is dense.** *"The fact that $\ell$-adic Betti numbers are the same integer $b_i$ for every $\ell$, that this integer also equals $\dim_{\mathbb{C}}H^i_{\text{dR}}$ and $\dim_{\mathbb{Q}}H^i_{\text{sing}}$, and that Frobenius eigenvalues and their characteristic polynomials are also $\ell$-independent, is evidence for a conjectural *motivic* cohomology sitting above all these Weil cohomologies — one realization functor for each."* One 60-word sentence packing four claims; a reader who hasn't met "realization functor" before stalls. Compare the comparable closing-thought beats in `sheaf-cohomology.html` §10 *"Coda: toward étale cohomology"* (multiple short paragraphs, each one idea) and `etale-fundamental-group.html` §7 *"Connections"* (one h3 per bridge). Minor — three sentences would absorb the same content with more breathing room.
- **§3 paragraph at line 542 is a wall of formulas-without-narration.** *"On $\mathbb{P}^n$ every odd cohomology vanishes and $F_q$ acts as $q^i$ on $H^{2i}$, so $\#\mathbb{P}^n(\mathbb{F}_{q^m}) = 1+q^m+q^{2m}+\dots+q^{nm}$. On a curve of genus $g$ the formula collapses to $\#X(\mathbb{F}_{q^m}) = 1+q^m - \sum_j(\alpha_j^m+\bar\alpha_j^m)$, and the Weil bound $|\,\#X(\mathbb{F}_q)-(q+1)\,|\le 2g\sqrt q$ is immediate from $|\alpha_j|=\sqrt q$."* Three results in one paragraph, no inter-sentence connective tissue. The follow-up §3 widget (`w-lef2`) does illustrate, but a one-clause "and that's why curves over finite fields are tractable" landing line would help a reader who's still digesting the trace formula.
- **§5 widget readout terseness.** Line 967 reads *"No topology available. ℓ-adic and crystalline are the two Weil cohomologies; both have Frobenius, and their char-polys agree."* Solid prose for a widget readout, no complaint here — flagged so the contrast with the §5 prose's *"Motivic shadow"* density is visible.

### Missing worked examples
- _None._ Every numbered `<h2>` (§1–§5) has at least one widget, several have two:
  - §1 Étale morphisms — `w-etale` (Kummer cover slider) + `w-jac` (Jacobian unit test)
  - §2 ℓ-adic cohomology — `w-ladic` (Betti table) + `w-tower` (inverse-limit sampler)
  - §3 Lefschetz fixed-point — `w-lef` (trace formula sanity check) + `w-lef2` (Betti → Lefschetz point count, with brute-force comparison)
  - §4 Weil conjectures — `w-weil` (zeta-function factoring for $E/\mathbb{F}_q$) + `w-stcircle` (Frobenius eigenvalue sweep + Sato–Tate histogram)
  - §5 Comparison theorems — `w-cmp` (cohomologies-line-up picker)
- The `w-lef2` widget is genuinely strong — it puts Betti numbers, schematic Frobenius eigenvalues, and brute-force point counts side-by-side with a `match? ✓` check. Worth highlighting as an exemplar for other pages.

### KaTeX macros / formatting
- **No locally-defined macros beyond the canonical `\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`** (lines 37–43, byte-identical to `category-theory.html` and the two references). Clean.
- **No re-invented delimiters** beyond `$…$`, `$$…$$`, `\(…\)`, `\[…\]`. Clean.
- **`<select>` with KaTeX-flavoured `<option>` labels is wired correctly.** Many `<option>` elements carry `$\mathbb{P}^n$`, `$E\times E$`, `$\overline{\mathbb{F}_p}$`, `$y^2+y=x^3$ over $\mathbb{F}_2$ ($a_q = 0$)` etc. (lines 357–362, 486–488, 551–558, 705–710, 941–947). The page loads `./js/katex-select.js` at line 23, so the dropdown popovers will render KaTeX rather than leaking literal `$` to the OS popup. **No `wire-katex-select --fix` action needed.**
- **Promotion candidate.** If a future macro pass adds `\Tr` → `\operatorname{Tr}` and `\Frob` → `\operatorname{Frob}` to the page-`<head>` macro list, lines 471/475 (`\mathrm{Tr}`) and the `\operatorname{Tr}` / `\operatorname{Frob}` mentions could share a single source spelling. Cosmetic.

## Helper-block / widget-chrome hygiene
- **2D helper block (lines 156–205) is a byte-clean copy** of the canonical block in `category-theory.html` lines 157–204: same `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow(svg, p1, p2, opts)` with `pad1/pad2/curve/label/labelSide/markerId/dash/width` knobs, `drawNode(svg, x, y, label, opts)` with `r/fill/stroke/textColor/fontSize`. No deviations.
- **No 3D helper block** (target has no rotatable surfaces; correctly omitted, like `sheaf-cohomology.html`).
- **Widget chrome is uniform** across all eight widgets: every one is `<div class="widget" id="…">` with `<div class="hd"><div class="ttl">…</div><div class="hint">…</div></div>`, then `.row` for controls, `.readout` for the live status string, plus the standard `.note` / `.ok` / `.bad` callout boxes in surrounding prose. No ad-hoc classes spotted. The `.small` helper is used consistently for slider value displays. Matches `sheaf-cohomology.html` and `etale-fundamental-group.html` exactly.
- **SVG `<title>` elements are present** on every interactive `<svg>` (lines 249, 373, 420, 566, 717, 784, 949). Good for a11y; no `audit-accessibility --fix` pass would find anything to add here.
- **Quiz placeholders** are correctly `<div class="quiz" data-concept="…"></div>` at the end of each section, matching the `concepts/etale-cohomology.json` ids (`etale-morphism`, `l-adic-cohomology`, `lefschetz-fixed-point`, `weil-frobenius-trace`, `comparison-theorems-etale` — verified by grepping the page).
- **`MVQuiz.init('etale-cohomology')` footer present** (lines 1017–1023), matching the canonical pattern in `category-theory.html`.
- **Top-nav backlink, sidetoc scaffold, breadcrumb / lineage mounts, callback / backlink fences** all present and correctly fenced. Re-running `audit-callbacks.mjs` and `inject-used-in-backlinks.mjs` would be no-ops.

## Section grade summary
| section | status |
|---|---|
| 1. Étale morphisms | ok (w-etale + w-jac; minor "Grothendieck site" undefined-term flag) |
| 2. ℓ-adic cohomology | ok (w-ladic + w-tower; "Frobenius-kernel pathology" + "Picard rank" undefined-term flags) |
| 3. Grothendieck–Lefschetz | ok (w-lef + w-lef2 — exemplary brute-force-comparison widget; one wall-of-formulas paragraph at line 542) |
| 4. Weil conjectures | ok (w-weil + w-stcircle; Sato–Tate undefined on first mention, no callback link) |
| 5. Comparison theorems | drift (w-cmp present; Witt vectors / $K_0$ / $B_{\text{dR}}, B_{\text{cris}}, B_{\text{st}}$ all introduced cold, "Motivic shadow" note dense) |

## Severity
minor polish

---

_The orchestrator runs `node scripts/rebuild.mjs` after any content changes._
