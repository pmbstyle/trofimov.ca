# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website (trofimov.ca) built with Vue 3 + Vite + TypeScript. Features multiple interactive interfaces: terminal emulator, Phaser-based RPG game, blog system, AI chatbot (Whiskers the cat powered by Mistral), and desktop-style UI.

**Stack:** Vue 3 (Composition API), Pinia stores, Phaser 3 game engine, TailwindCSS + DaisyUI, Vite, TypeScript.

## Common Development Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)

# Code Quality
npm run lint            # ESLint with auto-fix
npm run format          # Prettier formatting
npm run type-check      # TypeScript type checking (vue-tsc --noEmit)

# Testing
npm run run-cypress     # E2E tests with Cypress (requires dev server running)

# Build
npm run build           # Type-check + build for production
npm run build-only      # Build without type check
npm run preview         # Preview production build (port 4173)
```

**Important:** Always run `npm run type-check` before building. The build script includes type checking.

## Architecture

### Application Structure

- **Single Page App:** Vue Router handles routes (`/`, `/blog`, `/blog/:slug`) but all routes render the same `App.vue` component
- **Window Management:** `App.vue` manages a "desktop" metaphor with switchable windows (terminal, game, resume, contact, blog)
- **State Management:** Pinia stores handle terminal state, blog posts, chat history, game player stats, and dialogs

### Key Systems

**1. Terminal Interface (`src/components/Terminal.vue`)**
- Virtual filesystem in `src/config/filesystem.ts` - defines directory structure and file contents
- Commands in `src/commands/` directory: `ls`, `cd`, `cat`, `pwd`, `help`, `clear`, `exec`
- `execCommand.ts` routes commands to appropriate handlers
- Terminal state managed in `src/stores/terminal.ts`

**2. Game System (Phaser 3 RPG)**
- **Scenes:** `MainScene.ts` (exploration), `BattleScene.ts` (turn-based combat)
- **Player:** `Player.ts` handles movement, input (WASD + Space), and animations
- **NPC System:** NPCs defined in `NPC_CONFIGS` (MainScene.ts:20-26), each with associated artifact
- **Combat:** Telegraph-based attack patterns in `attackPatterns.ts`, projectiles in `Projectile.ts`
- **Stats:** `src/stores/playerStats.ts` manages inventory (max 5 artifacts) and stat bonuses
- **Scene Communication:** Custom window events (`gameDialogOpen`, `battleStart`, `battleEnd`, `battleHealth`) bridge Phaser and Vue

**3. Blog System**
- Posts in `src/blog/` directory as Markdown files
- `vite-plugin-markdown` transforms MD to Vue components with syntax highlighting (highlight.js)
- Blog state and routing in `src/stores/blog.ts` and `src/components/Blog.vue`

**4. AI Chatbot (`src/stores/chat.ts`)**
- Mistral API integration (`mistral-small-latest` model)
- System prompt defines "Whiskers" persona - a playful cat guide
- API key from `.env` as `VITE_MISTRAL_API_KEY`

### Store Architecture (Pinia)

- `terminal.ts` - Current path, command history, file execution state
- `blog.ts` - Blog posts list, current slug
- `chat.ts` - Chat history, loading state, error handling
- `playerStats.ts` - Player stats, artifact inventory (5 slots), computed stat bonuses
- `dialogs.ts` - Game dialog management for NPC interactions

### Asset Handling

- **Tilemap:** Tiled JSON at `src/assets/game/map/map.json` loaded as module
- **Sprites:** PNG imports for NPCs, projectiles, artifacts
- **Atlas:** JSON atlas for animated NPCs (blacksmith)
- **Build Config:** `assetsInlineLimit: 0` prevents asset inlining during build

### Communication Patterns

**Phaser ↔ Vue Bridge:**
```javascript
// Phaser dispatches events
window.dispatchEvent(new CustomEvent('battleHealth', { detail: {...} }))
window.dispatchEvent(new CustomEvent('battleEnd', { detail: {...} }))

// Vue components listen in mounted()
window.addEventListener('battleHealth', (e) => {...})
```

**Game Flow:**
1. MainScene: Player explores, approaches NPCs
2. Interaction triggers `scene.start('BattleScene', { playerX, playerY, npcType })`
3. BattleScene: Combat with telegraphed attacks, projectiles
4. Battle end dispatches `battleEnd` event, returns to MainScene with saved position
5. Artifacts awarded on first victory per NPC

## Type Safety

**Strict TypeScript:** `tsconfig.json` enables strict mode. All game types defined in `src/types/game.ts`:
- `NPCType` - union of NPC identifiers
- `Artifact` - interface for game artifacts
- `PlayerStats` - base stat structure
- `BattleData`, `NPCConfig`, `NPCEntity` - game scene types

## Important Notes

**Environment:** Requires `.env` file with `VITE_MISTRAL_API_KEY` for chatbot functionality.

**Cypress Testing:** E2E tests expect dev server at `http://localhost:5173`. Run tests with dev server already running.

**Game Asset Loading:** Phaser scenes use `preload()` for all assets. Map layers created from Tiled JSON with specific tileset names (`[Base]BaseChip_pipo`, `[A]Water_pipo`, `[A]Dirt_pipo`).

**Router Behavior:** All routes render `App.vue`. Blog routing handled by watching `route.path` and switching windows to `blog` when path starts with `/blog`.
