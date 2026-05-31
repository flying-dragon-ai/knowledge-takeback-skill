#!/usr/bin/env node
/*
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * knowledge-takeback-skill Artifact validator.
 * Portions of the parser/validation approach are adapted from the Apache-2.0
 * Agent-HTML core DSL by Agent-HTML contributors, modified for knowledge-takeback-skill.
 */

import { readFileSync } from "node:fs"
import { basename } from "node:path"

const rawTextTags = new Set(["CodeBlock"])

const layoutTags = new Set(["Page", "Section", "Stack", "Cluster", "Grid", "AspectRatio"])

const allTags = new Set([
  "Accordion",
  "AccordionContent",
  "AccordionItem",
  "AccordionTrigger",
  "Alert",
  "AlertAction",
  "AlertDescription",
  "AlertTitle",
  "AspectRatio",
  "Badge",
  "Button",
  "Card",
  "CardAction",
  "CardContent",
  "CardDescription",
  "CardFooter",
  "CardHeader",
  "CardTitle",
  "Carousel",
  "CarouselContent",
  "CarouselItem",
  "CarouselNext",
  "CarouselPrevious",
  "Chart",
  "ChartRow",
  "ChartSeries",
  "ChartTooltip",
  "Cluster",
  "CodeBlock",
  "Grid",
  "Icon",
  "Image",
  "Kanban",
  "KanbanColumn",
  "KanbanItem",
  "Page",
  "Progress",
  "Section",
  "Separator",
  "Stack",
  "Table",
  "TableBody",
  "TableCaption",
  "TableCell",
  "TableFooter",
  "TableHead",
  "TableHeader",
  "TableRow",
  "Tabs",
  "TabsContent",
  "TabsList",
  "TabsTrigger",
  "Text",
  "Timeline",
  "TimelineContent",
  "TimelineDescription",
  "TimelineItem",
  "TimelineTitle",
  "Tooltip",
])

const allowedAttrs = {
  Accordion: ["type"],
  AccordionItem: ["value", "disabled"],
  Alert: ["variant"],
  AspectRatio: ["ratio"],
  Badge: ["variant"],
  Button: ["variant", "href", "label"],
  Card: ["size"],
  Carousel: ["orientation"],
  Chart: ["type"],
  ChartSeries: ["key", "label"],
  ChartRow: ["label"],
  ChartTooltip: ["hideLabel"],
  Cluster: ["justify", "wrap"],
  CodeBlock: ["language", "title"],
  Grid: ["columns"],
  Icon: ["name"],
  Image: ["src", "alt", "fit"],
  KanbanColumn: ["value", "title"],
  KanbanItem: ["value"],
  Page: ["title"],
  Progress: ["value"],
  Section: ["width"],
  Separator: ["orientation"],
  Tabs: ["orientation", "defaultValue"],
  TabsTrigger: ["value", "disabled"],
  TabsContent: ["value"],
  Text: ["variant"],
  TimelineItem: ["icon", "status", "meta"],
}

const requiredAttrs = {
  Accordion: ["type"],
  AspectRatio: ["ratio"],
  Chart: ["type"],
  ChartSeries: ["key"],
  ChartRow: ["label"],
  CodeBlock: ["language"],
  Image: ["src", "alt"],
  KanbanColumn: ["value", "title"],
  KanbanItem: ["value"],
  Progress: ["value"],
  TabsContent: ["value"],
  TabsTrigger: ["value"],
}

const enums = {
  "Accordion.type": ["single", "multiple"],
  "AccordionItem.disabled": ["true", "false"],
  "Alert.variant": ["default", "destructive"],
  "Badge.variant": ["default", "secondary", "destructive", "outline", "ghost", "link"],
  "Button.variant": ["default", "outline", "ghost", "destructive", "secondary", "link"],
  "Card.size": ["default", "sm"],
  "Carousel.orientation": ["horizontal", "vertical"],
  "Chart.type": ["area", "bar"],
  "ChartTooltip.hideLabel": ["true", "false"],
  "Cluster.justify": ["start", "center", "end", "between"],
  "Cluster.wrap": ["true", "false"],
  "CodeBlock.language": ["ahtml", "html", "tsx", "jsx", "ts", "js", "json", "bash", "markdown", "text"],
  "Grid.columns": ["1", "2", "3", "4"],
  "Image.fit": ["cover", "contain"],
  "Section.width": ["full", "content", "reader"],
  "Separator.orientation": ["horizontal", "vertical"],
  "Tabs.orientation": ["horizontal", "vertical"],
  "TabsTrigger.disabled": ["true", "false"],
  "Text.variant": ["h1", "h2", "h3", "h4", "p", "lead", "large", "small", "muted", "inline-code"],
  "TimelineItem.status": ["default", "complete", "current", "muted"],
}

const emptyTags = new Set([
  "CarouselPrevious",
  "CarouselNext",
  "ChartSeries",
  "ChartRow",
  "ChartTooltip",
  "Icon",
  "Image",
  "Progress",
  "Separator",
])

function trimRawText(value) {
  return value.replace(/^\r?\n/, "").replace(/\r?\n\s*$/, "")
}

function parseAttrs(raw) {
  const attrs = {}
  const attrPattern = /([A-Za-z][A-Za-z0-9-]*)="([^"]*)"/g
  let match

  while ((match = attrPattern.exec(raw)) !== null) {
    attrs[match[1]] = match[2]
  }

  const stripped = raw.replace(attrPattern, "").trim()
  if (stripped.length > 0) {
    throw new Error(`Invalid attribute syntax: ${stripped}`)
  }

  return attrs
}

function tokenize(input) {
  const tokens = []
  const tagPattern = /<[^>]+>/g
  let lastIndex = 0
  let match

  while ((match = tagPattern.exec(input)) !== null) {
    const text = input.slice(lastIndex, match.index)
    if (text.length > 0) {
      tokens.push({ type: "text", value: text })
    }

    const rawTag = match[0]
    if (rawTag.startsWith("</")) {
      const tag = rawTag.slice(2, -1).trim()
      tokens.push({ type: "close", tag })
    } else {
      const selfClosing = rawTag.endsWith("/>")
      const tagBody = rawTag.slice(1, selfClosing ? -2 : -1).trim()
      const firstSpace = tagBody.search(/\s/)
      const tag = firstSpace === -1 ? tagBody : tagBody.slice(0, firstSpace)
      const rawAttrs = firstSpace === -1 ? "" : tagBody.slice(firstSpace + 1).trim()
      const attrs = parseAttrs(rawAttrs)
      tokens.push({ type: "open", tag, attrs, selfClosing })

      if (!selfClosing && rawTextTags.has(tag)) {
        const closeTag = `</${tag}>`
        const rawStart = match.index + rawTag.length
        const rawEnd = input.indexOf(closeTag, rawStart)

        if (rawEnd === -1) {
          throw new Error(`Unclosed tag: <${tag}>`)
        }

        const rawText = trimRawText(input.slice(rawStart, rawEnd))
        if (rawText.length > 0) {
          tokens.push({ type: "text", value: rawText, raw: true })
        }
        tokens.push({ type: "close", tag })
        tagPattern.lastIndex = rawEnd + closeTag.length
        lastIndex = tagPattern.lastIndex
        continue
      }
    }

    lastIndex = match.index + rawTag.length
  }

  const trailing = input.slice(lastIndex)
  if (trailing.length > 0) {
    tokens.push({ type: "text", value: trailing })
  }

  return tokens
}

function parseArtifact(input) {
  const tokens = tokenize(input)
  const stack = []
  const roots = []

  for (const token of tokens) {
    if (token.type === "text") {
      const normalized = token.raw ? token.value : token.value.replace(/\s+/g, " ").trim()
      if (!normalized) {
        continue
      }
      const textNode = { type: "text", value: normalized }
      if (stack.length > 0) {
        stack[stack.length - 1].children.push(textNode)
      } else {
        roots.push(textNode)
      }
      continue
    }

    if (token.type === "open") {
      const element = {
        type: "element",
        tag: token.tag,
        attrs: token.attrs,
        children: [],
      }
      if (stack.length > 0) {
        stack[stack.length - 1].children.push(element)
      } else {
        roots.push(element)
      }
      if (!token.selfClosing) {
        stack.push(element)
      }
      continue
    }

    const current = stack.pop()
    if (!current) {
      throw new Error(`Unexpected closing tag: ${token.tag}`)
    }
    if (current.tag !== token.tag) {
      throw new Error(`Mismatched closing tag: expected </${current.tag}> but found </${token.tag}>`)
    }
  }

  if (stack.length > 0) {
    throw new Error(`Unclosed tag: <${stack[stack.length - 1].tag}>`)
  }
  if (roots.length !== 1 || roots[0]?.type !== "element") {
    throw new Error("Document must contain exactly one root element")
  }

  return { root: roots[0] }
}

function elementChildren(node) {
  return node.children.filter((child) => child.type === "element")
}

function textChildren(node) {
  return node.children.filter((child) => child.type === "text")
}

function hasChild(node, tag) {
  return elementChildren(node).some((child) => child.tag === tag)
}

function hasDuplicate(values) {
  return new Set(values).size !== values.length
}

function add(errors, code, message, path, tag, attr) {
  errors.push({ code, message, path, tag, attr })
}

function validateUrl(value, type) {
  if (type === "href") {
    return (
      (value.startsWith("/") && !value.startsWith("//")) ||
      value.startsWith("https://") ||
      value.startsWith("mailto:")
    )
  }
  return value.startsWith("https://") || (value.startsWith("/") && !value.startsWith("//"))
}

function validateNumber(value) {
  return value.trim() !== "" && !Number.isNaN(Number(value))
}

function validateChildren(node, path, errors) {
  const children = elementChildren(node)
  const tags = children.map((child) => child.tag)

  const only = (allowed, message) => {
    for (const child of children) {
      if (!allowed.includes(child.tag)) {
        add(errors, "INVALID_CHILD", message, `${path}/${child.tag}`, child.tag)
      }
    }
  }

  switch (node.tag) {
    case "Accordion":
      only(["AccordionItem"], "Accordion can only contain AccordionItem")
      if (children.length === 0) add(errors, "MISSING_REQUIRED_CHILD", "Accordion must contain AccordionItem", path, node.tag)
      break
    case "AccordionItem":
      only(["AccordionTrigger", "AccordionContent"], "AccordionItem can only contain AccordionTrigger and AccordionContent")
      if (!hasChild(node, "AccordionTrigger") || !hasChild(node, "AccordionContent")) {
        add(errors, "MISSING_REQUIRED_CHILD", "AccordionItem must contain AccordionTrigger and AccordionContent", path, node.tag)
      }
      break
    case "AccordionTrigger":
    case "AlertTitle":
    case "AlertDescription":
    case "CardTitle":
    case "CardDescription":
    case "TableCaption":
    case "TableHead":
    case "TimelineTitle":
    case "TimelineDescription":
      only([], `${node.tag} can only contain text`)
      break
    case "Alert":
      only(["Icon", "AlertTitle", "AlertDescription", "AlertAction"], "Alert can only contain Icon, AlertTitle, AlertDescription, and AlertAction")
      break
    case "Button":
      only(["Icon"], "Button can only contain text and Icon")
      if (children.some((child) => child.tag === "Icon") && textChildren(node).length === 0 && !node.attrs.label) {
        add(errors, "MISSING_REQUIRED_ATTR", "Icon-only Button must include label", path, node.tag, "label")
      }
      break
    case "Card":
      only(["CardHeader", "CardContent", "CardFooter"], "Card can only contain CardHeader, CardContent, and CardFooter")
      break
    case "CardHeader":
      only(["CardTitle", "CardDescription", "CardAction"], "CardHeader can only contain CardTitle, CardDescription, and CardAction")
      break
    case "Carousel":
      only(["CarouselContent", "CarouselPrevious", "CarouselNext"], "Carousel can only contain CarouselContent, CarouselPrevious, and CarouselNext")
      if (!hasChild(node, "CarouselContent")) add(errors, "MISSING_REQUIRED_CHILD", "Carousel must contain CarouselContent", path, node.tag)
      break
    case "CarouselContent":
      only(["CarouselItem"], "CarouselContent can only contain CarouselItem")
      if (children.length === 0) add(errors, "MISSING_REQUIRED_CHILD", "CarouselContent must contain CarouselItem", path, node.tag)
      break
    case "Chart": {
      only(["ChartSeries", "ChartRow", "ChartTooltip"], "Chart can only contain ChartSeries, ChartRow, and ChartTooltip")
      const series = children.filter((child) => child.tag === "ChartSeries")
      const rows = children.filter((child) => child.tag === "ChartRow")
      const tooltips = children.filter((child) => child.tag === "ChartTooltip")
      if (series.length === 0) add(errors, "MISSING_REQUIRED_CHILD", "Chart must contain at least one ChartSeries", path, node.tag)
      if (rows.length === 0) add(errors, "MISSING_REQUIRED_CHILD", "Chart must contain at least one ChartRow", path, node.tag)
      if (tooltips.length > 1) add(errors, "INVALID_CHILD", "Chart can contain at most one ChartTooltip", path, node.tag)
      const seriesKeys = series.map((child) => child.attrs.key).filter(Boolean)
      const seriesKeySet = new Set(seriesKeys)
      for (const row of rows) {
        for (const key of seriesKeys) {
          if (!(key in row.attrs)) {
            add(errors, "MISSING_REQUIRED_ATTR", `ChartRow must include value for series "${key}"`, `${path}/ChartRow`, row.tag, key)
          }
        }
        for (const [attr, value] of Object.entries(row.attrs)) {
          if (attr === "label") continue
          if (!seriesKeySet.has(attr)) {
            add(errors, "UNKNOWN_ATTR", `Unknown chart series attr "${attr}" on ChartRow`, `${path}/ChartRow`, row.tag, attr)
          } else if (!validateNumber(value)) {
            add(errors, "INVALID_ATTR_VALUE", "ChartRow series values must be numbers", `${path}/ChartRow`, row.tag, attr)
          }
        }
      }
      break
    }
    case "CodeBlock":
      only([], "CodeBlock can only contain raw code text")
      if (textChildren(node).length === 0) add(errors, "MISSING_REQUIRED_CHILD", "CodeBlock must contain raw code text", path, node.tag)
      break
    case "Kanban":
      only(["KanbanColumn"], "Kanban can only contain KanbanColumn")
      if (children.length === 0) add(errors, "MISSING_REQUIRED_CHILD", "Kanban must contain KanbanColumn", path, node.tag)
      if (hasDuplicate(children.map((child) => child.attrs.value).filter(Boolean))) {
        add(errors, "INVALID_ATTR_VALUE", "KanbanColumn values must be unique", path, node.tag, "value")
      }
      {
        const itemValues = children
          .flatMap((child) => elementChildren(child).filter((item) => item.tag === "KanbanItem"))
          .map((item) => item.attrs.value)
          .filter(Boolean)
        if (hasDuplicate(itemValues)) {
          add(errors, "INVALID_ATTR_VALUE", "KanbanItem values must be unique", path, node.tag, "value")
        }
      }
      break
    case "KanbanColumn":
      only(["KanbanItem"], "KanbanColumn can only contain KanbanItem")
      break
    case "Tabs":
      only(["TabsList", "TabsContent"], "Tabs can only contain TabsList and TabsContent")
      if (!hasChild(node, "TabsList")) add(errors, "MISSING_REQUIRED_CHILD", "Tabs must contain TabsList", path, node.tag)
      if (!hasChild(node, "TabsContent")) add(errors, "MISSING_REQUIRED_CHILD", "Tabs must contain TabsContent", path, node.tag)
      break
    case "TabsList":
      only(["TabsTrigger"], "TabsList can only contain TabsTrigger")
      break
    case "Table":
      only(["TableCaption", "TableHeader", "TableBody", "TableFooter"], "Table can only contain caption, header, body, and footer")
      break
    case "TableHeader":
    case "TableBody":
    case "TableFooter":
      only(["TableRow"], `${node.tag} can only contain TableRow`)
      break
    case "TableRow":
      if (tags.length > 0 && !(tags.every((tag) => tag === "TableHead") || tags.every((tag) => tag === "TableCell"))) {
        add(errors, "INVALID_CHILD", "TableRow must contain only TableHead or only TableCell", path, node.tag)
      }
      break
    case "Text":
      only([], "Text can only contain text")
      break
    case "Timeline":
      only(["TimelineItem"], "Timeline can only contain TimelineItem")
      if (children.length === 0) add(errors, "MISSING_REQUIRED_CHILD", "Timeline must contain TimelineItem", path, node.tag)
      break
    case "TimelineItem":
      only(["TimelineTitle", "TimelineDescription", "TimelineContent"], "TimelineItem can only contain TimelineTitle, TimelineDescription, and TimelineContent")
      if (!hasChild(node, "TimelineTitle")) add(errors, "MISSING_REQUIRED_CHILD", "TimelineItem must contain TimelineTitle", path, node.tag)
      break
    default:
      break
  }
}

function validateNode(node, path, errors) {
  if (node.type === "text") return

  if (!allTags.has(node.tag)) {
    add(errors, "UNKNOWN_TAG", `Unknown tag: ${node.tag}`, path, node.tag)
    return
  }

  const allowed = new Set(allowedAttrs[node.tag] ?? [])
  for (const attr of Object.keys(node.attrs)) {
    if (node.tag !== "ChartRow" && !allowed.has(attr)) {
      add(errors, "UNKNOWN_ATTR", `Unknown attr "${attr}" on ${node.tag}`, path, node.tag, attr)
    }
  }

  for (const attr of requiredAttrs[node.tag] ?? []) {
    if (!(attr in node.attrs)) {
      add(errors, "MISSING_REQUIRED_ATTR", `Missing required attr "${attr}" on ${node.tag}`, path, node.tag, attr)
    }
  }

  for (const [attr, value] of Object.entries(node.attrs)) {
    const enumKey = `${node.tag}.${attr}`
    if (enums[enumKey] && !enums[enumKey].includes(value)) {
      add(errors, "INVALID_ATTR_VALUE", `${node.tag}.${attr} must be one of: ${enums[enumKey].join(", ")}`, path, node.tag, attr)
    }
  }

  if (layoutTags.has(node.tag)) {
    for (const child of node.children) {
      if (child.type === "text") {
        add(errors, "TEXT_NOT_ALLOWED", `Bare text is not allowed under ${node.tag}`, path, node.tag)
      }
    }
  }

  if (emptyTags.has(node.tag) && node.children.length > 0) {
    add(errors, "INVALID_CHILD", `${node.tag} cannot contain children`, path, node.tag)
  }

  if (node.tag === "AspectRatio" && node.attrs.ratio !== undefined && !validateNumber(node.attrs.ratio)) {
    add(errors, "INVALID_ATTR_VALUE", "AspectRatio ratio must be a number", path, node.tag, "ratio")
  }
  if (node.tag === "Progress" && node.attrs.value !== undefined && !validateNumber(node.attrs.value)) {
    add(errors, "INVALID_ATTR_VALUE", "Progress value must be a number", path, node.tag, "value")
  }
  if (node.tag === "Image" && node.attrs.src !== undefined && !validateUrl(node.attrs.src, "src")) {
    add(errors, "INVALID_ATTR_VALUE", "Image src must start with https:// or /", path, node.tag, "src")
  }
  if (node.tag === "Button" && node.attrs.href !== undefined && !validateUrl(node.attrs.href, "href")) {
    add(errors, "INVALID_ATTR_VALUE", "Button href must start with /, https://, or mailto:", path, node.tag, "href")
  }

  validateChildren(node, path, errors)

  for (const child of node.children) {
    validateNode(child, child.type === "element" ? `${path}/${child.tag}` : `${path}/#text`, errors)
  }
}

function validateArtifact(document) {
  const errors = []
  if (document.root.tag !== "Page") {
    add(errors, "INVALID_ROOT", "Root element must be Page", "/", document.root.tag)
  }
  validateNode(document.root, "/Page", errors)
  return { ok: errors.length === 0, errors }
}

function validateSource(source) {
  const document = parseArtifact(source)
  return validateArtifact(document)
}

function formatError(error) {
  const attr = error.attr ? ` attr=${error.attr}` : ""
  return `${error.code} ${error.path}${attr}: ${error.message}`
}

function runSelfTest() {
  const valid = `<Page title="Self Test"><Section width="reader"><Stack><Text variant="lead">knowledge-takeback-skill artifact validator works.</Text><Alert><AlertTitle>可信检查</AlertTitle><AlertDescription>Verified before teaching.</AlertDescription></Alert></Stack></Section></Page>`
  const invalid = `<Page><Stack>bare text</Stack></Page>`

  const validResult = validateSource(valid)
  const invalidResult = validateSource(invalid)

  if (!validResult.ok) {
    throw new Error(`Self-test valid sample failed:\n${validResult.errors.map(formatError).join("\n")}`)
  }
  if (invalidResult.ok) {
    throw new Error("Self-test invalid sample unexpectedly passed")
  }
  console.log("knowledge-takeback-skill artifact validator self-test passed.")
}

function printUsage() {
  console.log(`Usage:
  node scripts/validate-knowledge-takeback-skill-artifact.mjs --self-test
  node scripts/validate-knowledge-takeback-skill-artifact.mjs <artifact.ahtml> [more.ahtml]`)
}

const args = process.argv.slice(2)

if (args.includes("--help") || args.includes("-h")) {
  printUsage()
  process.exit(0)
}

try {
  if (args.includes("--self-test")) {
    runSelfTest()
    process.exit(0)
  }

  if (args.length === 0) {
    printUsage()
    process.exit(0)
  }

  let failed = false
  for (const file of args) {
    const source = readFileSync(file, "utf8")
    const result = validateSource(source)
    if (result.ok) {
      console.log(`OK ${basename(file)}`)
      continue
    }
    failed = true
    console.error(`FAIL ${file}`)
    for (const error of result.errors) {
      console.error(`  ${formatError(error)}`)
    }
  }
  process.exit(failed ? 1 : 0)
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`ERROR ${message}`)
  process.exit(1)
}
