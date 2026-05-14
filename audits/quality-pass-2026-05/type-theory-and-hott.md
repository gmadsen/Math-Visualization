# type-theory-and-hott — pedagogical audit (2026-05)

**Section:** Logic & Foundations
**Compared against:** first-order-logic-and-completeness, naive-set-theory

## Summary
The page is in solid shape — voice, widget chrome, helper block, and section pacing all match the section peers, and every numbered section has a working interactive. Two pedagogical gaps stand out: a handful of homotopy-flavored terms (equivalence `≃`, $\pi_1$, $\Omega$, Kan complex / fibration / fibrant) appear without a one-line gloss, and the projection and identity macros use a sans-serif convention that diverges from peers' `\mathrm{…}` style.

## Findings
### Notation drift
- Target uses `\mathsf{Id}, \mathsf{refl}, \mathsf{ap}, \mathsf{type}, \mathsf{ctx}, \mathsf{base}, \mathsf{loop}, \mathsf{succ}, \mathsf{idtoeqv}, \mathsf{ua}, \mathsf{seg}, \mathsf{merid}` for operator-like names; both peers settle on `\mathrm{…}` (FOL: `\mathrm{Th}(\mathbb{N})`, `\mathrm{Var}`, `\mathrm{ar}`; naive: `\mathbf{1}_S`, `\Hom`). Defensible — the HoTT Book is a sans-serif tradition — but worth a one-line note in the page or a `\mathsf` macro block in the head if you want to standardise. Cosmetic.
- `\mathrm{pr}_1, \mathrm{pr}_2` (Section 2 Π/Σ table) are `\mathrm` while the surrounding HoTT vocabulary is `\mathsf`. Pick one and live there. Cosmetic.
- Target hero uses `'derivation of a typing judgment'` with straight ASCII single quotes; peers use curly typographic quotes mid-prose ("From there flow compactness…") but ASCII inside readouts. The target has straight quotes throughout body prose (`'mathematics is the study of what's in collections'`, `'in context $\Gamma$, …'`). Minor — peers are more consistent with curly punctuation outside the readouts.
- Target Section 6 readout writes `Id_{Id_A}(p, q)` as plaintext (no LaTeX), which is consistent with how peers handle SVG-text math; not a drift, just confirming the approach matches.

### Undefined jargon
- Section 4 (univalence) — `\simeq` is used in the central statement (`\mathsf{idtoeqv}: (A=B) \to (A\simeq B)`) without a one-line gloss for what "equivalence" means in HoTT. The reader who comes in cold will read it as "isomorphism", which is *almost* right but not the homotopy-coherent notion the rest of the page leans on. Quoting the offending sentence: *"For any two types $A,B$ in a universe $\mathcal{U}$, there is a canonical map $\mathsf{idtoeqv}: (A=B) \to (A\simeq B)$"* — add a half-sentence parenthetical "(an equivalence is a map with a contractible space of inverses; for sets it's the same as a bijection)".
- Section 5 (HITs) — `\pi_1(S^1)` and "winding number" appear with no callback / definition; the fundamental group is not defined on this page nor pulled in via a `<aside class="callback">`. First offending sentence: *"From it one can reconstruct, inside the type theory, the fact that $\pi_1(S^1)\simeq\mathbb{Z}$"*. A one-liner gloss or a See-also pointer to algebraic-topology would close the gap.
- Section 5 — `\Omega(S^2)` (loop space) appears in the HIT table for `S^2`'s `surf` constructor with no definition. *"$\mathsf{surf}:\mathsf{Id}_{\Omega(S^2)}(\mathsf{refl},\mathsf{refl})$"* — needs "$\Omega X$ = loop space at the basepoint" inline, or sub it for the un-iterated form.
- Section 6 (Models) — "Kan complex", "Kan fibration", "fibrant simplicial sets", "path object $A^I$" all land in one bulleted list with only the parenthetical "(fibrant simplicial sets, presenting $\infty$-groupoids)" carrying the load. The See-also points to `simplicial-sets-and-nerve.html#kan-complex`, but the page assumes the reader has been there. A two-sentence "Kan fibration intuition: a map where any horn extends to a simplex" would prevent bouncing.
- Section 4 — "axiom K (UIP)" appears in the widget readout (*"Two distinct elements of Id_𝒰(B, B) — refuting axiom K (UIP)."*) — the body prose only said "Streicher's axiom K (uniqueness of identity proofs)" once at the bullet list. UIP-as-acronym should either be expanded again on first widget appearance or skipped.

### Tone mismatches
- Section 1 hero / opening pair sets "Set theory says X. Type theory says Y." which is more sloganeering than the peers do (FOL opens with "Naive set theory gives us collections to talk about; first-order logic gives us a language to talk with." — same sloganeering register). Match. No drift.
- Section 6 final paragraph: *"Why a model matters."* note is the same tone as FOL §4's "Why this matters" note. Match.
- Section 7 (Connections) is appropriately short with a four-h3 outro, matching FOL §8 and category-theory.html. No drift.
- Mild: Section 4 *"Consequences are immediate and dramatic"* and Section 5 *"That is the entire definition."* lean slightly more declarative-confident than the peers (FOL's analogous section openings are softer: *"The first big consequence of completeness is so important it gets its own name."*). Voice still matches, just on the punchier end. No action needed.

### Missing worked examples
- Section 1 widget enumerates four context scenarios but never *derives* a concrete typing judgment by feeding the rules — the readout shows `Γ ctx` as a label, not a derivation tree of how `n:ℕ ⊢ Vec(ℝ,n) type` is justified by the type-formation rule for `Vec`. A small "click to expand a derivation step" add-on would land harder; current widget shows the *result*, not the *deduction*. Low priority — the existing toy is already richer than zero.
- Section 4 (univalence) leans on a single $\mathbb{B}$ swap example. A second worked example — e.g. transport along `ua(swap)` of a function `\mathbb{B}\to\mathbb{N}` to see it acts as expected — would close the loop on "what does an identification *do*". Optional.
- Section 6 — the `Type ↦ ∞-groupoid` widget shows the diagram but does not exhibit any concrete computation in the model (e.g. "here's $S^1$ in sSet as $\Delta^1/\partial$"). Acceptable for an overview section; the cubical/Bezem–Coquand mention in the box is the right depth.

### KaTeX macros / formatting
- No new macros introduced in the page head — the macro block (`\Spec, \Gal, \Hom, \tr, \ad, \ind`) is verbatim from the canonical template, and the page does not use any of them. Clean.
- Helper `<script>` block at top of `<body>` is byte-identical to the canonical (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`). Clean.
- Widget chrome uses `.widget / .hd / .ttl / .hint / .row / .readout / .pill / .note / .ok / .bad` exclusively — no ad-hoc class names. Clean.
- KaTeX delimiters `$…$` and `$$…$$` only; no reinvented delimiters. Clean.
- Color tokens — all SVG paint attrs use `var(--cyan)`, `var(--violet)`, `var(--yellow)`, `var(--pink)`, `var(--green)`, `var(--ink)`, `var(--mute)`, `var(--line)`, `var(--panel2)`. No hex inlined into widget markup. Clean.
- Minor: the Π/Σ table row "logic side" uses `\Rightarrow` for implication while the same paragraph uses `\to` for function types — that's deliberate for the Curry–Howard slogan, but readers may pause. Consider an explicit "(here `\Rightarrow` is the logical implication; recall `→` is the function-type former)" gloss adjacent to the slogan. Optional.

## Severity
minor polish
