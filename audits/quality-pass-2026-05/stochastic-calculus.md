# stochastic-calculus — pedagogical audit (2026-05)

**Section:** Probability & statistics
**Compared against:** stochastic-processes-and-martingales, probability-theory

## Summary
Strong page — voice, widget chrome, helper block, and pedagogical rhythm match the section peers cleanly, every numbered section pairs prose with a real interactive toy, and the worked-example density is high. The only semantic drift worth flagging is the Brownian-motion symbol (`B_t` here vs `W_t` on both peers); a handful of advanced terms in §6 lean briefly on undefined acronyms.

## Findings
### Notation drift
- **Brownian symbol mismatch (semantic, high priority).** Target uses `$B_t$` exclusively (hero: `$[B]_t=t$`; §1: `$\int H_s\,dB_s$`). Both peers use `$W_t$` consistently — `stochastic-processes-and-martingales.html` §6 reads "the canonical example is **Brownian motion** $W_t$" and the hero declares "quadratic variation $[W]_t=t$"; `probability-theory.html` §12 opens with "$(W_t)_{t\ge 0}$". The cross-page callbacks point a reader from `[B]_t=t` straight to a peer page that calls the same thing `[W]_t=t`. Recommend: settle on `$B_t$` (the Itô-calculus tradition is fine for this page, but the peer pages should converge), or at minimum add a one-line "we write $B_t$ for the Brownian motion that other pages call $W_t$" disambiguation in the hero.
- **Quadratic-variation bracket vs angle, cosmetic.** Target hero uses `$[B]_t=t$`, but §2 prose drops to angle brackets `$d\langle X\rangle$` for the Itô correction without flagging the equivalence. Peer page is similarly mixed (`$\langle W\rangle_t=t$` on the predictable side, `$[W]_t=t$` on the path side), so the convention is inherited from the peer rather than introduced here — but a one-line aside that `$\langle X\rangle = [X]$ for continuous local martingales` would close the loop.
- **Tilde-Brownian rendering (cosmetic).** §4 prose writes `$\tilde B_t$`, but the in-widget readout falls back to a combining-tilde + `Bₜ` glyph (line 790: `̃Bₜ = Bₜ − θ t`) that renders as "B-with-floating-tilde" in most fonts. Peer widgets stick to ASCII fallback like `B_t`. Recommend either a plain `Btilde_t` ASCII or a true KaTeX-rendered span.

### Undefined jargon
- **"UI" in §6 outro callback prose** — line 1105 says "predictable, locally square-integrable" without ever spelling out **uniformly integrable**. The peer `stochastic-processes-and-martingales.html` defines UI explicitly in §3 ("$M$ is uniformly integrable (UI)"), so a reader who came in via a deep link to §6 wouldn't know what's been packed into "UI". Quote: "The integrand class (predictable, locally square-integrable) is exactly the language we used there." (this paragraph itself is fine; the §3 cross-page callback "uniformly integrable" earlier in the page goes undefined too).
- **`\mathcal{L}` in §6 Optional-stopping subsection** — line 970 introduces the variational PDE `$\min(\,-\partial_t V-\mathcal{L}V+rV,\;V-g\,)=0$` with `\mathcal{L}` ungloss­ed. Reader has to infer "infinitesimal generator", which doesn't appear anywhere on the page. One-clause gloss would fix it.
- **"Novikov's condition"** in §4 (line 681) is named but not justified or compared to weaker sufficient conditions; this is more "named-without-motivation" than truly undefined since the formula is right next to the name.
- **"BDG inequalities"** (line 1105) — peer `stochastic-processes-and-martingales.html` §6 defines Burkholder–Davis–Gundy fully in a `.note` block; target abbreviates without expansion. Acceptable as a back-reference but worth a one-clause expansion since the connection paragraph is the most-likely entry point for a curious reader.

### Tone mismatches
- **§6 reads as a survey, not a worked walkthrough.** The three subsections (Black–Scholes, Kalman, optimal stopping) are each one short paragraph that names the result and the equation, with only the Black–Scholes piece getting a widget. This is a deliberate "applications" outro pattern, but it drops to the dry textbook register of "$V$ solves a variational PDE: …" without the second-person framing the rest of the page maintains. Compare with peer §6 in `stochastic-processes-and-martingales.html`, where Brownian motion's "worked example" is explicitly narrated and paired with a widget.
- Otherwise tone is well-matched: "the widget below lets you compute…", "Itô's idea: build the integral in $L^2$…", and the `.note` mnemonic block in §2 ("the only one that's surprising; it's the heart of stochastic calculus") all hit the conversational-but-precise register the peers and `category-theory.html` use.

### Missing worked examples
- **§6 Kalman filter has no toy.** The page declares "the conditional mean $\hat X_t$ and covariance $P_t$ obey the closed Kalman–Bucy ODEs — recursive, online, and exact" and then moves on. By the rubric "every numbered $h2$ section should have at least one concrete computation or widget", §6 ships only one widget (the binomial tree), and that widget covers Black–Scholes; Kalman and optimal-stopping subsections are pure prose. A small filter-tracking widget or even a `.note` with a 2-step recursive-update equation would close it.
- **§6 Optimal stopping** likewise leaves the variational-PDE / free-boundary picture as text; no computation, no widget, no `.note` with a numeric exercise.
- All other sections (1–5) carry a real worked-computation widget plus a worked-by-hand mini-example in prose. §3 (geometric Brownian motion) is especially well-done.

### KaTeX macros / formatting
- **No new macros introduced.** The macro block (lines 22–29) is a verbatim copy of the peer pages' (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) — none of which are even used on this page, but that's the inherited template and matches the peers.
- **Helper block matches verbatim.** `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`, `randn` all present and identical to the peer (modulo single-vs-double-quote string style, which round-trips through render-topic.mjs and is cosmetic).
- **Widget chrome compliant.** All six widgets use `.widget / .hd / .ttl / .hint / .row / .readout`; no ad-hoc classes; SVGs include `<title>` elements; legends sit at fixed viewport offsets (`translate(80,40)`). Color usage is `var(--*)` throughout — no raw hex inside widgets.
- **One Unicode-glyph readout (low priority).** The Girsanov widget readout (lines 778–790) uses Unicode subscripts `Bᴛ`, `𝔼ℙ`, `𝔼ℚ` and a combining tilde for `̃Bₜ` rather than ASCII or KaTeX-rendered spans. Peer widgets prefer ASCII (`W_1`, `E[X]`) inside `.readout` blocks since they're rendered in monospace and the unicode subscripts/blackboard letters don't always render uniformly across fonts. Consistency-only nit.
- **Delimiters all standard** (`$…$`, `$$…$$`); no invented delimiters.

## Severity
minor polish
