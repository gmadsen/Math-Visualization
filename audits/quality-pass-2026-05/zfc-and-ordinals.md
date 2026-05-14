# zfc-and-ordinals — pedagogical audit (2026-05)

**Section:** Logic & Foundations
**Compared against:** naive-set-theory, forcing-and-independence

## Summary
Strong page overall — eight well-paced sections, six interactive widgets, the ordinal-arithmetic calculator is the standout. Main drift is a minor `\mathbb{}` brace-style inconsistency vs `naive-set-theory`, a thin worked-example showing in §7 (Inaccessibles/Grothendieck), and a few terms (DC, GCH, Cantor normal form) used before they are defined.

## Findings

### Notation drift
- `\mathbb N`, `\mathbb R`, `\mathbb Z` appear unbraced in the target (e.g. §3 `n_i\in\mathbb N_{>0}`; §4 `\mathbb R \hookrightarrow \mathcal P(\mathbb Q)`; §6 `|\mathbb R|=2^{\aleph_0}`), while `naive-set-theory` consistently writes `\mathbb{N}, \mathbb{R}, \mathbb{Z}` with braces. Cosmetic but the page is internally inconsistent — recommend `\mathbb{X}` everywhere to match the prereq page.
- `\mathcal P` vs `\mathcal{P}` likewise drifts: target §1 hierarchy uses `\mathcal P(V_\alpha)`, target §4 uses `\mathcal P(\mathbb Q)`, but `naive-set-theory` everywhere writes `\mathcal{P}(A)` with braces.
- CH abbreviation: target writes plain text `CH` in prose but switches to `\mathrm{CH}` once at the end of §5 (`M[G]\models\neg\mathrm{CH}` — wait, that's in the forcing peer; the target uses `\text{(CH)}` once on line 856 and otherwise plain `CH`). `forcing-and-independence` is consistent — `\mathrm{CH}` and `\neg\mathrm{CH}` in display math, plain `CH` in prose. Recommend matching the forcing peer's convention since the same machinery is being discussed.
- Cofinality is good: both `cardinals` section and the forcing peer use `\operatorname{cf}` consistently.

### Undefined jargon
- §1 widget readout uses `ℵ₀ (already infinite)` for `|V_ω|`; `ℵ₀` is not defined until §4. Minor — most readers will already know it from `naive-set-theory`, but a one-line forward callback would close the loop.
- §3 widget readout for `omegasq`: `the Cantor normal form lives here: any α < ε₀…`. Cantor normal form is then defined immediately below in the §3 prose, but the widget output appears first; consider reordering or a parenthetical "(see below)".
- §5: "ZF + DC (dependent choice)" — DC is parenthesized but never actually defined (what makes it weaker than AC). One-sentence gloss would help.
- §6 table "Gödel … builds the constructible universe `L`" and "GCH" appears in the §1 callback widget caption (`L \models$ GCH`) without defining GCH. The forcing peer at least spells it out: "generalized continuum hypothesis: 2^ℵ_α = ℵ_{α+1}". Recommend a one-line gloss on first GCH mention.
- §7 widget readout uses "stationary set" (Mahlo description) and "tree property" (weakly compact) and "κ-complete ultrafilter" (measurable) — three pieces of jargon stacked without definition. This widget is essentially a name-drop tour; that's defensible at this depth, but flag at least one ("stationary") since it isn't covered anywhere else in the corpus.

### Tone mismatches
- §5 ("The axiom of choice") is noticeably terser than its peer at `naive-set-theory#choice`. The peer opens with Russell's shoes-vs-socks intuition before formalism; the target jumps straight into the formal statement. For a page tagged `intermediate` this is consistent enough, but a one-sentence motivating image up front would echo the house voice.
- §7's large-cardinal paragraph ("Mahlo, weakly compact, measurable, …, supercompact, Woodin, and Reinhardt") is a name-drop wall — denser than the peer pages allow themselves to get. The widget below partially redeems it, but consider one line of motivation per tier in prose ("each rung above is a stronger consistency commitment") rather than relying on the widget to do all the work.
- §8 ("Connections") matches the forcing peer's outro style well — short, link-rich, no widget. Good.

### Missing worked examples
- §7 Grothendieck universe subsection ends with the Theorem statement and a "practical translation" note but has no concrete computation. The schematic "tier" widget covers large cardinals generally but doesn't let the reader poke at a Grothendieck universe (e.g. show that `V_ω` is closed under pairing/union but fails the inaccessible condition; or list which `V_κ` are universes). One toy bridging "definition → V_κ" would match the rigor of the §1–§4 widget pattern.
- §5 choice widget lets you pick from finitely many bins, which is the case AC is *not* needed for. The widget would teach more if it gestured at the infinite case (e.g. an "imagine ω-many bins" greyed-out continuation, or a contrast button showing "pick rule" available for naturals but not for socks-pairs). As written it's pleasant but doesn't dramatize the AC asymmetry.
- §3's Cantor normal form is described in prose only; given that the calculator above already lists CNF results in its readout, a small "verify your answer is in CNF" toy would pay for itself cheaply.

### KaTeX macros / formatting
- `\restriction` in §2 (`F\!\restriction\!\alpha`) is standard KaTeX but doesn't appear in either reference page. Either keep (it's the right symbol) and accept it as a one-off, or substitute `F|_\alpha` to match the pages that don't reach for it.
- Mixed brace styles (see "Notation drift" above) are the one consistent low-priority polish item.
- Helper-block (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) is a verbatim copy of the canonical 2D block — clean.
- All widgets use the standard `.widget / .hd / .ttl / .hint / .readout / .row / .note / .ok / .bad` chrome. No ad-hoc classes.
- Two `<svg>` ids in §5/§6 share the `ch-` prefix (`ch-svg` for the choice widget; `ch-svg2` for the continuum-candidates widget). They don't actually collide because each handler queries by its own id, but a non-overlapping prefix (`choice-svg` vs `ch-svg`) would prevent future copy-paste accidents.

## Severity
minor polish
