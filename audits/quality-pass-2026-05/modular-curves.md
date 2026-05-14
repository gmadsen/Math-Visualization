# modular-curves — pedagogical audit (2026-05)

**Section:** Modular forms & L-functions
**Compared against:** modular-forms, shimura-varieties

## Summary
A strong, widget-rich page (10 sections, 9 interactive widgets) whose voice and notation track modular-forms.html closely. Drift is mostly cosmetic: a single upper-half-plane symbol slip in the outro, a `<span>` vs `<div>` widget-chrome inconsistency, and a handful of jargon terms (Tate module, Néron–Tate height, modular parametrization, Hecke algebra `\mathbb{T}`) referenced in late sections without an in-page gloss.

## Findings
### Notation drift
- Upper half-plane is `\mathcal{H}` throughout §1–§9 (matches modular-forms §1.5: "$\mathrm{SL}_2(\mathbb{Z}) \backslash \mathcal{H}$"), but the §10 outro slips to `$\mathbb{H}/\Gamma_0(N)$` (modular-curves.html:1638). Cosmetic; pick one and stick with it. (Shimura-varieties uses `\mathbb{H}^\pm` legitimately as a different object, so cross-page disagreement is fine — only the in-page slip is the issue.)
- `\Gal(\overline{\mathbb{Q}}/\mathbb{Q})` (using the `\Gal` macro) at line 1012 vs spelled-out `\mathrm{Gal}(H_D/K)` at line 1446. Both pages defined `\Gal` in the same macro block; standardize on the macro.
- §1 widget readout writes `[SL2:Γ0(11)]` (plain ASCII pill) while the surrounding KaTeX uses `[\mathrm{SL}_2(\mathbb{Z}):\Gamma_0(N)]`. Modular-forms widget 1 has the same compromise (readout in plain text), so this is a corpus convention rather than drift — flagged only because the widget hint mixes the two registers within a single tile.
- "Cyclic subgroup `\langle 1/N \rangle`" in §2 widget hint vs "$\langle \tfrac{1}{N} \rangle$" in the body (line 429). Cosmetic.

### Undefined jargon
- §4 paragraph after the Eichler–Shimura widget refers to "Each <em>newform</em> $f \in S_2(\Gamma_0(N))$" (line 835) — but "newform" is not defined until §7 ("the old/new decomposition", lines 1158, 1292). A forward-reference in parentheses, or a one-clause gloss ("a Hecke eigenform not arising from lower level"), would close the gap.
- `\mathbb{T}` (the Hecke algebra) appears at line 1605 ("Eisenstein ideal $I \subset \mathbb{T}$") with no prior definition on this page or callback to one. The symbol `\mathbb{T}` is introduced cold inside the Mazur exposition; modular-forms.html:1124 uses `\mathbb{T}_k \subset \mathrm{End}(S_k)` with the surrounding sentence naming it.
- "Tate module" at line 837 ("$\ell$-adic Tate module recovers exactly the Galois representation attached to $f$") — undefined, no callback in §4. The §10 outro callback to `galois-representations.html` exists but is six sections later.
- "Néron–Tate height" via `\widehat{h}(y_K)` at line 1450 — symbol introduced without naming, then immediately used in Gross–Zagier.
- "modular parametrization $\phi : X_0(N) \to E$" at line 1446 is dropped in mid-sentence on first use; a half-clause naming it would help.
- "formal-immersion argument" at line 1605 is treated as known terminology; no callback to a definition. (Shimura-varieties.html parallels this with "neat $K$" but at least labels it ("for neat $K$") and has a Baily–Borel callout.)

### Tone mismatches
- §10 ("Connections") closes with a paragraph beginning "Open frontiers:" (line 1644). It lists four research directions in a single dense run-on sentence ("rational points on $X_0(N)$ for general $N$ beyond Mazur's level-lowering range; the Beilinson conjectures …; the geometric Langlands program …; explicit higher-rank Heegner-style constructions …"). Modular-forms.html's analogous wrap-up at §8 ("Where this page ends", lines 1126–1134) breaks the same kind of list into bullets and adds a one-sentence framing. Consider a similar treatment so the closer doesn't read as a lit-review aside.
- §7 paragraph at line 1163 ("Each $w_d$ commutes with every Hecke operator $T_p$ for $p \nmid N$") is a high-density formula sentence ending in `$\varepsilon(L(f, s)) = -\varepsilon_N(f)$` for a newform of weight 2 and level N — no narration of what the functional-equation sign means or why the reader should care. Adjacent peers (modular-forms §9 Petersson) consistently sandwich each formula with a one-sentence "why" before moving on.

### Missing worked examples
- _None._ Each numbered `<h2>` §1–§9 has at least one widget; §10 ("Connections") is a pure-prose outro and matches the convention of shimura-varieties §7 ("Connections") and modular-forms §8 wrap-up — no fix needed.

### KaTeX macros / formatting
- Macro block (lines 22–29) is identical to modular-forms and shimura-varieties — no invented macros, all of `\Spec / \Gal / \Hom / \tr / \ad / \ind` declared in the head and used consistently.
- Widget 9 (Mazur, line 1515) has a confusing `STATUS[12]` example string: `"E: y² = x³ − 4x;  E(ℚ)_tors ≅ ℤ/12 not direct, but ℤ/2 ⊕ ℤ/6 occurs at level 30"`. ℤ/12 IS one of Mazur's allowed cyclic groups (the widget itself lists it in `cyc`), so "not direct" reads as either a typo or a confusion with the ℤ/2⊕ℤ/2n family; the example sentence undercuts the widget's own correct UI. **Semantic, not cosmetic.**
- Widget chrome cosmetic drift: target uses `<span class="ttl">…</span><span class="hint">…</span>` (line 274) inside `<div class="hd">`, while shimura-varieties (line 292) and the canonical `category-theory.html` use `<div class="ttl">…</div><div class="hint">…</div>`. The `.hd` flexbox tolerates both, so this is purely visual; flagged for consistency with the canonical template.
- KaTeX inside `<option>` labels in §1, §2, §3, §6, §7, §8, §9 widgets — `js/katex-select.js` IS loaded (line 178), so labels render correctly. No action needed; just confirming the dependency is wired.
- §6 widget caption labels a cusp "ℚ-rational" iff `item.gd === 1 || item.gd === 2` (line 1095) but the surrounding prose only says "for general $d$ the Galois group acts non-trivially on the parameter $a$" without spelling out the `gcd ≤ 2` criterion that the widget actually applies. A one-line gloss above the widget ("a cusp class is individually ℚ-rational iff $\gcd(d, N/d) \le 2$") would make the color-coding self-explanatory.
- Helper-block (lines 187–236, `$, $$, SVG, ensureArrow, drawArrow, drawNode`) is a verbatim copy of the canonical category-theory.html block. Clean.

## Severity
minor polish

---
_Reminder: orchestrator should run `node scripts/rebuild.mjs` after any content change._
