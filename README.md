# knowledge-takeback-skill

knowledge-takeback-skill 是一个生成可交互 HTML 知识回流页面的 npm/npx skill 包：不只是让 AI 帮你把任务做完，而是把这次完成过程转化成你能理解、复用和沉淀的网页、结构化 Artifact 和学习记录。页面需要主视觉、章节插图或概念图时，可以按提示词调用图片生成 API。

## 覆盖范围

knowledge-takeback-skill 不只覆盖代码任务，而是覆盖所有 **AI 辅助的复杂认知任务**，包括但不限于：

- 写代码、改代码、看报错
- 读文献、读报告、做研究梳理
- 查知识点、整理笔记、搭知识框架
- 写方案、做汇报、沉淀会议记录
- 生成可交互 HTML 学习页、知识页和复盘页

## 使用方式

通过 npm/npx 安装到默认 Codex skills 目录：

```bash
npx knowledge-takeback-skill
```

自定义安装目录：

```bash
npx knowledge-takeback-skill install --target /absolute/path/to/skills/knowledge-takeback-skill
```

把本目录作为 skill 安装或放入你的 skill 搜索路径后，对 Agent 使用：

```text
/knowledge-takeback-skill
```

常用模式：

- `/knowledge-takeback-skill`：任务完成后复盘刚才发生了什么。
- `/knowledge-takeback-skill letmesee`：边做边讲，每个关键步骤先解释再继续。
- `/knowledge-takeback-skill letmetry`：基于刚才的任务出一道迁移练习题。

## 项目结构

```text
knowledge-takeback-skill/
├── SKILL.md                    # 根入口：让 skill loader 正确发现 knowledge-takeback-skill
├── knowledge-takeback-skill/
│   ├── SKILL.md                # knowledge-takeback-skill 规则正文，权威工作流
│   └── agents/openai.yaml      # knowledge-takeback-skill UI 元数据
├── agents/openai.yaml          # 根级 UI 元数据
├── assets/                     # 可视化模板和素材，可供 Vision+ 输出复用
├── bin/                        # npx 安装入口
├── prompts/image-generation/    # 图片生成提示词，用户可放入自己的提示词
├── references/                 # knowledge-takeback-skill Artifact DSL、可视化参考资料和排版规则
├── docs/                       # 产品说明、交接说明、结构说明
├── examples/                   # 生成出的 knowledge-takeback-skill HTML / Artifact 示例
├── scripts/                    # 校验器和维护脚本
├── package.json
└── LICENSE
```

详细目录约定见 [docs/STRUCTURE.md](docs/STRUCTURE.md)。

## 核心规则

- 先验真，再教学：未经验证的内容不能进入学习笔记。
- 区分事实、推断和待验证内容。
- 每次复盘都保留证据锚点：文件、原文、命令输出、对话上下文或明确推理。
- 学习笔记和档案必须写入用户选择的 knowledge-takeback-skill 存储根目录。
- 交互式 HTML 是主要交付形态；页面图片按需生成，生成记录必须可追溯。
- 需要持久、可编辑、可验证的复杂可视化时，使用 knowledge-takeback-skill Artifact DSL 并运行校验。

## 图片生成

把你的提示词放到：

```text
prompts/image-generation/
```

支持 `.md` 和 `.txt`；推荐按用途命名：`hero-*` / `cover-*` / `concept-*` / `section-*` / `showcase-*` / `style-*`。skill 会按页面位置和任务主题自己判断是否触发图片生成。

图片生成配置通过环境变量或 ignored 本地配置提供，不要提交 API key：

```bash
cp .env.example .env
KNOWLEDGE_TAKEBACK_IMAGE_PROVIDER="openai"
KNOWLEDGE_TAKEBACK_IMAGE_BASE_URL="https://..."
KNOWLEDGE_TAKEBACK_IMAGE_API_KEY="..."
KNOWLEDGE_TAKEBACK_IMAGE_MODEL="..."
```

手动生成示例：

```bash
npm run image:generate -- --provider openai --usage cover --prompt-file prompts/image-generation/hero-interactive-html.md --name demo-hero --optional
```

Generic base URL、StepFun / MiniMax 的 provider、尺寸映射和 QA 要求见 [references/image-generation.md](references/image-generation.md)。

## 校验

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

在 Windows 中文路径下运行 Python 校验器时，建议启用 UTF-8：

```powershell
$env:PYTHONUTF8='1'
```

## License

AGPL-3.0-only. See [LICENSE](./LICENSE).
