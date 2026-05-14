# motives — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** hodge-theory, etale-cohomology

## Summary
Voice and structural scaffolding line up well with the section peers, but the page ships **zero interactive `.widget` blocks** for an 8-section capstone — a sharp contrast to `etale-cohomology.html`, which packs four sliders into its first two sections. Several mid-page sections (Tannakian, motivic Galois group, realizations) are pure definition with no toy. Notation also drifts within the page itself: `\Gal(\overline{\mathbb{Q}}/\mathbb{Q})` and `G_\mathbb{Q}` alternate without rule, and three of the eight defined KaTeX macros (`\Corr`, `\cris`, `\et`) are bypassed by their `\mathrm{…}` longhand in adjacent paragraphs.

## Findings

### Notation drift
- **Absolute Galois group named two different ways on the same page.** Hero (`§hero`) writes `\Gal(\overline{\mathbb{Q}}/\mathbb{Q})`, then §4 row "ℓ-adic" (line 425) writes `G_\mathbb{Q}`, then §5 last bullet (line 456) writes "$\Gal(\overline{\mathbb{Q}}/\mathbb{Q})$ … (after $\ell$-adic completion)" then §6 again uses `G_\mathrm{mot}(\mathbb{Q}) \to \Gal(\overline{\mathbb{Q}}/\mathbb{Q})`. Pick one and stick. `etale-cohomology.html` uses `\Gal(\bar k/k)` consistently; `hodge-theory.html` doesn't reach for `G_\mathbb{Q}` at all.
- **`\Corr` macro defined, then ignored.** Head defines `'\\Corr':'\\operatorname{Corr}'` (line 25), but §2 writes `\mathrm{Corr}^r(X, Y)` (line 348) and `\mathrm{Corr}(X, Y)` (line 352), then §3 step 2 finally uses `\Corr^0(X, X)` (line 387). Three forms for the same object inside two adjacent sections.
- **`\cris` macro defined, never used.** Head defines `'\\cris':'\\mathrm{cris}'` (line 30); the body always writes the longhand `\mathrm{cris}` (lines 276, 425, 558, 560). Either drop the macro or apply it.
- **`\mathsf{Mot}_k` in prose vs `Mot(k)` in SVG label.** Body text uses `\mathsf{Mot}_k` (line 283 onward); the §1 SVG box (line 298) and §6 prose ad-hoc subscripting (`\mathsf{Mot}_k^{\mathrm{Chow}}`, `\mathsf{Mot}_k^{\mathrm{num}}`) work, but the SVG label `Mot(k)` is plain ASCII. Cosmetic, but readers parsing the diagram see a different glyph.
- **Mumford-Tate ↔ Mumford–Tate.** ASCII hyphen at lines 455, 526, 543; en-dash inside the §6 SVG label (line 508) and `MT (Mumford–Tate)`. `hodge-theory.html` mixes these too, so this is a section-wide nit, not a motives-only sin — flag-and-pick is still worth a sweep.
- **`MT` not behind a macro.** `hodge-theory.html` defines `'\\MT':'\\mathrm{MT}'` (line 25); motives writes `\mathrm{MT}(X)` raw (line 526) and `\mathrm{MT}` (line 528). Adding `\MT` to the macro block would harmonize with hodge-theory.

### Undefined jargon
- **"Eilenberg–MacLane spectrum" / "ring spectrum"** at the end of §1 (line 323): "every cohomology theory people care about (ordinary, $K$-theory, cobordism, étale, motivic) fits this template, with the Eilenberg–MacLane spectrum replaced by some other ring spectrum." First use of stable-homotopy vocabulary on this page; no callback to homotopy-theory or k-theory.
- **"pro-reductive group scheme"** at §6 (line 485): "$G_{\mathrm{mot}}(k)$ is a pro-reductive group scheme over $\mathbb{Q}$". `pro-reductive` is non-trivial vocabulary dropped without unpacking; "reductive" alone would already need a representation-theory callback.
- **"Voevodsky's triangulated category $\mathsf{DM}(k)$"** at §8 bullet (line 603), and again **"$\mathbb{A}^1$-homotopy theory"** and **"motivic spectra"** in the next bullet (line 604). All three of these arrive in §8 with zero earlier setup or callback. The Bloch–Kato conjecture in the same bullet is also bare.
- **"Mumford-Tate group"** introduced at §5 bullet (line 455) as a bold name, never defined on the page. `hodge-theory.html` does give a one-sentence definition (line 418: "the Tannakian group of the smallest sub-Tannakian category containing $V$"); a backlink callback would suffice.
- **"primitive part"** at §8 (line 591, Hodge standard conjecture I): "The bilinear form on the primitive part of $H^*(X; \mathbb{Q})$ is positive-definite." Primitive cohomology is a Lefschetz-decomposition concept that isn't defined here.
- **"Newton-and-Hodge polygons"** at §6 last bullet (line 527): "the crystalline realization recovers the Newton-and-Hodge polygons of the variety mod $p$." Capstone-level reference but no callback to the crystalline / p-adic Hodge story.
- **"$B_{\mathrm{cris}}$"** at §7 (line 568, Fontaine's comparison): the period ring $B_{\mathrm{cris}}$ appears in a formula with no surrounding word that says "period ring".
- **"torsor"** at §5 (line 448): "choose two fiber functors and you get a torsor between the corresponding groups." Torsor is undefined.
- **"hypercohomology" $\mathbb{H}^*$** in §1 bullet (line 274) — actually OK; the parenthetical "sheaf cohomology of a complex rather than a single sheaf" defines it inline and the `data-blurb` provides a tooltip. Good model for the others above.

### Tone mismatches
- **Voice and "Slogan" notes match the house tone well.** §1 line 281 and §5 line 450 are exactly the conversational-but-precise register `category-theory.html` and `hodge-theory.html` set.
- **§7 has a name-and-formula wall.** Line 568: "and the $\ell$-adic Tate-comparison $H^*_B(X(\mathbb{C}); \mathbb{Q}) \otimes \mathbb{Q}_\ell \cong H^*_{\et}(X_{\overline{\mathbb{Q}}}; \mathbb{Q}_\ell)$ (Artin), and Fontaine's $p$-adic comparison $B_{\mathrm{cris}} \otimes H^*_{\mathrm{cris}} \cong B_{\mathrm{cris}} \otimes H^*_{\et}(X; \mathbb{Q}_p)$ for varieties with good reduction at $p$." Three named theorems and two display-worthy isomorphisms compressed into one sentence. `hodge-theory.html` would have given each its own paragraph.
- **§8 status table is a status report, not a narrative.** The "What's known unconditionally?" bullet list (lines 599–605) reads like an annotated bibliography. `etale-cohomology.html` § "Weil conjectures" anchors each historical milestone in a worked sentence; motives drops Voevodsky / Morel / Brown / Goncharov in rapid succession without context.
- **"Now the climax"** at §6 (line 480) is a warmer voice than hodge-theory typically uses, but it is *promising* a payoff that the section never materially delivers (no widget, no concrete computation of $G_{\mathrm{mot}}$ on a toy). The voice writes a check the content doesn't cash.

### Missing worked examples
- **Zero interactive `.widget` blocks on the page.** `etale-cohomology.html` has at least four (`#w-etale`, `#w-jac`, `#w-ladic`, `#w-tower`); `hodge-theory.html` is also static-SVG-only, so motives is not an outlier *within the section*, but for a 9-section capstone-tier topic there is no "toy you can poke" — directly in tension with the project goal stated in `AGENTS.md`.
- **§5 Tannakian categories.** No worked Tannakian group computation. `\mathsf{Vect}_k$ with $G = 1$ is mentioned in passing but the slogan "solving the category ⇔ solving the group" never gets a one-page demonstration. A toy like "category of $\mathbb{Z}/n$-graded vector spaces ⇔ $\mu_n$" would land the idea concretely.
- **§6 The motivic Galois group.** Diagram is provided but no example of $G_{\mathrm{mot}}$ on a specific class of varieties (e.g. abelian varieties, where it *is* known) is computed. The §4 promise that mixed Tate motives over $\mathbb{Z}$ have a "fully-realised motivic Galois group" is reiterated in §8 line 601 but never written down.
- **§7 Realizations.** The comparison-iso table is worked, but there is no concrete numerical period example to make the "$2\pi i$ as period of $\mathbb{Q}(1)$" punchline (introduced in §4) tangible. A small computation like "the period of $H^1$ of an elliptic curve $\mathbb{C}/\Lambda$ is the lattice generators in $\Omega^1$" would tie §4 and §7 together.
- **§8 Standard conjectures.** The three conjectures are stated, then the status report follows. No concrete instance — e.g. Künneth (C) for projective space (which is trivially known) or Lefschetz (B) for surfaces (where it's the index theorem). At least one "here's where (B) is known and what it buys you" example would help.

### KaTeX macros / formatting
- **`\Corr`, `\cris`, `\et` macros defined but inconsistently applied** — see Notation drift above.
- **No `\MT` macro.** Pull the same macro hodge-theory uses (`'\\MT':'\\mathrm{MT}'`) and the §6 line 526 phrasing becomes one token instead of seven.
- **SVG labels use plain Unicode for math** (e.g. line 305 `Betti  H_B*(X(ℂ); ℚ)`, line 308 `de Rham  H_dR*(X/k)`, line 311 `ℓ-adic  H_ét*(X̄; ℚ_ℓ)`). This is the pattern hodge-theory uses too (Hodge-diamond labels), so it's a house norm rather than a defect. Worth noting that the SVG-internal `H_B*` syntax cannot be KaTeX-rendered, so `*` reads as a literal asterisk rather than a homological-grading "•" — a Unicode `•` or `^\bullet` would read better.
- **Macro `'\\Mot':'\\mathsf{Mot}'`** is defined (line 27) but the body always writes `\mathsf{Mot}_k` longhand. Same shape of issue as `\Corr` / `\cris`.

## Severity
minor polish
