# aca-nevanlinna-characteristic

Bespoke widget for **§10 Nevanlinna theory** on the
[advanced-complex-analysis](../../advanced-complex-analysis.html#nevanlinna) topic.

## What it does

For a meromorphic function $f$ on $\mathbb{C}$, the **Nevanlinna
characteristic** is the radial growth function
$T(r,f) = N(r,f) + m(r,f)$,
the sum of a *counting* function $N(r,f)$ (poles of $f$ inside $|z|\le r$,
weighted by multiplicity) and a *proximity* function $m(r,f)$ (mean
$\log^+|f|$ on the circle $|z|=r$). Order $\rho$ is the exponent
controlling how fast $T(r,f)$ grows: $T(r,f) = O(r^\rho)$.

This widget shows the $N$/$m$ split as a stacked bar chart, parameterized
by an order slider $\rho$ controlling a synthetic test function.

**Gesture.** A horizontal slider scrubs the order parameter
$\rho \in (0, 3]$. The SVG redraws a stacked bar chart over a sequence
of radii $r_1 < r_2 < \dots$: each bar splits into a lower (cyan)
$N(r,f)$ component and an upper (yellow) $m(r,f)$ component, with the
total bar height tracking $T(r,f) \sim r^\rho$. As $\rho$ increases, the
total grows polynomially faster.

**Readout.** Reports the current $\rho$, sample $T(r,f)$ values, and the
**defect**
$\delta(a,f) = \liminf_{r\to\infty} \dfrac{m(r,a,f)}{T(r,f)}$,
which the Second Main Theorem caps via $\sum_a \delta(a,f) \le 2$.

## Pedagogy

Nevanlinna theory generalizes Picard's exceptional values from a
qualitative count (≤ 2) to a quantitative defect-sum bound (≤ 2). The
widget makes the $N$/$m$ decomposition viscerally — readers see at a
glance how much of the growth comes from poles vs. boundary excursion,
and watch the defect ratio change as $\rho$ varies.

## Failure modes

- The function isn't a real meromorphic function — the bars are computed
  from a closed-form synthetic model parameterized by $\rho$. Readers
  shouldn't try to chase a specific $f$ from the picture.
- $\rho = 0$ collapses the bar chart to flat zero and makes the defect
  ill-defined; the slider min sits at a small positive value.
- The defect readout is the *limit* defect, computed from the asymptotic
  model — not a numerical limit of finite-$r$ samples (which would
  fluctuate visibly).

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field            | kind        | purpose |
|---|---|---|
| `widgetId`       | fundamental | DOM id for the outer `<div class="widget">`. |
| `title`          | fundamental | Header title (e.g. "Nevanlinna characteristic $T(r,f)$"). |
| `hint`           | fundamental | Header hint (e.g. "drag $\\rho$"). |
| `bodyMarkup`     | *artifact*  | Verbatim inner-body HTML (slider + svg viewport + readout). |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body (slider listener + bar-chart redraw + defect compute). |

## Usage

```json
{ "type": "widget",        "slug": "aca-nevanlinna-characteristic", "params": { ... } },
{ "type": "widget-script", "slug": "aca-nevanlinna-characteristic", "params": { ... } }
```

Both blocks carry the same `params` object (per the current registry
duplication — see widgets/README.md and the open infra task).
