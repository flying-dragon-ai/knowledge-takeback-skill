# Directory Structure

This repository is the installable `knowledge-takeback-skill` package for the knowledge-takeback-skill workflow. Keep the root small: it should expose the skill, package metadata, and top-level README files only.

## Root

- `SKILL.md` — discovery wrapper for skill loaders. It should stay short and route to `knowledge-takeback-skill/SKILL.md`.
- `README.md` / `README.en.md` — user-facing setup and usage.
- `package.json` / `package-lock.json` — Node metadata and validation scripts.
- `LICENSE` / `.gitignore` — repository metadata.
- `bin/knowledge-takeback-skill.mjs` — npx installer entrypoint.

## Skill Runtime

- `knowledge-takeback-skill/SKILL.md` — authoritative workflow and rules.
- `knowledge-takeback-skill/agents/openai.yaml` — UI metadata when `knowledge-takeback-skill/` is loaded as a standalone skill.
- `agents/openai.yaml` — UI metadata when the repository root is loaded as the skill.

## Supporting Material

- `assets/` — reusable visual templates, generated backgrounds, and client-side helpers.
- `bin/` — package CLI files included for npm distribution.
- `references/` — knowledge-takeback-skill Artifact DSL rules, artifact workflow, and optional visual/layout references.
- `scripts/` — validators and maintenance scripts, including `validate-knowledge-takeback-skill-artifact.mjs`.
- `docs/` — product, handoff, and maintainer documentation.

## Generated Material

- `examples/` — checked-in generated HTML and `.ahtml` artifact examples.
- `local/` — ignored local learner state, scratch artifacts, and imported source drops.
- `local/`, `knowledge-takeback-skill-notes/`, `knowledge-takeback-skill-artifacts/`, `knowledge-takeback-skill-log.md`, `knowledge-takeback-skill-config.md`, `fishing/` — ignored legacy or user-selected knowledge-takeback-skill storage locations.

## Placement Rules

- Do not put generated HTML pages at the repository root.
- Do not put generated HTML pages inside `knowledge-takeback-skill/`; that folder should contain the skill workflow and metadata only.
- Do not put generated `.ahtml` artifacts inside `knowledge-takeback-skill/`; save user artifacts under the knowledge-takeback-skill storage root or examples under `examples/`.
- Do not put imported upstream projects at the repository root; place them under `local/imports/`.
- Do not put product or handoff documents at the repository root.
- Do not publish `local/`, `node_modules/`, IDE folders, or upstream source drops; npm package contents are controlled by `package.json` `files`.
- Do not run `scripts/validate-social-deck.mjs` without a target. Use `npm run validate` for project syntax checks, or `npm run validate:social-deck -- <task-dir|index.html>` for the legacy poster validator.
- Validate knowledge-takeback-skill Artifact DSL with `node scripts/validate-knowledge-takeback-skill-artifact.mjs <artifact.ahtml>`.
- Check npm distribution contents with `npm run pack:check`.
