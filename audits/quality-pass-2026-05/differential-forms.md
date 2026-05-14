# differential-forms — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** smooth-manifolds, differential-geometry

## Summary
The page is solid pedagogically — clear motivation, the right "forms are the things you integrate" framing up front, five interactive widgets that all do real numerical computation (Stokes convergence, winding-number integral, exterior-derivative heatmap), and the tone matches the conversational-but-precise voice of the section peers. The one hard issue is a section-numbering bug: §6 and §7 are reused by mistake, and the auto-TOC garbles the §5.1 aside as "6. 1. Pullback of forms."

## Findings
### Notation drift
- _None significant._ `\mathbb{R}` is used consistently and matches both peers; `\Omega^k(M)`, `T^*M`, `\Lambda^k T^*M`, `H^k_{\mathrm{dR}}` all align with smooth-manifolds and differential-geometry conventions. The unicode-in-readout style (`ω`, `dω`, `∧`, `∂`, `²`) is also consistent with smooth-manifolds (`φ_N`, `ℝ²`) and differential-geometry (`γ`, `κ`, `τ`).
- Minor (cosmetic): differential-forms.html§289 quotes `\sum_i \omega_i(x)\,dx^i` with explicit summation, then differential-forms.html§297 immediately switches to summation convention `\omega = \omega_i(x)\,dx^i` without flagging the convention switch in plain prose. Smooth-manifolds.html§658 introduces `X = X^i\,\partial/\partial x^i` and explicitly says "summation convention" once. Recommend a half-sentence flag at the convention switch.

### Undefined jargon
- **"section"** of `\Lambda^k T^*M` is used at differential-forms.html§265 ("a smooth section of $\Lambda^k T^\*M$") before the page or any callback defines what a smooth section of a vector bundle is. Smooth-manifolds.html§822 defines `vector field` as a "smooth section of $\pi$" with the bundle map spelled out; this page links to `smooth-manifolds.html#tangent` only, not `#bundle`. Add a callback to `smooth-manifolds.html#bundle` from §1, or write one inline sentence: "section = smooth choice at every point."
- **"smooth $k$-simplex"** appears at differential-forms.html§761 ("a smooth map $\sigma\colon\Delta^k\to M$ from the standard $k$-simplex") with no in-page or callback definition of $\Delta^k$. The page leans on the reader knowing the standard simplex from singular homology. The §5 callback to `algebraic-topology.html#homology` covers it; this is fine as long as the callback fires — verify the cross-page callback rendered correctly.
- **"de Rham complex"** at differential-forms.html§1124 is called "a *resolution* of the constant sheaf $\underline{\mathbb{R}}$ by fine sheaves" — `resolution`, `constant sheaf`, `fine sheaf`, `Čech cohomology`, `good cover` all appear in one sentence. Acceptable in the §9 outro because peer outros (smooth-manifolds.html§1119+, differential-geometry.html "coda") do the same — a chain of teaser names with no expectation that the reader knows them. Low priority.

### Tone mismatches
- _None significant._ Voice ("forms are the things you integrate," "two identities, one proof," "ruler for parallelograms," "the only question is whether they agree") matches category-theory's conversational-but-precise register and the peers' phrasing. The §3 "Antisymmetry = oriented-area" callout and the §4 "$d$ is the boundary of the form" callout are exactly the kind of slogan-callouts category-theory.html and smooth-manifolds.html use.
- Minor: the §6 callout `<div class="note"><strong>What is a proof of Stokes?</strong>` (§838) compresses the proof sketch into a single dense run-on sentence; smooth-manifolds tends to bullet such breakdowns. Cosmetic.

### Missing worked examples
- _None._ Every numbered §1–§7 has at least one widget or worked computation: §1 the table of object-eats-integrated, §2 the 1-form evaluator (`w1`), §3 the 2-form parallelogram (`w2`), §4 the exterior-derivative heatmap (`w3`), §5 has integration-via-pullback exposition but no widget — acceptable because §5 sets up §6's Stokes widget which numerically computes both sides on a disk. §5.1 (Pullback) is explicitly an aside and skips a widget; consistent with the "(aside)" tag. §7 has the closed-but-not-exact winding widget (`w5`).
- Borderline: §5 "Integration of forms over chains" is the lone numbered section without its own toy — only prose plus a forward-pointer to §6. Not a defect (§6's widget exercises the §5 idea numerically), but a small concrete `\int_\gamma \omega` worked on a parametrized arc would round it out.

### KaTeX macros / formatting
- **Section-numbering bug (high priority, semantic).** Section bodies number `1, 2, 3, 4, 5, 5.1, 6, 7, 7` — there are TWO `<h2>7.` headings (lines 959 and 1112). The auto-generated TOC at lines 239–248 numbers them sequentially (`1…9`), so e.g. `<a href="#pullback">6&nbsp;1.&nbsp;Pullback&nbsp;of&nbsp;forms&nbsp;(aside)</a>` reads "6. 1. Pullback of forms" because the auto-numberer prepended `6` while the body kept `5.1`. Fix by renumbering body `<h2>` to `1, 2, 3, 4, 5, 6, 7, 8, 9` (drop the `5.1` aside numbering and the duplicate `7.`); the TOC will then come out clean.
- _No unusual KaTeX macros._ The page uses `\mathrm{dR}`, `\bigl\bigr`, `\Omega^\bullet`, `\binom`, `\dfrac`, `\colon`, `\xrightarrow{d}` — all standard KaTeX, all also used by the peers.
- Helper `<script>` block at top of `<body>` (lines 186–235) is a verbatim copy of the 2D helper from category-theory.html / smooth-manifolds.html (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`). No `fmt()` helper present, but smooth-manifolds adds it inline; differential-forms uses `.toFixed(n)` directly in widget code, which is fine.
- Widget chrome uses the standard `widget / hd / ttl / hint / row / readout / small / note / ok / bad` classes throughout — no ad-hoc classes detected. Inline `style="display:none"` on `#w1-custom-row` and `style="width:100%"` on readouts is consistent with peer-page patterns.

## Severity
minor polish (one real bug: §6/§7 duplicate-numbering + §5.1 "6. 1." TOC garble; everything else is cosmetic)
