# sobolev-spaces-distributions — pedagogical audit (2026-05)

**Section:** Analysis
**Compared against:** partial-differential-equations, harmonic-analysis-fourier

## Summary
Strong, well-paced page: every numbered section has a working interactive widget, notation matches the section peers (`\mathbb{R}^n`, `W^{k,p}`, `\operatorname{Tr}`, `\hookrightarrow`, `\hat u`), and the chain `D → D' → W^{k,p} → trace → fundamental sol → Lax–Milgram` lands cleanly. The only systemic drift is British spelling (regularised, minimiser, optimisation, generalisation, centred) where the rest of the corpus — including both Analysis peers — uses American spelling.

## Findings
### Notation drift
- `\mathrm{p.v.}` (Sobolev §1, table row "principal value") vs `\mathrm{p.v.}` in harmonic-analysis-fourier §4 — same spelling, agrees. _ok._
- `\operatorname{Tr}` (Sobolev §5) — peer pages don't define a trace operator, so no comparison possible; choice is consistent with the corpus convention `\operatorname{...}` over `\mathrm{...}` for operator names.
- `H^s = \{u\in\mathcal{S}' : (1+|\xi|^2)^{s/2}\hat u \in L^2\}` (Sobolev §3) and `H^s = \{f\in\mathcal{S}' : (1+|\xi|^2)^{s/2}\hat f \in L^2\}` (harmonic-analysis-fourier §4 closing paragraph) — definitions agree byte-for-byte modulo dummy variable. _ok._
- `\hookrightarrow` for embeddings used identically in Sobolev §3/§4 and PDE §6. _ok._
- `\Lambda^s` introduced in Sobolev §3 ("the operator $\Lambda^s u = \mathcal{F}^{-1}…$") is a one-shot symbol — never used again on the page or in either peer. Cosmetic; consider deleting the sentence or referencing it in §5/§6 to earn its definition.

### Undefined jargon
- "tempered distributions" (Sobolev §3, line 605) appears with no on-page definition or callback to harmonic-analysis-fourier §4 where `\mathcal{S}` and `\mathcal{S}'` are properly built. The sidebar "See also" for §3 lists Banach/Hilbert spaces and Lᵖ but not the Schwartz construction; readers landing in §3 cold see `\mathcal{S}'(\mathbb{R}^n)` without an anchor. Quote: _"For $s\in\mathbb{R}$, the fractional space $H^s(\mathbb{R}^n)$ is defined via the Fourier transform on tempered distributions"_ — a callback to `harmonic-analysis-fourier.html#schwartz` belongs in this section.
- "Plancherel" (Sobolev §3, line 607: _"For non-negative integer $s=k$ this agrees with $H^k$ (Plancherel + the multiplier …)"_) is invoked with no definition. Harmonic-analysis-fourier §2 is where this is defined; same callback would solve both.
- "BMO" used in PDE peer; Sobolev §4 instead says "borderline / Trudinger–Moser" which is more self-explanatory. _ok._
- "Hilbert scale" (Sobolev §3, line 607) is bolded as if a definition follows, but the only thing said is "$H^t\hookrightarrow H^s$ for $t>s$". Probably fine since the inclusion is the definition, but a half-sentence "i.e. nested by smoothness" would land it.
- "approximate identity" / "mollifying" (Sobolev §1, line 268: _"e.g. mollifying $\mathbf{1}_{B_1}$ with the model bump …"_) — the verb is used without prior definition. The callback to `real-analysis.html#bump-functions` is present, which softens this.

### Tone mismatches
- §3 table commentary is excellent ("$W^{1,p}$ allows kinks but not too-violent unboundedness in the derivative") — well within the conversational-but-precise voice of category-theory.html.
- §6 hero paragraph and §7 "chain in summary" `<div class="ok">` are crisp, on-tone.
- One drift: §5's "Why half a derivative?" subsection (lines 845–847) compresses a lot of Fourier handwave into one paragraph — _"averages the normal direction and leaves the tangential $|\xi'|$ paired with $1/2$ a normal derivative"_ — and reads more like a lecture aside than a worked motivation. The widget that follows partially rescues it (it shows the s ↔ s−1/2 balance) but the paragraph itself could land softer.
- British vs American spelling: the page uses _regularised_, _regularisation_, _minimiser_, _minimises_, _minimisation_, _optimisation_, _generalisation_, _centred_ throughout. Both Analysis peers are spelling-neutral or American; functional-analysis.html, real-analysis.html, and measure-theory.html use _minimizing_, _centered_. This is the page's most visible cross-corpus drift — purely cosmetic, but consistent across §1, §2, §4, §7.

### Missing worked examples
- _None._ All 7 numbered sections carry a live widget (`#w-pairing`, `#w-weakd`, `#w-frac`, `#w-emb`, `#w-trace`, `#w-fund`, `#w-var`), several with select-driven multi-example menus. Coverage is the best of the three pages on a per-section basis (Sobolev: 7 widgets / 7 sections; PDE: 6/7; harmonic-analysis-fourier: 5/8).

### KaTeX macros / formatting
- Macros block (lines 22–29) is the standard six (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) — verbatim with the peers. _ok._
- No locally-defined macros introduced. _ok._
- Delimiters `$…$`, `$$…$$`, `\(…\)`, `\[…\]` used as configured. _ok._
- Helper block at top of `<body>` (lines 187–239: `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) is a verbatim copy of the canonical block in category-theory.html. Spot-checked — identical. _ok._
- One micro-formatting note: the §1 widget's `<option>` labels carry KaTeX (`$\delta_0$ (point at 0)`, `Heaviside $H$`, `$f(x) = 1+x$ (regular)`); `js/katex-select.js` is loaded in `<head>` (line 178), so popups should render correctly. Same for §2's `<select id="wd-fn">` and §7's `<select id="var-f">`. _ok._
- Widget chrome uses standard `.widget / .hd / .ttl / .hint / .row / .readout / .note / .ok / .bad / .small`. No ad-hoc classes. _ok._

## Severity
minor polish (British→American spelling sweep, plus one missing callback to `harmonic-analysis-fourier.html#schwartz` from §3 to anchor "tempered distributions"/"Plancherel")
