---
name: Update CLAUDE.md and README.md after codebase changes
description: Keep CLAUDE.md and README.md in sync whenever the codebase changes
type: feedback
---

After every task that changes architecture, data flow, component structure, or key logic — update CLAUDE.md and README.md to reflect those changes.

**Why:** Docs drift out of sync and become misleading. Past issues included wrong Next.js version, removed handleReset still documented, missing component subdirectories.

**How to apply:** At the end of any task that modifies the codebase, check if CLAUDE.md or README.md need updating and edit them before finishing. Always verify against actual source files, not from memory.
