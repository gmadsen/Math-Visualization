# CLAUDE.md

Before doing anything in this repository, read [`AGENTS.md`](./AGENTS.md) — especially the § "Common pitfalls" checklist. It defines the project goal, house style, helper tools, quiz/progression system, verification checklist, and the parallel-agent protocol. Follow it.

Then skim [`README.md`](./README.md) § "How the notebook is organized" for the architectural overview and [`PLAN.md`](./PLAN.md) for forward priorities and concrete next tasks.

Scaffold scripts exist for the two common "add a new thing" flows: [`scripts/new-topic.mjs`](./scripts/new-topic.mjs) stamps out a new topic page (HTML + concepts + quizzes + index card registration), and [`scripts/new-widget.mjs`](./scripts/new-widget.mjs) stamps out a new widget-registry entry (`schema.json` + `index.mjs` + `README.md` under `widgets/<slug>/`). Prefer them over hand-authoring the 6-step boilerplate.
