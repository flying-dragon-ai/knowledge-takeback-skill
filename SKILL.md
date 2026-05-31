---
name: knowledge-takeback-skill
description: "将 AI 辅助完成的复杂认知任务转化为可验证、可迁移、可沉淀的理解、学习记录与结构化 knowledge-takeback-skill Artifact。Use when the user invokes /knowledge-takeback-skill, /knowledge-takeback-skill letmesee, /knowledge-takeback-skill letmetry, or asks to review, teach, explain, summarize, backtrace, create learning notes, or produce validated visual artifacts for coding, debugging, paper/report reading, research synthesis, knowledge lookup, note organization, planning, presentations, and meeting records."
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
- knowledge-takeback-skill Artifact DSL output and validation
- learning notes and tracking

The root `SKILL.md` exists only as the package entrypoint so skill loaders discover knowledge-takeback-skill correctly. Do not use the legacy Guizang social-card workflow from older copied files as the root behavior.
