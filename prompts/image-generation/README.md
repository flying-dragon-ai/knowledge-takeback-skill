# Image Generation Prompts

这个目录用于存放 `knowledge-takeback-skill` 生成交互式 HTML 时可复用的图片提示词。

## How Agents Use This Folder

- 当交互 HTML 需要首屏背景、章节插图、概念图、封面图或情绪化视觉锚点时，先在本目录查找最接近的提示词文件。
- 优先使用用户放入本目录的提示词；内置模板只作为兜底。
- 文件支持 `.md` 和 `.txt`；按文件名和用途匹配：`hero-*`/`cover-*` 用于首屏，`concept-*` 用于概念图，`section-*` 用于章节图，`showcase-*` 用于产品/结果展示，`style-*` 用作风格约束。
- 使用提示词前，根据当前任务替换变量，例如 `{{topic}}`、`{{audience}}`、`{{visual_goal}}`、`{{style_constraints}}`。
- 生成后的图片保存到当前任务输出目录或 `local/knowledge-takeback-skill/generated-images/`，不要保存到本提示词目录。
- 不要把 API key、base_url 或其他密钥写进提示词文件；密钥通过环境变量、命令参数或本地 ignored config 提供。

## Suggested File Naming

- `hero-[scene].md`：首屏背景或主视觉。
- `concept-[topic].md`：解释概念、流程、结构的图。
- `section-[name].md`：章节插图。
- `style-[name].md`：统一风格提示词。

## Runtime Configuration

图片生成脚本支持 StepFun、MiniMax 和 generic OpenAI-compatible base URL。优先使用 StepFun；MiniMax 作为可选补充。

通用环境变量：

```bash
KNOWLEDGE_TAKEBACK_IMAGE_PROVIDER="openai"
KNOWLEDGE_TAKEBACK_IMAGE_BASE_URL="https://..."
KNOWLEDGE_TAKEBACK_IMAGE_API_KEY="..."
KNOWLEDGE_TAKEBACK_IMAGE_MODEL="..."
```

StepFun：

```bash
STEPFUN_API_KEY="sk-..."
STEPFUN_REGION="cn"
STEPFUN_API_MODE="platform"
```

MiniMax：

```bash
MINIMAX_API_KEY="sk-..."
MINIMAX_REGION="global"
```

`scripts/generate-image.mjs` 会自动读取当前工作目录 `.env`，但不会覆盖已有 shell / CI 环境变量。也可以使用 ignored 本地配置文件：

```text
local/knowledge-takeback-skill/image-generation.config.json
```

完整 provider 选择、usage 尺寸映射、manifest 和 QA 要求见 `references/image-generation.md`。

当图片只是 HTML 页面增强项时，调用脚本加 `--optional`，这样 API key 缺失会输出 fallback metadata 并退出 0，不阻断页面生成。
