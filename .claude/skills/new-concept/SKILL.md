---
name: new-concept
description: One-shot scaffold for a new concept — concept JSON entry, matching HTML section stub with anchor + quiz placeholder, and a quiz bank stub.
---

## When to use this skill

Invoke when adding a new concept to a topic that already has a live HTML page. Use `/new-concept <topic-id> <concept-id> <title>`.

## Arguments

- `<topic-id>` — topic slug (e.g. `category-theory`). Must have existing `<topic>.html`, `concepts/<topic>.json`, `quizzes/<topic>.json`.
- `<concept-id>` — new concept id, kebab-case, globally unique across the whole notebook (check all `concepts/*.json`).
- `<title>` — short human-readable title. Quote if it contains spaces.

## What to do

1. **Preflight**
   - Verify `<topic>.html`, `concepts/<topic-id>.json`, `quizzes/<topic-id>.json` exist.
   - Scan every `concepts/*.json` for duplicate `id` → abort if `<concept-id>` is taken.
   - Derive `anchor` from `<concept-id>` (often the concept id itself works; if the id is long, use the last kebab segment). If an `id="<anchor>"` already exists on `<topic>.html`, suffix `-2` until unique.

2. **Update `concepts/<topic-id>.json`** — append to the `concepts` array:

   ```json
   {
     "id": "<concept-id>",
     "title": "<title>",
     "anchor": "<anchor>",
     "prereqs": [],
     "blurb": "TODO: 1–2 sentence summary for pathway detail panel."
   }
   ```

   Preserve existing 2-space indentation and trailing newline.

3. **Update `<topic-id>.html`** — insert a new numbered `<section>` after the current last numbered section (find max N from `<h2>N. …</h2>`; use N+1):

   ```html
   <section id="<anchor>">
   <h2><N+1>. <title></h2>
   <!-- TODO: prose + widget -->
   <div class="quiz" data-concept="<concept-id>"></div>
   </section>
   ```

4. **Update `quizzes/<topic-id>.json`** — add an entry under `quizzes`:

   ```json
   "<concept-id>": {
     "title": "<title>",
     "questions": [
       { "type": "mcq", "q": "TODO", "choices": ["TODO","TODO","TODO"], "answer": 0, "explain": "TODO" }
     ]
   }
   ```

5. Do NOT run `rebuild.mjs`, bundle builders, or validators. The caller does.

## Output format

Report, concisely:

- `<concept-id>` and derived `<anchor>`.
- Absolute paths of the 3 files touched.
- A one-line "author checklist":
  - Fill in `blurb`, `prereqs` (especially cross-topic ones → triggers callback audit later).
  - Replace the section TODO with real prose + widget.
  - Write 3 v1 questions (mix types). Consider `hard` tier.
  - Run `node scripts/rebuild.mjs`.

## Guardrails

- Abort on duplicate concept id (silent conflicts poison the concept graph).
- Abort on anchor collision that can't be resolved automatically.
- Edit only the three target files. Never touch `index.html`, `concepts/index.json`, `concepts/capstones.json`, or any bundle.
- Preserve existing JSON formatting — match the surrounding indentation and trailing comma / newline conventions.
