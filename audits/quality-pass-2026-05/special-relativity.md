# special-relativity — pedagogical audit (2026-05)

**Section:** Mathematical physics
**Compared against:** general-relativity, hamiltonians-classical-mechanics

## Summary
A strong, well-paced page: every numbered section carries a non-trivial worked widget, the two postulates are stated up front, and consequences are derived rather than asserted. Polish items are minor — chiefly a couple of jargon-before-definition spots in the §1 bullets and a few unintroduced four-tensor-index conventions.

## Findings

### Notation drift
- §3 introduces `\eta_{\mu\nu} = \mathrm{diag}(-1,+1,+1,+1)` and the "mostly-plus" label; general-relativity §1 uses signature `(-,+,+,+)` and `ds^2 = -dt^2 + dx^2 + dy^2 + dz^2` without ever using the symbol `\eta` or naming the convention. Cosmetic only — both pages are mostly-plus, but a one-line callback ("we use the same mostly-plus signature as the general-relativity page") would cement the cross-page link.
- Semantic clash: special-relativity §3 uses `\Lambda` for a Lorentz transformation matrix throughout (e.g. `\Lambda^\mu{}_\nu`, `\Lambda^0{}_0`); general-relativity §2 and §5 use `\Lambda` for the cosmological constant. Both usages are standard in physics, but two adjacent topic pages giving the same symbol two distinct meanings is a real semantic drift — worth a one-line "(here `\Lambda` denotes a Lorentz boost, not a cosmological constant)" hint at first appearance, or a switch to `L` / `\mathsf{\Lambda}`.
- §3 writes group symbols with `\mathrm{O}(1,3)`, `\mathrm{SO}^+(1,3)`, `\mathrm{Spin}(3)`, `\mathrm{SL}(2,\mathbb{C})`. These are consistent within the page and match the house pattern (cf. `\mathrm{SL}` usage in hamiltonians and `\mathrm{O}` in GR). No drift internal to SR; cosmetic only.
- §5 introduces `4-momentum` `p^\mu` with upstairs index, then writes the Minkowski norm as `\eta_{\mu\nu} p^\mu p^\nu`. This is correct/consistent within SR. The hamiltonians page uses `p_i` (downstairs) for canonical momentum. Unavoidable convention split since SR is covariant — but a one-clause aside ("downstairs index here is the metric-lowered partner of `p^\mu`, distinct from the Hamiltonian's canonical `p_i`") would smooth the §5↔Hamiltonians link the page already advertises.
- §6 introduces "$P$", "$T$", "$PT$" as bold one-letter abbreviations for parity and time-reversal in body prose; they are defined parenthetically in the same sentence, but a reader skimming will read `PT` as the product of two scalar variables. Low priority.

### Undefined jargon
- §1 first bullet uses the word "Galilean" three times before §2 ever writes the Galilean transformation explicitly. The hero paragraph and the postulate gloss at line 273 ("In Galilean physics, if you ride a train…") roughly recover the meaning, but a one-line definition ("Galilean = pre-relativistic Newtonian kinematics, where simultaneity is absolute and velocities add as `u' = u - v`") at first use would make the velocity-addition bullet self-contained.
- §1, third bullet: "$c$ is a hard speed limit for matter and information." The phrase "speed limit for information" is used before the causal/light-cone discussion in §6 explains why information-carrying signals must be subluminal. The bullet is rhetorically effective but technically unjustified at this point in the page.
- §3 final paragraph drops "proper orthochronous transformations $\mathrm{SO}^+(1,3)$" with parenthetical glosses for "proper" and "orthochronous"; this is fine, but the same paragraph also mentions "parity ($P$), time reversal ($T$), and their product $PT$" without saying that $PT$ is also called "$CPT$ minus $C$" or simply that these are discrete symmetries of the Lorentz group. A reader who has not seen the discrete group `\{1, P, T, PT\} \cong \mathbb{Z}/2 \times \mathbb{Z}/2` will read this as opaque — at minimum, the four components could be named (identity, parity-flip, time-flip, both).
- §6 closing paragraph introduces "tachyonic antitelephone" as a defined term, which is good — but the prerequisite term "superluminal" appears in the same sentence as if previously established; the body never uses it before this paragraph. Minor.
- "Connections" mentions "spin-statistics theorem and antiparticle prediction" with no callback or gloss. Acceptable for an outro, but the reader is dropped at the deep end.

### Tone mismatches
- §3 final paragraph (line 540) is a single 110-word sentence packing four definitions, two parenthetical glosses, and the four-component classification of `\mathrm{O}(1,3)`. Compare to the analogous closure paragraphs in general-relativity (Wheeler quote + 2-sentence gloss) and hamiltonians (the `p`/`q`-vs-`T*Q` aside as a `<aside class="note">` block). The SR §3 closing would read better as either an `<aside class="note">` with bullets for the four components or split into 2–3 sentences.
- Otherwise the voice matches: conversational-but-precise, second person occasionally ("you ride a train and shine a flashlight"), worked numerical anecdote (atmospheric-muon `\gamma\sim 30`, ~10 km), and live readouts that narrate the physics ("Newtonian undershoots; gap grows without bound as β→1"). No dry-textbook drift, no over-casual drift.
- Hero subtitle is appropriately punchy and matches the GR/Hamiltonians voice.

### Missing worked examples
- Sections §1, §2, §3, §4, §5, §6 each have one widget. None missing. §5 has a worked numerical anecdote (`mc^2`, slow-particle expansion) inside the prose as well, which is a nice extra.
- §6 has a strong widget (the simultaneity-slice tilt), but the "tachyonic antitelephone" thought experiment in the closing paragraph is *narrated* rather than *visualized* — it would be a natural follow-up widget (Alice→Bob→Alice with two slider-controlled boost frames showing the message arriving in Alice's past), but the existing simultaneity widget already carries the conceptual weight, so this is enhancement not gap.
- "Connections" is a list of links with one-line glosses — matches the GR / Hamiltonians outro convention exactly.

### KaTeX macros / formatting
- Macro block in `<head>` is the boilerplate algebraic-geometry/category-theory set (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`); none used on this page, none invented. Consistent with the corpus convention of leaving the standard macro set in place even when unused. No new macros introduced.
- Delimiters used: `$…$`, `$$…$$`. No `\(…\)`, `\[…\]`, no ad-hoc delimiters. Consistent with house convention.
- `\boxed{…}` is used three times (lines 566, 572, 650) for the time-dilation, length-contraction, and energy-momentum identities. General-relativity uses `\boxed{…}` once (the Einstein equation). Consistent rhetorical use — boxed = "remember this one".
- §3 uses `\mathrm{diag}` rather than introducing a `\diag` macro — appropriate.
- §3's `\Lambda^\mu{}_\nu` mixed-index notation (with `{}` between sub/superscripts) appears here for the first time on the page; the GR page uses the identical convention for `R^\rho{}_{\sigma\mu\nu}`. Consistent.
- Helper-block (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) at lines 187–239 is a verbatim copy of the category-theory canonical block (spot-checked against GR's helper at lines 187–239 — byte-identical). No deviations.
- Widget chrome: every widget uses `<div class="widget">` + `<div class="hd"><div class="ttl">…</div><div class="hint">…</div></div>` + `.row` + `.readout`. No ad-hoc classes introduced. `.note` used once (§4 reciprocity aside) and is the standard violet variant. Consistent.
- Color tokens: all SVG paint attributes use `var(--…)` tokens or `rgba(…,…)` with the documented yellow channel for cone fills (matches GR's pattern). No raw hex inside widgets. Clean.
- One minor formatting nit: §6 widget readout uses straight quotes around `'A and B simultaneous in S′ too'` (line 796) and uses the unicode prime `′` consistently elsewhere — that is fine; just noting that prose paragraphs around the widget mix `S'` (apostrophe) and `S′` (prime) — internal cosmetic inconsistency, low priority.

## Severity
minor polish
