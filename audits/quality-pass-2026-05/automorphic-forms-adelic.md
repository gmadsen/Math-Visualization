# automorphic-forms-adelic — pedagogical audit (2026-05)

**Section:** Modular forms & L-functions
**Compared against:** hecke-operators, langlands-program

## Summary
A dense, well-structured advanced-level page with clean widget chrome and an excellent classical→adelic spine; the main pedagogical risks are (1) several technical terms (admissible, generic, induced rep, root datum, Plancherel, hermitian domain) used before any callback or definition, and (2) cosmetic notation drift versus the sibling `langlands-program.html` which defines `\GL`/`\Sym`/`\Frob` macros that this page redundantly long-hands.

## Findings
### Notation drift
- **`\mathrm{GL}_n` long-form vs `\GL` macro.** Target writes `\mathrm{GL}_2(\mathbb{A}_\mathbb{Q})` everywhere (e.g. §1 `<h2>` "$\mathrm{GL}_2(\mathbb{A}_\mathbb{Q})$ as a restricted product"); `langlands-program.html` head defines `'\\GL':'\\mathrm{GL}'` and uses `\GL_n` in TOC/body (`#local`: "Local Langlands for $\GL_n$"). Same molecule, two spellings inside one section. Cosmetic — recommend either adding `\GL`/`\SL`/`\Sp`/`\PGL` macros to this page's KaTeX header (already present on langlands-program) or accept verbose form as house style; pick one and document.
- **`\mathrm{Sym}` vs `\Sym`.** Target §9 uses `\mathrm{Sym}^k` ("symmetric powers $\mathrm{Sym}^k$"); langlands-program defines `'\\Sym':'\\mathrm{Sym}'` and writes `\Sym^k`. Cosmetic but adjacent pages should agree.
- **`\mathrm{Frob}` vs `\Frob` macro.** Not used in target prose, but worth noting: `langlands-program.html` defines `\Frob`; if a future edit adds Frobenius traces (a natural extension at §5/§9), prefer the macro for consistency.
- **`\mathbb{A}_\mathbb{Q}` vs `\mathbb{A}_F`.** Target uses subscripted $\mathbb{A}_\mathbb{Q}$ in prose but bare $\mathbb{A}$ inside the §3 cusp-form integral (`\int_{\mathbb{Q} \backslash \mathbb{A}}`) and §6 (`\psi : \mathbb{Q} \backslash \mathbb{A} \to \mathbb{C}^\times$`). Reader-friendly to be consistent within one page.
- **Hecke-algebra letter.** Target §4–§5 uses `\mathcal{H}_p` (calligraphic H); hecke-operators §4 uses `\mathbb{T}_k` (blackboard T). Different objects (local-spherical vs global), so semantically correct, but worth a one-liner reminder pointing readers to the hecke-operators page where the global $\mathbb{T}_k$ is introduced.
- **Greek-letter-in-`<option>` rendered as plain text.** §4 dictionary widget has `<option value="form">$f \in M_k(\Gamma_0(N))$</option>` etc. The page does load `js/katex-select.js` (line 178), so this is wired correctly; flagging only because dropping that loader silently breaks the labels — keep the dependency in mind on future edits.

### Undefined jargon
- **"irreducible admissible $\pi_v$"** — first used §6 (line 783) "an irreducible admissible $\pi_v$ that is generic"; "admissible" is never defined or callback-linked. Reader at this section level needs at minimum a parenthetical or a `<aside class="callback">` to a representation-theory page.
- **"generic"** — defined inline by `(= admits any such $\Lambda \ne 0$)` in §6, which is good; but "generic representation" is then used in the abstract sense without flagging that "generic" is the standard technical term. Minor.
- **"induced representation $\mathrm{Ind}_B^G \chi_s$ from the standard Borel $B$"** — §8 line 991. "Induced" and "Borel" both first appear here, no definition, no callback. Sentence: "For $\phi$ a section of an induced representation $\mathrm{Ind}_B^G \chi_s$ from the standard Borel $B$…". Compare langlands-program §3 which at least says "Bernstein–Zelevinsky" while leaving the parts unexplained (also a sin, but it's clearly a tour-style page; this page is more deeply technical and the gap is more felt).
- **"hermitian domain"** — §7 line 880 "the symmetric space for $\mathrm{GL}_n(\mathbb{R})$ at $n \ge 3$ is not a hermitian domain". First occurrence; never defined.
- **"root datum" / "based root datum"** — §9 lines 1152, 1165. Used to define the dual group; reader who doesn't already know is stuck.
- **"Casselman–Wallach moderate-growth theory"** — §3 widget readout "Without 𝔷-finiteness, no Casselman–Wallach moderate-growth theory". First and only mention; pure name-drop.
- **"Plancherel formula"** — §8 note line 1011 "Selberg's Plancherel formula has no kernel". First mention; reader expected to know spectral theory of locally compact groups.
- **"trace formula" / "Arthur–Selberg trace formula"** — first appears §8 line 1011, then §9 line 1192 with a paragraph. Slightly redundant: the §8 mention precedes the §9 paragraph and is jargon at point of use; a forward-pointer ("see §9") would close the loop.
- **"Cartan decomposition"** — §5 line 651 "By the Cartan decomposition, every element of $\mathrm{GL}_2(\mathbb{Q}_p)$ lies in a unique double coset…". Used as a black box; a one-line remark or a callback to lie-groups.html would help.
- **"Gelfand pair"** — §5 line 656 "$(\mathrm{GL}_2(\mathbb{Q}_p), \mathrm{GL}_2(\mathbb{Z}_p))$ is a Gelfand pair." First and only mention; named property without definition.
- **"Tate's thesis pattern"** — not in target, but appears in the sibling langlands-program §2; if you add it on a future edit, watch the same gap.
- (Mitigating note: the page is `data-level="advanced"` and the audience is graduate, so some of the above are acceptable as live-fire vocabulary; the hardest ones to defend on pedagogical grounds are admissible / Borel / induced / root datum, all of which would be a one-sentence callback.)

### Tone mismatches
- **Hero `<p class="sub">` is good** — first-person plural is implicit, the second sentence "This is the entry door to the Langlands programme" matches the conversational pull-through that langlands-program §1 uses ("The Langlands philosophy is that *arithmetic rigidity = analytic flexibility*…").
- **§5 §7 §9 drift toward dry textbook voice.** Several long expository runs are entirely third-person ("Fix a prime $p \nmid N$, an unramified prime", "Let $G$ be a connected reductive group over $\mathbb{Q}$…", "To a cuspidal automorphic representation $\pi$…") with no narrator interjection, no "you" / "we", no "the slick proof goes through" register that hecke-operators §4 (line 736) uses to soften a definition wall. Compare hecke-operators §1 line 263 ("among all weight-$k$ modular forms, which ones are *distinguished*…?") and the chatty §1 of langlands-program ("The arithmetic side is rigid. The analytic side is flexible. The Langlands philosophy is that…"). Recommend at least one narrator beat per dense subsection — even a single "Why this works:" or "The point is:" sentence.
- **§9 functoriality bullet list is solid** — the "Three landmark cases tell most of the story" framing matches house tone well. Good benchmark to lift to other sections.
- **Widget readouts are fine** — concise, ASCII-friendly, present-tense; matches both refs.

### Missing worked examples
- All nine sections do contain a widget — coverage is complete. The qualifications:
  - **§6 widget** (local conductor ladder) hard-codes `cp = 2` as a "toy local conductor exponent" with no UI to vary it. The reader cannot poke the very parameter the section is about. Either expose `c_p` as a 0–4 selector, or pin a real example (e.g. "this is what $\Gamma_0(11)$ looks like at $p=11$ for a weight-2 newform").
  - **§7 widget** (local factor builder) uses fabricated Satake parameters for $p=2,3,5,7$ ("toy Satake parameters … for visualization"), and the comment says it's a stand-in for $\Delta$. Compare hecke-operators §7 widget which plots the **actual** Euler factor of $\Delta$ at chosen $p$ using real $\tau(p)$ — much more pedagogically grounded. Recommend wiring §7 to a real eigenform (the same $\tau(p)$ table sits one page over in `hecke-operators.html`).
  - **§9 widget** is text-table on a click, not an interactive computation — acceptable for a conjectural-framework section, matches langlands-program's static SVG philosophy diagram.

### KaTeX macros / formatting
- **No new macros introduced** — head block is identical to category-theory.html / hecke-operators.html (Spec/Gal/Hom/tr/ad/ind). Good.
- **Local one-shot operator names in body** — `\mathrm{Wh}_\psi` (§6), `\mathrm{Ind}_B^G` (§8), `\mathrm{Sym}^k` (§9), `T_p^{\mathrm{loc}}` (§5). All are inline `\mathrm{…}` rather than `\operatorname{…}`. Minor inconsistency with the macros file (Hom/Gal/etc. are operatorname). Safe under either spelling but worth noting.
- **`\boxplus`** — used §9 ("$\chi \boxplus \chi'$") and §9 bullet ("$\chi \boxplus \cdots \boxplus \chi$"). Standard KaTeX, fine; no definition is given of the isobaric-sum symbol though, so this is jargon-by-symbol — a parenthetical "(isobaric sum)" the first time would help.
- **Character `${}^L G$`** — left-superscript notation. Standard but unusual outside automorphic forms; first use §9 line 1165 explains the construction immediately, so OK.
- **Fraktur `\mathfrak{z}` / `𝔷`.** §3 prose uses `\mathfrak{z}`-finiteness (LaTeX); §3 widget readout uses the literal Unicode character `𝔷-finite`. Mixing rendered KaTeX and Unicode for the same symbol is OK in widget readouts (KaTeX doesn't render in `.readout` `font-family:ui-monospace`), but flag for awareness.
- **Delimiters used:** only `$…$` and `$$…$$` — within house spec.

### Helper-block / widget-chrome hygiene
- **Top-of-body helper block (lines 187–239)** is the canonical 2D block — `$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode` — byte-for-byte identical to hecke-operators (lines 185–234) and category-theory. No drift.
- **Widget chrome:** every `<div class="widget">` uses the standard `<div class="hd"><div class="ttl">…</div><div class="hint">…</div></div>` header. `.row`, `.readout`, `.pill`, `.note`, `.ok`, `.bad` used appropriately; no ad-hoc class introductions. Clean.
- **Page scaffold:** top-nav back-link, `<aside class="sidetoc">`, `MVQuiz.init('automorphic-forms-adelic')` footer, `data-section="modular-forms-and-l-functions" data-level="advanced"` all present and correct.
- **Color tokens:** widget SVGs use `var(--cyan)`, `var(--violet)`, `var(--yellow)`, `var(--mute)` etc. — no raw hex inside widget markup. (One incidental hex `#fff` on the §5 marker outline `stroke:'#fff'` line 744; minor, and category-theory has the same pattern in places.)
- **`<title>` elements present** on every interactive SVG (§1 implicit, §2 line 394, §3 line 510, §5 line 680, §6 line 800, §7 chart, §8 line 1004, §9 line 1179) — accessibility ok.
- **Callbacks and backlinks:** all idempotent fences (`callback-auto-begin/end`, `backlinks-auto-begin/end`) intact. Cross-topic prereqs visibly point to `adeles-and-ideles`, `modular-forms`, `hecke-operators`, `L-functions`, `class-field-theory`, `sato-tate`, `shimura-varieties`, `langlands-program` — coverage is dense, in keeping with this page's hub role.

## Severity
minor polish

---
_The orchestrator runs `node scripts/rebuild.mjs` after any content changes._
