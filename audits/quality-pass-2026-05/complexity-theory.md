# complexity-theory — pedagogical audit (2026-05)

**Section:** Logic & Foundations
**Compared against:** computability-and-decidability, naive-set-theory

## Summary
Strong page overall — six concepts each with a worked widget, hero+plan scaffold matches the peer template, KaTeX usage is consistent. A few minor polish items: $\mathsf{P}$ vs $\mathrm{DTIME}$ stylistic choice for $\mathsf{P}$ is correct but the surrounding bestiary (BPP, ZPP, PCP, IP, BQP, QMA) is name-dropped without definition in §7. Two small definitional gaps inside §6.

## Findings
### Notation drift
- Class names use `\mathsf{}` ($\mathsf{P}, \mathsf{NP}, \mathsf{PSPACE}, \mathsf{EXP}, \mathsf{L}, \mathsf{NL}$) and resource families use `\mathrm{}` ($\mathrm{DTIME}, \mathrm{NTIME}, \mathrm{DSPACE}, \mathrm{NSPACE}$). Internally consistent and matches the convention in computability-and-decidability.html (which uses $\mathsf{Q}$ for Robinson arithmetic, `\mathrm{Halt}`, `\mathrm{Prov}`). No drift here — this is a positive signal worth preserving.
- §1 line 269 writes `\mathrm{DTIME}(f(n)) = \{ L : \exists M ... \}` but §2 line 428 writes `\mathsf{P}=\bigcup_k\mathrm{DTIME}(n^k)` — same convention, fine.
- Outro §7 mentions "$\mathrm{TIME}(\infty) = $ recursive" — this is the only place `\mathrm{TIME}` (without `D`) appears; harmless poetic license but slightly inconsistent with the established `\mathrm{DTIME}` family.

### Undefined jargon
- §2 line 447 (`<div class="bad">` Equivalent formulation) introduces $q_{\text{acc}}$ without prior definition on this page. computability-and-decidability.html defines $q_{\text{acc}}$ as part of the TM tuple in §1; complexity-theory.html only says "Fix a multitape Turing-machine model" in §1 without spelling out the tuple, then uses $q_{\text{acc}}$ in §2 and $q_\text{acc}$ in the §3 widget readout. The "See also: Turing machines" callback covers it, but a one-liner here ("the accept state of the TM model") would close the gap.
- §6 line 956 introduces "time-constructible" in the Hartmanis–Stearns statement and never defines it. First offender: *"If $f, g$ are time-constructible and $f(n)\log f(n) = o(g(n))$..."* — readers without prior exposure won't know that this is the technical condition that prevents pathological $f$ from killing the diagonal. One sentence would fix it.
- §6 line 960 reuses "space-constructible" same way. Same fix.
- §7 line 1098 lists "BPP, ZPP, RP" with no expansion; line 1102 names "PCP and the IP=PSPACE theorem" with no unpacking; line 1105 names "BQP, QMA". §7 is the connections outro so abbreviated mentions are defensible, but each bestiary acronym should at least gloss what the letters mean (e.g. "BPP — bounded-error probabilistic polynomial time").
- "ZPP" is never expanded; readers familiar with BPP may still not recognise it.

### Tone mismatches
- Voice matches the peers — conversational-but-precise, occasional second person ("the widget makes this concrete", "you can poke"). Hero sub *"once we know what is computable, the next question is what is computable cheaply"* is on-tone with naive-set-theory's *"the quiet undergrowth beneath every other topic"* and computability's *"what can a machine compute, and what is permanently out of reach?"*.
- §6 hierarchy proof sketch (lines 958, 960) is denser than analogous sketches in the peers. The Hartmanis–Stearns sketch packs simulation-overhead, contradiction, and the $\log$ factor into one paragraph — peer sketches (e.g. computability §3 halting proof) break the contradiction into a numbered ordered list. Consider pulling the contradiction out into an `<ol>` to match the peer rhythm.
- §7 final `<p class="small">` paragraph crams "fine-grained complexity (SETH, $k$-SUM, 3-SUM hardness), quantum complexity classes (BQP, QMA), and the geometric complexity-theory program (Mulmuley, Sohoni)" into one sentence. computability's outro frontiers paragraph is similarly dense — pattern-match, so this is on-template.

### Missing worked examples
- §6 widget shows the abstract diagonal table but the prose mentions concrete separations ($\mathsf{P}\subsetneq\mathrm{DTIME}(2^n)$, $\mathsf{L}\subsetneq\mathsf{PSPACE}$) without numbers attached. A toy "plug $f=n^k$, $g=2^n$, check $n^k\log n^k = o(2^n)$" worked computation in the prose would anchor the abstract widget.
- §4 (Karp reductions) — the prose gives 3-SAT $\le_p$ CLIQUE and CLIQUE $\le_p$ INDEPENDENT-SET as worked sketches, and the widget covers six more. Good coverage; no gap.
- §3 Cook–Levin — the proof bullet list and widget together cover this well; the $z_{i,j,s}$ encoding shows up in both prose and widget readout. Good.
- §7 Connections — by design pure prose, no widget needed (matches peer convention).

### KaTeX macros / formatting
- No new macros defined locally; uses only the six in the head loader (`\Spec, \Gal, \Hom, \tr, \ad, \ind`) plus stock KaTeX. Clean.
- Class names are written `\mathsf{P}` etc. in flowing prose — correct per the standard complexity-theory typographic convention. No `\hom` or `\Pclass`-style reinventions.
- Subscripts `q_\text{acc}` (line 447) and `q_{\text{acc}}` (line 591) appear with both `\text` and inside braces — both render fine and are interchangeable; minor cosmetic inconsistency.
- §3 widget reads cells with `'(q0,1)'` etc. as plain text strings inside SVG — peers do the same (computability-and-decidability tape readouts use `'q1'` literals). Consistent.
- `\le_p` is used everywhere correctly; no `\leq_p` drift.
- `\mathrm{poly}(T(n))` (line 594) is fine but `\mathrm{poly}` could become a tiny shared macro; not worth a corpus-wide change for one occurrence.

## Severity
minor polish
