---
name: knowledge-takeback-skill
description: "生成可交互 HTML 知识回流页面，并将 AI 辅助完成的复杂认知任务转化为可验证、可迁移、可沉淀的理解、学习记录、结构化 Artifact 与按需生成的页面图片。Use when the user invokes /knowledge-takeback-skill, /knowledge-takeback-skill letmesee, /knowledge-takeback-skill letmetry, or asks to create interactive HTML, generate a learning page, review, teach, explain, summarize, backtrace, create learning notes, produce validated visual artifacts, or generate supporting images for coding, debugging, paper/report reading, research synthesis, knowledge lookup, note organization, planning, presentations, and meeting records."
---

## knowledge-takeback-skill Entry

This project root is the installable `knowledge-takeback-skill` package for the knowledge-takeback-skill workflow.

Before executing any knowledge-takeback-skill workflow, read `knowledge-takeback-skill/SKILL.md` and follow it as the authoritative procedure. That file contains the full rules for:

- `/knowledge-takeback-skill` review mode
- `/knowledge-takeback-skill letmesee` guided mode
- `/knowledge-takeback-skill letmetry` challenge mode
- evidence verification
- learner profile storage
- HTML visualization boundaries
- interactive HTML page generation
- image generation from prompt files
- StepFun / MiniMax image generation provider requirements
- knowledge-takeback-skill Artifact DSL output and validation
- learning notes and tracking

The root `SKILL.md` exists only as the package entrypoint so skill loaders discover knowledge-takeback-skill correctly. Do not use the legacy Guizang social-card workflow from older copied files as the root behavior.
