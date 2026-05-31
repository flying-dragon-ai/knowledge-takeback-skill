# knowledge-takeback-skill

knowledge-takeback-skill is an npm/npx skill package for generating interactive HTML knowledge-takeback pages. It does not only help an agent finish a task; it turns the completed process into a page, structured artifact, or learning record the user can understand, transfer, and retain. When a page needs a hero image, section illustration, or concept visual, the skill can call an image generation API from prompt files.

## Scope

knowledge-takeback-skill covers all **AI-assisted complex cognitive tasks**, including but not limited to:

- writing code, changing code, and debugging errors
- reading papers, reports, and research material
- looking up concepts, organizing notes, and building knowledge frameworks
- writing plans, preparing presentations, and consolidating meeting records
- generating interactive HTML learning pages, knowledge pages, and review pages

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
├── prompts/image-generation/    # Image prompts; users can add their own prompt files
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
- Use interactive HTML as the primary deliverable; generated images must remain traceable through prompt and metadata.
- Use knowledge-takeback-skill Artifact DSL and run validation when complex visualization should be durable, editable, and verifiable.

## Image Generation

Place custom prompt files in:

```text
prompts/image-generation/
```

Supported files are `.md` and `.txt`. Prefer usage-based names such as `hero-*`, `cover-*`, `concept-*`, `section-*`, `showcase-*`, and `style-*`. The skill decides when image generation should be triggered based on the page role and task topic.

Provide image API configuration through environment variables or an ignored local config file. Do not commit API keys:

```bash
cp .env.example .env
KNOWLEDGE_TAKEBACK_IMAGE_PROVIDER="openai"
KNOWLEDGE_TAKEBACK_IMAGE_BASE_URL="https://..."
KNOWLEDGE_TAKEBACK_IMAGE_API_KEY="..."
KNOWLEDGE_TAKEBACK_IMAGE_MODEL="..."
```

Manual generation example:

```bash
npm run image:generate -- --provider openai --usage cover --prompt-file prompts/image-generation/hero-interactive-html.md --name demo-hero --optional
```

See [references/image-generation.md](references/image-generation.md) for generic base URL, StepFun / MiniMax providers, usage size mapping, and QA rules.

## Validation

```bash
python C:/Users/Administrator/.codex/skills/.system/skill-creator/scripts/quick_validate.py .
python C:/Users/Administrator/.codex/skills/.system/skill-creator/scripts/quick_validate.py ./knowledge-takeback-skill
npm run validate
npm run pack:check
node --check scripts/generate-image.mjs
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
