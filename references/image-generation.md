# Image Generation Requirements

Use this reference whenever `knowledge-takeback-skill` creates supporting images for an interactive HTML page.

## Required Flow

1. Decide whether an image improves understanding, recognition, or evidence review. Do not generate decoration-only images.
2. Choose a prompt from `prompts/image-generation/` unless the user supplied an inline prompt. Fill variables before generation.
3. Write an image manifest in task notes or page metadata before calling the API.
4. Select an image `usage` and provider. Use the `--usage` map instead of hand-writing provider dimensions.
5. Run `scripts/generate-image.mjs`; use `--dry-run` first when provider settings are uncertain.
6. Downloaded images and metadata must stay local. HTML must reference relative local paths, not temporary provider URLs.
7. If the API key is missing or generation fails, continue the HTML build with a CSS or component fallback and record the reason. Use `--optional` when image generation is part of a larger build that must not fail on missing keys.
8. QA desktop and mobile crops, overlay readability, and image-text spacing before delivery.

## Prompt Folder Contract

Users can add reusable prompts to `prompts/image-generation/`. Treat that folder as the first source for image prompt selection.

Supported files:

```text
prompts/image-generation/*.md
prompts/image-generation/*.txt
```

Selection rules:

- Prefer user-added prompt files over built-in fallback prompts when the filename and task intent match.
- Match by intended placement first, then topic: `hero-*` and `cover-*` for first-screen visuals, `concept-*` for concept diagrams or metaphors, `section-*` for section anchors, `showcase-*` for product or result images, `style-*` for reusable style constraints.
- If multiple prompt files match, read the 1-3 closest filenames and choose the one with the clearest variables and constraints.
- If no prompt file matches, use `hero-interactive-html.md` for first-screen visuals or `concept-visual.md` for concept visuals.
- Fill variables such as `{{topic}}`, `{{audience}}`, `{{visual_goal}}`, `{{mood}}`, and `{{style_constraints}}` before calling the API.
- Do not edit user prompt files unless the user explicitly asks. Keep generated images and metadata out of the prompt folder.

## Provider Policy

StepFun is the default and recommended provider. MiniMax is the optional fallback or supplement. Generic OpenAI-compatible image endpoints are supported only when explicitly configured.

Provider priority:

1. CLI or local config: `--provider`, or `provider` in `local/knowledge-takeback-skill/image-generation.config.json`.
2. Environment: `KNOWLEDGE_TAKEBACK_IMAGE_PROVIDER`, `PPT_IMAGE_PROVIDER`, `AI_IMAGE_PROVIDER`.
3. If only `MINIMAX_API_KEY` exists, choose MiniMax.
4. Default to `stepfun-cn`.

Supported provider aliases:

```text
openai
stepfun
stepfun-cn
stepfun-global
minimax
minimax-cn
minimax-global
```

Do not hardcode API keys in prompts, HTML, metadata, docs, examples, or committed config.

For user-supplied `base_url` and `api-key`, prefer the generic provider:

```bash
KNOWLEDGE_TAKEBACK_IMAGE_PROVIDER=openai
KNOWLEDGE_TAKEBACK_IMAGE_BASE_URL=https://your-image-api.example/v1
KNOWLEDGE_TAKEBACK_IMAGE_API_KEY=sk-xxx
KNOWLEDGE_TAKEBACK_IMAGE_MODEL=image-model-name
```

If the base URL already includes `/images/generations`, the script will not append the endpoint twice.

## Environment And Local Config

`scripts/generate-image.mjs` loads `.env` from the current working directory and does not override existing `process.env` values. Keep `.env` and local config ignored by git.

Copy `.env.example` to `.env` for local use. Never commit the filled `.env`.

Generic override:

```bash
KNOWLEDGE_TAKEBACK_IMAGE_PROVIDER=stepfun-cn
KNOWLEDGE_TAKEBACK_IMAGE_REGION=cn
KNOWLEDGE_TAKEBACK_IMAGE_BASE_URL=https://...
KNOWLEDGE_TAKEBACK_IMAGE_API_KEY=sk-xxx
KNOWLEDGE_TAKEBACK_IMAGE_MODEL=...
```

Compatibility aliases:

```bash
PPT_IMAGE_PROVIDER=stepfun
PPT_IMAGE_REGION=cn
AI_IMAGE_PROVIDER=stepfun
AI_IMAGE_REGION=cn
```

StepFun:

```bash
STEPFUN_API_KEY=sk-xxx
STEPFUN_REGION=cn            # cn | global
STEPFUN_API_MODE=platform    # platform | step_plan
STEPFUN_BASE_URL=https://api.stepfun.com/v1
```

MiniMax:

```bash
MINIMAX_API_KEY=sk-xxx
MINIMAX_REGION=global        # cn | global
MINIMAX_BASE_URL=https://api.minimax.io/v1
```

Ignored local config path:

```text
local/knowledge-takeback-skill/image-generation.config.json
```

Example config:

```json
{
  "provider": "stepfun-cn",
  "stepfunApiKey": "sk-xxx",
  "stepfunRegion": "cn",
  "stepfunApiMode": "platform",
  "stepfunModel": "step-image-edit-2"
}
```

## Base URLs And Endpoints

| Provider | Region | Base URL | Endpoint |
|---|---|---|---|
| StepFun | cn | `https://api.stepfun.com/v1` | `/images/generations` |
| StepFun | global | `https://api.stepfun.ai/v1` | `/images/generations` |
| StepFun Step Plan | cn | `https://api.stepfun.com/step_plan/v1` | `/images/generations` |
| StepFun Step Plan | global | `https://api.stepfun.ai/step_plan/v1` | `/images/generations` |
| MiniMax | cn | `https://api.minimaxi.com/v1` | `/image_generation` |
| MiniMax | global | `https://api.minimax.io/v1` | `/image_generation` |

## Usage Size Map

Use `--usage` instead of mixing StepFun `size` and MiniMax `aspect_ratio` manually.

| Usage | HTML page role | StepFun size | MiniMax ratio | PPTX target inches | Typical HTML target |
|---|---|---|---|---|---|
| `cover` | full first-screen background | `1360x768` | `16:9` | `{ w:10, h:5.625 }` | full viewport hero |
| `coverOverlay` | hero background with text overlay | `1360x768` | `16:9` | `{ w:10, h:5.625 }` | hero with dark scrim |
| `hero` | wide hero image | `1360x768` | `16:9` | `{ w:10, h:3 }` | top visual band |
| `bannerWide` | extra-wide section banner | `1360x768`, then crop | `21:9` | `{ w:10, h:2.45 }` | shallow section visual |
| `ultraWideHero` | ultra-wide first-screen visual | `1360x768`, then crop | `21:9` | `{ w:10, h:2.8 }` | cinematic hero |
| `sideStrip` | vertical side illustration | `768x1360` | `9:16` | `{ w:2.5, h:4.44 }` | desktop side rail |
| `card` | square card image | `1024x1024` | `1:1` | `{ w:2.5, h:2.5 }` | concept card |
| `cardTall` | portrait card image | `896x1184` | `3:4` | `{ w:2.3, h:3.04 }` | tall story card |
| `cardWide` | landscape card image | `1184x896` | `4:3` | `{ w:3.5, h:2.65 }` | horizontal card visual |
| `showcase` | product or project showcase | `1184x896` | `4:3` | `{ w:3.9, h:2.95 }` | case-study panel |
| `phoneMockup` | phone-like vertical mockup | `768x1360` | `9:16` | `{ w:1.8, h:3.2 }` | mobile workflow visual |
| `icon` | icon or placeholder | `1024x1024` | `1:1` | `{ w:1.5, h:1.5 }` | render small in HTML |

Rules:

- StepFun uses exact `size` strings. Some StepFun docs describe the string as height x width; this skill maps by visual usage. Do not swap dimensions by intuition.
- `cover`, `hero`, `showcase`, `phoneMockup`, `card*`, and banners must use the usage map.
- `bannerWide` and `ultraWideHero`: MiniMax supports `21:9`; StepFun generates `1360x768`, then HTML crops with `object-fit: cover` and an explicit focal position.
- For PPTX/PptxGenJS work, use the `PPTX target inches` values from metadata instead of hand-writing slide dimensions. A generated image can be placed into `slide.addImage({ path, x, y, w, h })` with those values or a locally cropped variant.
- StepFun is treated as one image per request. If multiple candidates are needed, loop requests instead of relying on `n > 1`.
- MiniMax should prefer `aspect_ratio` over width and height. Use `--body-file` for custom provider fields only when required and provider constraints are known.
- Download returned URLs immediately. HTML must reference local image files so temporary provider URLs cannot expire.

## Provider Parameters

MiniMax options supported by the script:

```bash
--prompt-optimizer true
--seed 42
--n 2
--subject-reference path-or-url
--negative-prompt "low quality, unreadable text"
```

StepFun options supported by the script:

```bash
--steps 8
--cfg-scale 1.0
--negative-prompt "low quality, cluttered, unreadable text"
--text-mode true
--seed 42
--api-mode platform
```

Use `--response-format b64_json` for StepFun/OpenAI-compatible providers when direct base64 output is preferred. URL responses are still acceptable because the script downloads them immediately.

## Model Size Reference

| Provider | Default model | Supported dimensions or ratios |
|---|---|---|
| StepFun | `step-image-edit-2` | `1024x1024`, `768x1360`, `896x1184`, `1360x768`, `1184x896` |
| StepFun | `step-2x-large` | `256x256`, `512x512`, `768x768`, `1024x1024`, `1280x800`, `800x1280` |
| StepFun | `step-1x-medium` | `256x256`, `512x512`, `768x768`, `1024x1024`, `1280x800`, `800x1280` |
| MiniMax | `image-01` | `1:1`, `16:9`, `4:3`, `3:2`, `2:3`, `3:4`, `9:16`, `21:9` |

The script defaults to `step-image-edit-2` for StepFun and `image-01` for MiniMax.

## StepFun Setup

1. Use `https://platform.stepfun.com` for domestic accounts or `https://platform.stepfun.ai` for global accounts.
2. Create an API key in the platform account center.
3. Store the key only in `.env`, shell environment, ignored local config, or CI secrets.
4. Use `STEPFUN_API_MODE=platform` for the normal platform path. Use `STEPFUN_API_MODE=step_plan` only when the account is subscribed to Step Plan.
5. Verify configuration with `--dry-run` before a real generation call.

## Prompt Manifest

Before calling the API for a page image, write an image manifest in the task notes, page metadata, or generated artifact metadata:

```json
{
  "usage": "cover",
  "provider": "stepfun-cn",
  "prompt_file": "prompts/image-generation/hero-interactive-html.md",
  "final_prompt_summary": "short description of the rendered prompt",
  "size_or_ratio": "1360x768",
  "html_target": "index.html hero background",
  "fallback": "CSS solid visual block if API fails"
}
```

Do not put secrets in the manifest.

## Prompt Files

- First search `prompts/image-generation/`; use user-provided prompt files before built-in fallbacks.
- Built-in fallback prompts: `hero-interactive-html.md` for first-screen visuals and `concept-visual.md` for concept illustrations.
- Replace variables before use, such as `{{topic}}`, `{{audience}}`, `{{visual_goal}}`, and `{{style_constraints}}`.
- Prompts may describe style, subject, crop safety, and negative constraints. They must not contain API keys, base URLs, or other secrets.

## Layout And Readability

- Hero or cover image with text: add a dark overlay or independent text panel. Do not place body text directly on complex image detail.
- For dark image backgrounds with overlaid text, use a 40-55% dark overlay or a separate solid/semi-transparent text surface.
- Keep important subjects away from title-safe zones and likely mobile crop edges.
- Use generated images as evidence aids, concept visuals, hero recognition, section anchors, product showcases, or task-object images.
- Keep image-text spacing visible in HTML cards. Text must not touch image edges; use at least 12-16 px in HTML and about 0.15-0.2 inch in PPTX layouts.
- For full-bleed images, verify desktop and mobile crops with screenshots or browser inspection.
- Use local relative image paths in HTML.
- If provider config is missing, continue the HTML build with a CSS fallback and record the reason.

## Commands

Dry run:

```bash
node scripts/generate-image.mjs --provider stepfun-cn --usage cover --prompt-file prompts/image-generation/hero-interactive-html.md --dry-run
```

StepFun:

```bash
node scripts/generate-image.mjs --provider stepfun-cn --usage cover --prompt-file prompts/image-generation/hero-interactive-html.md --name page-hero --response-format b64_json
```

Optional build-safe call:

```bash
node scripts/generate-image.mjs --provider stepfun-cn --usage cover --prompt-file prompts/image-generation/hero-interactive-html.md --name page-hero --optional
```

MiniMax:

```bash
node scripts/generate-image.mjs --provider minimax-global --usage cardWide --prompt-file prompts/image-generation/concept-visual.md --name concept-card --prompt-optimizer true
```

Generic base URL:

```bash
node scripts/generate-image.mjs --provider openai --base-url "$KNOWLEDGE_TAKEBACK_IMAGE_BASE_URL" --api-key "$KNOWLEDGE_TAKEBACK_IMAGE_API_KEY" --usage hero --prompt-file prompts/image-generation/hero-interactive-html.md
```

## Completion Checklist

- Image generation was used only when it improved understanding, recognition, or evidence review.
- API key is not committed or written into HTML, metadata, prompts, or docs.
- Prompt came from `prompts/image-generation/` unless the user explicitly supplied an inline prompt.
- Image manifest records provider, usage, prompt file, size or ratio, target placement, and fallback.
- Usage mapping was used instead of mixing StepFun `size` and MiniMax `aspect_ratio` manually.
- PPTX dimensions, when needed, came from the usage map rather than ad hoc numbers.
- Returned URLs were downloaded to local files.
- HTML uses relative paths to generated images.
- Metadata records provider, usage, prompt file, sanitized request body, and output file paths.
- Background images with text have a readable overlay or separate text panel.
- Desktop and mobile crops were checked for full-bleed images.
- If generation failed or key was missing, the HTML still has a clean fallback and the reason is noted.
