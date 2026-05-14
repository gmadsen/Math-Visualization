# galois-representations — pedagogical audit (2026-05)

**Section:** Number theory
**Compared against:** class-field-theory, iwasawa-theory

## Summary
The page is rich, well-paced, and has more interactive widgets than either reference (9 vs 7 vs 7), with a strong worked-example culture. The most concrete drift is purely cosmetic — widget chrome uses `<span class="ttl">` while the rest of the section (and category-theory.html) uses `<div class="ttl">`. Two late sections (§8, §9) are pure prose with no widget, and one piece of jargon ("the CM symmetry") slips into a widget caption before the term is defined.

## Findings
### Notation drift
- **Frobenius operator:** galois-representations.html uses `\mathrm{Frob}_p` consistently (lines 288, 373, 396, 433, 438, 445, 479, 480, 520, 548, etc.); class-field-theory.html uses `\operatorname{Frob}_\mathfrak{p}` in body math (lines 733, 735, 737, 1035, 1036) and only falls back to `\mathrm{Frob}_p` in narrative captions. Cosmetic only — both render identically — but a single-page repo convention is preferable. Recommend: settle on `\operatorname{Frob}` (matches the page's own `\Hom`/`\Gal`/`\tr` macro family in the loader).
- **GL notation:** galois-representations.html always writes `\mathrm{GL}_n`; class-field-theory.html mostly does the same but slips in `\GL_1` once (line 781, "Class field theory as Langlands for $\GL_1$") with no `\GL` macro in its loader, so KaTeX silently falls back to identity rendering. Galois-representations is the cleaner side here — no recommendation other than noting CFT is the offender.
- **Profinite cyclotomic limit:** galois-representations writes `\widehat{\mathbb{Z}}^\times` (line 654, in widget label) and `\mathbb{Z}_p^\times`; class-field-theory uses `\widehat{\mathbb{Z}}^\times` in the same context (line 907). Aligned.
- **Page-local macros declared but unused:** the loader imports `\Spec`, `\ad`, `\ind` (lines 38, 42, 43) which never appear in body text. Cosmetic; matches the verbatim helper-block spec, so leave alone.

### Undefined jargon
- **"the CM symmetry"** appears in widget 6's hint text at line 463: "bars obey the Hasse bound; half are zero (the CM symmetry)". CM (complex multiplication) is mentioned only as a parenthetical curve label ("conductor 32, CM") in the dropdown at line 468, never defined or callback-linked. Reader hits "the CM symmetry" before ever seeing "complex multiplication" written out. Low-medium severity — caption-only, but the widget hint is the very first time a reader encounters it.
- **"Khare–Wintenberger theorem"** (line 406) is dropped as a one-word reference with no definition and no callback. Cosmetic — it is genuinely an aside ("odd irreducible Artin representations [are this kind of thing]") and the audience is graduate-level. Mention only because iwasawa-theory.html in similar situations either expands ("Mazur–Wiles (1984)") or uses a callback.
- **"Brauer–Nesbitt / Chebotarev"** at line 598 is named without definition. Same caveat as above; arguably acceptable for an advanced page, and the surrounding sentence does paraphrase the consequence. No action needed.

### Tone mismatches
- Tone is generally well-matched to the references — conversational lead-ins ("It is the symmetry group of *all* of algebraic number theory at once", line 280; "The Fourier coefficients of an eigenform *are* traces of Frobenius", line 549) hit the same register as iwasawa-theory ("the entire point", line 704) and class-field-theory ("the deformed unique factorization", line 630).
- One mild dry-textbook moment: §9 (Inertia, ramification, and the conductor) is two dense definition-paragraphs with no widget, no worked example, and no narrative breath. The class-field-theory analog (§7 Conductor-discriminant formula) has the same structure and is similarly bare, so this is consistent within the section — but iwasawa-theory's §6 always wraps a definition in a "What's proved for which curve?" widget. Consistency with class-field is fine; no urgent fix.

### Missing worked examples
- **§8 "Irreducibility and semisimplification"** has no widget. The single dense paragraph (line 597) introduces irreducibility, semisimplicity, the upper-triangular counterexample, semisimplification, and Brauer–Nesbitt/Chebotarev — five concepts in one block. A toy widget letting the user toggle between $\rho$ and $\rho^{\mathrm{ss}}$ on a 2×2 example would land naturally here.
- **§9 "Inertia, ramification, and the conductor"** has no widget. Two paragraphs introducing $D_p \supset I_p$, the unramified condition, the Artin conductor exponent, and the global conductor formula. A widget toggling between additive/multiplicative/good reduction at a specific bad prime (mirroring the existing `w-apbar` curve dropdown) and reading off $f_p$ would close the loop.
- **§1 "The absolute Galois group"** has a widget but no quiz placeholder; the first quiz (`galois-rep-definition`) sits at the end of §2 instead. This may be intentional (treat §§1–2 as a unit), but it diverges from class-field-theory and iwasawa-theory which place a quiz at the end of every numbered section.

### KaTeX macros / formatting
- All custom macros used in galois-representations (`\Gal`, `\tr`, `\Hom`) are defined in the page-local loader (lines 39–41) and match the loader text in class-field-theory (lines 24–26) and iwasawa-theory (lines 24–26) byte-for-byte. No drift.
- No re-invented delimiters — only the four canonical KaTeX pairs (`$…$`, `$$…$$`, `\(…\)`, `\[…\]`) appear in the loader config (lines 31–34).
- No raw `\hom`-style local redefinitions that conflict with the references.

## Helper-block / widget-chrome hygiene
- **Helper-block:** the top-of-`<body>` script (lines 186–249) contains the canonical `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode` — byte-identical to class-field-theory (lines 200–248) and iwasawa-theory (lines 187–238). The page also adds three number-theory helpers (`isPrime`, `primesUpTo`, `mod`, lines 235–248); class-field-theory has the same trio (lines 251–264) plus `legendre`/`eulerPhi`/`divisors`. No drift.
- **Widget chrome — semantic drift, high priority:** every widget header on this page uses `<span class="ttl">…</span><span class="hint">…</span>` (lines 292, 325, 376, 420, 450, 463, 479, 529, 555 — 9 occurrences). Both references and `category-theory.html` use `<div class="ttl">…</div><div class="hint">…</div>` exclusively (CFT: 16 div-tagged ttls; iwasawa: 21; category-theory: 27; galois-representations: 9 span-tagged, 0 div-tagged). The CSS rules for `.widget .hd .ttl` / `.widget .hd .hint` are tag-agnostic so the page renders fine, but this is the AGENTS.md-listed "ad-hoc class" boundary — the convention is `<div>` everywhere else in the corpus. Recommend: replace `span` with `div` in the JSON content blocks.
- **`<aside class="callback">` and `<aside class="related">`:** present and properly fenced with the auto-begin/auto-end markers; the injectors will manage these. No drift.

## Severity
minor polish

---
*Orchestrator runs `node scripts/rebuild.mjs` after any content changes.*
