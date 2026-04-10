# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**nxtdev** is a Claude Code plugin for NxtCloud AI agent development workflows. No build step, dependencies, or test suite — development consists of adding/editing markdown and JSON files.

## Plugin Structure

```
nxt-dev-claude-plugin/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest (ONLY this file goes here)
├── agents/                  # Custom subagent definitions (.md files)
├── skills/                  # Slash-command skills (directories with SKILL.md)
├── CLAUDE.md
└── README.md
```

**Critical**: Only `plugin.json` belongs in `.claude-plugin/`. All other components (`skills/`, `agents/`) must be at the plugin root level — files inside `.claude-plugin/` subdirectories won't be discovered.

## Development & Testing

```bash
# Test plugin locally during development
claude --plugin-dir .

# Debug plugin loading issues
claude --debug

# Reload plugins mid-session after changes
/reload-plugins
```

## Plugin Component Reference

### Skills (`skills/`)

Each skill is a directory with a `SKILL.md` file and optional subdirectories:

```
skills/
└── my-skill/
    ├── SKILL.md             # Required: frontmatter + instructions (max 500 lines)
    ├── references/          # Optional: detailed docs (loaded on-demand)
    │   ├── api-patterns.md
    │   └── edge-cases.md
    ├── examples/            # Optional: sample outputs, templates
    │   ├── sample-output.md
    │   └── config-template.yaml
    ├── scripts/             # Optional: executable helpers (not read, executed)
    │   ├── validate.sh
    │   └── deploy.py
    └── assets/              # Optional: static resources (HTML, CSS, images)
```

#### Skill Subdirectory Roles

| Directory | Role | Loading |
|-----------|------|---------|
| `references/` | API docs, patterns, edge cases (2,000-5,000+ words OK) | On-demand when Claude needs it |
| `examples/` | Working code samples, expected outputs, templates | On-demand when referenced |
| `scripts/` | Executable code (Bash, Python, Node.js) | Executed via `${CLAUDE_SKILL_DIR}/scripts/` |
| `assets/` | Static resources (HTML templates, CSS, images) | Not loaded into context |

Nested subdirectories supported — organize by domain (e.g. `references/api/`, `scripts/cli/`).

**Progressive disclosure**: SKILL.md = core instructions (1,500-2,000 words), references/ = deep detail, examples/ = format demos. Only SKILL.md loads on invocation; other files load when Claude references them.

#### SKILL.md Format

```markdown
---
name: my-skill
description: What this skill does. Use when...
---

# Instructions

Markdown body with Claude's instructions.

For API details, see [api-patterns.md](references/api-patterns.md)
Run validation: `bash ${CLAUDE_SKILL_DIR}/scripts/validate.sh`
```

#### Frontmatter Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Skill name (kebab-case, max 64 chars). Defaults to directory name |
| `description` | string | When to use (max 250 chars). Used for relevance matching |
| `disable-model-invocation` | boolean | `true` = only user can invoke via `/` (default: false) |
| `user-invocable` | boolean | `false` = only Claude can invoke, hidden from `/` menu (default: true) |
| `argument-hint` | string | Autocomplete hint (e.g. `"[issue-number]"`) |
| `allowed-tools` | string\|array | Tools usable without per-use prompting (e.g. `"Bash(git *) Read"`) |
| `model` | string | Override session model: `opus`, `sonnet`, `haiku` |
| `effort` | string | Override effort level: `low`, `medium`, `high`, `max` |
| `context` | string | `fork` = run in isolated subagent context |
| `agent` | string | Subagent type when context is fork: `Explore`, `Plan`, `general-purpose`, or custom |
| `paths` | string\|array | Glob patterns to auto-activate for matching files |
| `shell` | string | Shell for inline commands: `bash` or `powershell` |

#### String Substitutions

Available inside SKILL.md body:

- `${CLAUDE_SESSION_ID}` — current session ID
- `${CLAUDE_SKILL_DIR}` — absolute path to this skill's directory
- `$ARGUMENTS` — all arguments passed to the skill
- `$ARGUMENTS[0]` or `$0` — first argument
- `$ARGUMENTS[1]` or `$1` — second argument

#### Dynamic Content Injection

Run shell commands before Claude sees the prompt. Output replaces the placeholder.

Single command:
```markdown
Current branch: !`git branch --show-current`
```

Multi-line:
````markdown
```!
node --version
npm --version
git status
```
````

#### Supporting Files

Reference subdirectory files from SKILL.md via markdown links:
```markdown
For API details, see [api-patterns.md](references/api-patterns.md)
For examples, see [sample-output.md](examples/sample-output.md)
Run validation: `python ${CLAUDE_SKILL_DIR}/scripts/validate.py`
```

### Agents (`agents/`)

Each agent is a single `.md` file with frontmatter:

Key frontmatter fields: `name`, `description`, `model`, `tools`, `disallowedTools`, `maxTurns`, `isolation: worktree`

### Environment Variables

- `${CLAUDE_PLUGIN_ROOT}` — absolute path to plugin installation directory
- `${CLAUDE_PLUGIN_DATA}` — persistent data directory surviving updates (`~/.claude/plugins/data/{plugin-id}/`)

### Manifest (`plugin.json`)

Optional fields beyond name/version/description: `skills`, `commands`, `agents`, `mcpServers`, `lspServers`, `outputStyles`, `userConfig`, `channels`
