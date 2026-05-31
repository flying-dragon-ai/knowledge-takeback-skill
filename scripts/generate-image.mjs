#!/usr/bin/env node

import { mkdir, readFile, stat, writeFile } from "node:fs/promises"
import path from "node:path"

const defaultConfigPath = path.resolve(
  "local",
  "knowledge-takeback-skill",
  "image-generation.config.json"
)

const defaultOutDir = path.resolve(
  "local",
  "knowledge-takeback-skill",
  "generated-images"
)

const USAGE_MAP = {
  cover: { stepfunSize: "1360x768", minimaxRatio: "16:9", html: "full hero background", pptxLayout: { w: 10, h: 5.625 } },
  coverOverlay: { stepfunSize: "1360x768", minimaxRatio: "16:9", html: "hero background with readable overlay", pptxLayout: { w: 10, h: 5.625 } },
  hero: { stepfunSize: "1360x768", minimaxRatio: "16:9", html: "wide hero image", pptxLayout: { w: 10, h: 3 } },
  bannerWide: { stepfunSize: "1360x768", minimaxRatio: "21:9", html: "extra-wide banner; crop StepFun output if needed", pptxLayout: { w: 10, h: 2.45 } },
  ultraWideHero: { stepfunSize: "1360x768", minimaxRatio: "21:9", html: "ultra-wide hero; crop StepFun output if needed", pptxLayout: { w: 10, h: 2.8 } },
  sideStrip: { stepfunSize: "768x1360", minimaxRatio: "9:16", html: "vertical side illustration", pptxLayout: { w: 2.5, h: 4.44 } },
  card: { stepfunSize: "1024x1024", minimaxRatio: "1:1", html: "square card visual", pptxLayout: { w: 2.5, h: 2.5 } },
  cardTall: { stepfunSize: "896x1184", minimaxRatio: "3:4", html: "portrait card visual", pptxLayout: { w: 2.3, h: 3.04 } },
  cardWide: { stepfunSize: "1184x896", minimaxRatio: "4:3", html: "landscape card visual", pptxLayout: { w: 3.5, h: 2.65 } },
  showcase: { stepfunSize: "1184x896", minimaxRatio: "4:3", html: "product or project showcase", pptxLayout: { w: 3.9, h: 2.95 } },
  phoneMockup: { stepfunSize: "768x1360", minimaxRatio: "9:16", html: "phone-like vertical mockup", pptxLayout: { w: 1.8, h: 3.2 } },
  icon: { stepfunSize: "1024x1024", minimaxRatio: "1:1", html: "small icon or placeholder", pptxLayout: { w: 1.5, h: 1.5 } },
}

function usage() {
  return `Generate an image for knowledge-takeback-skill HTML output.

Usage:
  node scripts/generate-image.mjs --prompt-file prompts/image-generation/hero-interactive-html.md --usage cover
  node scripts/generate-image.mjs --provider stepfun-cn --prompt "..." --usage hero
  node scripts/generate-image.mjs --provider minimax-global --prompt "..." --usage cardWide

Provider selection:
  --provider <provider> or KNOWLEDGE_TAKEBACK_IMAGE_PROVIDER / PPT_IMAGE_PROVIDER / AI_IMAGE_PROVIDER
  Providers: openai, stepfun, stepfun-cn, stepfun-global, minimax, minimax-cn, minimax-global
  Default: stepfun-cn unless only MINIMAX_API_KEY is configured.

Secrets:
  Generic: KNOWLEDGE_TAKEBACK_IMAGE_BASE_URL, KNOWLEDGE_TAKEBACK_IMAGE_API_KEY
  StepFun: STEPFUN_API_KEY, STEPFUN_REGION, STEPFUN_API_MODE, STEPFUN_BASE_URL
  MiniMax: MINIMAX_API_KEY, MINIMAX_REGION, MINIMAX_BASE_URL
  Optional .env in the current working directory is loaded without overriding existing process.env values.
  Optional StepFun defaults: STEPFUN_STEPS, STEPFUN_CFG_SCALE, STEPFUN_TEXT_MODE, STEPFUN_SEED.

Common options:
  --prompt-file <file>       Prompt markdown/text file.
  --prompt <text>            Inline prompt.
  --usage <name>             cover, hero, bannerWide, card, cardWide, showcase, phoneMockup, icon, ...
  --out-dir <dir>            Output directory. Default: local/knowledge-takeback-skill/generated-images
  --name <name>              Output file slug.
  --config <file>            Local JSON config. Default: local/knowledge-takeback-skill/image-generation.config.json
  --base-url <url>           Override provider base URL.
  --api-key <key>            Override provider API key.
  --endpoint <path>          Override provider endpoint.
  --model <model>            Override provider model.
  --size <size>              StepFun/OpenAI size. If absent, derived from --usage.
  --aspect-ratio <ratio>     MiniMax aspect ratio. If absent, derived from --usage.
  --n <count>                Number of images. StepFun runs one request per image. Default: 1.
  --response-format <value>  For OpenAI-compatible providers, for example b64_json.
  --negative-prompt <text>   Provider negative prompt.
  --steps <number>           StepFun steps.
  --cfg-scale <number>       StepFun cfgScale.
  --text-mode <true|false>   StepFun textMode.
  --prompt-optimizer <bool>  MiniMax promptOptimizer.
  --seed <number>            Provider seed when supported.
  --body-file <file>         JSON body merged into the provider request.
  --api-mode <mode>          StepFun API mode: platform | step_plan.
  --timeout-ms <number>      Request timeout. Default: 120000.
  --optional                 If no API key is configured, warn and exit 0 with fallback metadata.
  --dry-run                  Print sanitized request without calling the API.
  -h, --help                 Show this help.
`
}

function parseArgs(argv) {
  const options = {
    apiKey: undefined,
    apiMode: undefined,
    aspectRatio: undefined,
    baseUrl: undefined,
    bodyFile: undefined,
    cfgScale: undefined,
    config: defaultConfigPath,
    dryRun: false,
    endpoint: undefined,
    help: false,
    model: undefined,
    n: undefined,
    name: undefined,
    negativePrompt: undefined,
    outDir: defaultOutDir,
    optional: false,
    prompt: undefined,
    promptFile: undefined,
    promptOptimizer: undefined,
    provider: undefined,
    quality: undefined,
    responseFormat: undefined,
    seed: undefined,
    size: undefined,
    steps: undefined,
    style: undefined,
    subjectReference: undefined,
    textMode: undefined,
    timeoutMs: undefined,
    usage: undefined,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === "-h" || arg === "--help") options.help = true
    else if (arg === "--api-mode") options.apiMode = argv[++index]
    else if (arg === "--dry-run") options.dryRun = true
    else if (arg === "--api-key") options.apiKey = argv[++index]
    else if (arg === "--aspect-ratio") options.aspectRatio = argv[++index]
    else if (arg === "--base-url") options.baseUrl = argv[++index]
    else if (arg === "--body-file") options.bodyFile = argv[++index]
    else if (arg === "--cfg-scale") options.cfgScale = Number.parseFloat(argv[++index])
    else if (arg === "--config") options.config = argv[++index]
    else if (arg === "--endpoint") options.endpoint = argv[++index]
    else if (arg === "--model") options.model = argv[++index]
    else if (arg === "--n") options.n = Number.parseInt(argv[++index], 10)
    else if (arg === "--name") options.name = argv[++index]
    else if (arg === "--negative-prompt") options.negativePrompt = argv[++index]
    else if (arg === "--out-dir") options.outDir = path.resolve(argv[++index])
    else if (arg === "--optional") options.optional = true
    else if (arg === "--prompt") options.prompt = argv[++index]
    else if (arg === "--prompt-file") options.promptFile = path.resolve(argv[++index])
    else if (arg === "--prompt-optimizer") options.promptOptimizer = parseBoolean(argv[++index])
    else if (arg === "--provider") options.provider = argv[++index]
    else if (arg === "--quality") options.quality = argv[++index]
    else if (arg === "--response-format") options.responseFormat = argv[++index]
    else if (arg === "--seed") options.seed = Number.parseInt(argv[++index], 10)
    else if (arg === "--size") options.size = argv[++index]
    else if (arg === "--steps") options.steps = Number.parseInt(argv[++index], 10)
    else if (arg === "--style") options.style = argv[++index]
    else if (arg === "--subject-reference") options.subjectReference = argv[++index]
    else if (arg === "--text-mode") options.textMode = parseBoolean(argv[++index])
    else if (arg === "--timeout-ms") options.timeoutMs = Number.parseInt(argv[++index], 10)
    else if (arg === "--usage") options.usage = argv[++index]
    else throw new Error(`Unknown option: ${arg}`)
  }

  return options
}

function parseBoolean(value) {
  if (value === true || value === false) return value
  const normalized = String(value).trim().toLowerCase()
  if (["1", "true", "yes", "on"].includes(normalized)) return true
  if (["0", "false", "no", "off"].includes(normalized)) return false
  throw new Error(`Invalid boolean value: ${value}`)
}

async function exists(filePath) {
  try {
    await stat(filePath)
    return true
  } catch (error) {
    if (error && error.code === "ENOENT") return false
    throw error
  }
}

async function readJsonIfExists(filePath) {
  if (!filePath || !(await exists(filePath))) return {}
  return JSON.parse(await readFile(filePath, "utf8"))
}

async function loadDotEnvIfExists(filePath) {
  if (!(await exists(filePath))) return
  const content = await readFile(filePath, "utf8")
  for (const rawLine of content.split(/\r?\n/)) {
    let line = rawLine.trim()
    if (!line || line.startsWith("#")) continue
    if (line.startsWith("export ")) line = line.slice(7).trim()

    const equalsIndex = line.indexOf("=")
    if (equalsIndex <= 0) continue

    const key = line.slice(0, equalsIndex).trim()
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue
    if (process.env[key] !== undefined) continue

    process.env[key] = parseDotEnvValue(line.slice(equalsIndex + 1))
  }
}

function parseDotEnvValue(rawValue) {
  let value = rawValue.trim()
  const quote = value[0]
  if (quote === "\"" || quote === "'") {
    const closingIndex = value.indexOf(quote, 1)
    if (closingIndex > 0) return value.slice(1, closingIndex)
  }

  const commentIndex = value.indexOf(" #")
  if (commentIndex >= 0) value = value.slice(0, commentIndex).trim()
  return value
}

function pick(...values) {
  return values.find((value) => value !== undefined && value !== "")
}

function pickNumber(...values) {
  for (const value of values) {
    if (value === undefined || value === "") continue
    const number = Number(value)
    if (Number.isFinite(number)) return number
  }
  return undefined
}

function pickBoolean(...values) {
  for (const value of values) {
    if (value === undefined || value === "") continue
    if (typeof value === "boolean") return value
    return parseBoolean(value)
  }
  return undefined
}

function configValue(config, snakeName, camelName = snakeName) {
  return pick(config[snakeName], config[camelName])
}

function configNumber(config, snakeName, camelName = snakeName) {
  return pickNumber(config[snakeName], config[camelName])
}

function cleanBaseUrl(baseUrl) {
  return baseUrl.replace(/\/+$/, "")
}

function resolveApiUrl(baseUrl, endpoint) {
  const clean = cleanBaseUrl(baseUrl)
  const endpointPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  if (clean.endsWith(endpointPath)) return clean
  return `${clean}${endpointPath}`
}

function slugify(value) {
  const slug = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return slug || "image"
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-")
}

function imageExtension(contentType, fallbackUrl) {
  if (contentType && contentType.includes("webp")) return ".webp"
  if (contentType && contentType.includes("jpeg")) return ".jpg"
  if (contentType && contentType.includes("png")) return ".png"
  try {
    const ext = path.extname(new URL(fallbackUrl).pathname)
    if (ext) return ext
  } catch {
    // Use default extension.
  }
  return ".png"
}

function extractImages(payload) {
  const candidates = []
  if (Array.isArray(payload.data)) candidates.push(...payload.data)
  if (payload.data && Array.isArray(payload.data.images)) candidates.push(...payload.data.images)
  if (payload.data && Array.isArray(payload.data.image_urls)) candidates.push(...payload.data.image_urls)
  if (payload.data && payload.data.image_url) candidates.push(payload.data.image_url)
  if (Array.isArray(payload.images)) candidates.push(...payload.images)
  if (Array.isArray(payload.image_urls)) candidates.push(...payload.image_urls)
  if (payload.image) candidates.push(payload.image)
  if (payload.image_url) candidates.push(payload.image_url)

  return candidates
    .map((item) => {
      if (typeof item === "string") return { url: item }
      if (item && typeof item === "object") return item
      return undefined
    })
    .filter(Boolean)
}

async function readPrompt(options) {
  if (options.prompt) return options.prompt
  if (options.promptFile) return readFile(options.promptFile, "utf8")
  throw new Error("Provide --prompt-file or --prompt.")
}

async function writeImageFromUrl(url, outputBase) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Image download failed: ${response.status} ${response.statusText}`)
  }
  const bytes = Buffer.from(await response.arrayBuffer())
  const ext = imageExtension(response.headers.get("content-type"), url)
  const file = `${outputBase}${ext}`
  await writeFile(file, bytes)
  return file
}

async function writeImageFromBase64(base64, outputBase) {
  const file = `${outputBase}.png`
  await writeFile(file, Buffer.from(base64, "base64"))
  return file
}

function normalizeProvider(rawProvider, config) {
  const explicit = pick(
    rawProvider,
    config.provider,
    process.env.KNOWLEDGE_TAKEBACK_IMAGE_PROVIDER,
    process.env.PPT_IMAGE_PROVIDER,
    process.env.AI_IMAGE_PROVIDER
  )
  if (explicit) return canonicalProvider(explicit, config)
  if (process.env.MINIMAX_API_KEY && !process.env.STEPFUN_API_KEY) {
    return canonicalProvider("minimax", config)
  }
  return canonicalProvider("stepfun-cn", config)
}

function canonicalProvider(value, config) {
  const normalized = String(value).trim().toLowerCase().replace(/_/g, "-")
  if (normalized === "openai" || normalized === "generic") return { kind: "openai", region: "" }
  if (normalized === "stepfun") return { kind: "stepfun", region: regionValue(config, "stepfun", "cn") }
  if (normalized === "stepfun-cn") return { kind: "stepfun", region: "cn" }
  if (normalized === "stepfun-global") return { kind: "stepfun", region: "global" }
  if (normalized === "minimax") return { kind: "minimax", region: regionValue(config, "minimax", "global") }
  if (normalized === "minimax-cn") return { kind: "minimax", region: "cn" }
  if (normalized === "minimax-global") return { kind: "minimax", region: "global" }
  throw new Error(`Unknown image provider: ${value}`)
}

function regionValue(config, provider, fallback) {
  const providerRegionEnv = provider === "stepfun"
    ? process.env.STEPFUN_REGION
    : process.env.MINIMAX_REGION
  return String(
    pick(
      config[`${provider}_region`],
      config[`${provider}Region`],
      providerRegionEnv,
      process.env.KNOWLEDGE_TAKEBACK_IMAGE_REGION,
      process.env.PPT_IMAGE_REGION,
      process.env.AI_IMAGE_REGION,
      fallback
    )
  )
    .trim()
    .toLowerCase()
}

function stepfunBaseUrl(provider, options, config) {
  const apiMode = String(
    pick(
      options.apiMode,
      config.stepfun_api_mode,
      config.stepfunApiMode,
      process.env.STEPFUN_API_MODE,
      "platform"
    )
  )
    .trim()
    .toLowerCase()
  const host = provider.region === "global" ? "api.stepfun.ai" : "api.stepfun.com"
  const defaultUrl = apiMode === "step_plan"
    ? `https://${host}/step_plan/v1`
    : `https://${host}/v1`
  return pick(
    options.baseUrl,
    configValue(config, "stepfun_base_url", "stepfunBaseUrl"),
    process.env.STEPFUN_BASE_URL,
    process.env.KNOWLEDGE_TAKEBACK_IMAGE_BASE_URL,
    defaultUrl
  )
}

function minimaxBaseUrl(provider, options, config) {
  const defaultUrl = provider.region === "cn"
    ? "https://api.minimaxi.com/v1"
    : "https://api.minimax.io/v1"
  return pick(
    options.baseUrl,
    configValue(config, "minimax_base_url", "minimaxBaseUrl"),
    process.env.MINIMAX_BASE_URL,
    process.env.KNOWLEDGE_TAKEBACK_IMAGE_BASE_URL,
    defaultUrl
  )
}

function providerConfig(provider, options, config) {
  const usageConfig = options.usage ? USAGE_MAP[options.usage] : undefined
  if (options.usage && !usageConfig) {
    throw new Error(`Unknown usage: ${options.usage}. Known usages: ${Object.keys(USAGE_MAP).join(", ")}`)
  }

  if (provider.kind === "stepfun") {
    return {
      apiKey: pick(
        options.apiKey,
        configValue(config, "stepfun_api_key", "stepfunApiKey"),
        process.env.STEPFUN_API_KEY,
        process.env.KNOWLEDGE_TAKEBACK_IMAGE_API_KEY
      ),
      baseUrl: stepfunBaseUrl(provider, options, config),
      endpoint: pick(options.endpoint, config.stepfun_endpoint, config.stepfunEndpoint, "/images/generations"),
      model: pick(options.model, config.stepfun_model, config.stepfunModel, process.env.STEPFUN_MODEL, process.env.KNOWLEDGE_TAKEBACK_IMAGE_MODEL, "step-image-edit-2"),
      requestBody: stepfunBody(options, config, usageConfig),
    }
  }

  if (provider.kind === "minimax") {
    return {
      apiKey: pick(
        options.apiKey,
        configValue(config, "minimax_api_key", "minimaxApiKey"),
        process.env.MINIMAX_API_KEY,
        process.env.KNOWLEDGE_TAKEBACK_IMAGE_API_KEY
      ),
      baseUrl: minimaxBaseUrl(provider, options, config),
      endpoint: pick(options.endpoint, config.minimax_endpoint, config.minimaxEndpoint, "/image_generation"),
      model: pick(options.model, config.minimax_model, config.minimaxModel, process.env.MINIMAX_MODEL, process.env.KNOWLEDGE_TAKEBACK_IMAGE_MODEL, "image-01"),
      requestBody: minimaxBody(options, config, usageConfig),
    }
  }

  return {
    apiKey: pick(
      options.apiKey,
      configValue(config, "api_key", "apiKey"),
      process.env.KNOWLEDGE_TAKEBACK_IMAGE_API_KEY
    ),
    baseUrl: pick(
      options.baseUrl,
      configValue(config, "base_url", "baseUrl"),
      process.env.KNOWLEDGE_TAKEBACK_IMAGE_BASE_URL
    ),
    endpoint: pick(options.endpoint, config.endpoint, process.env.KNOWLEDGE_TAKEBACK_IMAGE_ENDPOINT, "/images/generations"),
    model: pick(options.model, config.model, process.env.KNOWLEDGE_TAKEBACK_IMAGE_MODEL),
    requestBody: openAiBody(options, config, usageConfig),
  }
}

function openAiBody(options, config, usageConfig) {
  const body = {}
  const size = pick(options.size, config.size, usageConfig?.stepfunSize)
  if (size) body.size = size
  const imageCount = pickNumber(options.n, config.n, 1)
  if (imageCount !== undefined) body.n = imageCount
  if (options.quality || config.quality) body.quality = pick(options.quality, config.quality)
  if (options.style || config.style) body.style = pick(options.style, config.style)
  if (options.responseFormat || config.response_format || config.responseFormat) {
    body.response_format = pick(options.responseFormat, config.response_format, config.responseFormat)
  }
  return body
}

function stepfunBody(options, config, usageConfig) {
  const body = {}
  body.size = pick(options.size, config.stepfun_size, config.stepfunSize, config.size, usageConfig?.stepfunSize, "1360x768")
  if (options.responseFormat || config.response_format || config.responseFormat) {
    body.response_format = pick(options.responseFormat, config.response_format, config.responseFormat)
  }
  const steps = pickNumber(options.steps, config.steps, config.stepfun_steps, config.stepfunSteps, process.env.STEPFUN_STEPS)
  if (steps !== undefined) body.steps = steps
  const cfgScale = pickNumber(options.cfgScale, config.cfg_scale, config.cfgScale, config.stepfun_cfg_scale, config.stepfunCfgScale, process.env.STEPFUN_CFG_SCALE)
  if (cfgScale !== undefined) body.cfg_scale = cfgScale
  const negativePrompt = pick(options.negativePrompt, config.negative_prompt, config.negativePrompt)
  if (negativePrompt) body.negative_prompt = negativePrompt
  const textMode = pickBoolean(
    options.textMode,
    config.text_mode,
    config.textMode,
    config.stepfun_text_mode,
    config.stepfunTextMode,
    process.env.STEPFUN_TEXT_MODE
  )
  if (textMode !== undefined) body.text_mode = textMode
  const seed = pickNumber(options.seed, config.seed, config.stepfun_seed, config.stepfunSeed, process.env.STEPFUN_SEED)
  if (seed !== undefined) body.seed = seed
  return body
}

function minimaxBody(options, config, usageConfig) {
  const body = {}
  body.aspect_ratio = pick(
    options.aspectRatio,
    config.aspect_ratio,
    config.aspectRatio,
    usageConfig?.minimaxRatio,
    "16:9"
  )
  const imageCount = pickNumber(options.n, config.n, 1)
  if (imageCount !== undefined) body.n = imageCount
  if (options.promptOptimizer !== undefined) body.promptOptimizer = options.promptOptimizer
  else if (config.prompt_optimizer !== undefined) body.promptOptimizer = Boolean(config.prompt_optimizer)
  else if (config.promptOptimizer !== undefined) body.promptOptimizer = Boolean(config.promptOptimizer)
  const subjectReference = pick(options.subjectReference, config.subject_reference, config.subjectReference)
  if (subjectReference) body.subjectReference = subjectReference
  const seed = pickNumber(options.seed, config.seed)
  if (seed !== undefined) body.seed = seed
  const negativePrompt = pick(options.negativePrompt, config.negative_prompt, config.negativePrompt)
  if (negativePrompt) body.negative_prompt = negativePrompt
  return body
}

function requestCount(provider, requestBody) {
  const n = pickNumber(requestBody.n, 1)
  return provider.kind === "stepfun" ? Math.max(1, n) : 1
}

function sanitizeRequestBody(body) {
  return JSON.parse(JSON.stringify(body))
}

async function callImageApi({ apiKey, apiUrl, requestBody, timeoutMs }) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(apiUrl, {
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      signal: controller.signal,
    })

    const text = await response.text()
    if (!response.ok) {
      throw new Error(`Image API failed: ${response.status} ${response.statusText}\n${text}`)
    }
    return JSON.parse(text)
  } finally {
    clearTimeout(timeout)
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    console.log(usage())
    return
  }

  await loadDotEnvIfExists(path.resolve(".env"))

  const config = await readJsonIfExists(path.resolve(options.config))
  const bodyOverride = options.bodyFile
    ? JSON.parse(await readFile(path.resolve(options.bodyFile), "utf8"))
    : {}
  const prompt = await readPrompt(options)
  const provider = normalizeProvider(options.provider, config)
  const providerSettings = providerConfig(provider, options, config)
  const timeoutMs = pickNumber(
    options.timeoutMs,
    config.timeout_ms,
    config.timeoutMs,
    process.env.KNOWLEDGE_TAKEBACK_IMAGE_TIMEOUT_MS,
    120000
  )

  if (!providerSettings.baseUrl) {
    if (options.optional) {
      console.warn("generate-image: missing base URL; skipped image generation because --optional was set.")
      console.log(
        JSON.stringify(
          {
            fallback_reason: "missing_base_url",
            files: [],
            provider,
            usage: options.usage || null,
            usage_config: options.usage ? USAGE_MAP[options.usage] : null,
          },
          null,
          2
        )
      )
      return
    }
    throw new Error("Missing base URL. Set --base-url or provider-specific base URL env.")
  }
  if (!providerSettings.apiKey && !options.dryRun) {
    if (options.optional) {
      console.warn("generate-image: missing API key; skipped image generation because --optional was set.")
      console.log(
        JSON.stringify(
          {
            fallback_reason: "missing_api_key",
            files: [],
            provider,
            usage: options.usage || null,
            usage_config: options.usage ? USAGE_MAP[options.usage] : null,
          },
          null,
          2
        )
      )
      return
    }
    throw new Error("Missing API key. Set --api-key or provider-specific API key env.")
  }

  const apiUrl = resolveApiUrl(providerSettings.baseUrl, providerSettings.endpoint)
  const requestBody = {
    ...providerSettings.requestBody,
    ...bodyOverride,
    model: providerSettings.model,
    prompt,
  }

  const outputSlug = slugify(
    options.name ||
      options.usage ||
      (options.promptFile && path.basename(options.promptFile, path.extname(options.promptFile)))
  )
  const outputBase = path.join(options.outDir, `${outputSlug}-${timestamp()}`)

  if (options.dryRun) {
    console.log(
      JSON.stringify(
        {
          api_url: apiUrl,
          has_api_key: Boolean(providerSettings.apiKey),
          output_base: outputBase,
          provider,
          request_body: sanitizeRequestBody(requestBody),
          usage: options.usage || null,
          usage_config: options.usage ? USAGE_MAP[options.usage] : null,
        },
        null,
        2
      )
    )
    return
  }

  await mkdir(options.outDir, { recursive: true })

  const files = []
  const payloads = []
  const totalRequests = requestCount(provider, requestBody)
  for (let requestIndex = 0; requestIndex < totalRequests; requestIndex += 1) {
    const body = { ...requestBody }
    if (provider.kind === "stepfun") delete body.n
    const payload = await callImageApi({
      apiKey: providerSettings.apiKey,
      apiUrl,
      requestBody: body,
      timeoutMs,
    })
    payloads.push(payload)

    const images = extractImages(payload)
    if (images.length === 0) {
      throw new Error("Image API response did not contain a supported image URL or b64_json field.")
    }

    for (let index = 0; index < images.length; index += 1) {
      const image = images[index]
      const imageIndex = files.length + 1
      const indexedBase = `${outputBase}-${imageIndex}`
      if (image.b64_json) {
        files.push(await writeImageFromBase64(image.b64_json, indexedBase))
      } else if (image.url || image.image_url) {
        files.push(await writeImageFromUrl(image.url || image.image_url, indexedBase))
      } else {
        throw new Error(`Image ${imageIndex} has neither url nor b64_json.`)
      }
    }
  }

  const metadata = {
    api_url: apiUrl,
    created_at: new Date().toISOString(),
    files,
    prompt_file: options.promptFile ? path.relative(process.cwd(), options.promptFile) : null,
    provider,
    request_body: sanitizeRequestBody(requestBody),
    response_summary: payloads.map((payload) => ({
      created: payload.created,
      id: payload.id,
      revised_prompts: extractImages(payload).map((image) => image.revised_prompt).filter(Boolean),
      usage: payload.usage,
    })),
    usage: options.usage || null,
    usage_config: options.usage ? USAGE_MAP[options.usage] : null,
  }
  const metadataFile = `${outputBase}.json`
  await writeFile(metadataFile, JSON.stringify(metadata, null, 2), "utf8")

  console.log(`Generated ${files.length} image(s):`)
  for (const file of files) console.log(file)
  console.log(`Metadata: ${metadataFile}`)
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`generate-image: ${message}`)
  process.exit(1)
})
