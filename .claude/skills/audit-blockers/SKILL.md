---
name: audit-blockers
description: Run the CI-equivalent rebuild in audit-only mode and distill only the blocking errors, each with a one-line diagnosis and suggested fix.
---

## When to use this skill

Invoke when the author wants a fast "what's actually broken in CI right now?" readout without waiting on full logs. Use `/audit-blockers` for the whole repo or `/audit-blockers <topic>` to bias the smoke-test toward one topic.

## Arguments

- `[topic]` (optional) — topic slug (e.g. `category-theory`). Used to narrow smoke-test / validate output if it supports a filter; otherwise the full run still fires and this skill filters the report.

## What to do

1. Run the audit-only rebuild:

   ```bash
   node scripts/rebuild.mjs --no-fix
   ```

   This mirrors CI (`.github/workflows/verify.yml`) and bails on the first non-zero exit.
2. If `--no-fix` fails early on a fix-required step, continue by running the remaining individual validators the pipeline would have hit (in `AGENTS.md` order): `validate-concepts.mjs`, `validate-katex.mjs`, `audit-callbacks.mjs` (no flag), `insert-used-in-backlinks.mjs` (no flag), `smoke-test.mjs`. Collect stderr + non-zero-exit output from each.
3. Extract ONLY blocking errors — the things that make `rebuild.mjs` exit non-zero. Ignore advisory audits (color-vars, accessibility warnings, backlink-strength, etc.) unless the user asked.
4. If a `[topic]` arg was passed, down-rank or drop items that don't mention the slug, `<topic>.html`, `concepts/<topic>.json`, or `quizzes/<topic>.json`.

## Output format

Markdown list, ordered by severity (validator > katex > smoke > audit-callbacks > backlinks). Each item:

```
- <short title> — <file:line or concept-id>
  Diagnosis: <one-sentence plain-English cause>
  Fix: <one-sentence suggested action, usually "edit X" or "run `node scripts/Y.mjs --fix`">
```

End with a one-line summary: total blocker count and whether the repo would pass CI right now.

## Guardrails

- Pass `--no-fix` — never mutate files. This is a read-only audit.
- Do not run non-gating advisory audits unless explicitly asked.
- Do not propose speculative fixes. If the cause is unclear, say so and point to the file that needs human eyes.
