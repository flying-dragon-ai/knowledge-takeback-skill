# knowledge-takeback-skill Artifact DSL

knowledge-takeback-skill Artifact DSL is the structured artifact format knowledge-takeback-skill uses when a review, learning note, evidence map, or challenge would be too dense for plain Markdown and too fragile as hand-written HTML.

It keeps the useful Agent-HTML idea: the agent writes a constrained XML-like document, validates it before use, and lets a renderer or host turn it into editable UI blocks. In knowledge-takeback-skill, the format is owned by the learning workflow: every visual block must serve evidence, explanation, transfer, or tracking.

## When To Use

Use this format when the output needs at least one of these:

- a durable learning artifact saved under the knowledge-takeback-skill storage root
- a timeline of evidence, decisions, or task steps
- a decision matrix, comparison board, or What-If set
- a Kanban-style challenge, practice queue, or learning state board
- a table, chart, or compact dashboard with verified values
- a component-shaped artifact that an Agent-HTML-compatible host can render or edit

Stay in Markdown when the answer is short. Use inline HTML fragments only when the user needs a compact visual inside chat and no durable artifact is needed.

## Contract

- Output only knowledge-takeback-skill Artifact DSL.
- Use JSX-like XML tags with `PascalCase`.
- Root must be `<Page>`.
- Attribute values must be quoted scalars, for example `columns="2"` and `value="82"`.
- Do not use `class`, `className`, `style`, imports, fragments, hooks, JS expressions, or raw HTML.
- Do not use unknown tags or unknown attributes.
- Do not put bare text directly under `Page`, `Section`, `Stack`, `Cluster`, `Grid`, `AspectRatio`, `Kanban`, or `KanbanColumn`; wrap text in `<Text>`.
- Keep every factual claim tied to evidence already verified by knowledge-takeback-skill.

## Defaults

- `Cluster justify="start" wrap="true"`
- `Grid columns="2"`
- `Section width="content"`
- `Alert variant="default"`
- `Card size="default"`
- `Carousel orientation="horizontal"`
- `Separator orientation="horizontal"`
- `Tabs orientation="horizontal"`
- `ChartTooltip hideLabel="false"`

## Layout

- `Page:title=string -> Layout | UI`
- `Section:width?="full|content|reader" -> Layout | UI`
- `Stack -> Layout | UI`
- `Cluster:justify?="start|center|end|between", wrap?="true|false" -> Layout | UI`
- `Grid:columns?="1|2|3|4" -> Layout | UI`

## UI

- `Accordion:type="single|multiple" -> AccordionItem+`
- `AccordionItem:value?=string, disabled?="true|false" -> AccordionTrigger, AccordionContent`
- `AccordionTrigger -> Text`
- `AccordionContent -> Layout | UI | Text`

- `Alert:variant?="default|destructive" -> Icon?, AlertTitle?, AlertDescription?, AlertAction?`
- `AlertTitle -> Text`
- `AlertDescription -> Text`
- `AlertAction -> Layout | UI | Text`

- `AspectRatio:ratio=number -> Layout | UI`

- `Badge:variant?="default|secondary|destructive|outline|ghost|link" -> Text, Icon?`

- `Button:variant?="default|outline|ghost|destructive|secondary|link", href?=string, label?=string -> Text, Icon?`

- `Card:size?="default|sm" -> CardHeader?, CardContent?, CardFooter?`
- `CardHeader -> CardTitle?, CardDescription?, CardAction?`
- `CardTitle -> Text`
- `CardDescription -> Text`
- `CardAction -> Layout | UI | Text`
- `CardContent -> Layout | UI | Text`
- `CardFooter -> Layout | UI | Text`

- `Carousel:orientation?="horizontal|vertical" -> CarouselContent, CarouselPrevious?, CarouselNext?`
- `CarouselContent -> CarouselItem+`
- `CarouselItem -> Layout | UI | Text`
- `CarouselPrevious -> none`
- `CarouselNext -> none`

- `Progress:value=number -> none`

- `Separator:orientation?="horizontal|vertical" -> none`

- `Table -> TableCaption?, TableHeader?, TableBody?, TableFooter?`
- `TableCaption -> Text`
- `TableHeader -> TableRow+`
- `TableBody -> TableRow+`
- `TableFooter -> TableRow+`
- `TableRow -> TableHead+ | TableCell+`
- `TableHead -> Text`
- `TableCell -> Layout | UI | Text`

- `Tabs:orientation?="horizontal|vertical", defaultValue?=string -> TabsList, TabsContent+`
- `TabsList -> TabsTrigger+`
- `TabsTrigger:value=string, disabled?="true|false" -> Text, Icon?`
- `TabsContent:value=string -> Layout | UI | Text`

- `Timeline -> TimelineItem+`
- `TimelineItem:icon?=string, status?="default|complete|current|muted", meta?=string -> TimelineTitle, TimelineDescription?, TimelineContent?`
- `TimelineTitle -> Text`
- `TimelineDescription -> Text`
- `TimelineContent -> Layout | UI | Text`

- `Chart:type="area|bar" -> ChartSeries+, ChartRow+, ChartTooltip?`
- `ChartSeries:key=string, label?=string`
- `ChartRow:label=string, [series key]=number -> none`
- `ChartTooltip:hideLabel?="true|false" -> none`

- `CodeBlock:language="ahtml|html|tsx|jsx|ts|js|json|bash|markdown|text", title?=string -> raw code text`

- `Icon:name=string -> none`
- `Image:src=string, alt=string, fit?="cover|contain" -> none`
- `Kanban -> KanbanColumn+`
- `KanbanColumn:value=string, title=string -> KanbanItem+`
- `KanbanItem:value=string -> Layout | UI | Text`
- `Text:variant?="h1|h2|h3|h4|p|lead|large|small|muted|inline-code" -> Text`

## knowledge-takeback-skill Patterns

### Evidence Timeline

Use `Timeline` when the user needs to see how the agent moved from raw evidence to a conclusion.

```xml
<Timeline>
  <TimelineItem icon="search" status="complete" meta="Observe">
    <TimelineTitle>Read the source material</TimelineTitle>
    <TimelineDescription>Anchor the review to files, commands, quotes, or user-provided context.</TimelineDescription>
  </TimelineItem>
  <TimelineItem icon="shield-check" status="current" meta="Verify">
    <TimelineTitle>Separate verified facts from inference</TimelineTitle>
    <TimelineDescription>Only verified or clearly inferred content can enter the learning note.</TimelineDescription>
  </TimelineItem>
</Timeline>
```

### Trust Check

Use `Alert` for the short trust gate required by knowledge-takeback-skill.

```xml
<Alert>
  <Icon name="shield-check" />
  <AlertTitle>可信检查</AlertTitle>
  <AlertDescription>已验证内容进入笔记；待验证内容单独标注，不包装成事实。</AlertDescription>
</Alert>
```

### Transfer Board

Use `Kanban` when a review turns into practice work or spaced repetition.

```xml
<Kanban>
  <KanbanColumn value="understood" title="已理解">
    <KanbanItem value="evidence-chain">
      <Text variant="small">先找证据锚点，再写结论。</Text>
    </KanbanItem>
  </KanbanColumn>
  <KanbanColumn value="practice" title="仍需练习">
    <KanbanItem value="what-if">
      <Text variant="small">把关键前提替换掉，检查结论是否仍成立。</Text>
    </KanbanItem>
  </KanbanColumn>
</Kanban>
```

## Validation

Validate saved artifacts with:

```bash
node scripts/validate-knowledge-takeback-skill-artifact.mjs path/to/artifact.ahtml
```

Run the built-in validator smoke test with:

```bash
node scripts/validate-knowledge-takeback-skill-artifact.mjs --self-test
```

## Attribution

This DSL adapts the constrained component-language idea and grammar shape from Agent-HTML's Apache-2.0 core. The knowledge-takeback-skill version is re-scoped to evidence-backed learning artifacts. See `docs/THIRD_PARTY_NOTICES.md`.
