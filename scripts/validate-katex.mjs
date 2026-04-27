#!/usr/bin/env node
// Structural validator for KaTeX math spans in quiz and concept JSON.
//
// Catches the common authoring mistakes that otherwise surface only at render
// time (silent KaTeX error boxes on the live page):
//
//   - Unbalanced delimiters: orphan `$`, `$$`, `\(…)` without close, `\[…]`
//     without close, or overlapping / interleaved pairs.
//   - Unbalanced braces inside a math span: unequal `{` / `}` counts (after
//     stripping escaped `\{` and `\}`).
//   - Unbalanced environments: every `\begin{foo}` needs a matching
//     `\end{foo}` inside the same span.
//   - Empty spans: `$$`, `\(\)`, `\[\]`, `$$  $$` (usually editor artifacts).
//     Warnings only.
//   - Heuristics for a couple of very common typos (stray `&` outside an
//     aligned env; `\sqrt` with no argument).
//   - Macro-aware warning pass: tokenizes each math span for `\<letters>`
//     usages, classifies them against a large whitelist of KaTeX built-ins
//     (plus any user-project macros declared in the KaTeX loader of
//     `category-theory.html`), and emits WARNINGS for unknown macros. These
//     warnings do NOT gate the exit code — they're advisory only, meant to
//     surface typos (`\foozlez`) or macros KaTeX doesn't ship without a
//     matching `macros:` config.
//
// This is NOT a KaTeX parser — that would pull in the `katex` npm package
// and break the project's "runs from stock node, zero deps" rule. Instead
// we catch the ~80% of failures that are structural, which is by far the
// noisiest class in practice.
//
// Walks:
//   - quizzes/*.json → every `quiz.questions[i].q`, `.explain`, each string
//     in `.choices` (for mcq). Same for the `hard` sibling array.
//   - concepts/*.json → every `concepts[i].blurb`.
//   - concepts/capstones.json → every `capstone.blurb`.
//
// Output format: `<file>:<path.to.field> → <error description>`, sorted by
// file. Prints a final count. Exit 1 if any errors, 0 clean. Warnings print
// but do not affect exit code.
//
// Zero dependencies: regex + string checks, runs from stock node.

import { loadContentModel } from './lib/content-model.mjs';

const errors = [];   // [{ file, path, msg }]
const warnings = []; // [{ file, path, msg }]

// ─────────────────────────────────────────────────────────────────────────
// Math span extraction.
//
// KaTeX delimiters in this project (per AGENTS.md § House conventions):
//   $…$    inline
//   $$…$$  display
//   \(…\)  inline
//   \[…\]  display
//
// Strategy: walk the string left-to-right. At each position, try (in order):
//   1. a double-dollar open (`$$`) — greedy so it beats single-dollar
//   2. a single-dollar open (`$`)
//   3. `\(`
//   4. `\[`
// When an opener is found, scan forward for its matching close of the same
// kind. `$`-style closes are the same token reversed; `\(` closes on `\)`,
// `\[` closes on `\]`. A `\` right before the delimiter char escapes it
// (e.g. `\$` is a literal dollar, not a math open/close).
//
// Returns an array of { kind, open, close, body, startIdx, endIdx } and an
// array of structural errors encountered while scanning.

function escapedAt(s, i) {
  // Is the character at s[i] escaped by an odd number of preceding backslashes?
  let n = 0;
  for (let j = i - 1; j >= 0 && s[j] === '\\'; j--) n++;
  return n % 2 === 1;
}

function findDelimClose(s, startInside, opener) {
  // Search for the closing counterpart of `opener`, starting from index
  // `startInside` (just after the opener). Return the index of the close
  // token's first character, or -1 if not found. Honors backslash escaping
  // for the dollar closes.
  if (opener === '$$') {
    for (let i = startInside; i < s.length - 1; i++) {
      if (s[i] === '$' && s[i + 1] === '$' && !escapedAt(s, i)) return i;
    }
    return -1;
  }
  if (opener === '$') {
    for (let i = startInside; i < s.length; i++) {
      // Don't match a `$$` as a single-`$` close.
      if (s[i] === '$' && s[i + 1] !== '$' && !escapedAt(s, i)) return i;
    }
    return -1;
  }
  if (opener === '\\(') {
    for (let i = startInside; i < s.length - 1; i++) {
      if (s[i] === '\\' && s[i + 1] === ')') return i;
    }
    return -1;
  }
  if (opener === '\\[') {
    for (let i = startInside; i < s.length - 1; i++) {
      if (s[i] === '\\' && s[i + 1] === ']') return i;
    }
    return -1;
  }
  return -1;
}

function extractSpans(s) {
  const spans = [];
  const localErrors = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    const next = s[i + 1];

    // Try `$$` first (greedy beats `$`).
    if (c === '$' && next === '$' && !escapedAt(s, i)) {
      const openAt = i;
      const innerStart = i + 2;
      const closeAt = findDelimClose(s, innerStart, '$$');
      if (closeAt === -1) {
        localErrors.push(`unclosed $$…$$ opened at offset ${openAt}`);
        i = s.length;
        break;
      }
      spans.push({
        kind: '$$', open: '$$', close: '$$',
        body: s.slice(innerStart, closeAt),
        startIdx: openAt,
        endIdx: closeAt + 2,
      });
      i = closeAt + 2;
      continue;
    }

    if (c === '$' && !escapedAt(s, i)) {
      const openAt = i;
      const innerStart = i + 1;
      const closeAt = findDelimClose(s, innerStart, '$');
      if (closeAt === -1) {
        localErrors.push(`unclosed $…$ opened at offset ${openAt}`);
        i = s.length;
        break;
      }
      spans.push({
        kind: '$', open: '$', close: '$',
        body: s.slice(innerStart, closeAt),
        startIdx: openAt,
        endIdx: closeAt + 1,
      });
      i = closeAt + 1;
      continue;
    }

    if (c === '\\' && next === '(') {
      const openAt = i;
      const innerStart = i + 2;
      const closeAt = findDelimClose(s, innerStart, '\\(');
      if (closeAt === -1) {
        localErrors.push(`unclosed \\(…\\) opened at offset ${openAt}`);
        i = s.length;
        break;
      }
      spans.push({
        kind: '\\(', open: '\\(', close: '\\)',
        body: s.slice(innerStart, closeAt),
        startIdx: openAt,
        endIdx: closeAt + 2,
      });
      i = closeAt + 2;
      continue;
    }

    if (c === '\\' && next === '[') {
      const openAt = i;
      const innerStart = i + 2;
      const closeAt = findDelimClose(s, innerStart, '\\[');
      if (closeAt === -1) {
        localErrors.push(`unclosed \\[…\\] opened at offset ${openAt}`);
        i = s.length;
        break;
      }
      spans.push({
        kind: '\\[', open: '\\[', close: '\\]',
        body: s.slice(innerStart, closeAt),
        startIdx: openAt,
        endIdx: closeAt + 2,
      });
      i = closeAt + 2;
      continue;
    }

    // Stray `\)` or `\]` outside any open span is an orphan close.
    if (c === '\\' && (next === ')' || next === ']')) {
      localErrors.push(`orphan \\${next} close at offset ${i}`);
      i += 2;
      continue;
    }

    i++;
  }
  return { spans, errors: localErrors };
}

// ─────────────────────────────────────────────────────────────────────────
// Per-span structural checks.

function checkBraces(body) {
  // Count `{` and `}` but ignore escaped `\{` and `\}`.
  let open = 0, close = 0;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (c === '{' && !escapedAt(body, i)) open++;
    else if (c === '}' && !escapedAt(body, i)) close++;
  }
  if (open !== close) {
    return `unbalanced braces inside ${body.length > 50 ? body.slice(0, 47) + '…' : body} ({=${open}, }=${close})`;
  }
  return null;
}

function checkEnvironments(body) {
  const openRe = /\\begin\{([a-zA-Z*]+)\}/g;
  const closeRe = /\\end\{([a-zA-Z*]+)\}/g;
  const stack = [];
  const unmatchedClose = [];
  // Walk tokens in order. We merge both regexes by stepping through the
  // string and matching whichever comes first. Simplest: build a combined
  // array sorted by index.
  const tokens = [];
  let m;
  while ((m = openRe.exec(body))) tokens.push({ at: m.index, kind: 'begin', name: m[1] });
  while ((m = closeRe.exec(body))) tokens.push({ at: m.index, kind: 'end', name: m[1] });
  tokens.sort((a, b) => a.at - b.at);
  for (const t of tokens) {
    if (t.kind === 'begin') stack.push(t.name);
    else {
      if (stack.length === 0) { unmatchedClose.push(t.name); continue; }
      const top = stack.pop();
      if (top !== t.name) {
        return `mismatched environment: \\begin{${top}} closed by \\end{${t.name}}`;
      }
    }
  }
  if (stack.length > 0) {
    return `unclosed environment \\begin{${stack[stack.length - 1]}} (no matching \\end)`;
  }
  if (unmatchedClose.length > 0) {
    return `orphan \\end{${unmatchedClose[0]}} (no matching \\begin)`;
  }
  return null;
}

function checkEmpty(span) {
  if (span.body.trim() === '') {
    return `empty math span ${span.open}${span.close}`;
  }
  return null;
}

function checkTypoHeuristics(body) {
  // \sqrt with no argument. Valid forms include `\sqrt{…}`, `\sqrt[n]{…}`,
  // `\sqrt 3` (single-token arg after whitespace), or `\sqrt3`. So we only
  // flag `\sqrt` followed immediately by end-of-span or a closing-ish token.
  const sqrtRe = /\\sqrt(?![a-zA-Z])(?=\s*$|\s*[)\]}])/g;
  const m = sqrtRe.exec(body);
  if (m) {
    return `suspicious \\sqrt with no argument at offset ${m.index}`;
  }
  // stray `&` outside an aligned/matrix/cases env. Cheap check: if there is
  // any `&` (not escaped) and no \begin{align|aligned|array|matrix|pmatrix|
  // bmatrix|cases|smallmatrix|split|gathered} in the span, flag it.
  let hasAmp = false;
  for (let i = 0; i < body.length; i++) {
    if (body[i] === '&' && !escapedAt(body, i)) { hasAmp = true; break; }
  }
  if (hasAmp && !/\\begin\{(align\*?|aligned|alignat\*?|array|matrix|pmatrix|bmatrix|Bmatrix|vmatrix|Vmatrix|smallmatrix|cases|split|gathered|eqnarray\*?)\}/.test(body)) {
    return `stray '&' outside an aligned/matrix/cases environment`;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────
// Macro-aware warning pass.
//
// Tokenizes each math span for `\<letters>` uses and emits a warning for any
// macro name that is neither a KaTeX built-in nor a user-project macro
// declared in `category-theory.html`'s KaTeX loader `macros:` block.
//
// The whitelist is deliberately generous. False negatives (letting a real
// typo through) are cheap; false positives (nagging about legitimate KaTeX
// macros) train authors to ignore the warnings. When in doubt, include.
//
// User-project macros: grep the canonical style template for a `macros:`
// entry in the KaTeX loader. There is none today, so this set is empty;
// keeping the hook in place so adding `\N`, `\Z`, `\defeq`, etc. to the
// loader automatically propagates to the validator.
//
// The whitelist draws from KaTeX's documented "Supported Functions" list
// (https://katex.org/docs/supported), de-duplicated and normalized.

const USER_MACROS = new Set([
  // Mirror of the KaTeX loader's `macros:` block in every topic page's rawHead.
  // Defined via `\X = \operatorname{X}` so each renders the operator name in
  // upright Roman with proper spacing. Adding more here propagates the
  // recognition to this validator.
  'Spec', 'Gal', 'Hom', 'tr', 'ad', 'ind',
]);

const KATEX_MACROS = new Set([
  // Greek lowercase
  'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'varepsilon', 'zeta', 'eta',
  'theta', 'vartheta', 'iota', 'kappa', 'varkappa', 'lambda', 'mu', 'nu',
  'xi', 'omicron', 'pi', 'varpi', 'rho', 'varrho', 'sigma', 'varsigma',
  'tau', 'upsilon', 'phi', 'varphi', 'chi', 'psi', 'omega', 'digamma',
  // Greek uppercase
  'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta',
  'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho',
  'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega',
  'varGamma', 'varDelta', 'varTheta', 'varLambda', 'varXi', 'varPi',
  'varSigma', 'varUpsilon', 'varPhi', 'varPsi', 'varOmega',
  // Font and style
  'mathbb', 'mathbf', 'mathbfit', 'mathcal', 'mathfrak', 'mathit',
  'mathnormal', 'mathrm', 'mathscr', 'mathsf', 'mathsfit', 'mathtt',
  'boldsymbol', 'bm', 'pmb', 'bold', 'Bbb', 'bbFont', 'frak',
  'textbf', 'textit', 'textmd', 'textnormal', 'textrm', 'textsf',
  'texttt', 'textup', 'emph', 'text', 'textsc', 'textcolor',
  'color', 'colorbox', 'fcolorbox',
  // Fractions and binoms
  'frac', 'dfrac', 'tfrac', 'cfrac', 'binom', 'dbinom', 'tbinom',
  'genfrac', 'over', 'atop', 'above', 'choose', 'brack', 'brace',
  // Roots
  'sqrt', 'surd',
  // Operators (large + functional-looking)
  'sum', 'prod', 'coprod', 'int', 'iint', 'iiint', 'iiiint', 'idotsint',
  'oint', 'oiint', 'oiiint', 'intop', 'smallint',
  'bigcap', 'bigcup', 'bigsqcup', 'bigsqcap', 'biguplus', 'bigvee',
  'bigwedge', 'bigoplus', 'bigotimes', 'bigodot',
  'lim', 'limsup', 'liminf', 'varliminf', 'varlimsup', 'varinjlim',
  'varprojlim', 'injlim', 'projlim',
  'sup', 'inf', 'max', 'min', 'arg', 'det', 'dim', 'ker', 'gcd', 'lcm',
  'exp', 'log', 'ln', 'lg', 'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
  'sinh', 'cosh', 'tanh', 'coth', 'arcsin', 'arccos', 'arctan', 'arccot',
  'arcsec', 'arccsc', 'arsinh', 'arcosh', 'artanh',
  'deg', 'hom', 'Pr', 'mod', 'pmod', 'bmod', 'pod',
  'operatorname', 'operatornamewithlimits', 'DeclareMathOperator',
  // Accents (single-char)
  'hat', 'widehat', 'tilde', 'widetilde', 'bar', 'overline', 'underline',
  'vec', 'dot', 'ddot', 'dddot', 'ddddot', 'breve', 'check', 'grave',
  'acute', 'mathring', 'overrightarrow', 'overleftarrow', 'overleftrightarrow',
  'underrightarrow', 'underleftarrow', 'underleftrightarrow',
  'overbrace', 'underbrace', 'overgroup', 'undergroup',
  'overbracket', 'underbracket', 'overparen', 'underparen',
  'overlinesegment', 'underlinesegment', 'utilde', 'widecheck',
  'overrightharpoon', 'overleftharpoon',
  // Arrows
  'to', 'gets', 'mapsto', 'longmapsto', 'hookrightarrow', 'hookleftarrow',
  'Rightarrow', 'Leftarrow', 'Leftrightarrow', 'leftrightarrow',
  'rightarrow', 'leftarrow', 'longrightarrow', 'longleftarrow',
  'longleftrightarrow', 'Longrightarrow', 'Longleftarrow', 'Longleftrightarrow',
  'twoheadrightarrow', 'twoheadleftarrow', 'leftharpoonup', 'leftharpoondown',
  'rightharpoonup', 'rightharpoondown', 'leftrightharpoons', 'rightleftharpoons',
  'nearrow', 'searrow', 'swarrow', 'nwarrow', 'uparrow', 'downarrow',
  'updownarrow', 'Uparrow', 'Downarrow', 'Updownarrow',
  'rightrightarrows', 'leftleftarrows', 'upuparrows', 'downdownarrows',
  'rightleftarrows', 'leftrightarrows', 'Lleftarrow', 'Rrightarrow',
  'rightarrowtail', 'leftarrowtail', 'looparrowright', 'looparrowleft',
  'curvearrowright', 'curvearrowleft', 'circlearrowright', 'circlearrowleft',
  'Lsh', 'Rsh', 'upharpoonright', 'upharpoonleft', 'downharpoonright',
  'downharpoonleft', 'rightsquigarrow', 'leadsto', 'restriction',
  'xrightarrow', 'xleftarrow', 'xRightarrow', 'xLeftarrow',
  'xleftrightarrow', 'xLeftrightarrow', 'xhookrightarrow', 'xhookleftarrow',
  'xmapsto', 'xtofrom', 'xrightharpoonup', 'xrightharpoondown',
  'xleftharpoonup', 'xleftharpoondown', 'xrightleftharpoons',
  'xleftrightharpoons', 'xlongequal', 'xtwoheadrightarrow', 'xtwoheadleftarrow',
  'implies', 'impliedby', 'iff',
  // Binary operators
  'pm', 'mp', 'times', 'div', 'cdot', 'ast', 'star', 'circ', 'bullet',
  'oplus', 'ominus', 'otimes', 'oslash', 'odot', 'boxplus', 'boxminus',
  'boxtimes', 'boxdot', 'diamond', 'Diamond', 'triangle', 'bigtriangleup',
  'bigtriangledown', 'triangleleft', 'triangleright', 'lhd', 'rhd',
  'unlhd', 'unrhd', 'oslash', 'intercal', 'wedge', 'vee', 'barwedge',
  'veebar', 'doublebarwedge', 'curlyvee', 'curlywedge', 'sqcap', 'sqcup',
  'amalg', 'ddagger', 'dagger', 'setminus', 'smallsetminus', 'wr', 'Cap',
  'Cup', 'doublecap', 'doublecup', 'leftthreetimes', 'rightthreetimes',
  'ltimes', 'rtimes',
  'divideontimes',
  // Relations
  'leq', 'le', 'geq', 'ge', 'neq', 'ne', 'equiv', 'sim', 'simeq', 'approx',
  'cong', 'doteq', 'propto', 'asymp', 'bowtie', 'dashv', 'vdash', 'models',
  'perp', 'mid', 'nmid', 'parallel', 'nparallel', 'smile', 'frown',
  'sqsubset', 'sqsupset', 'sqsubseteq', 'sqsupseteq', 'subset', 'supset',
  'subseteq', 'supseteq', 'subsetneq', 'supsetneq', 'subseteqq',
  'supseteqq', 'subsetneqq', 'supsetneqq', 'nsubseteq', 'nsupseteq',
  'nsubseteqq', 'nsupseteqq', 'Subset', 'Supset', 'in', 'ni', 'notin',
  'owns', 'll', 'gg', 'lll', 'ggg', 'lessless', 'greatergreater',
  'prec', 'succ', 'preceq', 'succeq', 'precsim', 'succsim', 'precapprox',
  'succapprox', 'precneqq', 'succneqq', 'lesssim', 'gtrsim', 'lessapprox',
  'gtrapprox', 'lessgtr', 'gtrless', 'lesseqgtr', 'gtreqless',
  'lesseqqgtr', 'gtreqqless', 'lneq', 'gneq', 'lneqq', 'gneqq',
  'lnsim', 'gnsim', 'lnapprox', 'gnapprox', 'doteqdot', 'risingdotseq',
  'fallingdotseq', 'circeq', 'triangleq', 'eqcirc', 'bumpeq', 'Bumpeq',
  'thickapprox', 'thicksim', 'approxeq', 'backsim', 'backsimeq',
  'ncong', 'nsim', 'nvdash', 'nvDash', 'nVdash', 'nVDash', 'vDash',
  'Vdash', 'Vvdash', 'nless', 'ngtr', 'nleq', 'ngeq', 'nleqq', 'ngeqq',
  'nleqslant', 'ngeqslant', 'lneqq', 'gneqq', 'nprec', 'nsucc',
  'npreceq', 'nsucceq', 'precnsim', 'succnsim', 'precnapprox',
  'succnapprox', 'shortmid', 'shortparallel', 'nshortmid', 'nshortparallel',
  'varpropto', 'between', 'pitchfork', 'because', 'therefore',
  'trianglelefteq', 'trianglerighteq', 'ntriangleleft', 'ntriangleright',
  'ntrianglelefteq', 'ntrianglerighteq', 'leqslant', 'geqslant',
  'eqslantless', 'eqslantgtr', 'leftarrowtriangle', 'rightarrowtriangle',
  'multimap', 'multimapdot', 'multimapdotboth', 'leftrightarrowtriangle',
  'sqsubset', 'sqsupset',
  // Set / logic
  'cup', 'cap', 'emptyset', 'varnothing', 'forall', 'exists', 'nexists',
  'neg', 'not', 'lnot', 'land', 'lor', 'top', 'bot', 'aleph', 'beth', 'gimel',
  'daleth', 'infty', 'partial', 'nabla', 'hbar', 'hslash', 'imath',
  'jmath', 'ell', 'wp', 'Re', 'Im', 'Finv', 'Game', 'eth', 'mho', 'Bbbk',
  'flat', 'natural', 'sharp', 'S', 'P', 'copyright', 'circledR',
  'circledS', 'pounds', 'yen', 'checkmark', 'diagup', 'diagdown',
  'surd', 'spadesuit', 'clubsuit', 'heartsuit', 'diamondsuit',
  'angle', 'measuredangle', 'sphericalangle',
  // Dots and spacing
  'cdots', 'ldots', 'dots', 'dotsb', 'dotsc', 'dotsi', 'dotsm', 'dotso',
  'vdots', 'ddots', 'iddots',
  'quad', 'qquad', 'thinspace', 'medspace', 'thickspace', 'negthinspace',
  'negmedspace', 'negthickspace', 'enspace', 'kern', 'mkern', 'hskip',
  'mskip', 'hspace', 'mspace', 'nobreakspace', 'space', 'vphantom',
  'hphantom', 'phantom', 'strut', 'mathstrut', 'smash',
  // Delimiters / sizes
  'left', 'right', 'middle', 'big', 'bigl', 'bigr', 'bigm',
  'Big', 'Bigl', 'Bigr', 'Bigm', 'bigg', 'biggl', 'biggr', 'biggm',
  'Bigg', 'Biggl', 'Biggr', 'Biggm',
  'langle', 'rangle', 'lvert', 'rvert', 'lVert', 'rVert', 'lfloor',
  'rfloor', 'lceil', 'rceil', 'lbrace', 'rbrace', 'lbrack', 'rbrack',
  'lmoustache', 'rmoustache', 'lgroup', 'rgroup', 'llbracket', 'rrbracket',
  'llcorner', 'lrcorner', 'ulcorner', 'urcorner', 'vert', 'Vert',
  'backslash', 'lBrace', 'rBrace', 'lang', 'rang',
  // Stacking / layout / math style
  'underset', 'overset', 'stackrel', 'stackbin', 'substack',
  'sideset', 'prescript', 'displaystyle', 'textstyle', 'scriptstyle',
  'scriptscriptstyle', 'limits', 'nolimits',
  'atop', 'above', 'abovewithdelims', 'atopwithdelims',
  'overwithdelims',
  // Math environments (used via \begin{...})
  'begin', 'end',
  // Matrix / alignment (names used inside \begin{...})
  // (These are listed for completeness; the env-check handles \begin{...}.)
  'array', 'matrix', 'pmatrix', 'bmatrix', 'Bmatrix', 'vmatrix', 'Vmatrix',
  'smallmatrix', 'cases', 'aligned', 'align', 'alignat', 'gathered',
  'split', 'gather', 'multline', 'eqnarray', 'equation', 'subarray',
  // Raising / lowering / boxes
  'raisebox', 'lower', 'raise', 'rlap', 'llap', 'mathclap', 'mathllap',
  'mathrlap', 'mathrlap', 'hbox', 'mbox', 'fbox', 'framebox', 'boxed',
  'enclose', 'cancel', 'bcancel', 'xcancel', 'sout', 'ulem',
  // Misc structural
  'tag', 'notag', 'nonumber', 'label', 'ref', 'eqref',
  'intertext', 'shortintertext', 'hline', 'cline', 'hdashline',
  'toprule', 'midrule', 'bottomrule',
  'char', 'mathchoice', 'relax', 'expandafter', 'noexpand',
  // Number systems shortcut
  'colon', 'semicolon',
  // Specific non-standard but KaTeX-supported
  'Sha', 'Sha',
  // Escaped specials treated as "macros" when followed by letters via lookbehind.
  // (These are accents when a letter follows; they're harmless in the whitelist.)
  'H', 'c', 'v', 'u', 'r', 'b', 'd', 't', 'l', 'o', 'O', 'AA', 'aa',
  'ss', 'L', 'i', 'j', 'aA',
  // Mods / display variants
  'mod', 'pmod', 'pod', 'bmod',
  // Typed TeX primitives occasionally appearing in this repo
  'def', 'newcommand', 'renewcommand', 'providecommand',
  'string', 'message', 'global',
  // Explicit escapes
  'lq', 'rq',
  // KaTeX environment names (again safe)
  'equation',
]);

// Match `\<letters>` macros. Excludes `\<non-letter>` which are typically
// escaped delimiters or punctuation (e.g. `\{`, `\,`, `\\`, `\$`).
const MACRO_RE = /\\([a-zA-Z]+)\*?/g;

function isKnownMacro(name) {
  return KATEX_MACROS.has(name) || USER_MACROS.has(name);
}

function checkUnknownMacros(body, span, file, path, macroCounts) {
  let m;
  MACRO_RE.lastIndex = 0;
  while ((m = MACRO_RE.exec(body))) {
    const name = m[1];
    if (isKnownMacro(name)) continue;
    warnings.push({
      file,
      path,
      msg: `${span.open}…${span.close}: unknown macro "\\${name}"`,
    });
    if (macroCounts) macroCounts.set(name, (macroCounts.get(name) || 0) + 1);
  }
}

const unknownMacroCounts = new Map();

// ─────────────────────────────────────────────────────────────────────────
// Validate one string value, annotating errors with the JSON field path.

function validateString(s, file, path) {
  if (typeof s !== 'string' || s === '') return;
  const { spans, errors: extractErrs } = extractSpans(s);
  for (const e of extractErrs) {
    errors.push({ file, path, msg: e });
  }
  for (const span of spans) {
    const emptyMsg = checkEmpty(span);
    if (emptyMsg) {
      warnings.push({ file, path, msg: emptyMsg });
      continue; // skip further checks on an empty span
    }
    const braceMsg = checkBraces(span.body);
    if (braceMsg) {
      errors.push({ file, path, msg: `${span.open}…${span.close}: ${braceMsg}` });
    }
    const envMsg = checkEnvironments(span.body);
    if (envMsg) {
      errors.push({ file, path, msg: `${span.open}…${span.close}: ${envMsg}` });
    }
    const typoMsg = checkTypoHeuristics(span.body);
    if (typoMsg) {
      warnings.push({ file, path, msg: `${span.open}…${span.close}: ${typoMsg}` });
    }
    checkUnknownMacros(span.body, span, file, path, unknownMacroCounts);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Load the content model once. The model exposes raw quiz banks (preserving
// the `.questions` tier name), the first-writer-wins concept map (keyed by
// concept id), and the raw capstones array — everything we need to iterate.

const model = await loadContentModel();

// ─────────────────────────────────────────────────────────────────────────
// Walk quizzes.

for (const [topic, bank] of model.quizBanks) {
  if (!bank) continue;
  const rel = `quizzes/${topic}.json`;
  const quizzes = (bank && bank.quizzes) || {};
  for (const [conceptId, quiz] of Object.entries(quizzes)) {
    if (!quiz || typeof quiz !== 'object') continue;
    for (const tier of ['questions', 'hard', 'expert']) {
      const arr = Array.isArray(quiz[tier]) ? quiz[tier] : null;
      if (!arr) continue;
      for (let i = 0; i < arr.length; i++) {
        const q = arr[i];
        if (!q || typeof q !== 'object') continue;
        const base = `quizzes.${conceptId}.${tier}[${i}]`;
        validateString(q.q,       rel, `${base}.q`);
        validateString(q.explain, rel, `${base}.explain`);
        validateString(q.hint,    rel, `${base}.hint`);
        if ((q.type === 'mcq' || q.type === 'multi-select' || q.type === 'proof-completion')
            && Array.isArray(q.choices)) {
          for (let j = 0; j < q.choices.length; j++) {
            validateString(q.choices[j], rel, `${base}.choices[${j}]`);
          }
        }
        if ((q.type === 'ordering') && Array.isArray(q.items)) {
          for (let j = 0; j < q.items.length; j++) {
            validateString(q.items[j], rel, `${base}.items[${j}]`);
          }
        }
        if ((q.type === 'proof-completion' || q.type === 'spot-the-error')
            && Array.isArray(q.steps)) {
          for (let j = 0; j < q.steps.length; j++) {
            validateString(q.steps[j], rel, `${base}.steps[${j}]`);
          }
        }
        if (q.type === 'matching') {
          if (Array.isArray(q.left)) {
            for (let j = 0; j < q.left.length; j++) {
              validateString(q.left[j], rel, `${base}.left[${j}]`);
            }
          }
          if (Array.isArray(q.right)) {
            for (let j = 0; j < q.right.length; j++) {
              validateString(q.right[j], rel, `${base}.right[${j}]`);
            }
          }
        }
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Walk concept blurbs (each owner topic).

for (const c of model.concepts.values()) {
  const rel = `concepts/${c.topic}.json`;
  const key = c.id;
  validateString(c.blurb, rel, `concepts[${key}].blurb`);
}

// Capstones.
for (let i = 0; i < model.capstones.length; i++) {
  const c = model.capstones[i];
  if (!c || typeof c !== 'object') continue;
  const key = c.id || `#${i}`;
  validateString(c.blurb, 'concepts/capstones.json', `capstones[${key}].blurb`);
}

// ─────────────────────────────────────────────────────────────────────────
// Report.

function cmp(a, b) {
  if (a.file !== b.file) return a.file < b.file ? -1 : 1;
  if (a.path !== b.path) return a.path < b.path ? -1 : 1;
  return 0;
}
errors.sort(cmp);
warnings.sort(cmp);

console.log(`validate-katex: scanned quizzes/*.json + concepts/*.json`);
console.log('');

if (errors.length) {
  console.log(`ERRORS (${errors.length}):`);
  for (const { file, path, msg } of errors) console.log(`  - ${file}:${path} → ${msg}`);
  console.log('');
}
if (warnings.length) {
  console.log(`WARNINGS (${warnings.length}):`);
  for (const { file, path, msg } of warnings) console.log(`  - ${file}:${path} → ${msg}`);
  console.log('');
}

if (unknownMacroCounts.size > 0) {
  const top = [...unknownMacroCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  console.log(`Top unknown macros (${unknownMacroCounts.size} distinct):`);
  for (const [name, n] of top) console.log(`  ${n}\t\\${name}`);
  console.log('');
}

if (errors.length === 0) {
  console.log(`OK: ${warnings.length === 0 ? 'no structural KaTeX issues found' : `no errors (${warnings.length} warning${warnings.length === 1 ? '' : 's'})`}.`);
  process.exit(0);
} else {
  console.log(`FAIL: ${errors.length} structural KaTeX error(s).`);
  process.exit(1);
}
