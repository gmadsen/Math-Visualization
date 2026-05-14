# mathematics-and-cryptography — pedagogical audit (2026-05)

**Section:** Number theory
**Compared against:** computational-number-theory, algebraic-number-theory

## Summary
Tone, helper block, widget chrome, and core notation all align cleanly with both peers and the canonical category-theory.html template; six numbered sections each ship a working interactive. The page does have one render-bug (math wrapped in `<code>` in the hero) and a cluster of jargon names introduced too quickly to absorb in §4 ECC and §5 lattices.

## Findings
### Notation drift
- _None of substance._ Target uses `\mathbb{Z}`, `\mathbb{F}_p`, `\bmod`/`\pmod`, `\operatorname{...}` macros consistent with `computational-number-theory.html` (e.g. `\mathbb F_p` at L429) and `algebraic-number-theory.html` (e.g. `\mathbb{Z}[\sqrt{d}]` at L274). Only the macro set declared in the loader (`\Spec`, `\Gal`, `\Hom`, `\tr`, `\ad`, `\ind`) is used.

### Undefined jargon
- High priority — `<code>(\mathbb{Z}/n)^\times</code>` in the hero (L312) is wrapped in `<code>` rather than `$…$`; KaTeX auto-render skips `<code>`, so readers see literal `(\mathbb{Z}/n)^\times` before any prose introduces the unit group. Both reference heroes use raw `$…$` (cf. algebraic-number-theory L274).
- High priority — `L_p[1/3,c]` is dropped at L503 with no expansion or callback; `computational-number-theory.html` L321 defines the parallel `L_n[\alpha,c]` in a `<div class="note">`. Either inline a one-line note or add a "see also" to the CompNT definition.
- L592 introduces "Weil pairing", "embedding degree", and "$E[\ell]$" in a single MOV bullet with no prior touch and no callback to `elliptic-curves.html`; readers without prior ECC context cannot parse the bullet.
- L585 uses "chord-tangent construction" before defining it; the elliptic-curves.html callback is attached only at the end of the section (L726), after the term has appeared in body prose and a widget caption.
- §5 introduces "KEM", "Module-LWE", "FIPS 203", "GapSVP", "approximate-SVP" in one paragraph (L747–749) without any expansion of the acronyms; "KEM" in particular is never spelled out.
- §6 mentions "zk-SNARKs (Groth16, PLONK, STARKs)" at L854 — only Fiat–Shamir is unpacked in the same paragraph; the others land as bare names.
- Minor — "CRT" appears at L414 inside an aside before any expansion; `computational-number-theory.html` L408 has a dedicated `<h3>Chinese remainder theorem</h3>` to point at, but no callback is wired here.

### Tone mismatches
- _None._ Voice matches the conversational-but-precise register of `category-theory.html` and the two peers — e.g. "the algebraic substrate every classical cryptosystem will rent" (L324) and "the post-quantum lattice frontier — with a coda on zero-knowledge proofs" (L312) sit in the same band as CompNT's "where structural theorems become engineering" (L510).

### Missing worked examples
- _None._ All six numbered `<h2>` sections ship an interactive widget (W1 totient grid, W2 toy RSA, W3 DH, W4 toy ECC point group, W5 LWE samples, W6 step-through Schnorr) and the §7 "Connections" outro is the same shape used by `computational-number-theory.html` L508.

### KaTeX macros / formatting
- The hero `<code>` wrap noted above is the only formatting bug (math will render as raw LaTeX source).
- No locally re-defined macros, no novel delimiters; the loader macro list is byte-identical to category-theory.html. Helper block matches the canonical `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode` template, with a legitimate number-theory utility tail (`gcdInt`, `eeaInt`, `modInv`, `modPow`, `isPrimeSmall`, `eulerPhi`) — not a deviation from the helper contract.
- Widget chrome uses only `.widget / .hd / .ttl / .hint / .row / .readout / .pill / .note`; no ad-hoc classes.

## Severity
minor polish
