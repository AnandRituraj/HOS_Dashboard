---
name: Update project memory after codebase changes
description: Always update .claude/memory/ files in the project directory when the codebase changes
type: feedback
---

After every task that changes the architecture, data flow, component structure, or key logic — update the relevant files in `.claude/memory/` (inside the project directory).

**Why:** Memory files drift out of sync with the codebase and become misleading. User had to manually point out stale entries (wrong Next.js version, removed handleReset function).

**How to apply:** At the end of any task that modifies the codebase, check if `project_architecture.md` or `project_key_logic.md` in `.claude/memory/` need updating and edit them before finishing.
