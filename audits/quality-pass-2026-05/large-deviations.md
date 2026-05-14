# large-deviations — pedagogical audit (2026-05)

**Section:** Probability & statistics
**Compared against:** probability-theory, random-walks-and-mixing

## Summary
The page is well-structured, technically dense, and consistent with section peers in chrome, helper block, and KaTeX macros. Two real issues stand out: a notation collision where `H(\nu\|\mu)` denotes KL divergence here but `H(X)` denotes Shannon entropy in the cross-linked information-theory page, and a tone that is slightly drier (less second-person, more textbook) than `random-walks-and-mixing` and `probability-theory`.

## Findings
### Notation drift
- **High priority — semantic.** Large-deviations writes KL divergence as `H(\nu\,\|\,\mu)` (line 583, 587, 854, 854) while the directly cross-linked `information-theory.html#kl-divergence` writes the same object as `D(p\,\|\,q)` (info-theory line 502, 508). Worse, `information-theory.html` uses `H(X)` for **Shannon entropy** of a single distribution (info-theory line 271, 281, 390, 397), so the same letter `H` denotes two different objects across two pages a reader is encouraged to navigate between via the §3 callback. Recommend either renaming to `D(\nu\,\|\,\mu)` to match information-theory, or at least adding a one-line "(some texts write this as $D(\nu\|\mu)$ — same object)" note at first use.
- **Cosmetic — internal inconsistency.** §1 introduces the family as `X_i\sim\text{Bernoulli}(p)` (line 278) and immediately switches to `\text{Ber}(x)` / `\text{Ber}(p)` for the rest of the page (lines 279, 289, 446, 591). Probability-theory consistently spells `\text{Bernoulli}(p)`. Pick one.
- **Cosmetic.** Indexing: large-deviations uses lowercase `\bar X_n`, probability-theory's LLN section uses uppercase `\bar X_N` (line 1162). Both are fine but a reader cross-referencing "the LLN says $\bar X_n\to\mu$" (large-dev hero) against probability-theory will see a capital. Trivial but worth a one-shot pass to align with `n` (the indexing in the page itself is internally consistent).
- `\asymp` is used heavily (hero, §1, §3, §5) without a one-line gloss. Probability-theory and random-walks both lean on `\xrightarrow{}`-style limits and avoid `\asymp`. A parenthetical "(equality on the log scale)" on first use would close the loop.

### Undefined jargon
- **Polish space** appears in §2 line 434 ("A **(good) rate function** on a Polish space $\mathcal{X}$ is...") with no definition or callback. Neither `probability-theory.html` nor any analysis page in the corpus defines it on the path a reader of this page is likely to traverse. Either inline-define ("complete separable metric space") or cite a one-line gloss.
- **Itakura–Saito divergence** is name-dropped at §2 line 448 ("the *Itakura–Saito* divergence from $1$") with no definition. It is purely decorative here, but the italicised emphasis suggests a defined term — readers may chase it. Either drop the name or footnote it.
- **Eyring–Kramers** at §5 line 851 ("Eyring–Kramers refines the prefactor") — undefined; acceptable as a teaser but a one-clause gloss ("which gives the prefactor of order $\sqrt{|\det \nabla^2 V|}$") would match the conversational density elsewhere.
- **log-MGF** in the hero (line 259) precedes the first definition at line 266 by seven lines. It's fine for a hero teaser but readers landing via deep-link see the term cold. Could swap for "log moment-generating function" in the hero or add an `\Lambda(\theta)$` parenthetical.

### Tone mismatches
- **Drift toward dry textbook voice.** Large-deviations contains essentially no second-person constructions: a quick grep finds only "no matter how rare we are willing to consider" (line 446) and "telling you the exponential decay rate" (line 886). Compare random-walks-and-mixing's hero ("Every concept is paired with a small chain you can drive: step it, watch the empirical frequencies converge to $\pi$, and read off the cost of forgetting where you started.") and probability-theory ("Once we have $\mathbb{P}_X$, the original $(\Omega,\mathcal{F},\mathbb{P})$ recedes…"). Large-deviations' hero by contrast is a string of declaratives. The page is more conversational than dense category-theory pages but noticeably less so than its two section peers — adding two or three "you" / "we" framings (especially in section openings and at the widget hand-off) would close the gap.
- **Closing line of §5 ("Statistical mechanics, entirely from large deviations.")** is a strong rhetorical flourish that lands well, but is the only such moment on the page. The peers use these more freely (random-walks: "the cost of forgetting where you started", probability-theory: "Same number, two readings."). Not a problem, just a missed opportunity.

### Missing worked examples
- _None._ Every numbered §1–§5 has at least one explicit worked computation (Gaussian + Bernoulli in §1, three families in §2, biased coin in §3, AR(1) in §4, Schilder/FW/Boltzmann in §5) plus a widget. §6 "Connections" is a pure-prose outro with no widget or quiz, which matches `random-walks-and-mixing.html#outro`'s pattern (and probability-theory has no outro section at all) — consistent with corpus convention.

### KaTeX macros / formatting
- Macro block is the verbatim corpus standard (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`); no locally-invented macros.
- Helper block (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) is byte-identical to `probability-theory.html` and `random-walks-and-mixing.html` (lines 187-238 vs. peers' equivalents). No drift.
- Widget chrome uses `.widget`, `.hd`, `.ttl`, `.hint`, `.row`, `.readout`, `.note` correctly throughout. No ad-hoc classes.
- Delimiters are exclusively `$…$` and `$$…$$` (no `\(…\)` or `\[…\]` use, and no invented variants).
- Minor: `\bigl\{ \theta x - \Lambda(\theta) \bigr\}` (line 268) and `\Bigl( -n\inf \Bigr)` (line 582) use sized delimiters where peers prefer plain `\{` / `\}` for shallow content. Cosmetic and arguably better here.
- Minor: a few inline `\,\|\,` usages for KL spacing (e.g. `H(\nu\,\|\,\mu)`) — fine, but `H(\nu\mid\mu)` is the convention in some peers; combined with the `H` vs `D` issue above, consolidating to `D(\nu\,\|\,\mu)` would solve both.

## Severity
minor polish
