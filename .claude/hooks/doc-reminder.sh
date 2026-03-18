#!/bin/bash
# Fires after Write/Edit on source files.
# Injects a doc-update reminder into Claude's context.

f=$(jq -r '.tool_input.file_path // empty')

if echo "$f" | grep -qE '\.(tsx?|ts|css)$' && ! echo "$f" | grep -q 'node_modules'; then
  printf '{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"Doc reminder: before finishing this task, update CLAUDE.md, README.md, and .claude/memory/project_architecture.md if architecture, UI theme, or key logic changed."}}\n'
fi
