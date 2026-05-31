# Handoff — knowledge-takeback-skill

## Current State

The project has been converted from a copied Guizang social-card source tree into the knowledge-takeback-skill package.

Important entrypoints:

- `SKILL.md` — root discovery wrapper for skill loaders.
- `knowledge-takeback-skill/SKILL.md` — authoritative knowledge-takeback-skill workflow.
- `agents/openai.yaml` — root UI metadata.
- `knowledge-takeback-skill/agents/openai.yaml` — standalone knowledge-takeback-skill folder UI metadata.
- `docs/STRUCTURE.md` — directory contract for maintainers.
- `bin/knowledge-takeback-skill.mjs` — npm/npx installer entrypoint.

## Fixed Project Direction

knowledge-takeback-skill covers AI-assisted complex cognitive tasks, not only code:

- code and debugging
- papers, reports, and research synthesis
- concept lookup, notes, and knowledge frameworks
- plans, presentations, and meeting records

## Structured Artifact Integration

Agent-HTML has been integrated into knowledge-takeback-skill as a constrained structured artifact capability, not as a copied app shell.

Current files:

- `references/knowledge-takeback-skill-artifact-dsl.md` — knowledge-takeback-skill-branded DSL contract and grammar.
- `references/knowledge-takeback-skill-artifact-workflow.md` — when to choose Markdown, inline HTML, or `.ahtml` artifacts.
- `scripts/validate-knowledge-takeback-skill-artifact.mjs` — standalone validator for knowledge-takeback-skill Artifact DSL.
- `examples/knowledge-takeback-skill-artifact-review.ahtml` — validated example artifact.
- `docs/THIRD_PARTY_NOTICES.md` — attribution and license boundary.

The proprietary Agent-HTML app source has not been incorporated. Keep legal/attribution notices intact when adapting upstream material.

## Retained Legacy Files

The copied social-card visual system remains under:

- `assets/`
- `references/`
- `scripts/validate-social-deck.mjs`

These files are retained as optional visual resources for local HTML fragments or future Vision+ work. They are no longer the root skill identity, and they should not be used when knowledge-takeback-skill Artifact DSL is enough.

## Known Conventions

- Keep `knowledge-takeback-skill/SKILL.md` as the workflow source of truth.
- Keep root `SKILL.md` short so it does not drift from the knowledge-takeback-skill source.
- Keep generated examples in `examples/`, not at the repository root or inside `knowledge-takeback-skill/`.
- Keep product and handoff documents in `docs/`, not at the repository root.
- Generated learner data should be written under the user-selected knowledge-takeback-skill storage root, not hard-coded to the current working directory.
- Local task state and generated learner artifacts are ignored by `.gitignore`.
- Imported upstream projects belong under `local/imports/`, not at the repository root, and are not published to npm.
- `package.json` `files` is the source of truth for npm package contents.

## Verification Commands

```powershell
$env:PYTHONUTF8='1'
python C:\Users\Administrator\.codex\skills\.system\skill-creator\scripts\quick_validate.py .
python C:\Users\Administrator\.codex\skills\.system\skill-creator\scripts\quick_validate.py .\knowledge-takeback-skill
npm run validate
npm run pack:check
node .\scripts\validate-knowledge-takeback-skill-artifact.mjs .\examples\knowledge-takeback-skill-artifact-review.ahtml
node --check .\scripts\validate-social-deck.mjs
node --check .\assets\magazine-bg-webgl.js
```
