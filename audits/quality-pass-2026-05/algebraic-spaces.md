# algebraic-spaces — pedagogical audit (2026-05)

**Section:** Algebraic geometry
**Compared against:** stacks, schemes

## Summary
Strong page overall: voice, KaTeX macros, helper block, and widget chrome match the canonical template; every numbered section carries a worked widget. The only substantive risks are (a) the section 1 lead lands several technical terms (quasi-separated, properly discontinuous) before any callback, and (b) the closing "Connections" §7 is a list of internal links rather than the explicit "Takeaways" wrap-up that stacks/schemes use.

## Findings
### Notation drift
- _None of significance._ All three pages consistently use `\mathbb{Z}`, `\mathbb{A}^1`, `\Spec` (from the shared macros block), `\mathrm{Aut}`, `\mathrm{Stab}`, `\Delta_X`, `\rightrightarrows`, `\twoheadrightarrow`, `\hookrightarrow`. KaTeX `macros:{…}` block is byte-identical to category-theory.html / stacks.html / schemes.html.
- Cosmetic: §6 widget legend uses `'arr-up-'+i` marker ids — fine, but stacks.html prefers per-widget two-letter prefixes (`gg1`, `dc1`, `co1`). Not a correctness issue.
- Cosmetic: `B(\mathbb{Z}/n)` appears alongside `B\mu_n` (used in stacks §8) for the same idea; both are standard, but cross-page a reader sees the same object as `B(\mathbb{Z}/n)` here and `B\mu_n` in stacks. Pick one in a future polish pass.

### Undefined jargon
- §1 ¶1 (line 272) uses **"properly discontinuous in the étale sense"** and **"quasi-separated"** in the same opening paragraph, before either is defined and without a callback. Quote: _"a Zariski-dense fibre of $\mathbb{Z}$-orbits forces $X$ to fail to be quasi-separated."_ The §1 callback only links to schemes#intro and schemes#locally-ringed-space; schemes.html itself never defines "quasi-separated". The condition is finally explained in §3 ¶3 (line 468). Recommend adding a one-sentence parenthetical at first use ("quasi-separated = diagonal is quasi-compact; see §3").
- §1 ¶1 (line 272) uses **"locally ringed spaces"** parenthetically without a glossary callback or definition. The schemes#locally-ringed-space anchor is in the See-also block but never explicitly invoked from prose.
- §3 ¶3 (line 468) introduces **"unramified"** ("only an étale (or even just unramified) representable diagonal") with no callback; the term reappears in §6 with no definition either. stacks.html similarly uses unramified without definition — so this is corpus-wide drift, not page-local — but worth flagging.
- §6 (line 705) introduces **"monomorphism"**, **"locally closed immersion"**, and **"finite étale group schemes"** in the if-and-only-if list; the diagonal trichotomy is the page's most demanding paragraph and lands three undefined morphism-property terms in two bullets.
- §7 (line 795) drops **"Moishezon manifolds"** and **"maximal transcendence degree"** with no link, no widget, no further definition. Either expand or trim.

### Tone mismatches
- §1 ¶3 (line 274) uses the slogan "as if it were a scheme" in scare quotes — matches stacks/schemes voice well. No issues there.
- §6 (line 696) opens with _"The four-rung hierarchy of algebro-geometric 'spaces'…"_ — the meta-quoting reads slightly drier than stacks.html's "Schemes : Sets :: Stacks : Groupoids" slogan voice. Not a problem, just less punchy.
- §7 (line 776) is titled "Connections" and is a list of `<a>`-tag bullets; stacks.html §11 ("Takeaways") and the canonical category-theory.html closing both use a bulleted slogan recap with `<strong>` headers, plus a `<div class="ok">` "Mental model" pull-quote. The current §7 reads more like a navigational footer than a pedagogical wrap-up. Recommend mirroring the stacks §11 + `.ok` pattern.
- §3 ¶3 (line 468) packs three lettered sub-points (a)/(b)/(c) into a single dense paragraph — stacks.html prefers a `<div class="note">` block for such enumerated subtleties (e.g. stacks §6 "Two concrete facts"). A formatting pass would help readability.

### Missing worked examples
- _None._ Every numbered §1–§6 has at least one widget — proof-scrubber, click-to-highlight relation explorer, two-arrow definition diagram, property-propagation diagram, Hironaka proof-scrubber, four-rung hierarchy. §7 ("Connections") legitimately has no widget by design.
- Minor: §5 ("Examples") covers (i)/(ii)/(iii) in prose but only widgetises (iii). A toggle in the §5 widget to flip between schemes / free quotient / Hironaka would let a reader poke (ii) too. Not a blocker.

### KaTeX macros / formatting
- No locally-defined macros beyond the shared block. `\Spec`, `\Hom`, `\Gal`, `\tr`, `\ad`, `\ind` are the page's macros — identical to stacks.html and schemes.html.
- §3 line 462 uses **`(\mathrm{Sch}/S)^{\mathrm{op}}_{\acute{e}t}`** — the `\acute{e}t` accent on a subscript is unusual KaTeX (works, but visually awkward). stacks.html writes `\mathrm{Sch}^{\mathrm{op}}` and uses prose "(étale)" for the topology rather than building the accent into a subscript. Recommend writing `(\mathrm{Sch}/S)_{\text{ét}}^{\mathrm{op}}` or just spelling it out in prose.
- §1 line 287 inline svg uses literal Unicode `𝔸¹` and `ℤ` inside SVG `<text>` — fine for SVG (not parsed by KaTeX), and stacks.html does the same; consistent.
- §2 widget readout (line 429) introduces `$\\mathrm{Stab}$` as a stand-alone symbol with no subscripted base — schemes.html and stacks.html always write `\mathrm{Stab}_G(x)`. Cosmetic; the readout context makes the omission readable.

## Severity
minor polish
