---
title: AI Integration Skill
---

# AI Integration Skill

Speed up your development with the official agent skill for `react-native-reanimated-dnd`. This skill follows the open [Agent Skills](https://agentskills.io) standard and works with 30+ AI coding agents including Claude Code, Codex, Cursor, Gemini CLI, GitHub Copilot, and more.

The skill teaches your AI agent the full library API — components, hooks, props, types, gotchas, and best practices — so it generates correct, working code with no hallucinated APIs.

## What It Does

When installed, the skill automatically activates when you ask your agent to:

- Add drag and drop to your app
- Create sortable or reorderable lists
- Build sortable grids
- Implement drop zones
- Work with drag handles, collision detection, or bounded dragging

Your agent will generate code using the correct components, hooks, props, and types from this library.

## Installation

### Option 1: `npx skills add` (Recommended)

The fastest way to install via [Vercel's skills CLI](https://skills.sh). It auto-detects which agents you use and installs to all of them:

```bash
npx skills add entropyconquers/react-native-reanimated-dnd
```

For global installation (available in all projects):

```bash
npx skills add entropyconquers/react-native-reanimated-dnd -g
```

To target a specific agent:

```bash
npx skills add entropyconquers/react-native-reanimated-dnd -a cursor
npx skills add entropyconquers/react-native-reanimated-dnd -a claude-code
```

### Option 2: Plugin Marketplace (Claude Code)

```
/plugin marketplace add entropyconquers/react-native-reanimated-dnd
/plugin install reanimated-dnd@reanimated-dnd-skills
```

### Option 3: Manual Installation

Copy the skill into the correct directory for your agent:

**For Claude Code:**
```bash
mkdir -p .claude/skills/reanimated-dnd
curl -o .claude/skills/reanimated-dnd/SKILL.md \
  https://raw.githubusercontent.com/entropyconquers/react-native-reanimated-dnd/main/skills/reanimated-dnd/SKILL.md
```

**For Codex, Gemini CLI, Cursor, GitHub Copilot, and others:**
```bash
mkdir -p .agents/skills/reanimated-dnd
curl -o .agents/skills/reanimated-dnd/SKILL.md \
  https://raw.githubusercontent.com/entropyconquers/react-native-reanimated-dnd/main/skills/reanimated-dnd/SKILL.md
```

**For maximum compatibility (all agents):**
```bash
mkdir -p .claude/skills/reanimated-dnd .agents/skills/reanimated-dnd
curl -o .agents/skills/reanimated-dnd/SKILL.md \
  https://raw.githubusercontent.com/entropyconquers/react-native-reanimated-dnd/main/skills/reanimated-dnd/SKILL.md
cp .agents/skills/reanimated-dnd/SKILL.md .claude/skills/reanimated-dnd/SKILL.md
```

## Where Each Agent Reads Skills

| Agent | Project-level path | User-level path |
|-------|-------------------|-----------------|
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| OpenAI Codex | `.agents/skills/` | `~/.agents/skills/` |
| Cursor | `.cursor/skills/`, `.agents/skills/`, `.claude/skills/` | `~/.cursor/skills/` |
| Gemini CLI | `.gemini/skills/`, `.agents/skills/` | `~/.gemini/skills/` |
| GitHub Copilot | `.github/skills/`, `.agents/skills/`, `.claude/skills/` | `~/.copilot/skills/` |
| Amp, Roo Code, Cline, etc. | `.agents/skills/` | `~/.agents/skills/` |

This repo ships the skill in both `.claude/skills/` and `.agents/skills/` so it works out of the box for all agents when you clone the repo.

## Usage Examples

Once installed, just describe what you want in natural language:

### Sortable List

> "Add a sortable list where I can reorder items by dragging"

Your agent will generate a complete `Sortable` + `SortableItem` implementation with correct props and state management.

### Drag and Drop

> "Create a drag and drop interface with items and drop zones"

Your agent will set up `DropProvider` + `Draggable` + `Droppable` with proper event handlers.

### Sortable Grid

> "Make a reorderable grid of cards, 3 columns"

Your agent will generate a `SortableGrid` + `SortableGridItem` implementation with the correct `GridDimensions` configuration.

### Advanced Patterns

> "Add drag handles to my sortable list items"

> "Constrain dragging to the Y axis within a bounded container"

> "Track which items are in which drop zone"

The skill covers all library features including handles, axis constraints, bounded dragging, collision algorithms, drop alignment, capacity limits, dynamic heights, custom animations, gotchas, and best practices.

## What's Included

The skill provides your AI agent with:

- Complete API reference for all 6 components and 8 hooks
- All prop signatures with types and defaults
- 14 integration patterns with code examples
- Type definitions for all enums and interfaces
- 28 gotchas and what-not-to-do rules
- Best practices for data, performance, and platform compatibility
- Hooks API for advanced custom implementations

## Compatible Agents

This skill follows the [Agent Skills open standard](https://agentskills.io) and works with:

- **Claude Code** — via `.claude/skills/`
- **OpenAI Codex** — via `.agents/skills/`
- **Cursor** — via `.cursor/skills/`, `.agents/skills/`, or `.claude/skills/`
- **Gemini CLI** — via `.agents/skills/`
- **GitHub Copilot** — via `.github/skills/`, `.agents/skills/`, or `.claude/skills/`
- **Amp, Roo Code, Windsurf, Cline, OpenCode** — via `.agents/skills/`
- And [30+ more](https://agentskills.io)

## Verifying Installation

Ask your agent:

> "What components does react-native-reanimated-dnd export?"

If the skill is loaded, it will accurately list `Draggable`, `Droppable`, `DropProvider`, `Sortable`, `SortableItem`, `SortableGrid`, and `SortableGridItem` with their correct props.
