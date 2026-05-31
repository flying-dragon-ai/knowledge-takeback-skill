# knowledge-takeback-skill NPM Distribution

knowledge-takeback-skill distributes the knowledge-takeback-skill workflow as an npm package with an `npx` installer.

## User Install

After the package is published, users install the skill with:

```bash
npx knowledge-takeback-skill
```

Default destination:

```text
~/.codex/skills/knowledge-takeback-skill
```

If `CODEX_HOME` is set, the installer uses:

```text
<CODEX_HOME>/skills/knowledge-takeback-skill
```

Custom destinations:

```bash
npx knowledge-takeback-skill install --skills-dir ~/.codex/skills
npx knowledge-takeback-skill install --target /absolute/path/to/skills/knowledge-takeback-skill
npx knowledge-takeback-skill install --target /absolute/path/to/skills/knowledge-takeback-skill --force
```

## Published Package Contents

The npm package is controlled by the `files` whitelist in `package.json`.

Included:

- `SKILL.md`
- `knowledge-takeback-skill/`
- `agents/`
- `assets/`
- `bin/`
- `docs/`
- `examples/`
- `references/`
- `scripts/`
- `README.md`
- `README.en.md`
- `LICENSE`

Excluded:

- `local/`
- `local/imports/`
- `node_modules/`
- IDE folders
- temporary learner state
- upstream source drops

## Maintainer Checks

Run before publishing:

```bash
npm run validate
npm run pack:check
npm run publish:dry
```

Publish when logged in to npm:

```bash
npm publish
```

If the unscoped package name is unavailable, rename the package to a scoped public name such as `@your-scope/knowledge-takeback-skill`, then users install with:

```bash
npx @your-scope/knowledge-takeback-skill
```
