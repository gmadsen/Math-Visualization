---
name: suggest-callbacks
description: Scan a topic's prose and quizzes for concept names owned by OTHER topics and propose `<aside class="callback">` blocks to add — report only, no edits.
---

## When to use this skill

Invoke when hunting for missing cross-topic references that `scripts/audit-callbacks.mjs` won't flag because the prereq edge hasn't been declared yet. Use `/suggest-callbacks <topic-id>`.

This is the discovery counterpart to `audit-callbacks.mjs --fix` (which only inserts callbacks for already-declared prereqs).

## Arguments

- `<topic-id>` — required. The topic to scan.

## What to do

1. Load `concepts/index.json` → list of all topic slugs.
2. Load every `concepts/<other>.json` for `<other> != <topic-id>` and build a map `conceptTitle → { id, anchor, topic }`. Also include common title fragments (strip leading "the", trailing "s").
3. Read `<topic-id>.html` and `quizzes/<topic-id>.json`. For each numbered `<section id="…">`:
   - Extract prose text (strip tags, KaTeX `$…$` content, and SVG).
   - Pull the quiz block for that section's concept (match via `data-concept=` → concept id → `quizzes/<topic-id>.json` entry).
   - Look for case-insensitive whole-word matches against the cross-topic concept title map. Skip matches to concepts owned by `<topic-id>` itself.
4. For each hit, check whether the target concept id is already a declared prereq of *any* concept on this page (by reading `concepts/<topic-id>.json`). If yes, callback is already covered by `audit-callbacks.mjs --fix` — skip.
5. For each surviving hit, propose a callback block:

   ```html
   <aside class="callback">
     <strong>See also:</strong>
     <a href="./<other-topic>.html#<anchor>"><title></a> — <one-line why it's relevant>.
   </aside>
   ```

   Group by section so multiple hits in one section become a single aside with multiple links.

## Output format

Per section of `<topic-id>.html`:

- `### <N>. <section heading> (#<id>)`
- Bullet list of proposed callbacks: target topic, concept id, anchor, confidence (high / medium / low based on match specificity).
- A ready-to-paste HTML block for the whole aside.

At the end:

- Summary count.
- Reminder: "This skill does not edit files. If you want these live, add a prereq to `concepts/<topic-id>.json` and run `node scripts/audit-callbacks.mjs --fix` — or paste the block manually."

## Guardrails

- READ ONLY. Do not modify any file.
- Skip matches inside code blocks, KaTeX, or existing `<aside>` elements to avoid noise.
- Prefer precision over recall: short/common words like "set", "group", "map" generate too many false positives — require either a multi-word concept title OR context that makes the concept sense obvious (e.g. "functor" near "category").
