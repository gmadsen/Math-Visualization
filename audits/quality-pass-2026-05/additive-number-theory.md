# additive-number-theory — pedagogical audit (2026-05)

**Section:** Number theory
**Compared against:** analytic-number-theory, quadratic-forms-genus-theory

## Summary
The page is a stitched-together composite of three originally-separate topics (sums of squares; Waring + circle method; Faulhaber/Bernoulli/zeta), and the seams show: section numbering restarts twice, the `<h1>` says "Sums of squares" instead of "Additive number theory", and one of the original sibling pages it cross-links to no longer exists. Mathematical content is dense, accurate, and well-illustrated, but the navigation and framing need a cleanup pass before the page reads as a single coherent topic.

## Findings
### Notation drift
- **High priority — broken H1.** Line 269 reads `<h1>Sums of squares</h1>` while the `<title>` tag (line 6) and TOC label say "Additive number theory". Both peers have matching `<title>`/`<h1>` (`analytic-number-theory.html` line 51 + 265, `quadratic-forms-genus-theory.html` line 6 + 302). This is a silent UX break — readers landing from index see a different heading than they clicked.
- **High priority — section numbering restarts twice.** `<h2>` tags renumber `1.…7.` (sums of squares, lines 274–881), then restart at `1. The statement` (line 969), then restart again at `1. Faulhaber:` (line 1508). Sidebar TOC numbers them sequentially `1…19`, so the in-page `<h2>` numbers contradict the sidetoc. Both peers number sections strictly sequentially (`analytic-number-theory.html` 1–11; `quadratic-forms-genus-theory.html` 1–5).
- Low — `\operatorname{Re}(s)` (target line 2178, 2288) vs `\mathrm{Re}\,s` in `analytic-number-theory.html` (lines 314, 321, 353, 358). Both render acceptably but the section-peer is consistent with `\mathrm{Re}`; pick one.
- Low — `\mathbb Z` (target line 2178: `n\in\mathbb Z`) appears unbraced once while every other `\mathbb{Z}` occurrence is braced (e.g. lines 276, 377, 430). Cosmetic.
- Low — internal stale `sums-of-squares` references: callback at line 1010 (`./sums-of-squares.html#four`) and note at 1503 (`./sums-of-squares.html`) both point to a file that does not exist on disk. Likely orphaned from when the three pieces were separate topics. Also the "Used in" backlink at line 1017–1018 points back at `./additive-number-theory.html#statement` and `#hilbert` — i.e. the page references itself, suggesting these were originally cross-page backlinks before the merge.

### Undefined jargon
- **"Eisenstein series of weight 2 (on $\Gamma_0(4)$)"** at line 800 (§6 Four squares, before Waring's problem) is used to motivate Jacobi's $r_4$ formula, but Eisenstein series, weight, and $\Gamma_0(4)$ are nowhere defined on this page and there is no callback to `modular-forms.html` or `theta-functions.html`. First-time reader will be lost.
- **"Hurwitz quaternions $\mathbb{H}_\mathbb{Z}$"** appears in a parenthetical at line 791 (§6) without definition, callback, or even an explanation that $\mathbb{H}$ means quaternions. The parenthetical is decorative for an expert and opaque for a learner.
- **"semigroup"** at line 666 ("they do not form a semigroup under multiplication") in §5 — not defined and no callback to `algebra.html`. The peer `analytic-number-theory.html` is consistent about hyperlinking first uses (e.g. `<a href="./dirichlet-series-euler-products.html#perron">Perron's formula</a>`).
- **"singular series"** and **"singular integral"** are *named* in §5 (line 1413) but the term "singular" is never explained — the reader sees `\mathfrak{S}(N)` and `J(N)` without justification for the adjective. Compare `analytic-number-theory.html#circle-method` line 528 which calls it "the *singular series* $\mathfrak{S}(N)$" and ties it to a concrete prediction in the same paragraph.
- **"Vaughan-type identity"** at line 491 of analytic-NT is allowed because it's marked as bridge to a later section; on this page **"Weyl differencing"** at line 1244 ("Weyl differencing gives a nontrivial bound") is dropped without follow-up — Weyl's inequality is finally stated five paragraphs later in §5 but never connected back to the word "differencing".
- **"Brauer–Siegel"-style growth** is not used here, but **"$2$-adic obstruction"** at line 1099 (table cell for $G(8)$) appears with no definition; "Hensel's lemma" at line 1497 is name-dropped without callback to `p-adic-numbers.html`.
- **"Mellin transform"** at line 2178 is hyperlinked (good), but the surrounding text mentions "Poisson-summation symmetry" without callback.

### Tone mismatches
- **Section-3-restart hero is missing.** When section "1. Faulhaber" (line 1508) begins after a blank `</section>` boundary at line 1505, there is no transitional sentence saying "Now we shift gears: from counting representations to summing $k^m$ in closed form." Both peers signal topic shifts with a connecting paragraph (e.g. `analytic-number-theory.html` §11 "Connections" weaves the threads together at the end). Here the reader is dropped into Faulhaber with no warning.
- The Waring section (§7, line 881) repeats material the reader just saw 100 lines earlier — "Lagrange (1770)" appears in the table at line 977 and again as "Lagrange handles squares" at line 1210. Also `g(2)=4`, `g(3)=9`, `g(4)=19` are tabulated three times across §6, §7, §8, §9 with very minor variations. Compaction is overdue.
- Several display equations are walls of formulas with no narration between them. Lines 1409–1413 (Major arcs) display three large equations back-to-back; the only prose between them is "Each factor is an *Euler product*…" — a peer like `analytic-number-theory.html#explicit` interleaves a sentence per equation explaining what each new symbol does (lines 313–321).
- A throwaway joke ("the regularised value that makes the string theorist's $1+2+3+\cdots$ finite", line 1895) is fine in isolation but stands out because the rest of the page is uniformly serious; both peers maintain the conversational-but-precise register without meme detours.

### Missing worked examples
- **§5 (Major arcs: the main term)** has the Gauss-sum widget (lines 1429–1444) but no concrete numeric demonstration of the major-arc / minor-arc dichotomy giving an actual representation count for a small $N$. The widget shows a Gauss sum but does not connect to "and therefore $r_{s,k}(N)\approx$ this number".
- **§6 (Local densities — Hasse principle for powers)** has *no widget at all* (lines 1485–1505). It is the only section on the page that is pure definition + theorem + cross-link asides, with no toy. The peer `analytic-number-theory.html` has a widget for every numbered section. House conventions in `AGENTS.md` ("every major concept has a toy you can poke") are violated here.
- **§3 (Hilbert–Waring: finiteness, line 1199)** also has no widget — it has the Hilbert identity and an "idea in one slogan" note, but nothing the reader can poke. The Hilbert identity itself would invite an interactive: pick small $k$, see the explicit polynomial identity verified.
- **§5 Functional equation preview (line 2168)** has only a bar-chart consistency check (`#fe-svg`); a small interactive showing $\zeta(2n)$ ↔ $\zeta(1-2n)$ matched via the reflection would close the loop with the §3 worked formula.

### KaTeX macros / formatting
- No locally-defined macros — page relies on the standard `\Spec / \Gal / \Hom / \tr / \ad / \ind` set inherited from `category-theory.html`. Good.
- **Inconsistent display-math style:** §1 of every block uses `$$…$$`, but §1 (Faulhaber) at line 1512 and §2 (Bernoulli) at line 1762 wrap displayed equations in `<p style="text-align:center">$\displaystyle …$</p>` instead. Both render but the latter loses the automatic margin/spacing of `$$…$$` and is inconsistent with the first half of the same page. Pick one. Peer `quadratic-forms-genus-theory.html` uses `$$…$$` exclusively (e.g. line 312, 526).
- **Unicode in formulas inside readouts is fine** (`²`, `√`, `∑`, `≈`, `≪`, `−`) — both peers do the same in `<div class="readout">` text.
- **Inline `\<script>` fragment uses `e(x):=e^{2\pi i x}`** at line 1230 — peer `analytic-number-theory.html` uses `e(x) := e^{2\pi i x}` (line 524) with spaces. Cosmetic.
- The §4 widget hint at line 1250 reads `vertical rails mark rationals $a/q$ with $q\le 6$ (major arcs)`; the actual TOC anchor for that widget's section (`#circle`) and the heading "4. The circle method" are correct, but the cross-reference to "section 6" inside line 1413 ("see section 6") is fragile because the section that *would have been* §6 in this contiguous block is actually §6 numbered locally (Local densities) — the local renumbering means "section 6" is ambiguous to a reader using the sidetoc which says §13.
- Helper script block (lines 188–237) is verbatim from category-theory.html — `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode` all present and untouched. Widget chrome uses `.widget / .hd / .ttl / .hint / .readout / .row / .note / .ok` correctly throughout. No ad-hoc classes. Good.

## Severity
needs rework
