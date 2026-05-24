# info-cramer-rao

Bespoke module for **information-theory** §8 (Fisher information and the
Cramér–Rao bound). Makes concrete that Fisher information is the curvature of
the log-likelihood and that it sets a hard floor on estimator variance.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

Pick a one-parameter family — Bernoulli($\theta$) with
$I(\theta)=1/[\theta(1-\theta)]$, Gaussian mean $N(\theta,1)$ with $I=1$, or
Poisson($\lambda$) with $I(\lambda)=1/\lambda$ — and slide the parameter and the
sample size $n$. The widget reports the Fisher information
$I(\theta)=\operatorname{Var}(U_\theta)=-\mathbb{E}[\partial_\theta^2\log p]$ and
the Cramér–Rao bound $\operatorname{Var}(\hat\theta)\ge 1/(nI(\theta))$. It plots
variance against $n$: the bound's $1/n$ decay (yellow floor), the MLE — the
sample mean — riding exactly on it (green dots, *efficient*), and a naive
single-observation estimator pinned at $1/I(\theta)$ far above the floor (pink),
making "curvature = informativeness" visible.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "info-cramer-rao", "params": { "widgetId": "w-cramer-rao", "title": "Fisher information and the Cramér–Rao floor" } },
{ "type": "widget-script", "ref": "w-cramer-rao" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
