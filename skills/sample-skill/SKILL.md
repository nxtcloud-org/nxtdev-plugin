---
name: sample-skill
description: Sample skill demonstrating plugin skill structure. Use as a template for creating new skills.
disable-model-invocation: true
allowed-tools: "Read Glob Grep"
argument-hint: "[query]"
---

# Sample Skill

This is a sample skill for the nxt-dev plugin.

## Current Context

```!
git branch --show-current 2>/dev/null || echo "not a git repo"
```

## Instructions

1. Read the user's query: `$ARGUMENTS`
2. Search the codebase using allowed tools
3. Summarize findings

For detailed patterns, see [patterns.md](references/patterns.md)
For output format, see [output-format.md](examples/output-format.md)
