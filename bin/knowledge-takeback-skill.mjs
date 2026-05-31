#!/usr/bin/env node

import { copyFile, mkdir, readdir, rm, stat } from "node:fs/promises"
import { constants as fsConstants } from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const packageRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)))

const installEntries = [
  "SKILL.md",
  "knowledge-takeback-skill",
  "agents",
  "assets",
  "docs",
  "examples",
  "references",
  "scripts",
  "README.md",
  "README.en.md",
  "LICENSE",
  "package.json",
]

function usage() {
  return `knowledge-takeback-skill

Installs the knowledge-takeback-skill workflow into a Codex skills directory.

Usage:
  npx knowledge-takeback-skill
  npx knowledge-takeback-skill install [--target <skill-dir>] [--skills-dir <dir>] [--force]
  npx knowledge-takeback-skill print-path

Defaults:
  CODEX_HOME set: <CODEX_HOME>/skills/knowledge-takeback-skill
  Otherwise:      ~/.codex/skills/knowledge-takeback-skill

Options:
  --target <dir>      Exact destination skill directory.
  --skills-dir <dir>  Parent skills directory. Installs into <dir>/knowledge-takeback-skill.
  --name <name>       Skill folder name when using --skills-dir. Default: knowledge-takeback-skill.
  --force             Replace an existing destination.
  --dry-run           Print actions without writing files.
  -h, --help          Show this help.
`
}

function parseArgs(argv) {
  const args = [...argv]
  const command = args[0] && !args[0].startsWith("-") ? args.shift() : "install"
  const options = {
    command,
    dryRun: false,
    force: false,
    name: "knowledge-takeback-skill",
    skillsDir: undefined,
    target: undefined,
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (arg === "--dry-run") {
      options.dryRun = true
    } else if (arg === "--force") {
      options.force = true
    } else if (arg === "--target") {
      options.target = args[++index]
    } else if (arg === "--skills-dir") {
      options.skillsDir = args[++index]
    } else if (arg === "--name") {
      options.name = args[++index]
    } else if (arg === "-h" || arg === "--help") {
      options.command = "help"
    } else {
      throw new Error(`Unknown option: ${arg}`)
    }
  }

  return options
}

function defaultSkillsDir() {
  const codexHome = process.env.CODEX_HOME
  if (codexHome) {
    return path.resolve(codexHome, "skills")
  }
  return path.resolve(os.homedir(), ".codex", "skills")
}

function resolveTarget(options) {
  if (options.target) {
    return path.resolve(options.target)
  }
  const skillsDir = options.skillsDir
    ? path.resolve(options.skillsDir)
    : defaultSkillsDir()
  return path.resolve(skillsDir, options.name)
}

async function pathExists(filePath) {
  try {
    await stat(filePath)
    return true
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return false
    }
    throw error
  }
}

async function copyRecursive(source, destination) {
  const sourceStat = await stat(source)
  if (sourceStat.isDirectory()) {
    await mkdir(destination, { recursive: true })
    const entries = await readdir(source, { withFileTypes: true })
    for (const entry of entries) {
      await copyRecursive(
        path.join(source, entry.name),
        path.join(destination, entry.name)
      )
    }
    return
  }

  await mkdir(path.dirname(destination), { recursive: true })
  await copyFile(source, destination, fsConstants.COPYFILE_FICLONE)
}

async function install(options) {
  const target = resolveTarget(options)
  const existing = await pathExists(target)

  if (options.dryRun) {
    console.log(`Would install knowledge-takeback-skill to: ${target}`)
    console.log(`Would copy: ${installEntries.join(", ")}`)
    return
  }

  if (existing && !options.force) {
    throw new Error(
      `Destination already exists: ${target}\nUse --force to replace it.`
    )
  }

  if (existing) {
    await rm(target, { recursive: true, force: true })
  }

  await mkdir(target, { recursive: true })
  for (const entry of installEntries) {
    await copyRecursive(path.join(packageRoot, entry), path.join(target, entry))
  }

  console.log(`knowledge-takeback-skill installed to: ${target}`)
  console.log("Use /knowledge-takeback-skill in a new agent session after your skill host reloads skills.")
}

async function main() {
  const options = parseArgs(process.argv.slice(2))

  if (options.command === "help") {
    console.log(usage())
    return
  }

  if (options.command === "print-path") {
    console.log(resolveTarget(options))
    return
  }

  if (options.command !== "install") {
    throw new Error(`Unknown command: ${options.command}`)
  }

  await install(options)
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`knowledge-takeback-skill: ${message}`)
  process.exit(1)
})
