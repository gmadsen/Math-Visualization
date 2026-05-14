# resolution-of-singularities — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** mmp-and-birational-geometry, singular-cubics-reduction

## Summary
Content is in solid shape — six well-structured sections, each with an interactive widget and a sharp working example. The main issue is mechanical, not pedagogical: seven CSS rules in the inline `<style>` block wrap `var(--…)` in single quotes (e.g. `color:'var(--blue)'`), which is invalid and silently no-ops. The peer pages do not have this. Writing voice, KaTeX usage and worked-example density are otherwise on-style.

## Findings

### Notation drift
- `\Spec` is used as a macro at `#curves` (`$C = \Spec A$` / `$\tilde C = \Spec \tilde A$`) — consistent with the page's own `macros` block and with `singular-cubics-reduction.html` (which uses `\Spec\mathbb{Z}` throughout `#reduction`). No drift here.
- Blow-up symbol: target uses `\mathrm{Bl}_0 \mathbb{A}^n`, `\mathrm{Bl}_Z X`, `\mathrm{Bl}_p X` consistently in prose and widgets. `mmp-and-birational-geometry.html` matches with `\mathrm{Bl}_p\mathbb{P}^2` in its `#surfaces` widget title. Aligned.
- Tilde-resolution variable: target uses `\tilde X` for the resolved variety; `mmp` uses both `\tilde X` and `X_{\min}`/`X^+` for distinct objects — no conflict, but worth checking the cross-callback at `mmp#flips` reads cleanly when followed from `ros#statement`.
- Cosmetic: a few SVG `<text>` labels in widgets fall back to Unicode for sub/superscripts (`y² = x³`, `ℙ¹`, `𝔸²/ℤ_n`) instead of KaTeX, matching the reference pages — this is a deliberate convention for SVG labels and is consistent.
- Cusp/node defining equation drifts slightly between pages: target's `#singular` widget and `#curves` widget use `y^2 = x^2 + ax^3` and `y^2 = x^2(1+x)` respectively for the node, while `singular-cubics-reduction#sing` settles on the canonical `y^2 = x^3 + x^2`. All three are equivalent up to coordinate change but a cross-page reader following the `Used in` link will see three different node equations in three minutes. Low-priority cosmetic.

### Undefined jargon
- "strict transform" first appears at `#blowup`: *"…the strict transform $\tilde X \subset \mathrm{Bl}_p X$ — the closure of $\pi^{-1}(X \setminus \{p\})$ — is often less singular than $X$."* The inline gloss is good — keep this pattern; it matches the way `mmp` introduces "klt" with an inline `(Kawamata log terminal)` expansion.
- "exceptional divisor" appears in `#blowup` widget readout (*"x = 0 is the exceptional divisor E ≅ ℙ¹"*) before being defined in prose anywhere on the page. The `#surfaces` section then uses it freely (*"exceptional divisor a tree of smooth rational curves"*) without back-defining. Consider one-sentence inline gloss in the `#blowup` widget caption ("exceptional divisor — the locus that gets crushed onto the blow-up centre").
- "$\mathbb{Q}$-Gorenstein" / "$\mathbb{Q}$-Cartier" do not appear in target prose, but the `#applications` bullet on log resolution mentions "simple normal crossing divisor" without gloss. `mmp-and-birational-geometry#singularities` defines log pairs and SNC, so a callback would help — currently the `#applications` log-resolution bullet has no callback aside.
- "klt" appears nowhere in target prose, even though `#applications` cites BCHM (which is a klt result). Ok if the page intentionally ducks below this layer — the existing forward-pointer to MMP via the `Used in` aside is sufficient.
- "Hilbert–Samuel function" appears in the `#statement` proof sketch with no gloss. One inline phrase ("…tracks a numerical invariant of the local ring at the singularity — the Hilbert–Samuel function…") would help.
- "Bertini-type genericity" in the `#statement` `<div class="note">` is unglossed; this is fine for a sidebar but could read "(generic-hyperplane) Bertini-type" inline.
- "crepant" first appears in `#applications` ("agrees on crepant resolutions") and again in `#connections` ("crepant resolutions of Calabi–Yau orbifolds") with no gloss. A 6-word inline ("crepant — discrepancies all zero") would close it.
- "alterations" is glossed nicely on first use in `#applications` (*"a generically finite cover by a smooth variety in any characteristic"*) — good model for the others above.

### Tone mismatches
- Voice is mostly on-style: short paragraphs, conversational openers, worked examples sandwiched into widgets — matches `mmp-and-birational-geometry` closely. No "dry textbook voice" walls or meme drift.
- Hero `<p class="sub">` opens *"Pinch a curve, crease a surface — algebraic varieties degenerate at points where the Jacobian drops rank."* — strong, on-brand, matches the visceral hero of `singular-cubics-reduction` (*"When the discriminant vanishes, an elliptic curve degenerates into a node or a cusp…"*). Good.
- `#applications` is a bare bullet list. The peer page (`mmp#connections`) does the same shape, so this is consistent — but `singular-cubics-reduction#counting`'s "What this sets up" closer is a notable absence here. Consider a one-paragraph framing sentence before the bullets.
- `#connections` opens with a sharp framing sentence (*"Resolution of singularities sits at a crossroads…"*) — this is the right voice and could be exported to `#applications` as a section opener.

### Missing worked examples
- Sections 1–5 each ship an interactive widget with a worked toy. Solid coverage.
- `#applications` (section 6) has no widget — pure bullet list. The peers diverge: `mmp` ends with bullet-only `#connections`, `singular-cubics-reduction#counting` includes two widgets and a worked conductor example. A small "Tower → MFS / log-resolution split" visual or an SNC-divisor toy would round out the page.
- `#connections` (section 7) is intentionally a navigation map, no widget — consistent with peer `mmp#connections`.

### KaTeX macros / formatting
- The page-level `macros` block declares `\Spec, \Gal, \Hom, \tr, \ad, \ind` — verbatim copy of the canonical block in `category-theory.html` and matched byte-for-byte in both peers. No new macros introduced. Good.
- KaTeX delimiters used in prose: only the standard four (`$…$`, `$$…$$`, plus the implicit `\(…\)`/`\[…\]` from the auto-render config). No reinvention.
- `\;\;\leadsto\;\;` does not appear here (it does in `singular-cubics-reduction#badtypes`); the target uses plain `\to`/`\dashrightarrow`/`\;=\;` spacing — fine.
- Helper `<script>` block (`$`, `$$`, `SVG`, `ensureArrow`, `drawArrow`, `drawNode`) is the verbatim canonical block at lines 187–239. No drift.
- **CSS bug (semantic, not KaTeX, but flagging here for completeness):** seven inline-style rules quote the `var()` value as a string literal — `a{color:'var(--blue)'}` (line 47), `h3{…color:'var(--yellow)'}` (line 53), `button.active{…border-color:'var(--yellow)'}` (line 70), `nav.toc a:hover{color:'var(--yellow)'}` (line 88), `aside.sidetoc a:hover{color:'var(--ink)'}` (line 102), `aside.sidetoc a.active{…border-left-color:'var(--yellow)'}` (line 103), `.small{…color:'var(--mute)'}` (line 107). Both peer pages use `color:var(--blue)` (no quotes) — these rules currently no-op and the page is silently relying on browser defaults / cascading. High priority to fix during the next polish pass.

## Severity
minor polish
