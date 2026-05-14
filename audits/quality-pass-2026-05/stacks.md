# stacks — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** moduli-spaces, algebraic-spaces

## Summary
`stacks.html` is a strong, well-paced page that earns its capstone level: 6 worked widgets, clean section rhythm, and tight prose. The chief drift is **`\mathrm{Aut}` vs `\operatorname{Aut}` and `\mu_n` vs `\mathbb{Z}/n`** — semantically real disagreements with `moduli-spaces.html` for the same automorphism groups at $j=0$ and $j=1728$. Several technical terms (fppf, Morita equivalence, finite inertia, gerbe) are used without a quick gloss, and the §8 "DM vs Artin" section is the only numbered section with no widget.

## Findings

### Notation drift
- **Aut operator (cosmetic, but corpus-wide):** stacks uses `\mathrm{Aut}` everywhere — `$\mathrm{Aut}$-groups` (§1, line 278), `automorphism group $\mathrm{Aut}(x)$` (§2, line 286), `$\dim \mathrm{Aut}(x) = 0$` (§8, line 689), `$\mathrm{Aut}(E)=\mu_4$` (§9, line 721), `$B\mathrm{Aut}$` (§10, line 828). `moduli-spaces.html` consistently uses `\operatorname{Aut}` in the same role: `$\operatorname{Aut}(E) \cong \mathbb{Z}/6$` (line 324), `$\operatorname{Aut}(C, p_1, \dots, p_n)$` (line 464), `$\operatorname{Aut}(C)$` (line 508). `category-theory.html` uses `\operatorname{...}` for non-macro operator names (e.g. `\operatorname{Nat}`, `\operatorname{ob}`, `\operatorname{Bilin}`). Recommend: settle on `\operatorname{Aut}` (or, even cleaner, add `'\\Aut':'\\operatorname{Aut}'` to the macro list and use `\Aut`).
- **Cyclic-vs-µ for elliptic-curve automorphism groups (semantic — high priority):** §9 of stacks says $j=1728$ has `$\mathrm{Aut}(E)=\mu_4$` and $j=0$ has `$\mathrm{Aut}(E)=\mu_6$` (lines 721–722). `moduli-spaces.html` at the same physical fact says `$\operatorname{Aut}(E) \cong \mathbb{Z}/4$` and `$\operatorname{Aut}(E) \cong \mathbb{Z}/6$` (lines 324–325). Two readers cross-referencing the pages will see different group symbols for the same group. Over an alg-closed base they're isomorphic, but `\mu_n` and `\mathbb{Z}/n` are non-isomorphic group schemes outside char 0 (mass at the singular fibres of `\mathcal{M}_{1,1}` over `\mathbb{Z}`), so they are not interchangeable. Either pick one and stick to it across the two pages, or add a one-line reconciling sentence in §9 ("over $\overline{\mathbb{Q}}$ this is $\mathbb{Z}/4$; we write $\mu_4$ to remember the étale group-scheme structure").
- **Stabiliser operator:** stacks §6 writes `$\mathrm{Stab}_G(x)$` (line 598); algebraic-spaces uses the same form `$\mathrm{Stab}$` (line 429). Consistent — no action needed, but if you switch Aut to `\operatorname{...}`, switch Stab too.
- **Cyclic group rendering inside widget bodies:** widget readouts/SVG strings in stacks use ASCII `Z/2`, `S_3`, `μ_6` (lines 307, 319, 326, 539–546, 745). moduli-spaces does the same in widget bodies. Fine — but the §9 W5 readout mixes `μ_6` and `μ_3` while the surrounding prose talks about `\mathbb{Z}[i]` and `\mathbb{Z}[\zeta_3]` for CM rings; the µ-vs-Z drift is therefore visible inside one section.

### Undefined jargon
- **"fppf"** appears in §4 in `<div class="note"><strong>Stack.</strong> ... typically étale or fppf` (line 419) and again in §11 takeaways (line 842). It's never expanded ("fidèlement plat de présentation finie") nor linked to a topology page. Algebraic-spaces uses only "étale". A one-line gloss on first use, or a callback to a topology page, would close the gap.
- **"Morita equivalence"** appears once at the end of §7: "A DM stack *is* such an étale groupoid object, up to Morita equivalence." (line 630). Drops the term cold with no explanation and no callback. For a notebook page this is a 1-sentence parenthetical at most.
- **"finite inertia"** is the precondition of the Keel–Mori statement in §10 (line 774): "For a DM stack $\mathcal{X}$ of finite type with finite inertia ...". The inertia stack is never introduced. Either gloss ("inertia stack — the relative automorphism stack $I_{\mathcal{X}} = \mathcal{X}\times_{\mathcal{X}\times\mathcal{X}}\mathcal{X}$") or weaken to "with finite automorphism groups."
- **"gerbe quotient"** in §10 (line 828): "the map $\pi$ is *not* a gerbe quotient in general." Term used once with no definition or callback. Can be paraphrased without losing meaning.
- **"Galois group ... $\mathrm{GL}_2(\mathbb{Z}/N)/\{\pm1\}$"** in §9 (line 717): the `/{\pm1\}` quotient is asserted without explanation (it accounts for the [-1] hyperelliptic involution, which is exactly the page's running thread — a ten-word aside connecting it would be very on-brand).

### Tone mismatches
- The page is overall tonally consistent with `category-theory.html` and the references — conversational, with second-person "you" and worked toys. No meme/over-casual drift.
- §8 ("Deligne–Mumford vs. Artin") leans **dry-textbook**: a definition box, a bulleted comparison list, three example bullets, a guidance box. It reads like the briefest possible reference card and is the section where the page most resembles a Wikipedia stub. Compare with `algebraic-spaces.html` §6 ("Algebraic spaces sit between schemes and DM stacks") which covers the same hierarchy but with the four-rung interactive widget — stacks could borrow that gesture.
- The §10 ("Coarse moduli map") closing sentence — "you are allowed to use them, you just know they are lossy" — is the page at its best, and a good model for the tonal target. Several other section closings are flatter ("This is exactly the tractability you want." §7, line 678) and could borrow the same sting.

### Missing worked examples
- **§8 "Deligne–Mumford vs. Artin"** has no widget at all — the only numbered section besides §11 (Takeaways) without one. The natural toy already exists nearby: `algebraic-spaces.html` §6 has the `w-hierarchy` four-rung clickable diagram (Schemes ⊂ algebraic spaces ⊂ DM stacks ⊂ Artin stacks). Either link out to it explicitly, or scaffold a sibling widget here showing how the diagonal property (locally closed immersion / monomorphism / unramified / representable) tightens going down.
- **§9 W5 ($j$-line)** is hover-only with two stacky points decorated. The widget shows the answer but there's no toy to *poke* — no slider, no toggle. A small lift: "click a generic tick → readout says 'Aut = µ₂'" would make it more in line with the other 5 widgets on the page.
- **§7 "Deligne–Mumford stacks"** lacks a quiz placeholder despite being a definition-heavy section with its own concept. (Sections 2, 4, 7, 9 also have no quiz. Compare with `algebraic-spaces.html` where every numbered section ends with a `<div class="quiz">`.) Worth checking the concept-graph; if these correspond to concepts at all, they should have placeholders, or the orphan concepts should be merged.

### KaTeX macros / formatting
- Helper `<script>` block at top of `<body>` is a near-verbatim copy of `category-theory.html` plus one local extension: `drawLoop(svg, cx, cy, label, color, markerId)` (lines 234–243). Used by W1 and W3 for automorphism self-loops. This is a legitimate page-local addition (no other page needs it) — fine, but worth either (a) hoisting into the shared helper if a second page wants self-loops, or (b) leaving a `// page-local: drawLoop` comment so future maintainers don't think it's part of the canonical helper.
- KaTeX macro list (`\Spec, \Gal, \Hom, \tr, \ad, \ind`) matches references verbatim. Good.
- No new local macros invented in `\macros{}`. Good.
- Delimiter set `$…$ / $$…$$ / \(…\) / \[…\]` matches references. Good.
- Widget labels: `W1`, **`W·A`** (§3, line 347), `W2`, `W3`, `W4`, `W5`, `W6`. The `W·A` is an oddball "appendix-style" label inserted between `W1` and `W2`; the rest of the corpus uses `W<n>`. Re-number to `W2` and shift downstream, or label it `W2a` if it's intentionally a sidebar.
- Widget chrome (`.widget`, `.hd`, `.ttl`, `.hint`, `.row`, `.readout`, `.note`, `.ok`) is used correctly throughout. No ad-hoc classes spotted. `<title>` elements present on every SVG. Good.
- Section §4's `<div class="note">` for the **Stack** definition is an `<ol>` of two items inside the violet note — fine, but the same content in moduli/algebraic-spaces tends to live in the prose flow with bolded sub-headings. Cosmetic.

## Severity
minor polish
