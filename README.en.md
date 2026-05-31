# knowledge-takeback-skill

knowledge-takeback-skill is the npm/npx distribution package for the knowledge-takeback-skill workflow. knowledge-takeback-skill provides knowledge backflow for AI-assisted work: it does not only help an agent finish a task; it turns the completed process into something the user can understand, transfer, and retain. Complex reviews can also become validated knowledge-takeback-skill Artifact DSL documents for evidence chains, timelines, comparisons, challenges, and learning state.

## Scope

knowledge-takeback-skill covers all **AI-assisted complex cognitive tasks**, including but not limited to:

- writing code, changing code, and debugging errors
- reading papers, reports, and research material
- looking up concepts, organizing notes, and building knowledge frameworks
- writing plans, preparing presentations, and consolidating meeting records

## Usage

Install into the default Codex skills directory through npm/npx:

```bash
npx knowledge-takeback-skill
```

Install into a custom destination:

```bash
npx knowledge-takeback-skill install --target /absolute/path/to/skills/knowledge-takeback-skill
```

Install or place this directory in your skill search path, then invoke:

```text
/knowledge-takeback-skill
```

Modes:

- `/knowledge-takeback-skill`: review the task that was just completed.
- `/knowledge-takeback-skill letmesee`: explain each important step before continuing.
- `/knowledge-takeback-skill letmetry`: create a transfer exercise based on the previous task.

## Project Structure

```text
knowledge-takeback-skill/
├── SKILL.md                    # Root entrypoint for skill discovery
├── knowledge-takeback-skill/
│   ├── SKILL.md                # Authoritative knowledge-takeback-skill workflow
│   └── agents/openai.yaml      # knowledge-takeback-skill UI metadata
├── agents/openai.yaml          # Root UI metadata
├── assets/                     # Visual templates/assets retained for optional Vision+ reuse
├── bin/                        # npx installer entrypoint
├── references/                 # knowledge-takeback-skill Artifact DSL, visual references, and layout rules
├── docs/                       # Product, handoff, and structure documentation
├── examples/                   # Generated knowledge-takeback-skill HTML / Artifact examples
├── scripts/                    # Validators and maintenance scripts
├── package.json
└── LICENSE
```

See [docs/STRUCTURE.md](docs/STRUCTURE.md) for the directory contract.

## Core Rules

- Verify before teaching: unverified claims do not enter learning notes.
- Separate facts, inferences, and items that still need verification.
- Preserve evidence anchors: files, original text, command output, conversation context, or explicit reasoning.
- Store profiles, logs, and notes under the user-selected knowledge-takeback-skill storage root.
- Use local HTML fragments for complex visual structure when helpful, but never emit a complete page shell.
- Use knowledge-takeback-skill Artifact DSL and run validation when complex visualization should be durable, editable, and verifiable.

## Validation

```bash
python C:/Users/Administrator/.codex/skills/.system/skill-creator/scripts/quick_validate.py .
python C:/Users/Administrator/.codex/skills/.system/skill-creator/scripts/quick_validate.py ./knowledge-takeback-skill
npm run validate
npm run pack:check
node scripts/validate-knowledge-takeback-skill-artifact.mjs examples/knowledge-takeback-skill-artifact-review.ahtml
node --check scripts/validate-social-deck.mjs
node --check assets/magazine-bg-webgl.js
```

On Windows paths containing non-ASCII characters, enable UTF-8 for the Python validator:

```powershell
$env:PYTHONUTF8='1'
```

## License

AGPL-3.0-only. See [LICENSE](./LICENSE).
