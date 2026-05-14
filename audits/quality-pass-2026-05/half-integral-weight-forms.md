# half-integral-weight-forms — pedagogical audit (2026-05)

**Section:** Modular forms & L-functions
**Compared against:** modular-forms, theta-functions

## Summary
Solid advanced-tier page with a clean six-section arc (cocycle → theta → Shimura → plus space → Waldspurger → Tunnell) and a worked widget per section. Main issues are (a) a semantic notation clash with `theta-functions.html` on the definition of $\theta$, (b) several jargon terms used without callbacks in §3 and §5, and (c) one widget (Waldspurger) that is a static diagram instead of a real "toy you can poke."

## Findings

### Notation drift
- **Semantic (high priority).** `half-integral-weight-forms.html#theta` writes $\theta(\tau)=\sum_{n\in\mathbb{Z}} q^{n^2}$ with $q=e^{2\pi i\tau}$. `theta-functions.html#def` defines the *same symbol* as $\theta(\tau)=\sum q^{n^2/2}$ with $q=e^{2\pi i\tau}$. Both pages even reach for "$r_4(n)=8\sigma(n)-32\sigma(n/4)$" via "$\theta^4$ on $\Gamma_0(4)$", but a reader bouncing between pages will see the same Fourier expansion and disagree on the convention. The theta-functions page actually flags this in its "Variants and conventions" note; this page does not. Recommend adding a one-sentence note ("we use the integer-exponent convention $q^{n^2}$, i.e. theta-functions.html's $\vartheta$") at the head of §2.
- **Cosmetic.** This page mixes `\mathrm{Im}\,\tau` (§4 not present, but `\mathrm{Im}` is used implicitly via `\operatorname` macros nowhere). Actually the half-integer page never spells $\operatorname{Im}$; modular-forms uses `\mathrm{Im}\,\tau` (e.g. "Im\,\tau > 0") in §2 and theta-functions uses `\operatorname{Im}\tau` in §1. Recommend `\operatorname{Im}` per the theta-functions/category-theory conventions.
- **Cosmetic.** `\mathrm{SL}_2(\mathbb{Z})` used throughout — matches both peers. The double cover is written `\widetilde{\mathrm{SL}_2(\mathbb{Z})}` in §1; consistent.
- **Cosmetic.** Widget readouts use `χ` (literal), `Γ₀`, `²` Unicode in `<svg>` text (e.g. §3 widget: `weight ${wHalf}, level Γ₀(4N)`; §6: `2x²+y²+8z²`). Peer pages do the same in SVG to avoid in-SVG KaTeX rendering — consistent, no action.
- **Cosmetic.** Half-integer notation: this page consistently writes "$k+\tfrac12$" (e.g. §1 note, §3 theorem). Theta-functions writes "weight $1/2$" inline (§3 boxed identity discussion, "weight $1/2$ of $\theta$"). Slight drift but both readable.

### Undefined jargon
- **§3 Shimura lift, theorem box (line 519).** "Let $f$ be a Hecke eigenform of weight $k+\tfrac12$ on $\Gamma_0(4N)$ with character $\chi$." First appearance of *Hecke eigenform*, *character $\chi$*, *level $4N$* on the page — `4N` was previewed in §1's note but $N$ is never defined as a level parameter (just "$\Gamma_0(4N)$"). The "See also" callback to `hecke-operators.html` appears at the *end* of the section, after the reader has parsed the theorem. Recommend either a one-line preface or moving the callback above the theorem note.
- **§4 Kohnen-Zagier note.** "Every level-1 *newform* of weight $2k$ has a unique (up to scalar) preimage in the plus space." First and only use of *newform*; no definition, no callback. The natural target is `modular-forms.html` or `hecke-operators.html` but neither is linked here for "newform."
- **§5 Waldspurger note (line 737).** "For $D$ a *fundamental discriminant* with $(-1)^k D > 0$, …". *Fundamental discriminant* is not defined and not linked. Quadratic-forms-genus-theory or algebraic-number-theory would be the targets; neither callback is present.
- **§5 readout.** "$L(F\otimes\chi_D, s)$ is the *twisted $L$-function*, and $C_{f,F}$ is an explicit constant involving *Petersson norms*. The central value is at $s = k$ — the centre of the *functional equation* for the weight-$2k$ form $F$." Three pieces of jargon (*twist*, *Petersson norm*, *functional equation*) in two sentences. The §5 callback links to `L-functions.html#special-values`; recommend also linking `modular-forms.html#petersson` for the Petersson term.
- **§3 Shimura outro paragraph (line 603).** "*Atkin-Lehner involutions*" — used once and never explained; no callback. Either drop or link.
- **§6 BSD framing (line 835).** "BSD predicts: $E_n$ has positive rank iff $L(E_n, 1) = 0$." First appearance of the acronym BSD on the page, expanded only via the callback at the end of the section. A two-word expansion ("Birch–Swinnerton-Dyer") on first use would help.
- **§6 (line 829).** "Mordell's 1922 finite-generation theorem makes the rank a meaningful invariant." *Mordell-Weil rank* is then used in the next paragraph — fine, but this passage assumes the reader knows the Mordell-Weil group structure. Acceptable for the "advanced" body level.
- **§7 Connections.** "Shimura's lift to $\mathrm{Sp}_{2k}$" and "*geometric Langlands counterpart*" appear with no context. Acceptable in a closure section pointing to frontiers, but the symplectic group $\mathrm{Sp}_{2k}$ has not appeared anywhere on the page until this final mention.

### Tone mismatches
- Overall tone is well-aligned with peers — conversational openings ("So far the half-integral world looks like an unwieldy curiosity…", "Two surprises packaged into one formula", "Read this both directions") match the modular-forms voice well.
- **§1 §3 inline meta-narration.** "you" appears occasionally ("What if you want $k$ to be a half-integer like $\tfrac12$?", "irregular factor of $\sqrt{c\tau+d}$, level $\Gamma_0(4N)$ forced on you"). Matches `modular-forms`' "we will say more about this presentation when it matters". OK.
- **§4 (Kohnen).** Slightly drifts toward textbook voice between the two `<div class="note">` boxes — a definition and a theorem land back-to-back with only a one-sentence interleave ("The condition looks ad hoc, but…"). The peer pages typically narrate more between formal blocks.
- **§5 (Waldspurger).** The "Why squared?" subsection (one paragraph, line 750) is good narration — keeps the conversational rhythm.
- **§7 Connections.** Single dense paragraph naming Goldfeld, Bump-Friedberg-Hoffstein, Murty-Murty, the metaplectic Sp₂k generalization, and geometric Langlands without spacing. Reads more like a textbook coda than the typical "Connections" closure on peer pages. Recommend breaking into 2-3 short paragraphs or letting the bullet list do that work.

### Missing worked examples
- **§5 Waldspurger widget (`#w-wald`).** Pure SVG diagram; no inputs, no controls, no live computation. The readout is a static one-liner. Of the six numbered sections, this is the only one without a poke-able toy. A live evaluation along the lines of "pick $D$ from {-3, -4, -7, -8, -11, …}, compute $|a_f(|D|)|^2$ from a hard-coded table for $\Delta$'s preimage in $S^+_{13/2}(\Gamma_0(4))$, compare against a hard-coded table of $L(\Delta\otimes\chi_D, 6)$" would make Waldspurger concrete the way the §3 Shimura widget makes the lift concrete.
- All other sections (§1 cocycle toggle, §2 $r_k(n)$ computation, §3 Shimura recipe calculator, §4 plus-space filter, §6 Tunnell test) have working interactives.
- §4's plus-space widget is closer to a passive visualizer than a worked example — it shades passing/failing $n$, but does not compute an actual Fourier coefficient. Acceptable as a coefficient filter; lower priority.

### KaTeX macros / formatting
- The KaTeX macros block (lines 22-29) matches the standard category-theory.html / modular-forms / theta-functions block exactly: `\Spec, \Gal, \Hom, \tr, \ad, \ind`. No locally-invented macros.
- All math uses standard delimiters (`$…$`, `$$…$$`); no invented forms.
- `\boxed{…}` used twice (§3 Shimura formula, §5 Waldspurger formula) — matches the boxed-identity convention from theta-functions §3 (Jacobi transformation) and is part of the house style.
- One small inconsistency: `\widetilde{\mathrm{SL}_2(\mathbb{Z})}` is rendered as a full overtilde across both characters; KaTeX handles this fine, but `\widetilde{\mathrm{SL}_2}(\mathbb{Z})` (tilde over `SL_2` only) would match how peers occasionally render double covers. Cosmetic only.
- Helper block (lines 187-239) is a verbatim copy of the canonical 2D helpers (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) — matches `theta-functions.html` and `category-theory.html` exactly. No deviations.
- Widget chrome consistent: every widget uses `<div class="widget">` with `<div class="hd"><div class="ttl">…</div><div class="hint">…</div></div>`, plus standard `.row`, `.readout`, `.small`, `.note` classes. No ad-hoc classes detected.
- Section-2 widget (`#w-rk-checker`) uses an SVG fill `var(--bad,#5a2a2a)` (line 689) — `--bad` is not a defined CSS variable in the page's `:root` (only `.bad` class exists). The fallback `#5a2a2a` will always fire. Cosmetic; could be `var(--pink)` to match the palette tokens.

## Severity
minor polish
