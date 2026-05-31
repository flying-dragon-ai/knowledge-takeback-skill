# knowledge-takeback-skill

knowledge-takeback-skill 是 knowledge-takeback-skill 工作流的 npm/npx 分发包。knowledge-takeback-skill 面向 AI 辅助工作的知识回流：不只是让 AI 帮你把任务做完，而是把这次完成过程转化成你能理解、复用和沉淀的能力。复杂复盘还可以输出可验证的 knowledge-takeback-skill Artifact DSL，用结构化组件承载证据链、时间线、对比、挑战题和学习状态。

## 覆盖范围

knowledge-takeback-skill 不只覆盖代码任务，而是覆盖所有 **AI 辅助的复杂认知任务**，包括但不限于：

- 写代码、改代码、看报错
- 读文献、读报告、做研究梳理
- 查知识点、整理笔记、搭知识框架
- 写方案、做汇报、沉淀会议记录

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
- 复杂结构可使用局部 HTML 可视化，但不能输出完整页面框架。
- 需要持久、可编辑、可验证的复杂可视化时，使用 knowledge-takeback-skill Artifact DSL 并运行校验。

## 校验

```bash
python C:/Users/Administrator/.codex/skills/.system/skill-creator/scripts/quick_validate.py .
python C:/Users/Administrator/.codex/skills/.system/skill-creator/scripts/quick_validate.py ./knowledge-takeback-skill
npm run validate
npm run pack:check
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
