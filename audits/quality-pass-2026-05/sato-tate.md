# sato-tate — pedagogical audit (2026-05)

**Section:** Modular forms & L-functions
**Compared against:** L-functions, bsd

## Summary
Strong, widget-rich page with five well-numbered sections each carrying at least one interactive (and §3/§5 carry three). Findings are all minor polish: a single but consistent `\operatorname{Re}` vs `\mathrm{Re}` divergence from L-functions, a handful of jargon terms parachuted in without callbacks, and a few KaTeX names (`\mathrm{Sym}`, `\mathrm{End}`, `\mathrm{GL}`) that could be macroed for consistency with the existing `\Gal/\Hom/\tr` set.

## Findings
### Notation drift
- `\operatorname{Re}` used 4× in sato-tate (e.g. line 1139 "non-vanishing of each $L(\mathrm{Sym}^n E,s)$ on $\operatorname{Re}s=1$"; line 1297 "on $\operatorname{Re}(s)\ge 1$") vs `\mathrm{Re}` 10× in L-functions (e.g. line 330 "$\mathrm{Re}\,s > 1$"; line 1227 "$\mathrm{ord}_{s=1}$"). Same symbol, two visual styles, in adjacent section pages. Recommend settling on `\mathrm{Re}` per the L-functions majority, or hoist `\Re` into the macro block.
- `\mathrm{Sym}` (12×, lines 252, 1128, 1134…) and `\mathrm{End}` (line 972: `\mathrm{End}(E_{\overline{\mathbb{F}_p}})`) and `\mathrm{GL}` (line 1502: `\mathrm{GL}_2`, `\mathrm{GL}_n`) are all spelled out long-hand. The shared macro block already promotes `\Spec/\Gal/\Hom/\tr/\ad/\ind` to `\operatorname{…}`; adding `\Sym/\End/\GL` would normalize spacing and remove a class of typo risk.
- Inconsistency *within* the page: `\Gal(L/K)` at line 407 uses the macro form (renders as `\operatorname{Gal}`), but `\mathrm{Sym}^n\operatorname{Frob}_p` at line 1137 mixes the two styles in one expression.

### Undefined jargon
- "Tate module" (§1, line 258, "characteristic polynomial of Frobenius on the Tate module") is used as a known object; sato-tate has no in-page definition and no callback to galois-representations or elliptic-curves where it is introduced. First-time reader hits a noun they cannot resolve in paragraph 1.
- "Peter–Weyl theorem" / "Stone–Weierstrass" (§2, line 402, "By Stone–Weierstrass…the Peter–Weyl theorem hands us a preferred dense family") — both invoked without definition or link. Functional analysis prereqs are real but not flagged.
- "Hecke Grössencharacter" (§4, line 963: "the Frobenius $\alpha_p$ is a Hecke Grössencharacter value"; line 970 expanded slightly) — used as the load-bearing object explaining CM Sato–Tate, but no inline gloss and no link to algebraic-number-theory or class-field-theory. By comparison, L-functions takes care to define "trace of Frobenius," "conductor," "newform" before leaning on them.
- "Wiener–Ikehara" (§5, line 1137: "By Wiener–Ikehara, equidistribution…is equivalent to") — a non-trivial Tauberian theorem dropped in as a citation; no link, no one-line gloss of what it provides. Reader has to take the equivalence on faith.
- Coda (line 1502) cascade: "Satake parameters", "cuspidal automorphic representation", "$L$-group", "Katz–Sarnak heuristic" all appear in one sentence, none defined or linked. Acceptable for a deliberate "open horizons" outro, but worth flagging.
- Cosmetic: "$\ell$-adic Galois representation" (line 407) — `$\ell$` is rendered but the prefix "$\ell$-adic" is jargon worth a one-clause gloss for first-time readers, even though the noun `Galois representation` is correctly linked.

### Tone mismatches
- Hero `<p class="sub">` (line 251) opens with a dense single sentence containing four technical objects ($E/\mathbb{Q}$, Frobenius traces, Hasse interval, semicircle density) plus the punchline ("arithmetic shadow of Haar measure on $\mathrm{SU}(2)$"). L-functions' hero (line 257) and bsd's (line 256) by contrast lead with one verbal sentence ("A single object…binds together…", "Count points on $E$ modulo each prime and multiply"). The sato-tate hero is correct but unusually load-bearing for a first paragraph.
- §5 paragraph at line 1297 is a 100+ word block that defines normalization, hand-waves the analytic conductor, and parenthesizes the widget convention all in one breath. This is the kind of "formula-with-narration-but-no-breath" wall that breaks the brisk rhythm of the rest of the page. Splitting at the parenthetical would help.
- Bullet vs paragraph balance is fine elsewhere; second-person "you" appears 5× across the page, in line with peers (L-functions 8×, bsd 4×).

### Missing worked examples
- _None._ Every numbered `<h2>` carries at least one widget; §3 and §5 each have three. The unnumbered "Coda: open horizons" (§6) is pure prose with no widget, but that matches the "outro / further reading" pattern used identically in L-functions §9 and bsd §5 closes — flag only if you want an explicit widget for the generalized Sato–Tate group menagerie.
- Worth noting (advisory): the §5 `w-symstrip` widget is the page's most computational widget but its readout includes "in a research-grade tool you would substitute actual Frobenius angles of a specific curve" (line 1314) — fair caveat, but it slightly undercuts the punch since the §3 `w-frob` widget already does compute real $a_p$ from Legendre. Linking `w-symstrip` back to `w-frob` or feeding the same curves would close the loop.

### KaTeX macros / formatting
- Macro block (lines 36–44) is byte-identical to L-functions. bsd has an extra `\Sha`:`\text{Ш}` macro plus a duplicate `macros:` block — a bug on bsd's side, not sato-tate's, but worth noting that adding `\Sym/\End/\GL/\Re/\Im` to the shared template would benefit all three.
- Delimiters: only `$…$` and `$$…$$` are used; `\(…\)` and `\[…\]` available but unused — house-style compliant.
- `\mathrm{Sha}` does not appear here (no Tate–Shafarevich content), so the bsd-only macro absence is correct.
- `\bigl/\bigr` used appropriately around tall Euler factors (lines 1134, 1296). `\tfrac` used in §2 readout commentary (line 525) — consistent with peer pages.
- Inline `b` element used inside `<div class="note">` headings (e.g. line 404 `<b>Weyl's criterion (group form).</b>`, line 553 `<b>Sato–Tate (theorem, non-CM case).</b>`) where L-functions and bsd consistently use `<strong>` (e.g. L-functions line 329 "<strong>Riemann zeta function</strong>", bsd line 264 "<strong>Mordell–Weil (1922/1928).</strong>"). Cosmetic but easy to normalize.

## Severity
minor polish
