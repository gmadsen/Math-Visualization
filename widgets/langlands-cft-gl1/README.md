# langlands-cft-gl1

Bespoke widget for `langlands-program.html` (§5 *Class field theory as Langlands for $\GL_1$*,
concept `cft-as-langlands`). Single module, not part of a shared family.

See [../README.md](../README.md) for the registry contract and the bespoke-vs-shared
distinction.

## What it does

The $\GL_1$ (abelian) prototype of Langlands, made concrete on cyclotomic fields. Buttons pick a
modulus $N \in \{5, 8, 12\}$ and a Dirichlet character $\chi \bmod N$.

The cyclotomic character identifies $\mathrm{Gal}(\mathbb{Q}(\zeta_N)/\mathbb{Q}) \cong
(\mathbb{Z}/N)^\times$, and **Artin reciprocity** says the Frobenius at an unramified prime $p$ is
just $\mathrm{Frob}_p = (p \bmod N)$. The widget tabulates, for the first several good primes:
$\mathrm{Frob}_p = p \bmod N$, the residue degree $f = \mathrm{ord}(p \bmod N)$, the number of
primes $g = \varphi(N)/f$ above $p$, and the value $\chi(\mathrm{Frob}_p) = \chi(p)$. Primes with
$p \equiv 1$ (split completely) are highlighted.

The four Dirichlet characters mod $N$ **are** the characters of the abelian Galois group — the
1-dimensional Galois representations. The order-2 ones cut out the **quadratic subfields**
(N=8: $\mathbb{Q}(i), \mathbb{Q}(\sqrt2), \mathbb{Q}(\sqrt{-2})$; N=12: $\mathbb{Q}(i),
\mathbb{Q}(\sqrt{-3}), \mathbb{Q}(\sqrt3)$; N=5: $\mathbb{Q}(\sqrt5)$), and $\chi(p)=+1$ exactly
when $p$ splits in that subfield — quadratic reciprocity as CFT. The readout connects this to the
full adelic statement (idèle class group, Hecke characters, $L(\chi,s)=L(\chi^{\mathrm{Hecke}},s)$),
Artin's 1920s theorem, and the $n=1$ case of $L(\rho,s)=L(\pi,s)$.

Distinct from `langlands-euler-product` (the GL₂ elliptic-curve L-factor match), from
`langlands-gl2-modularity` (GL₂ $a_p$ match), and from the class-field-theory page's
`class-field-theory-existence` (Takagi lattice) and `-conductor-discriminant` (discriminant
formula). Frobenius is computed live; character tables are intrinsic. (Plain `Q`/`Z`/`F` since
blackboard $\mathbb{F}$/$\mathbb{A}$ are astral; $\zeta,\varphi,\chi$ are BMP Greek.)

## Params

See [`schema.json`](./schema.json). Required: `widgetId`, `title`; optional `hint`. All modulus and
character data is internal.

## Usage

```json
{ "type": "widget",        "slug": "langlands-cft-gl1", "params": { "widgetId": "w-cft-gl1", "title": "GL_1 = class field theory: Frobenius is just p mod N", "hint": "pick N and a Dirichlet character — Frob_p = p mod N, and χ(p)=+1 ⟺ p splits" } },
{ "type": "widget-script", "ref": "w-cft-gl1" }
```

Then `node scripts/rebuild.mjs --only widget-params` and `node scripts/rebuild.mjs`.
