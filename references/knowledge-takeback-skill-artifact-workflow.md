# knowledge-takeback-skill Artifact Workflow

Use this workflow when a knowledge-takeback-skill answer should become a durable, structured, Agent-HTML-compatible artifact instead of only a chat reply.

## Choose The Output Form

| Need | Use |
|---|---|
| Short explanation or normal review | Markdown |
| Compact visual inside the chat answer | Inline HTML fragment from `knowledge-takeback-skill/SKILL.md` |
| Durable visual artifact, editable block structure, validation before render | knowledge-takeback-skill Artifact DSL |
| Social poster or fixed-size export | Legacy visual templates in `assets/` and `references/` |

Do not use a richer form just for decoration. The form must reduce cognitive load or improve reuse.

## File Placement

When a knowledge-takeback-skill storage root is available, save artifact files here:

```text
{storage_root}/knowledge-takeback-skill-artifacts/YYYY-MM-DD-[task-slug].ahtml
```

If the artifact is an example for the skill package itself, save it under:

```text
examples/*.ahtml
```

Do not save generated artifact files in `knowledge-takeback-skill/`; that directory is only for the skill workflow and metadata.

## Build Steps

1. Determine whether the artifact is a review, note, evidence map, challenge, or progress board.
2. Read `references/knowledge-takeback-skill-artifact-dsl.md`.
3. Draft the `.ahtml` source with verified facts only.
4. Run `node scripts/validate-knowledge-takeback-skill-artifact.mjs <file>`.
5. If validation fails, fix the source instead of bypassing the validator.
6. In the chat response, provide a compact Markdown fallback summary and the saved file path.
7. If an Agent-HTML-compatible host is available, the `.ahtml` file can be opened there for block editing or preview; if not, the source remains a durable structured record.

## knowledge-takeback-skill Mapping

| knowledge-takeback-skill concept | Preferred DSL element |
|---|---|
| Task summary | `Card`, `CardHeader`, `CardContent` |
| Evidence chain | `Timeline` |
| Trust check | `Alert` |
| Decision comparison | `Grid` + `Card` or `Table` |
| What-If set | `Accordion` or `Tabs` |
| Learning note | `Section` + `Stack` + `Card` |
| Challenge/practice queue | `Kanban` |
| Verified metrics | `Chart` or `Table` |
| Code/source anchor | `CodeBlock` |

## Guardrails

- Verify before visualizing. Unknown claims stay out of the artifact or are marked as `待验证`.
- Keep the DSL source semantic; do not encode layout through raw HTML or style attributes.
- Keep user-facing labels knowledge-takeback-skill-branded unless the artifact is explicitly about Agent-HTML.
- Do not copy proprietary Agent-HTML app source into knowledge-takeback-skill. Use the open DSL contract, examples, and validation approach only.
- Preserve third-party notices when adapting upstream material.
