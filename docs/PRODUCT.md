# Product — knowledge-takeback-skill

## Positioning

knowledge-takeback-skill is a learning layer for AI-assisted work that produces interactive HTML pages. Its product promise is:

> Do not only let AI complete the task. Help the user understand why it worked and how to do a similar task next time.

For complex reviews, knowledge-takeback-skill can emit a complete interactive HTML page, a validated structured artifact, or both. The page can include generated hero images, section visuals, evidence maps, timelines, comparison boards, challenge queues, and learning notes.

## Supported Task Types

| Task type | Evidence to capture | Learning output |
|---|---|---|
| Code / debugging | files, diffs, command output, tests | interactive debugging page and reusable path |
| Papers / reports / research | source paragraphs, claims, data scope | evidence page, claim map, limits |
| Concepts / notes / frameworks | definitions, prerequisites, neighboring concepts, counterexamples | concept page, visual explanation, transfer notes |
| Plans / presentations / meetings | goals, constraints, decisions, action items, open issues | decision page, risks, next steps |

## Modes

- `/knowledge-takeback-skill`: post-task review.
- `/knowledge-takeback-skill letmesee`: guided work with step-by-step explanation.
- `/knowledge-takeback-skill letmetry`: transfer challenge after a task.

## Structured Artifacts

knowledge-takeback-skill Artifact DSL is the current structured visual format. It adapts the useful part of Agent-HTML: constrained tags, quoted scalar attributes, validation before render, and component-shaped output.

Artifacts belong under `{storage_root}/knowledge-takeback-skill-artifacts/` for user work or `examples/` for package examples. They are validated with `scripts/validate-knowledge-takeback-skill-artifact.mjs`.

## Image Generation

Image generation is optional and page-driven. It is used when a generated visual improves the first screen, concept explanation, or section comprehension.

- Prompt files live in `prompts/image-generation/`.
- Runtime images and metadata are saved outside the prompt directory, usually under the task output directory or `local/knowledge-takeback-skill/generated-images/`.
- API configuration is read from environment variables or an ignored local config file; secrets are never part of the published package.
- The reusable script is `scripts/generate-image.mjs`; detailed StepFun/MiniMax provider behavior lives in `references/image-generation.md`.

## Non-goals

- It is not a replacement for the actual task executor.
- It is not a source of unverified facts.
- It should not turn every answer into a long lecture.
- It should not treat all work as code.
- It should not generate decorative images that do not improve the HTML page.

## Current Architecture

The root `SKILL.md` is a discovery wrapper. The authoritative workflow lives in `knowledge-takeback-skill/SKILL.md` so it can also be tested as a standalone skill folder.

The copied poster-oriented `assets/` and legacy visual references are retained as optional Vision+ and fixed-export resources. Image prompts live in `prompts/image-generation/`. knowledge-takeback-skill Artifact DSL is the primary structured artifact path.

Generated learning pages belong in `examples/`. Product, handoff, and maintenance notes belong in `docs/`. Local learner state belongs under a user-selected knowledge-takeback-skill storage root and is ignored when it is placed in `local/`, `knowledge-takeback-skill-notes/`, `knowledge-takeback-skill-artifacts/`, or legacy `fishing/`.
