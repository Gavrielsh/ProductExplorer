# Repo Audit — How to Run

This audit checks:
1. Unused or missing dependencies (`depcheck`)
2. Unused exports/files (`ts-prune`)
3. Circular deps and orphans (`madge`)
4. Unused vars/imports via ESLint (if config exists)

## Prerequisites
- Node.js >= 18
- From your project root (where `package.json` lives)

## Run
```bash
node audit.mjs --src src --tsconfig tsconfig.json
# or simply
node audit.mjs
```

The script will auto-install necessary CLIs via `npx` on first run.
When finished, it prints a one-line summary and writes **AUDIT_REPORT.md** with details.

> Tip (React Native / TypeScript):
> - If you have type-only imports, ensure they use `import type` to avoid false positives in dep checkers.
> - For test files, the script ignores `__tests__` and `*.test.*|*.spec.*` by default in ts-prune.
