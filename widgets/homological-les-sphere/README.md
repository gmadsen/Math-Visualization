# homological-les-sphere

Mayer–Vietoris explorer for $H_*(S^n)$, introduced on `homological.html` §5
(*The long exact sequence in homology*). Bespoke semantic module — the
arithmetic is intrinsic; params carry only the slider bound and chrome.

See [../README.md](../README.md) for the registry contract.

## What it does

Slide the sphere dimension $n$. The widget renders the flagship use of the long
exact sequence: cover $S^n=U\cup V$ by two contractible hemispheres with
$U\cap V\simeq S^{n-1}$. For $n\ge 2$ it draws the Mayer–Vietoris chunk
$0\to H_n(S^n)\xrightarrow{\partial} H_{n-1}(S^{n-1})\to 0$ — the outer terms
$H_k(U)\oplus H_k(V)$ vanish because the hemispheres are contractible, so the
connecting map $\partial$ is forced to be an isomorphism. It then shows the
**descent ladder** $H_n(S^n)\cong\cdots\cong H_1(S^1)=\mathbb{Z}$ and the
resulting Betti table ($\mathbb{Z}$ in degrees $0$ and $n$, else $0$). At $n=1$
the base case $H_1(S^1)=\mathbb{Z}$ is shown directly.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-n/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `maxDim` | integer (optional) | Slider max for $n$ (3–6). Default 6. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/homological.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
