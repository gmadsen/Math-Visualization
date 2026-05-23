# hodge-theory-period-elliptic

The elliptic-curve period map, introduced on `hodge-theory.html` §7. Makes the
abstract "period domain + variation of Hodge structure" concrete in the one case
where the period domain is the familiar upper half-plane. Bespoke semantic
module — the SL₂(ℤ) reduction and the $j$-invariant $q$-series are intrinsic;
params carry only optional notable presets.

See [../README.md](../README.md) for the registry contract.

## What it does

Move a period $\tau$ in the upper half-plane $\mathbb{H}$ with Re/Im sliders (or
jump to a preset: $i$, $\rho = e^{2\pi i/3}$, $2i$, …). The widget shades the
$\mathrm{SL}_2(\mathbb{Z})$ fundamental domain, reduces $\tau$ into it (the
period map modulo monodromy), and computes the modular invariant $j(\tau)$ —
recovering the $j$-line ($j(i)=1728$, $j(\rho)=0$). The readout notes that
$\mathbb{H}$ is the weight-1 period domain (Siegel $H_1$) and that Griffiths
transversality is automatic here because $\mathbb{H}$ is Hermitian symmetric —
the contrast that makes higher-weight period domains hard.

## Params

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id; script derives `-re/-im/-preset/-svg/-out`. |
| `title` | string | Header title. |
| `hint` | string (optional) | Short hint. |
| `presets` | array (optional) | Jump targets: each `id`, `label` (plain text), `re`, `im` (>0). |

## Usage

Add a `widget` block + ref-based `widget-script` block to
`content/hodge-theory.json`, then `node scripts/rebuild.mjs --only widget-params`
and `node scripts/rebuild.mjs`.
