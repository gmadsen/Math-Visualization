# galois-cohomology-and-brauer — pedagogical audit (2026-05)

**Section:** Algebra & homological
**Compared against:** group-cohomology, homological

## Summary
Strong page overall — voice is on-register with `group-cohomology.html`, the six-section / six-widget rhythm is honored, and notation tracks the peer faithfully. Two real issues: (1) `\mathrm{III}` is used for Tate–Shafarevich whereas every other arithmetic page in the repo uses `\Sha` rendering as Cyrillic Ш; (2) §6 introduces several heavy terms (adèles, Severi–Brauer varieties, Cassels–Tate pairing) without definition or callback.

## Findings

### Notation drift
- Tate–Shafarevich: target uses `\mathrm{III}(E/K)` and `\mathrm{III}[n]` (#applications, lines 550–551). `bsd.html` defines `'\\Sha':'\\text{Ш}'` and uses `$\Sha(E/\mathbb{Q})$` throughout; `elliptic-curves.html` references it as "Ш". This is **semantic drift** — three Latin Is render very differently from Ш and break visual continuity with BSD/elliptic-curves. Recommend adopting `\Sha` macro.
- `\mathrm{Sel}_n`, `\mathrm{rk}`, `\mathrm{Br}`, `\mathrm{Aut}`, `\mathrm{GL}`, `\mathrm{PGL}`, `\mathrm{inv}`, `\mathrm{cts}`, `\mathrm{op}` all use `\mathrm{...}` rather than `\operatorname{...}`. `homological.html` uses `\operatorname{im}` for operators, and AGENTS.md `:root` macros prefer `\operatorname{Hom}`, `\operatorname{Spec}` etc. The peer `group-cohomology.html` is just as guilty (uses `\mathrm{Br}`, `\mathrm{res}`, `\mathrm{inf}`), so this is corpus-wide cosmetic drift, not target-specific.
- Field letter: target consistently uses `K`; peer `group-cohomology.html` uses `k` in §7 (`H^n(k,M)`, `\mathrm{Br}(k)`) and `K` in the connections section. Minor, internal to each page is consistent.
- The KaTeX preamble defines macros `\Spec`, `\Gal`, `\Hom` (used) but not `\Br`, `\Aut`, `\GL`, `\PGL` — page repeatedly inlines `\mathrm{Br}` etc. A page-local macro `'\\Br':'\\operatorname{Br}'` would shorten and standardize.

### Undefined jargon
- "adelic point $(P_v)\in X(\mathbb{A}_K)$" appears at #applications line 526 with no definition or callback to adèles. First-time reader hits the symbol cold.
- "Severi–Brauer varieties" at #applications line 524 used without definition (correct usage but the term is not unpacked anywhere on the page; even a parenthetical "(twists of $\mathbb{P}^{n-1}$ split by a CSA)" would help).
- "Cassels–Tate pairing" at #cup-product line 511 and again in widget data at #applications line 891 — only described as "the global counterpart" of cup product; never explicitly defined.
- "Hensel lift" appears in the §6 widget readout text (lines 873, 887, 898) without on-page definition; standard for arithmetic readers but worth a one-liner gloss given the page targets `data-level="intermediate"`.
- "good reduction" appears in §6 widget data without gloss.
- "profinite group" / "Krull topology" — target says "regarded as a profinite group" in §1 line 262 but does not define the topology; group-cohomology peer §7 line 569 says "Krull topology" with the same brevity, so this is a peer-consistent shortcut, not a target-specific gap.

### Tone mismatches
- Hero tagline "one cohomological machine, six concrete payoffs" + "Six sections, six widgets" (line 264) is on-register with category-theory.html and group-cohomology's "Three things make this notebook entry unusually fertile" — voice consistent.
- §6 "Counterexamples gallery" widget hint "click for the local invariants" + readout prose ("Selmer 1951: solvable in every Q_p…") matches the Brilliant-style toy-to-poke ethos.
- §1 hero sentence "same bar resolution, same coboundary, only with continuity" (line 262) is admirably terse but assumes the reader has the bar-resolution machinery in working memory; the callback to group-cohomology#h1 is in §1 but should arguably also point to group-cohomology#bar.
- §4 line 419 "and which has no two-sided ideals besides $0$ and $A$" — slight textbook-register dip; peer prose typically frames such conditions ("a *simple* algebra: only the trivial two-sided ideals").

### Missing worked examples
- §5 (Cup product / local Tate duality): the widget shows the Hilbert symbol table for `K=Q_p, M=mu_2` and is good — but there is no explicit hand-walked computation of `(α∪β)(g_1,g_2,g_3) = α(g_1,g_2)·g_1g_2·β(g_3)` on a small group. Compare §1 in `homological.html` which always shows `∂` acting on a concrete preset. A toy "compute α∪β for $G=C_2$, α=β=Hilbert character" would close the gap between the abstract pairing formula (line 472–473) and the table.
- §3 (H² central extensions): widget catalogues five extensions but doesn't actually let the user build a 2-cocycle by clicking. The peer group-cohomology #h2 widget is similarly read-only; not a regression, just a missed opportunity.
- §6 Brauer–Manin: widget shows pre-baked local invariants. No place where the user *picks* a Brauer class and an adelic point and the page computes the pairing — readout is hard-coded data. This is the weakest widget on the page from a Brilliant-pedagogy lens.
- §1 cocycle widget readout (script lines 567–593) renders cocycle test in plain ASCII (`varphi(sigma) = ...`, `Norm = 1`) inside a `.readout` block. Functional, but `homological.html` widgets render in unicode (`∂`, `⊕`) for richer feedback.

### KaTeX macros / formatting
- Page does not define any extra macros beyond the shared head block, so no novel macros to flag.
- Heavy reliance on `\mathrm{...}` for operators (Br, Sel, inv, cts, op, et) — consistent with the peer but inconsistent with AGENTS.md's `\operatorname{...}` lean. Cosmetic.
- TOC entry at line 246 uses `\mathrm{Br}(K)` inside a non-breaking-space-laden link text — renders fine but has `&nbsp;` injected by the TOC builder around `\mathrm{Br}(K)=H^2(K,\bar&nbsp;K^\times)`. Tolerable but slightly fragile if the rebuilder ever changes its escaping rules.
- §5 line 482 `\mu_n\subset\mathbb{Q}/\mathbb{Z}` mid-sentence; technically `\mu_n` lives in $\bar K^\times$ and embeds into `\mathbb{Q}/\mathbb{Z}` only after the local-invariant identification. Minor abuse of `\subset`.
- Widget readouts use plain ASCII fallback (`alpha`, `sigma`, `mu`, `^`) rather than unicode (`α`, `σ`, `μ`, superscripts) — this is a deliberate choice to avoid in-readout KaTeX, but `group-cohomology.html` uses unicode (`σ`, `φ`, `→`, `⇒`, `ℤ`) in its readouts. Cosmetic drift; the peer is more polished.

### Helper-block / widget-chrome hygiene
- Top-of-body 2D helper block (lines 187–239) is verbatim copy of `category-theory.html` and matches `group-cohomology.html` byte for byte. ✓
- All widgets use the standard `.widget / .hd / .ttl / .hint / .readout / .row / .note / .ok / .bad` chrome. ✓
- All six widget SVGs include `viewBox` and a `<title>` element (lines 357, 396, 506, 542) — passes the a11y/audit-accessibility convention. ✓
- KaTeX-in-`<option>` shim: page loads `js/katex-select.js` (line 178); §3 ext-pick options (lines 388–394), §4 br-field options (lines 435–441), §6 app-pick options (lines 535–540) all contain LaTeX inside `<option>` text — correctly wired.
- Color tokens: SVG widget code uses `var(--mute)`, `var(--green)`, `var(--pink)`, `var(--violet)`, `var(--yellow)`, `var(--ink)`, `var(--panel2)`, `var(--line)` exclusively (script lines 611–947). No raw hex inside widget paint attrs. ✓
- `MVQuiz.init('galois-cohomology-and-brauer')` IIFE present at line 956–962. ✓
- Sidetoc scaffold at line 253. ✓ Top-nav backlink at line 241. ✓

## Severity
minor polish — strong page, fix `\mathrm{III}` → `\Sha` for cross-page consistency and add 2–3 inline glosses in §6.
