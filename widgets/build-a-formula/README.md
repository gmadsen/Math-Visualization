# build-a-formula

Self-contained **"compose-and-evaluate"** engine for first-order satisfaction
over one binary relation $R$ — the corpus's `compose-evaluate` gesture (the
symbolic-input modality it otherwise lacks: you *assemble* a formula rather than
pick one). The reader builds a sentence by clicking **prefix tiles** (quantifiers
$\forall/\exists$ over $x,y$; the connectives $\land\lor\lnot\to$; the atoms
$R(x,y),R(y,x),R(x,x),R(y,y),x=y$); the engine parses it to an AST and evaluates
it on several small structures (finite directed graphs), marking live which ones
**model** it. First home: `first-order-logic-and-completeness §semantics`.

Complements the section's `fol-model-checker` (which fixes the sentences and lets
you edit the *structure*); this fixes the structures and lets you build the
*sentence*.

## The gesture

- **Click a tile** to append it (in prefix order — quantifiers and ¬ take one
  following subformula, ∧/∨/→ take two). The formula display and the ✓/✗ marks
  update live; the tiles disable once the sentence is complete. **⌫** removes the
  last tile, **clear** empties. A free variable ⇒ "not a sentence — bind it".

## Division of labor

This widget is concept-specific (FO over one binary relation); it has no author
`bodyScript`. The renderer owns the tile palette, the prefix builder, the
well-formedness check, the FO evaluator (recursive over the AST and the finite
domain), the per-structure digrams + satisfaction marks, and the readout. The
**structures** (and optional **preset** sentences) are author-supplied.
jsdom-safe.

## Params

| param | required | default | meaning |
|---|---|---|---|
| `widgetId` / `formulaId` / `svgId` / `outputId` / `title` | ✓ | — | DOM ids + title |
| `structures` | ✓ | — | `[{label, n, edges:[[i,j],…]}]` — finite digraphs |
| `presets` | | — | `[{label, tokens:[…]}]` starter sentences (prefix tile keys) |
| `hint` / `svgTitle` | | — / `title` | hint / accessible SVG title |
| `viewBox` / `svgWidth` / `svgHeight` | | `0 0 600 220` / 600 / 220 | SVG geometry |

Tile keys: `Ax Ex Ay Ey` (∀x ∃x ∀y ∃y), `NOT AND OR IMP`, `Rxy Ryx Rxx Ryy EQ`.

## Usage

```json
{ "type": "widget", "slug": "build-a-formula", "params": {
  "widgetId": "w-bf2", "formulaId": "bf2-f", "svgId": "bf2-svg", "outputId": "bf2-out",
  "title": "…",
  "structures": [
    { "label": "empty", "n": 3, "edges": [] },
    { "label": "cycle", "n": 3, "edges": [[0,1],[1,2],[2,0]] }
  ],
  "presets": [
    { "label": "every node has an out-edge", "tokens": ["Ax","Ey","Rxy"] }
  ]
} },
{ "type": "widget-script", "ref": "w-bf2" }
```

Then `node scripts/rebuild.mjs --only widget-params` (AJV) and
`node scripts/rebuild.mjs` (byte-identical round-trip).

## Authoring notes

- Sentences are built in **prefix** (Polish) order, so no parentheses or parsing
  ambiguity — the well-formedness counter knows exactly when the sentence is
  complete.
- The evaluator is exact FO model checking over the finite domain $\{0,\dots,n-1\}$;
  keep domains small (the cost is $n^{(\text{quantifier depth})}$).
- A formula with a free variable is reported as "not a sentence" (its truth would
  depend on the assignment) rather than evaluated.
- Colour tokens only (`var(--green)` ✓, `var(--pink)` ✗, `var(--cyan)` the
  count, `var(--mute)`/`var(--ink)` the diagrams), never hex.
