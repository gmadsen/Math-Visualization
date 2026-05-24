# prob-martingale-stopping

Bespoke module for **probability-theory** §11 (Martingales). Demonstrates Doob's
optional-stopping theorem — and its failure without a hypothesis — on the
simplest martingale, symmetric simple random walk.

See [../README.md](../README.md) for the registry contract (schema + pure render
functions) and the bespoke-vs-shared distinction.

## What it does

Symmetric simple random walk $S_n$ ($\pm 1$ steps, each probability $\tfrac12$)
is a martingale: $\mathbb{E}[S_{n+1}\mid\mathcal{F}_n]=S_n$, a fair game. The
widget Monte-Carlo simulates many walks, draws a sample of paths, and compares
the stopped value against $\mathbb{E}[S_0]=0$ for three stopping rules:

- **fixed time** $\tau=N$ — bounded, so $\mathbb{E}[S_\tau]=0$ (holds);
- **two-sided exit** $\tau=\inf\{n:|S_n|=a\}$ — $S_{n\wedge\tau}$ stays bounded,
  so $\mathbb{E}[S_\tau]=0$ (holds);
- **first hit** $\tau=\inf\{n:S_n=1\}$ — finite a.s. but $\mathbb{E}[\tau]=\infty$
  and $S$ is not uniformly integrable, so $\mathbb{E}[S_\tau]=1\neq 0$ (FAILS).

For the failing rule the widget reports the *fraction* of walks reaching $+1$
($\to 100\%$ a.s.), not a naive average — because the truncated value
$S_{n\wedge\tau}$ is still a martingale with mean exactly $0$ for every finite
$n$, so a capped Monte-Carlo average can't see the jump to $1$. That subtlety is
the whole point: the mean only moves "at infinity", which is why the theorem
needs a hypothesis.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `title`    | string | Display title (prose — `.ttl` is uppercased). |
| `hint`     | string (optional) | Short hint rendered next to the title. |

## Usage

```json
{ "type": "widget", "slug": "prob-martingale-stopping", "params": { "widgetId": "w-prob-martingale", "title": "Optional stopping on a fair random walk" } },
{ "type": "widget-script", "ref": "w-prob-martingale" }
```

Then `node scripts/rebuild.mjs --only widget-params` to AJV-validate, and
`node scripts/rebuild.mjs` for the full byte-identical round-trip gate.
