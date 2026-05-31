# Product — knowledge-takeback-skill

## Positioning

knowledge-takeback-skill packages knowledge-takeback-skill as a learning layer for AI-assisted work. Its product promise is:

> Do not only let AI complete the task. Help the user understand why it worked and how to do a similar task next time.

For complex reviews, knowledge-takeback-skill can also emit a validated structured artifact. This gives the user a durable evidence map, timeline, comparison board, challenge queue, or learning note that can be inspected as source and rendered by an Agent-HTML-compatible host.

## Supported Task Types

| Task type | Evidence to capture | Learning output |
|---|---|---|
| Code / debugging | files, diffs, command output, tests | implementation reasoning and reusable debugging path |
| Papers / reports / research | source paragraphs, claims, data scope | reliable conclusions, evidence chain, limits |
| Concepts / notes / frameworks | definitions, prerequisites, neighboring concepts, counterexamples | concept map and transferable notes |
| Plans / presentations / meetings | goals, constraints, decisions, action items, open issues | decision chain, structure, risks, next step |

## Modes

- `/knowledge-takeback-skill`: post-task review.
- `/knowledge-takeback-skill letmesee`: guided work with step-by-step explanation.
- `/knowledge-takeback-skill letmetry`: transfer challenge after a task.

## Structured Artifacts

knowledge-takeback-skill Artifact DSL is the current structured visual format. It adapts the useful part of Agent-HTML: constrained tags, quoted scalar attributes, validation before render, and component-shaped output.

Artifacts belong under `{storage_root}/knowledge-takeback-skill-artifacts/` for user work or `examples/` for package examples. They are validated with `scripts/validate-knowledge-takeback-skill-artifact.mjs`.

## Non-goals

- It is not a replacement for the actual task executor.
- It is not a source of unverified facts.
- It should not turn every answer into a long lecture.
- It should not treat all work as code.

## Current Architecture

The root `SKILL.md` is a discovery wrapper. The authoritative workflow lives in `knowledge-takeback-skill/SKILL.md` so it can also be tested as a standalone skill folder.

The copied poster-oriented `assets/` and legacy visual references are retained as optional Vision+ and fixed-export resources. knowledge-takeback-skill Artifact DSL is the primary structured artifact path.

Generated learning pages belong in `examples/`. Product, handoff, and maintenance notes belong in `docs/`. Local learner state belongs under a user-selected knowledge-takeback-skill storage root and is ignored when it is placed in `local/`, `knowledge-takeback-skill/`, `knowledge-takeback-skill-notes/`, or legacy `fishing/`.
