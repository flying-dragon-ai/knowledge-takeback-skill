---
name: knowledge-takeback-skill
description: "生成可交互 HTML 知识回流页面，并将 AI 辅助完成的复杂认知任务转化为可验证、可迁移、可沉淀的理解、学习记录、结构化 Artifact 与按需生成的页面图片。Use when the user invokes /knowledge-takeback-skill, /knowledge-takeback-skill letmesee, /knowledge-takeback-skill letmetry, or asks to create interactive HTML, generate a learning page, review, teach, explain, summarize, backtrace, create learning notes, produce validated visual artifacts, or generate supporting images for coding, debugging, paper/report reading, research synthesis, knowledge lookup, note organization, planning, presentations, and meeting records."
---

## knowledge-takeback-skill

knowledge-takeback-skill 是 AI 辅助工作的知识回流层：先验证，再教学，把一次完成过程转化成用户能理解、迁移和沉淀的可交互 HTML 页面、结构化 Artifact 或学习笔记。

## Core Loop

按这个闭环工作：

1. **Observe**：读取刚完成的真实任务，不脱离上下文讲抽象知识。
2. **Verify**：把关键主张拆成已验证、可推断、待验证。
3. **Distill**：压缩成用户能吸收的摘要、关键决策、对比和类比。
4. **Transfer**：用 What-If、挑战题和迁移问题让用户下次能自己做。
5. **Track**：把学习笔记、掌握记录和薄弱点写入用户选择的 knowledge-takeback-skill 存储根目录。

## Evidence Rules

- 先验真，再教学；未经验证的内容不能写成确定知识点。
- 每条事实性结论尽量保留证据锚点：文件、原文、命令输出、运行结果、对话上下文或明确推理。
- 找不到依据时说“当前上下文没有证据”，不要编造链接、论文、参数、版本或结论。
- 时效性强或高风险内容标为待验证；必要时建议查官方文档或权威来源。

任务证据重点：

| 任务类型 | 必须捕获 | 回流目标 |
|---|---|---|
| 代码 / 报错 | 文件路径、关键 diff、命令输出、测试结果 | 实现思路、失败原因、调试路径 |
| 文献 / 报告 / 研究 | 原文段落、作者主张、数据口径 | 可信结论、证据链、适用边界 |
| 知识点 / 笔记 / 框架 | 定义、前置知识、相邻概念、反例 | 概念地图、结构化笔记、迁移问题 |
| 方案 / 汇报 / 会议 | 目标、约束、共识、行动项、未决问题 | 决策链、表达结构、风险和下一步 |

## Storage

每次 `/knowledge-takeback-skill` 前先解析存储根目录：

1. 当前工作目录有 `knowledge-takeback-skill-config.md` 时，读取其中的 `storage_root`。
2. 没有配置但存在 `local/knowledge-takeback-skill/knowledge-takeback-skill-profile.md` 时，使用当前目录下的 `local/knowledge-takeback-skill/`。
3. 两者都没有时，询问用户存储位置：当前项目 `local/knowledge-takeback-skill/`、主目录 `~/knowledge-takeback-skill/`、自定义路径。

写入规则：

- profile：`{storage_root}/knowledge-takeback-skill-profile.md`
- log：`{storage_root}/knowledge-takeback-skill-log.md`
- notes：`{storage_root}/knowledge-takeback-skill-notes/YYYY-MM-DD-[task-slug].md`
- artifacts：`{storage_root}/knowledge-takeback-skill-artifacts/YYYY-MM-DD-[task-slug].ahtml`
- html：`{storage_root}/knowledge-takeback-skill-html/YYYY-MM-DD-[task-slug]/index.html`
- images：`{storage_root}/knowledge-takeback-skill-images/YYYY-MM-DD-[task-slug]/`

不要把学习档案硬编码到 skill 包目录。

## Modes

### `/knowledge-takeback-skill`

任务完成后复盘。先输出 10 行以内摘要，再提供深入菜单，不要一次性倒出全部内容。

摘要必须包含：

```markdown
━━━━━━━━━━━━━━━━━━━━━━
刚才做了什么：[一句话]
核心知识点：[3-5 个]
最值得了解的一件事：[最关键的决策/技巧]
━━━━━━━━━━━━━━━━━━━━━━
```

摘要后加入可信检查：

```markdown
可信检查
- 已验证：[1-2 个有依据的关键点]
- 待确认：[需要验证的点；没有则写“暂无明显高风险点”]
- 本次笔记规则：只把已验证/可推断内容写入学习笔记；待验证内容单独标注。
```

深入菜单优先使用宿主选择题工具；不可用时用紧凑 Markdown 等用户选择：

- 决策 + 对比：为什么这么做，新手 vs 最佳实践
- What-If：如果改了/删了会怎样
- 类比解释：用用户熟悉的场景解释关键概念
- 学习笔记：生成一页纸摘要并保存

### `/knowledge-takeback-skill letmesee`

边做边讲。每个关键步骤先解释再执行：

- 下一步要做什么
- 为什么这样做
- 涉及的知识点
- 证据或位置定位
- 对用户当前水平是新的、接触过还是已熟悉

关键步骤后暂停，等用户确认继续。用户说“快进”或“这个我懂”时减少讲解。

### `/knowledge-takeback-skill letmetry`

基于刚才任务出迁移练习题。题目必须：

- 来自刚才任务，但换场景、改需求或加约束
- 难度匹配用户档案
- 给出明确边界和起始材料
- 用户提交后先提示，不急着直接给答案

题目格式：

```markdown
挑战题（难度：⭐ / ⭐⭐ / ⭐⭐⭐）
场景：[改编后的需求]
要求：[完成标准]
起始材料：[代码骨架 / 原文片段 / 笔记模板 / 方案大纲]
提示：回顾刚才的 [知识点]，这次变化是 [变化点]
```

## Output Forms

按需求选择输出形态：

| 需求 | 输出 |
|---|---|
| 短解释或普通复盘 | Markdown |
| 聊天里压缩展示复杂结构 | 局部 HTML 片段 |
| 可交付、可打开、可交互的知识回流页面 | 完整 HTML 文件 |
| 可保存、可验证、可编辑的复杂工件 | knowledge-takeback-skill Artifact DSL |
| 固定尺寸海报 / 社交图导出 | legacy `assets/` + visual references |

### Interactive HTML Pages

当用户要求“生成可交互 HTML”“做学习页”“做可视化页面”“输出网页”或任务适合沉淀为可打开页面时，生成完整 HTML 文件，而不是只在聊天中贴片段。

规则：

- 保存到 `{storage_root}/knowledge-takeback-skill-html/YYYY-MM-DD-[task-slug]/index.html`，相关图片放同目录 `assets/` 或 `{storage_root}/knowledge-takeback-skill-images/`。
- 页面必须可直接在浏览器打开；CSS 和 JS 可内联，避免依赖未声明的远程资源。
- 交互优先服务学习：时间线、证据展开、概念切换、对比卡片、挑战题、掌握度记录、步骤回放。
- 页面中的事实仍然遵守 Evidence Rules；不能为了视觉效果加入未经验证的断言。
- 如果生成图片，HTML 使用相对路径引用图片，并保留生成图片的 prompt 和 metadata 以便追溯。

### Image Generation

当交互 HTML 需要首屏主视觉、章节插图、概念视觉、背景图或任务对象图片，且现有素材不足以表达主题时，触发图片生成。

触发规则：

- 用户明确要求“生成图片”“配图”“主视觉”“背景图”“封面图”时必须考虑图片生成。
- 生成交互 HTML 时，如果图片能显著提升理解或首屏识别度，主动使用图片生成；如果只是装饰，不生成。
- 不为纯代码 diff、纯命令复盘或没有视觉收益的任务生成图片。
- 如果 API 未配置或调用失败，继续完成 HTML，用 CSS/结构化组件兜底，并在交付说明中标注图片未生成原因。
- 用户会把可复用提示词放进 `prompts/image-generation/`；生成页面时先按任务主题、页面位置和文件名匹配提示词，找不到合适文件再用内置兜底提示词或任务内联提示词。
- 生成封面、hero、showcase、卡片图、侧栏图或移动端 mockup 前，先读 `references/image-generation.md`，按 required flow、provider、usage 尺寸映射和 manifest 规则执行。
- 生图前必须写 image manifest；不要手写 provider 尺寸，不要把 StepFun `size` 和 MiniMax `aspect_ratio` 混用。
- StepFun 是默认 provider；MiniMax 是可选补充。支持 `stepfun-cn`、`stepfun-global`、`minimax-cn`、`minimax-global` 和 `openai`/generic base URL。
- 返回 URL 必须立即下载到本地；HTML 只能引用相对本地路径，避免临时链接失效。
- 如果生成页面或交付物时生图只是增强项，调用脚本加 `--optional`；API key 缺失时记录原因并继续交付，不让整页失败。

提示词规则：

- 先查 `prompts/image-generation/`；优先使用用户放入该目录的提示词文件，支持 `.md` 和 `.txt`。
- 按文件名和用途选择：`hero-*`/`cover-*` 用于首屏，`concept-*` 用于概念图，`section-*` 用于章节图，`style-*` 用作风格约束。
- 内置兜底提示词：`hero-interactive-html.md` 用于首屏主视觉，`concept-visual.md` 用于概念插图。
- 使用前替换提示词变量，例如 `{{topic}}`、`{{audience}}`、`{{visual_goal}}`、`{{style_constraints}}`。
- 不把 API key、base_url 或密钥写进提示词文件、HTML、metadata 或 git 可发布文件。

配置和命令：

```bash
KNOWLEDGE_TAKEBACK_IMAGE_PROVIDER="openai"
KNOWLEDGE_TAKEBACK_IMAGE_BASE_URL="https://your-image-api.example/v1"
KNOWLEDGE_TAKEBACK_IMAGE_API_KEY="sk-..."
KNOWLEDGE_TAKEBACK_IMAGE_MODEL="image-model-name"
node scripts/generate-image.mjs --provider openai --usage cover --prompt-file prompts/image-generation/hero-interactive-html.md --name task-hero --optional
```

脚本会读取当前工作目录 `.env`，但已有 shell / CI 环境变量优先；`.env.example` 只放占位值。也可把本地配置放到 ignored 文件：

```text
local/knowledge-takeback-skill/image-generation.config.json
```

该脚本默认保存图片和 metadata 到：

```text
local/knowledge-takeback-skill/generated-images/
```

### Local HTML Fragments

只在 Markdown 难以承载结构时使用局部 HTML。规则：

- 不输出 `<!DOCTYPE>`、`html`、`head`、`body`。
- 不使用 `<style>`、`class`、伪类、伪元素。
- 必须 100% 使用内联 `style="..."`。
- 不把整段回复包进一个巨大 HTML 块。
- 默认黑白灰；强调色克制使用。

### knowledge-takeback-skill Artifact DSL

当复盘、学习笔记、证据图谱或挑战题需要长期保存、块级编辑、结构化验证或 Agent-HTML 兼容预览时，使用 knowledge-takeback-skill Artifact DSL。

使用规则：

- 先读 `references/knowledge-takeback-skill-artifact-dsl.md`；需要保存或校验流程时再读 `references/knowledge-takeback-skill-artifact-workflow.md`。
- 只输出 `<Page>` 根节点的 XML-like DSL，不使用 `class`、`className`、`style`、原始 HTML、JS 表达式、imports 或 hooks。
- 保存到 `{storage_root}/knowledge-takeback-skill-artifacts/YYYY-MM-DD-[任务简述].ahtml`。
- 保存后运行 `node scripts/validate-knowledge-takeback-skill-artifact.mjs <file>`；验证失败时修 DSL，不绕过验证。
- 宿主不能渲染 `.ahtml` 时，同时给出紧凑 Markdown 回退摘要。
- Artifact 里的事实仍然遵守“先验真，再教学”。

## Learning Notes

用户选择“学习笔记”或任务需要沉淀时，保存 Markdown 版：

```markdown
---
knowledge-takeback-skill 学习笔记

日期：YYYY-MM-DD
任务：[一句话]

核心收获：
1. ...
2. ...
3. ...

关键证据：
- [文件/命令/原文/上下文] — [为什么重要]

下次遇到类似问题：
先... → 再... → 最后...
---
```

同时追加 `{storage_root}/knowledge-takeback-skill-log.md`：

```markdown
## YYYY-MM-DD | [任务简述]

知识点：
- [知识点]（首次接触 / 再次出现 / 已掌握）

掌握度自评：（请用户 1-5 分）
累计学习次数：N
```

## Tone

- 默认简体中文，高信息密度，短句。
- 不居高临下，不说“这很简单”或“你应该知道”。
- 发现用户已经理解的部分就跳过，专注薄弱点。
- 对小白少术语，多类比；对进阶用户直接讲结构、取舍和边界。
