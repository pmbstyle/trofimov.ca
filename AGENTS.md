# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Vue 3 + Vite + TypeScript SPA (personal website at trofimov.ca). No backend — purely client-side. See `CLAUDE.md` for full architecture details and all development commands.

### Development commands

All commands are in `package.json`. Key ones: `npm run dev`, `npm run lint`, `npm run type-check`, `npm run build-only`, `npm run run-cypress`. See `CLAUDE.md` for the complete list.

### Case-sensitivity gotcha (Linux)

The repo has two files with casing that works on macOS but breaks on Linux:
- `src/components/companion/charWrapper.vue` is imported as `CharWrapper.vue`
- `src/components/companion/char.vue` is imported as `Char.vue`

On Linux (including Cloud Agent VMs), create symlinks before building or running the dev server:
```
ln -sf charWrapper.vue src/components/companion/CharWrapper.vue
ln -sf char.vue src/components/companion/Char.vue
```

### Pre-existing lint/type-check issues

- `npm run lint` exits with errors (21 errors, 36 warnings) — all pre-existing in the codebase (multi-word component names, unused vars, `.tsx` tileset files parsed as TypeScript).
- `npm run type-check` fails on Tiled map `.tsx` files in `src/assets/game/map/` — these are XML tileset definitions, not TypeScript JSX. This is pre-existing.
- `npm run build-only` (Vite build without type-check) succeeds cleanly.

### Cypress E2E tests

Cypress tests require the dev server running on port 5173 first:
```
npm run dev &
npm run run-cypress
```

### Optional environment variables

The chatbot and contact form require external API keys (set in `.env`). The rest of the site works without them:
- `VITE_MISTRAL_API_KEY` — for Whiskers AI chatbot
- `VITE_EMAILJS_PUBLIC_KEY`, `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID` — for contact form
