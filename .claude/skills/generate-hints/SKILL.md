---
name: generate-hints
description: Add missing `hint` fields to hard-tier quiz questions in a topic bank, deriving each hint from the existing `explain`.
---

## When to use this skill

Invoke when the hard tier exists but `?`-button hints are thin. Use `/generate-hints <topic-id>` for all hard questions in the topic, or `/generate-hints <topic-id> <concept-id>` to scope to one concept.

## Arguments

- `<topic-id>` — required. Matches `quizzes/<topic-id>.json`.
- `<concept-id>` — optional. If given, restrict to that one concept's hard bank.

## What to do

1. Read `quizzes/<topic-id>.json`. For each concept entry (or just the named one), iterate the `hard` array (skip if absent).
2. For every hard question with no `hint` field:
   - Derive a hint from `explain` — focus on the *approach* or *what to notice*, not the answer.
   - Constraints:
     - Single sentence.
     - ≤ 15 words.
     - Nudge, not spoiler — do not restate the final value, correct option text, or numeric answer.
     - Preserve LaTeX delimiters (`$…$`) if the notation is load-bearing.
   - If `explain` is empty, stubby, or too answer-heavy to paraphrase safely, skip that question and note it in the report.
3. Write the updated JSON back, preserving the existing field order on each question (insert `hint` after `explain`, or just before the closing brace if `explain` is absent). Keep 2-space indentation and the trailing newline the file already uses.
4. Do NOT touch `questions` (v1 tier) unless the user explicitly asks — v1 falls back to the first sentence of `explain` and rarely needs authored hints.
5. Do NOT run `build-quizzes-bundle.mjs` or `rebuild.mjs`. The caller does.

## Output format

Summary block:

- Topic / concept(s) scoped.
- Count of hints added, skipped, already-present.
- For each added hint, a one-line preview: `<concept-id>[<index>]: "<hint>"`.
- For each skipped question, a one-line reason (e.g. "explain too short to paraphrase safely").

## Guardrails

- Only mutate `quizzes/<topic-id>.json`. Never touch `concepts/`, HTML, or bundles.
- Never overwrite an existing `hint`.
- A hint that reveals the answer is worse than no hint — when in doubt, skip and report.
