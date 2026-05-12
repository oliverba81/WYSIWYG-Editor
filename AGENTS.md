# AGENTS.md

## Cursor Cloud specific instructions

This is a TypeScript WYSIWYG editor library with zero runtime dependencies. It uses **npm** as the package manager and **Vite** as the build/dev tool.

### Quick reference

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Typecheck | `npm run typecheck` |
| Dev server (vanilla demo) | `npm run dev` |
| Dev server (React demo) | `npm run dev:react` |
| Build (full) | `npm run build` |

### Notes

- There is no test framework configured. The only validation is `npm run typecheck` (runs `tsc --noEmit`).
- React is an **optional** peer dependency. The vanilla demo (`npm run dev`) works without React installed. The React demo (`npm run dev:react`) requires React, which is pulled in via devDependencies.
- Vite dev server defaults to port 5173 (vanilla demo) and port 3001 (React demo, configured in `demo/vite.config.demo.ts`).
- When starting with `--host 0.0.0.0`, warnings about unresolved React dependencies in optimizeDeps are harmless for the vanilla demo.
- The `npm run build` command runs two sequential Vite builds: ESM/CJS library + UMD bundle. Output goes to `dist/`.
