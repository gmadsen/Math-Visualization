# mapping-class-groups — pedagogical audit (2026-05)

**Section:** Geometry & topology
**Compared against:** surgery-theory, algebraic-topology

## Summary
Page is on-voice and notation-aligned with both peers; primary issues are a stray draft note ("…wait:…") shipped to a user-visible widget readout, three names dropped without prereq grounding (train-tracks, Heegaard splittings, instanton/ASD), and a couple of inconsistent operator spellings inside the §6 character-variety paragraph.

## Findings
### Notation drift
- Mixed `\Hom` macro vs spelled-out `\mathrm{Hom}` in the same page. The `<head>` defines `\Hom = \operatorname{Hom}` (`mapping-class-groups.html:25`) and surgery-theory.html relies on the macro implicitly; algebraic-topology uses the macro at `algebraic-topology.html:1250`. But §6 spells it out: `mapping-class-groups.html:845` `\mathrm{Hom}(\pi_1\Sigma, \mathrm{SU}(2))/\mathrm{conj}`. Cosmetic, but inconsistent within one page — the macro renders as upright `Hom` with proper spacing; `\mathrm{Hom}` renders identically but bypasses the shared definition. Recommend `\Hom` for consistency with the loader macros.
- Hyphen vs en-dash drift in proper names: "Lickorish–Humphries" with en-dash at `:403`, but "Fintushel-Stern" with ASCII hyphen at `:906, 909` and "Lanneau-Thiffeault" at `:574`. Surgery-theory uses en-dashes consistently (`Mazur–Stallings–Barden` `:374`, `Browder–Novikov–Sullivan–Wall` `:413`, `Bass–Heller–Swan` `:377`). Cosmetic but visible inside the §3/§6 widget readouts where `\n` joins make the punctuation prominent.
- "Rohlin" (`:873, 941`) vs the spelling "Rokhlin" used in surgery-theory `:471`. Same person; the project should pick one. Ditto "isomorphisation" choices: surgery uses `\widetilde W` for universal covers (`surgery-theory.html:372`) while mapping-class-groups uses `\tilde\gamma`/`\tilde X` style only in callbacks — no widetilde appears in target prose, but no collision either.

### Undefined jargon
- "train-track" — first occurrence `mapping-class-groups.html:509` *"the singular train-track that carries $\mathcal{F}^u$"* — used in the §3 prose immediately after the Nielsen–Thurston theorem, with no prereq callback or sketch definition. Train-tracks are a non-trivial concept (a 1-complex with smoothing data carrying a foliation) and the page never defines them, even informally.
- "(projective) measured laminations" — `:523` *"The boundary $\partial\mathcal{T}$ is the space of projective measured laminations, a sphere $S^{6g-7}$"* — used as the headline characterisation of the Thurston boundary without any pointer to a definition. No "measured foliation" or "lamination" is defined on the page (the §3 statement just calls them transverse measured foliations).
- "Heegaard splitting" — first appearance is in §6 prose `:845` *"Heegaard-splitting $\Sigma = H_+ \cup_{F_g} H_-$ along a genus-$g$ surface"* — used as load-bearing setup for the Casson definition without ever being defined or callback-ed. Surgery-theory does the same elsewhere (`:316-317` "Heegaard splittings and diagrams") but flags the topic via a "Used in" backlink to a future Heegaard-Floer page; here it just appears.
- "ASD instantons", "$F_A^+ = 0$" — `:875` introduces both inside a single sentence with no buildup. The accompanying "Where this leads" `.ok` block at `:877` re-uses "ASD $\mathrm{SU}(2)$ moduli" before any reader has been told what an anti-self-dual connection is. Acceptable as a forward pointer if the gauge-theory link existed and were prereq-ed, but `gauge-theory.html` is referenced in the same paragraph and is not yet a registered topic page in the same way the §1–§5 prereqs are.
- "Atiyah–Bott" name-dropped at `:849` (*"…symplectic moduli space $\mathcal{R}^{\mathrm{irr}}(F_g)$ (Atiyah–Bott)"*) without explaining what their construction supplies (the symplectic structure on the character variety). Compare surgery-theory's name-drops which always come with a one-line gloss (e.g. `:464` "Wall computed $L_*(\mathbb{Z}[\mathbb{Z}/2])$ in his 1970 book; the answer involves an extra factor of $\mathbb{Z}/2$ in dimension 2, capturing the Browder–Livesay obstruction.").
- "Lehmer's number" / "Mahler-measure problem" — `:525` — used as a coda flourish without context. Plausibly OK as a "tantalisingly close to" tease, but reader has no anchor to chase.

### Tone mismatches
- _None._ Page voice ("discrete shadow of the (continuous) symmetries", "the dimension where every classical tool fails simultaneously", "tantalisingly close to Lehmer's number") is well aligned with surgery-theory ("the apex statement", "a miracle of dimension $\ge 5$", "a startling appearance of number theory inside differential topology") and algebraic-topology ("gelatinous continuous thing", "gloriously non-abelian"). The §1 take-away `.ok` block and the §6 "Where this leads" block follow the canonical conversational-summary cadence.

### Missing worked examples
- _None._ Every numbered §1–§6 carries a widget (`mg-svg`, `tw-svg`, `pa-svg`, `fn-svg`, `if-svg`, `cas-svg`) with concrete data, plus the §1, §2, §5 sections add a hand-computed presentation/relation table. §7 ("Connections") is unnumbered and intentionally has no widget — matches surgery-theory `:545-557` and algebraic-topology connections-pattern.

### KaTeX macros / formatting
- **Stray draft note shipped to user-visible widget readout.** `mapping-class-groups.html:912` (in the `surgery` entry of the §6 Casson widget data) reads *"λ(S³) + ½·Δ″(1) = 0 + ½·(-2) ... wait: Δ(t) = -t+3-t⁻¹ so Δ″(1) = -2, but the surgery formula uses (1/2n)Δ″(1). For +1-surgery: λ = 0 (figure-8 surgery is hyperbolic but Casson zero)."* — the `... wait:` self-correction is an author thinking-out-loud artefact that renders verbatim into the readout when the user clicks the "+1-surgery on 4₁" button. Either resolve the arithmetic and rewrite the note as a clean explanation, or keep it as a "the surgery formula has a normalisation subtlety" gloss. Highest-priority cosmetic fix.
- §1 widget data labels mix `\\Sigma_2` (escaped LaTeX) with `Σ` (Unicode) inside the same `out.textContent` string — `:371` strips `\\Sigma` to literal `Σ`, but `mod`/`presentation`/`note` strings still contain raw LaTeX (`$\\mathrm{Mod}(S^2)=1$`, `$\\mathrm{SL}_2(\\mathbb{Z})$`, etc.). The readout is plain `<div class="readout">`, not KaTeX-rendered, so the dollar signs leak through visibly. Compare surgery-theory's `wh-out` readout `:660-663`, which writes plain ASCII (`Wh(Z/5) ≅ Z`) without any `$`. Mixed convention; pick one.
- Helper `<script>` block at top of `<body>` (`:193-245`) is the canonical 2D copy from `category-theory.html` — no rewrite. Confirmed against surgery-theory `:193-245` byte-for-byte. Good.
- Widget chrome (`.widget`, `.hd .ttl`, `.hint`, `.row`, `.readout`, `.note`, `.ok`, `.bad`, `.pill`) follows the standard taxonomy throughout §1–§6; no ad-hoc classes. Good.
- Cross-page callback at `:637` points to `./upper-half-plane-hyperbolic.html#metric` — file exists; anchor presence not checked here but the link is structurally correct. The `./gauge-theory.html#donaldson-sw-invariants` link at `:877, 962` and `./moduli-spaces.html` at `:964` point to pages that do exist on disk.

## Severity
minor polish
