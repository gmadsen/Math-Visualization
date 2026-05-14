# quantum-field-theory — pedagogical audit (2026-05)

**Section:** Mathematical physics
**Compared against:** dirac-equation, gauge-theory

## Summary
The page is a strong, well-paced capstone with one worked widget per numbered section, an explicit signature-convention callout, and good prereq callbacks; voice and notation match the section peers closely. Issues are minor: a few terms used (vev, Wick rotation, θ_W, Goldstone modes) get only widget-caption or parenthetical definitions on first appearance, and there is mild cosmetic SU(N) markup drift between display math and inline / SVG labels.

## Findings
### Notation drift
- `\mathrm{SU}(3)_C \times \mathrm{SU}(2)_L \times \mathrm{U}(1)_Y` in display math (line 937) vs bare `SU(3)_C / SU(2)_L / U(1)_Y` in surrounding prose (line 939: "8 gluons … (color SU(3))") and SVG button labels (lines 946–948, 1051). Cosmetic; gauge-theory.html has the same mixed pattern (`\mathrm{Hol}_A` and `\mathrm{Ad}` wrapped, but `G = U(1)`, `SU(2)` bare in §1, §4). Suggest one direction page-wide.
- Feynman slash uses `\not{p}` (line 673) — gauge-theory and dirac-equation never reach for slash notation; in QED-style propagator listings KaTeX's `\not` produces a slightly off-center slash. Standard but worth noting if a page-wide `\slashed{}` shim ever lands.
- `\eta_{\mu\nu} = \mathrm{diag}(+1,-1,-1,-1)` (line 665) matches dirac-equation.html line 398 exactly — no drift; the Convention note explicitly flags the mismatch with klein-gordon and special-relativity, which is the right move.
- `:O:` for normal-ordering (line 273) is introduced inline and never used again; harmless one-off.
- Lie-algebra direct-sum at line 1075 uses `\mathfrak{su}(3)\oplus\mathfrak{su}(2)\oplus\mathfrak{u}(1)` — consistent with how gauge-theory and dirac-equation render fraktur Lie algebras.

### Undefined jargon
- **vev** appears at line 941 §6 ("breaks $\mathrm{SU}(2)_L\times\mathrm{U}(1)_Y \to \mathrm{U}(1)_{\mathrm{em}}$ via a vev $\langle\phi\rangle\ne 0$") with no in-prose expansion of "vacuum expectation value". The widget caption at line 1048 later writes "Higgs vev v ≈ 246 GeV" but still doesn't expand. Low cost to fix: parenthesize "vacuum expectation value" on first prose use.
- **θ_W (Weinberg angle)** introduced as `\sin\theta_W\,W^3_\mu + \cos\theta_W\,B_\mu` at line 941 with zero gloss; SVG labels at lines 1024, 1027 reuse it. Reader who hasn't seen electroweak unification before has nothing to anchor to.
- **Goldstone modes** appears only inside the widget caption at line 1048 ("W,Z eat 3 Goldstone modes from φ doublet → longitudinal polarization"). Goldstone's theorem is never named in prose. This violates the "prose first, widget second" pattern.
- **Wick rotation** at line 523 §3 is named with no callback or inline gloss before the formula — but the immediately-following `t \to -i\tau` substitution operationalizes it, so this one is borderline rather than a clear miss.
- **Stationary phase** (line 521) is named and defined in the same sentence — fine.
- **LSZ** and **BRST** are both expanded inline at first use (lines 674, 939) — model citizens; same pattern dirac-equation uses for Clifford algebra.

### Tone mismatches
- §1–§5 voice matches the category-theory.html / dirac-equation register: conversational-but-precise, mini-narrative around each formula. No drift.
- §6 (gauge-fields) drifts into the textbook-density end of the spectrum: line 939 packs "Faddeev-Popov ghost fields", BRST cohomology, and `\mathrm{ker}\,Q/\mathrm{im}\,Q` into one sentence with two parenthetical mini-essays. dirac-equation §1's analogous algebraic-density paragraph (line 277) is broken up with "We will shortly discover…" narration; QFT §6 has no such breathers. Suggest splitting the Faddeev-Popov clause into its own sentence and the BRST clause into a follow-up.
- The "Connections" outro (line 1069) catalogs five open frontiers in a single 130-word paragraph. dirac-equation and gauge-theory both reserve the outro paragraph for one or two sentences and put the catalog in the bulleted list below. Cosmetic.

### Missing worked examples
- _None._ Every numbered §1–§6 has exactly one widget (qft-modes, qft-fock, qft-paths, qft-diagrams, qft-rg-flow, qft-sm-fields), each with sliders/buttons that update a SVG plus readout. This matches gauge-theory's coverage (§1–§4 each have a widget; §5–§7 mostly do). The Connections section has no widget, which is the convention.

### KaTeX macros / formatting
- Loader macros are the verbatim 6-macro set (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) shared with dirac-equation and gauge-theory — no drift, no locally-introduced macros. None of the six are actually used in this page's math, which is consistent with sibling pages.
- Delimiters `$…$`, `$$…$$`, `\(…\)`, `\[…\]` only — no invented delimiters.
- Inline use of bracketed "ket" with literal `|0\rangle` (line 273) and Unicode `|0⟩` in SVG/readout strings (e.g. line 364, 369, 484) is unavoidable since SVG text can't host KaTeX; gauge-theory and dirac-equation do the same trick.
- Helper-block at lines 187–236 is a verbatim copy of category-theory.html's 2D helpers (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) — no rewrites.
- Widget chrome (`<div class="widget">` / `.hd` / `.ttl` / `.hint` / `.row` / `.readout`) is conformant on all six widgets; no ad-hoc classes spotted. Color tokens via `var(--…)` only, no hex literals in SVG attributes.

## Severity
minor polish
