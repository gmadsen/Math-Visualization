# Math-rendering leak audit

CLASS A (HTML tag-open in math — content loss): 170
CLASS B (renderMathInElement missing single-$): 8
CLASS C (LaTeX in SVG <text>): 119

## CLASS A — HTML tag-open inside math  (READER-VISIBLE BUG)
A raw `<letter` inside a math span is parsed as a start-tag and swallows
following prose. Fix with `\lt`/`\gt` (quiz banks, dual-path) or
`&lt;`/`&gt;` (single-parse static prose).

  abelian-varieties.html  prose  «<g»  $<g$
  abelian-varieties.html  prose  «<g»  $<g$
  additive-number-theory.html  prose  «<p»  $k<p$
  additive-number-theory.html  prose  «<k»  $k'<k$
  additive-number-theory.html  prose  «<p»  $m<p$
  additive-number-theory.html  prose  «<p»  $1\le m<p$
  advanced-complex-analysis.html  prose  «<R»  $|z|<R_n = |a_n|/2$
  advanced-complex-analysis.html  prose  «<R»  $|z|<R_n$
  advanced-complex-analysis.html  prose  «<r»  $S = \{z = re^{i\theta} : 0<r, |\theta|<\pi/(2\alpha)\}$
  advanced-complex-analysis.html  prose  «<p»  $1<p\le\infty$
  advanced-complex-analysis.html  prose  «<R»  $|f(0)|^2 \le \frac{1}{\pi R^2}\int_{|z|<R}|f|^2\,dA \le \|f\|_{A^2}^2/(\pi R^2) \to 0$
  advanced-complex-analysis.html  prose  «<r»  $$\|f\|_{H^p}^p \;=\; \sup_{0<r<1}\frac{1}{2\pi}\int_0^{2\pi}\bigl|f(re^{i\theta})\bigr|…
  algebra.html  prose  «<n»  $0\leq a<n$
  algebra.html  prose  «<n»  $<n$
  algebra.html  prose  «<n»  $i<n$
  cluster-algebras.html  prose  «<j»  $1\le i<j\le n$
  cluster-algebras.html  prose  «<j»  $$p_{ik}\,p_{j\ell} \;=\; p_{ij}\,p_{k\ell} \;+\; p_{i\ell}\,p_{jk}\qquad (1\le i<j<k<\e…
  coding-theory.html  prose  «<k»  $$\mathrm{ev}:\mathbb{F}_q[x]_{<k}\to\mathbb{F}_q^n,\qquad f \mapsto (f(\alpha_1),\dots,…
  combinatorial-optimization.html  prose  «<c»  $f(e)<c(e)$
  complex-analysis.html  prose  «<r»  $|a-z_0|<r<R$
  complex-analysis.html  prose  «<R»  $0<|z-z_0|<R$
  computational-molecular-biology.html  prose  «<k»  $W_{ij} = \max\!\Bigl(W_{i+1,j},\ W_{i,j-1},\ W_{i+1,j-1} + \delta(x_i,x_j),\ \max_{i<k<…
  computational-molecular-biology.html  prose  «<j»  $i<j$
  computational-molecular-biology.html  prose  «<j»  $P(x_1,\dots,x_L) \;\propto\; \exp\!\Bigl(\sum_i h_i(x_i) + \sum_{i<j} J_{ij}(x_i, x_j)\…
  computational-number-theory.html  prose  «<s»  $0\le r<s$
  computational-number-theory.html  prose  «<i»  $j<i$
  computational-number-theory.html  prose  «<N»  $|x|<N^{1/d}$
  concepts/coding-theory.json  ct-reed-solomon.blurb  «<k»  $f\in\mathbb{F}_q[x]_{<k}$
  concepts/coding-theory.json  ct-reed-solomon.blurb  «<k»  $<k$
  concepts/computational-molecular-biology.json  cmb-rna-folding.blurb  «<k»  $W_{ij}=\max(W_{i+1,j},\,W_{i,j-1},\,W_{i+1,j-1}+\delta(x_i,x_j),\,\max_{i<k<j}W_{ik}+W_{k+1,j})$
  concepts/continued-fractions.json  cf-convergents.blurb  «<q»  $q<q_n$
  concepts/continued-fractions.json  cf-roth.blurb  «<q»  $|\alpha-p/q|<q^{-2-\varepsilon}$
  concepts/dynamical-systems.json  dyn-ergodicity.blurb  «<N»  $\tfrac{1}{N}\sum_{k<N} f(T^k x)$
  concepts/harmonic-functions.json  hf-harnack-inequality.blurb  «<R»  $|x|=r<R$
  concepts/information-theory.json  it-channel-coding.blurb  «<C»  $R<C$
  concepts/mathematical-chaos.json  mchaos-ergodic-srb.blurb  «<n»  $\tfrac{1}{n}\sum_{k<n}f(T^k x)$
  concepts/random-matrix-theory.json  rmt-ensembles.blurb  «<j»  $\prod_{i<j}|\lambda_i-\lambda_j|^\beta e^{-\beta\sum\lambda_i^2/4}$
  concepts/special-relativity.json  sr-causality.blurb  «<c»  $|v|<c$
  concepts/special-relativity.json  sr-lorentz.blurb  «<c»  $|v|<c$
  concepts/wavelets.json  w-daubechies.blurb  «<N»  $k<N$
  continued-fractions.html  prose  «<q»  $0<q<q_{n+1}$
  continued-fractions.html  prose  «<q»  $|\alpha-p/q|<q^{-n}$
  continued-fractions.html  prose  «<q»  $|\alpha-p/q|<q^{-2}$
  continued-fractions.html  prose  «<H»  $\prod_{v\in S}\min(1,|\alpha-p/q|_v)<H(p/q)^{-2-\varepsilon}$
  differential-forms.html  prose  «<i»  $\{\,dx^{i_1}\wedge\cdots\wedge dx^{i_k}\ :\ 1\le i_1<i_2<\cdots<i_k\le n\,\},$
  differential-forms.html  prose  «<i»  $I=(i_1<\cdots<i_k)$
  dirichlet-series-euler-products.html  prose  «<x»  $\mathbf{1}[n<x]$
  dirichlet-series-euler-products.html  prose  «<x»  $\frac{1}{2\pi i}\int_{c-i\infty}^{c+i\infty}(x/n)^s\,ds/s = \mathbf{1}[n<x]$
  dirichlet-series-euler-products.html  prose  «<x»  $n<x$
  dirichlet-series-euler-products.html  prose  «<x»  $\sum_{n<x}\Lambda(n)\sim x$
  dirichlet-series-euler-products.html  prose  «<x»  $\sum_{n<x} 1 = \lfloor x\rfloor$
  dirichlet-series-euler-products.html  prose  «<n»  $$a_n \;=\; \lim_{\sigma \to \infty} n^\sigma \Bigl( D(\sigma) - \sum_{k<n} \frac{a_k}{k…
  dirichlet-series-euler-products.html  prose  «<x»  $$\sum_{n<x} 1 \;=\; x - \tfrac12 + \frac{1}{2\pi i}\!\int_{(c')} \zeta(s)\frac{x^s}{s}\…
  fixed-point-theorems.html  prose  «<a»  $x<a$
  functional-analysis.html  prose  «<c»  $\ell(a)<c\le\ell(b)$
  functional-analysis.html  prose  «<p»  $1<p<\infty$
  functional-analysis.html  prose  «<p»  $1<p<\infty$
  functional-analysis.html  prose  «<p»  $1<p<\infty$
  functional-analysis.html  prose  «<p»  $1<p<\infty$
  functional-analysis.html  prose  «<p»  $1<p<\infty$
  functional-analysis.html  prose  «<p»  $1<p<\infty$
  functional-analysis.html  prose  «<p»  $1<p<\infty$
  functional-analysis.html  prose  «<n»  $$u_n = v_n - \sum_{k<n}\langle v_n, e_k\rangle e_k,\qquad e_n = u_n/\|u_n\|.$$
  groebner-bases.html  prose  «<j»  $i<j$
  groebner-bases.html  prose  «<j»  $i<j$
  groebner-bases.html  prose  «<j»  $$\overline{S(g_i,g_j)}^G = 0 \quad\text{for all }i<j.$$
  heegaard-floer.html  prose  «<p»  $0\le q<p$
  information-theory.html  prose  «<C»  $R<C$
  klein-gordon-equation.html  prose  «<c»  $|v|<c$
  mathematical-chaos.html  prose  «<K»  $K<K_c\approx 0.971635$
  matroid-theory.html  prose  «<i»  $I_{<i}$
  matroid-theory.html  prose  «<i»  $J_{<i+1}$
  measure-theory.html  prose  «<p»  $1<p<\infty$
  measure-theory.html  prose  «<s»  $s<s^*$
  model-theory-basics.html  prose  «<x»  $\exists x\,\forall y\,\neg(y<x)$
  model-theory-basics.html  prose  «<y»  $\forall x\,\exists y\,(x<y)$
  model-theory-basics.html  prose  «<y»  $\forall x\,\forall y\,(x<y \to \exists z\,(x<z \land z<y))$
  p-adic-numbers.html  prose  «<n»  $i<n$
  positive-characteristic-ag.html  prose  «<i»  $0<i<p$
  positive-characteristic-ag.html  prose  «<p»  $0\le i_j<p$
  probability-theory.html  prose  «<t»  $0\le t_0<t_1<\cdots<t_n$
  probability-theory.html  prose  «<t»  $0\le s<t$
  quantum-groups.html  prose  «<j»  $$\nabla \;=\; d \;-\; \hbar\sum_{i<j}\,\dfrac{\Omega_{ij}}{z_i - z_j}\,d(z_i-z_j),$$
  quizzes/additive-number-theory.json  quizzes.major-vs-minor-arcs.questions[1].explain  «<q»  $N^{1/k}<q<N^{k-1/k}$
  quizzes/advanced-complex-analysis.json  quizzes.aca-hadamard-three-circles.questions[0].explain  «<r»  $r_1<r_2<r_3$
  quizzes/advanced-complex-analysis.json  quizzes.aca-hardy-spaces.questions[0].explain  «<r»  $\|f\|_{H^p}^p = \sup_{0<r<1}\frac{1}{2\pi}\int_0^{2\pi}|f(re^{i\theta})|^p d\theta < \infty$
  quizzes/algebra.json  quizzes.polynomial-rings-irreducibility.questions[0].explain  «<n»  $i<n$
  quizzes/algebra.json  quizzes.sylow-theorems.hard[1].explain  «<q»  $p<q$
  quizzes/algebra.json  quizzes.sylow-theorems.hard[1].q  «<q»  $p<q$
  quizzes/algebraic-number-theory.json  quizzes.minkowski-bound.hard[2].choices[1]  «<M»  $2<M_K<3$
  quizzes/algebraic-number-theory.json  quizzes.minkowski-bound.hard[2].choices[2]  «<M»  $3<M_K<5$
  quizzes/algebraic-number-theory.json  quizzes.minkowski-bound.hard[2].explain  «<M»  $1<M_K<2$
  quizzes/cluster-algebras.json  quizzes.ca-applications.questions[0].choices[0]  «<j»  $1\le i<j\le n$
  quizzes/coding-theory.json  quizzes.ct-reed-solomon.questions[0].explain  «<k»  $<k$
  quizzes/coding-theory.json  quizzes.ct-reed-solomon.questions[0].explain  «<k»  $<k$
  quizzes/computational-molecular-biology.json  quizzes.cmb-protein-contacts.questions[0].choices[1]  «<j»  $P(x)\propto\exp\bigl(\sum h_i(x_i)+\sum_{i<j} J_{ij}(x_i,x_j)\bigr)$
  quizzes/computational-molecular-biology.json  quizzes.cmb-rna-folding.questions[2].choices[0]  «<j»  $i<j$
  quizzes/continued-fractions.json  quizzes.cf-convergents.questions[2].choices[1]  «<q»  $0<q<q_n$
  quizzes/continued-fractions.json  quizzes.cf-hurwitz.questions[0].q  «<C»  $|\alpha-p/q|<C/q^2$
  quizzes/continued-fractions.json  quizzes.cf-liouville.questions[1].explain  «<q»  $|L-L_k|<q_k^{-r_k}$
  quizzes/continued-fractions.json  quizzes.cf-liouville.questions[1].q  «<q»  $|L-L_k|<q_k^{-r_k}$
  quizzes/continued-fractions.json  quizzes.cf-liouville.questions[2].choices[1]  «<q»  $|\alpha-p/q|<q^{-n}<C/q^d$
  quizzes/continued-fractions.json  quizzes.cf-liouville.questions[2].q  «<q»  $|\alpha-p/q|<q^{-n}$
  quizzes/continued-fractions.json  quizzes.cf-roth.questions[0].choices[0]  «<q»  $|\alpha-p/q|<q^{-d-\varepsilon}$
  quizzes/continued-fractions.json  quizzes.cf-roth.questions[0].choices[1]  «<q»  $|\alpha-p/q|<q^{-2-\varepsilon}$
  quizzes/continued-fractions.json  quizzes.cf-roth.questions[0].choices[2]  «<q»  $|\alpha-p/q|<q^{-2}$
  quizzes/continued-fractions.json  quizzes.cf-roth.questions[0].choices[3]  «<q»  $|\alpha-p/q|<q^{-3-\varepsilon}$
  quizzes/continued-fractions.json  quizzes.cf-roth.questions[0].explain  «<q»  $|\alpha-p/q|<q^{-2}$
  quizzes/differential-forms.json  quizzes.exterior-derivative.hard[2].q  «<j»  $i<j$
  quizzes/differential-forms.json  quizzes.forms-and-wedge.hard[2].explain  «<i»  $i_1<i_2<i_3$
  quizzes/dirichlet-series-euler-products.json  quizzes.perron-formula.hard[0].q  «<x»  $0<x<1$
  quizzes/dynamical-systems.json  quizzes.dyn-chaos.hard[2].choices[0]  «<N»  $\lambda=\tfrac{1}{N}\sum_{i<N}\log|T'(x_i)|=\log 2$
  quizzes/dynamical-systems.json  quizzes.dyn-ergodicity.hard[0].q  «<N»  $\tfrac{1}{N}\sum_{k<N}T^k(x)\to a$
  quizzes/dynamical-systems.json  quizzes.dyn-iterated-maps.hard[2].q  «<q»  $p<q$
  quizzes/dynamical-systems.json  quizzes.period-doubling-cascade.questions[0].explain  «<r»  $1<r<3$
  quizzes/enumerative-combinatorics.json  quizzes.ec-permutation-statistics.questions[0].hint  «<j»  $i<j$
  quizzes/enumerative-combinatorics.json  quizzes.ec-permutation-statistics.questions[0].q  «<j»  $i<j$
  quizzes/functional-analysis.json  quizzes.reflexivity.questions[1].choices[0]  «<p»  $1<p<\infty$
  quizzes/functional-analysis.json  quizzes.reflexivity.questions[1].explain  «<p»  $1<p<\infty$
  quizzes/functional-analysis.json  quizzes.riesz-representation.questions[1].q  «<p»  $1<p<\infty$
  quizzes/geometric-invariant-theory.json  quizzes.git-hilbert-mumford.questions[0].explain  «<n»  $i<n/2$
  quizzes/harmonic-functions.json  quizzes.hf-harnack-inequality.questions[1].explain  «<R»  $|x|<R$
  quizzes/mathematical-chaos.json  quizzes.mchaos-feigenbaum.questions[0].q  «<r»  $r_1<r_2<\cdots$
  quizzes/measure-theory.json  quizzes.lebesgue-measure.hard[2].explain  «<m»  $\sum m(I_n)<m(E)+\varepsilon$
  quizzes/measure-theory.json  quizzes.lebesgue-measure.hard[2].explain  «<m»  $m(U)\le\sum m(I_n)<m(E)+\varepsilon$
  quizzes/model-theory-basics.json  quizzes.mt-ehrenfeucht-fraisse.questions[1].q  «<n»  $m<n$
  quizzes/point-set-topology.json  quizzes.connectedness.hard[2].explain  «<x»  $\{1/n\}=\{x:1/(n+1)<x<1/(n-1)\}\cap S$
  quizzes/point-set-topology.json  quizzes.separation-axioms.hard[0].choices[0]  «<s»  $r<s$
  quizzes/point-set-topology.json  quizzes.separation-axioms.hard[1].q  «<b»  $\{[a,b):a<b\}$
  quizzes/positive-characteristic-ag.json  quizzes.pchar-absolute-frobenius.questions[0].choices[1]  «<i»  $0<i<p$
  quizzes/positive-characteristic-ag.json  quizzes.pchar-absolute-frobenius.questions[1].explain  «<p»  $\{x_1^{i_1}\cdots x_n^{i_n}:0\le i_j<p\}$
  quizzes/probability-theory.json  quizzes.brownian-motion.expert[0].hint  «<t»  $s<t$
  quizzes/probability-theory.json  quizzes.random-variables.hard[1].explain  «<e»  $\mathbb{P}(Y>1)=\mathbb{P}(-\ln X>1)=\mathbb{P}(X<e^{-1})=e^{-1}\approx 0.3679$
  quizzes/random-matrix-theory.json  quizzes.rmt-ensembles.questions[2].choices[0]  «<j»  $\prod_{i<j}|\lambda_i-\lambda_j|^\beta$
  quizzes/real-analysis.json  quizzes.absolute-continuity.questions[2].explain  «<L»  $L\sum(b_k-a_k)<L\delta$
  quizzes/real-analysis.json  quizzes.bump-functions.hard[0].explain  «<n»  $k<n$
  quizzes/real-analysis.json  quizzes.bump-functions.hard[0].explain  «<n»  $k<n$
  quizzes/real-analysis.json  quizzes.lebesgue-differentiation.questions[1].explain  «<r»  $0<r<1$
  quizzes/real-analysis.json  quizzes.power-series-real.hard[1].explain  «<R»  $|x|<R$
  quizzes/real-analysis.json  quizzes.real-continuity.hard[2].choices[0]  «<b»  $c<b$
  quizzes/real-analysis.json  quizzes.real-continuity.hard[2].q  «<f»  $f(a)<0<f(b)$
  quizzes/real-analysis.json  quizzes.uniform-convergence.hard[1].q  «<r»  $0<r<1$
  quizzes/simplicial-sets-and-nerve.json  quizzes.simplex-category.questions[2].explain  «<j»  $i<j$
  quizzes/special-relativity.json  quizzes.sr-lorentz.questions[2].explain  «<c»  $|v_3|<c$
  quizzes/special-relativity.json  quizzes.sr-lorentz.questions[2].explain  «<c»  $|v_1|,|v_2|<c$
  quizzes/stochastic-processes-and-martingales.json  quizzes.sp-continuous-martingales.questions[0].hint  «<t»  $0\le s<t$
  quizzes/wavelets.json  quizzes.w-biorthogonal.questions[2].q  «<N»  $k<N$
  quizzes/wavelets.json  quizzes.w-daubechies.questions[0].explain  «<N»  $k<N$
  quizzes/zfc-and-ordinals.json  quizzes.cardinals-cofinality.questions[0].explain  «<r»  $r\mapsto\{q\in\mathbb Q: q<r\}$
  random-matrix-theory.html  prose  «<j»  $p_\beta(\lambda)\;=\;\frac{1}{Z_{N,\beta}}\;\prod_{i<j}|\lambda_i-\lambda_j|^{\beta}\;e…
  random-matrix-theory.html  prose  «<p»  $\le n<p$
  real-analysis.html  prose  «<x»  $P\colon a=x_0<x_1<\cdots<x_n=b$
  real-analysis.html  prose  «<R»  $|x-a|<R$
  real-analysis.html  prose  «<x»  $P\colon a=x_0<x_1<\cdots<x_n=b$
  several-complex-variables.html  prose  «<r»  $0<r<1$
  several-complex-variables.html  prose  «<r»  $|z_1|<r$
  several-complex-variables.html  prose  «<c»  $X_c = \{\rho<c\}$
  simplicial-sets-and-nerve.html  prose  «<j»  $$d^j d^i = d^i d^{j-1}\;(i<j),\quad s^j s^i = s^i s^{j+1}\;(i\le j),\quad s^j d^i = \be…
  sobolev-spaces-distributions.html  prose  «<n»  $kp<n$
  sobolev-spaces-distributions.html  prose  «<n»  $kp<n$
  sobolev-spaces-distributions.html  prose  «<p»  $q<p^*$
  sobolev-spaces-distributions.html  prose  «<p»  $q<p^*$
  special-relativity.html  prose  «<c»  $v_3<c$
  special-relativity.html  prose  «<c»  $|v|<c$
  spectral-theory.html  prose  «<p»  $$\mathcal{K}(H)^*\cong\mathcal{S}_1, \qquad \mathcal{S}_1^*\cong B(H), \qquad \mathcal{…
  stochastic-processes-and-martingales.html  prose  «<b»  $a<0<b$
  stochastic-processes-and-martingales.html  prose  «<b»  $a<0<b$
  stochastic-processes-and-martingales.html  prose  «<t»  $0=t_0<t_1<\cdots<t_n=t$
  three-body-problem.html  prose  «<j»  $H = \sum_i \tfrac{|p_i|^2}{2m_i} - G\sum_{i<j}\frac{m_im_j}{|r_i-r_j|}$
  zfc-and-ordinals.html  prose  «<r»  $r\mapsto\{q\in\mathbb{Q}:q<r\}$

## CLASS B — renderMathInElement() without a single-$ delimiter  (advisory)
Silent no-op on `$…$`. Many are benign (only ever fed `\(…\)` or static
content). Review each; add a `{left:'$',right:'$'}` delimiter if it ever
receives `$…$` dynamic text.

  d-modules.html  …renderMathInElement(out, {throwOnError:false}); } sel1.addEventListener('change', render); sel2.addEventListener('change
  d-modules.html  …renderMathInElement(out, {throwOnError:false}); } function update(){ const a = parseFloat(sla.value); const c = parseFlo
  d-modules.html  …renderMathInElement(out, {throwOnError:false}); } sel.addEventListener('change', render); render(); })(); 
  homotopy-theory.html  …renderMathInElement(lab,{throwOnError:false}); } sel.addEventListener('input',draw); draw(); })(); // ═════ §2 widget · 
  homotopy-theory.html  …renderMathInElement(lab,{throwOnError:false}); } } sel.addEventListener('input',draw); draw(); })(); // ═════ §4 widget 
  homotopy-theory.html  …renderMathInElement(lab,{throwOnError:false}); } } sel.addEventListener('input',draw); draw(); })(); // ═════ §5 widget 
  homotopy-theory.html  …renderMathInElement(lab,{throwOnError:false}); } } sel.addEventListener('input',draw); draw(); })(); // ═════ §6 widget 
  homotopy-theory.html  …renderMathInElement(lab,{throwOnError:false}); } } sel.addEventListener('input',draw); draw(); })(); 

## CLASS C — LaTeX inside SVG <text>  (advisory)
KaTeX cannot render inside SVG <text>; convert to Unicode or move to an
HTML overlay / <foreignObject>.

  algebraic-de-rham-cohomology.html  "$h^{0,0}$"
  algebraic-de-rham-cohomology.html  "$h^{0,1}$"
  algebraic-de-rham-cohomology.html  "$h^{1,0}$"
  algebraic-de-rham-cohomology.html  "$h^{0,2}$"
  algebraic-de-rham-cohomology.html  "$h^{1,1}$"
  algebraic-de-rham-cohomology.html  "$h^{2,0}$"
  algebraic-de-rham-cohomology.html  "$h^{1,2}$"
  algebraic-de-rham-cohomology.html  "$h^{2,1}$"
  algebraic-de-rham-cohomology.html  "$h^{2,2}$"
  algebraic-de-rham-cohomology.html  "⤬ Serre duality $h^{p,q}=h^{n-p,n-q}$"
  algebraic-de-rham-cohomology.html  "⌒ conjugation $h^{p,q}=h^{q,p}$"
  algebraic-de-rham-cohomology.html  "$h^{0,0}=1$"
  algebraic-de-rham-cohomology.html  "$h^{1,0}=g$"
  algebraic-de-rham-cohomology.html  "$h^{0,1}=g$"
  algebraic-de-rham-cohomology.html  "$h^{1,1}=1$"
  algebraic-de-rham-cohomology.html  "$H^1_{\mathrm{dR}}(C)$"
  algebraic-de-rham-cohomology.html  "$=\mathbb{C}^{2g}$"
  cocartesian-fibrations.html  "$\mathcal{E}$"
  cocartesian-fibrations.html  "$x_1$"
  cocartesian-fibrations.html  "$x_2$"
  cocartesian-fibrations.html  "fiber $\mathcal{E}_a$"
  cocartesian-fibrations.html  "$y_1$"
  cocartesian-fibrations.html  "$y_2$"
  cocartesian-fibrations.html  "fiber $\mathcal{E}_b$"
  cocartesian-fibrations.html  "$z$"
  cocartesian-fibrations.html  "fiber $\mathcal{E}_c$"
  cocartesian-fibrations.html  "$p$"
  cocartesian-fibrations.html  "$\mathcal{B}$"
  cocartesian-fibrations.html  "$a$"
  cocartesian-fibrations.html  "$b$"
  cocartesian-fibrations.html  "$c$"
  cocartesian-fibrations.html  "$\bar{e}$"
  cocartesian-fibrations.html  "$\bar{f}$"
  cocartesian-fibrations.html  "$\bar{f}\bar{e}$"
  cocartesian-fibrations.html  "$\mathcal{E}_{\bar{x}}$"
  cocartesian-fibrations.html  "$x_1$"
  cocartesian-fibrations.html  "$x_2$"
  cocartesian-fibrations.html  "$x_3$"
  cocartesian-fibrations.html  "$\alpha$"
  cocartesian-fibrations.html  "$\beta$"
  cocartesian-fibrations.html  "$\mathcal{E}_{\bar{y}}$"
  cocartesian-fibrations.html  "$y_1$"
  cocartesian-fibrations.html  "$y_2$"
  cocartesian-fibrations.html  "$y_3$"
  cocartesian-fibrations.html  "$\bar{e}_!\alpha$"
  cocartesian-fibrations.html  "$\bar{e}_!$"
  cocartesian-fibrations.html  "(induced by edge $\bar{e}: \bar{x} \to \bar{y}$ in $\mathcal{B}$)"
  cocartesian-fibrations.html  "$\mathcal{E}$"
  cocartesian-fibrations.html  "$\mathcal{S}_{*/}$"
  cocartesian-fibrations.html  "$\mathcal{B}$"
  cocartesian-fibrations.html  "$\mathcal{S}$"
  cocartesian-fibrations.html  "$p$"
  cocartesian-fibrations.html  "$\mathrm{St}(p)$  (the straightening)"
  cocartesian-fibrations.html  "$\mathcal{E} \;\simeq\; \mathcal{B} \times_\mathcal{S} \mathcal{S}_{*/}$  — the "
  cocartesian-fibrations.html  "arrow-category fibration $t = \mathrm{ev}_1: \mathrm{Fun}(\Delta^1, \mathcal{C})"
  cocartesian-fibrations.html  "$a$"
  cocartesian-fibrations.html  "$b$"
  cocartesian-fibrations.html  "$c$"
  cocartesian-fibrations.html  "$f$"
  cocartesian-fibrations.html  "$g$"
  cocartesian-fibrations.html  "$gf$"
  deformation-theory.html  "$U_i \times \Spec\,D$"
  deformation-theory.html  "$U_j \times \Spec\,D$"
  deformation-theory.html  "$U_i \cap U_j$"
  deformation-theory.html  "$\theta_{ij}$"
  deformation-theory.html  "$X_0$"
  deformation-theory.html  "$X_1$"
  deformation-theory.html  "$X_2$"
  deformation-theory.html  "$X_\infty$"
  deformation-theory.html  "$/k$"
  deformation-theory.html  "$/k[t]/t^2$"
  deformation-theory.html  "$/k[t]/t^3$"
  deformation-theory.html  "$/k[\![t]\!]$"
  deformation-theory.html  "$\mathrm{ob}_0 = 0$"
  deformation-theory.html  "$\mathrm{ob}_1 \in H^2(T_{X_0})$"
  deformation-theory.html  "$\mathrm{ob}_2 = 0 \Rightarrow$ formal lift"
  deformation-theory.html  "Tower of Artinian truncations: a class in $H^2(X_0, T_{X_0})$ for each stage to "
  deformation-theory.html  "$A' \times_A A''$"
  deformation-theory.html  "$A''$"
  deformation-theory.html  "$A'$"
  deformation-theory.html  "$A$"
  deformation-theory.html  "$\pi''$"
  deformation-theory.html  "vertical arrows (yellow) are surjections; (H1) tests the induced $\mathrm{Def}$-"
  derived-categories.html  "$X^\bullet$"
  derived-categories.html  "$X^{n-1}$"
  derived-categories.html  "$X^{n}$"
  derived-categories.html  "$X^{n+1}$"
  derived-categories.html  "$d$"
  derived-categories.html  "$d$"
  derived-categories.html  "$Y^\bullet$"
  derived-categories.html  "$Y^{n-1}$"
  derived-categories.html  "$Y^{n}$"
  derived-categories.html  "$Y^{n+1}$"
  derived-categories.html  "$d$"
  derived-categories.html  "$d$"
  derived-categories.html  "$f$"
  derived-categories.html  "$g$"
  derived-categories.html  "$s$"
  derived-categories.html  "$s$"
  derived-categories.html  "$s$ (qis)"
  derived-categories.html  "$f$"
  derived-categories.html  "induced morphism in $D(\mathcal{A})$: $f \circ s^{-1}$"
  derived-categories.html  "$D^{\le 0}$"
  derived-categories.html  "$D^{\ge 0}$"
  derived-categories.html  "heart $\heartsuit \simeq \mathcal{A}$"
  derived-categories.html  "$\tau_{\ge 1}X$ "lives upstairs""
  derived-categories.html  "$D^b(X)$"
  derived-categories.html  "$D^b(Y)$"
  derived-categories.html  "$D^b(X \times Y)$"
  derived-categories.html  "kernel $\mathcal{P}$"
  derived-categories.html  "$\pi_X^*$"
  derived-categories.html  "$R\pi_{Y,*}$"
  derived-categories.html  "$\Phi_{\mathcal{P}}$"
  heyting-algebras-toposes.html  "$\mathcal{F}$"
  heyting-algebras-toposes.html  "$\mathcal{E}$"
  heyting-algebras-toposes.html  "$\mathbf{Set}$"
  heyting-algebras-toposes.html  "$f$"
  heyting-algebras-toposes.html  "$g$"
  heyting-algebras-toposes.html  "$(g\circ f)^* = f^* \circ g^*$"

