# harmonic-pontryagin

Pontryagin-duality gallery, introduced on `harmonic-analysis-fourier.html` §8
(*Pontryagin duality*). Bespoke semantic module — a structural diagram; params
carry only chrome.

See [../README.md](../README.md) for the registry contract.

## What it does

Four tabs — $\mathbb R$, $\mathbb T=\mathbb R/\mathbb Z$, $\mathbb Z$,
$\mathbb Z/N$ — show a locally compact abelian group $G$ and its dual
$\widehat G=\mathrm{Hom}_{\mathrm{cts}}(G,U(1))$, each drawn as its characteristic
picture (a line, a circle, discrete dots, or $N$-th roots of unity) so the
**discrete↔compact swap** ($\mathbb Z\leftrightarrow\mathbb T$) is visible. Each
tab lists the character formula $\chi$, the corresponding Fourier transform
(continuous FT / Fourier series / DTFT / DFT), and the double dual
$\widehat{\widehat G}\cong G$. Self-dual groups ($\mathbb R$, $\mathbb Z/N$) are
flagged. Adds the interaction the static §8 prose table lacks.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-svg/-out` and the four group-tab button ids. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/harmonic-analysis-fourier.json`, then
`node scripts/rebuild.mjs --only widget-params` and `node scripts/rebuild.mjs`.
