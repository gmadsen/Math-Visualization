---
name: new-section
description: Scaffold a new numbered <section> stub inside an existing topic page, optionally with a quiz placeholder.
---

## When to use this skill

Invoke when the author wants to add a new numbered section to an existing `<topic>.html` without leaving the editor. Use `/new-section <topic-id> <number> <heading>`.

## Arguments

- `<topic-id>` — slug matching `<topic>.html` and `concepts/<topic>.json` (e.g. `category-theory`).
- `<number>` — the numeric prefix for the `<h2>` (e.g. `4`). Should be one past the current last numbered section.
- `<heading>` — short human-readable heading (everything after the number). Quote if it contains spaces.

## What to do

1. Read `<topic>.html` and locate the existing numbered `<section>` blocks (pattern: `<h2>N. …</h2>`). Find the last one.
2. Derive an `id` by slugging `<heading>` (kebab-case, strip non-`[a-z0-9-]`). If the resulting slug already appears as an `id=` on the page, suffix `-2`, `-3`, ... until unique.
3. Insert, immediately after the closing `</section>` of the current last numbered section:

   ```html
   <section id="<auto-slug>">
   <h2><number>. <heading></h2>
   <!-- TODO: content goes here — prose, widgets, and a quiz placeholder:
        <div class="quiz" data-concept="<concept-id>"></div>
   -->
   </section>
   ```

4. If `<heading>` looks concept-sized (a noun phrase, not "Examples" / "Exercises" / "Notes"), append this hint line inside the TODO comment so the author remembers to wire a quiz + concept entry:

   > Heuristic: add a matching concept to `concepts/<topic>.json` and a `<div class="quiz" data-concept="…"></div>` above.

5. Preserve existing indentation (the rest of the page uses no leading indent on top-level sections — match that).

## Output format

Report back, concisely:

- The auto-generated section id.
- File path touched (absolute).
- Whether a quiz placeholder hint was emitted.
- Reminder: "Run `node scripts/rebuild.mjs` when you're ready — this skill does not."

## Guardrails

- Edit only the target `<topic>.html`. Do not touch `concepts/`, `quizzes/`, `index.html`, or any JSON.
- Do not run `rebuild.mjs` or any validator — the caller owns verification.
- If the topic page has no existing numbered section, insert the new section immediately after `<section class="hero">…</section>` and report that the author should renumber if desired.
