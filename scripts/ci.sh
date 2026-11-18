#!/usr/bin/env bash
# CI locale: nessun workflow su GitHub, i controlli girano qui (a mano o dal hook pre-push).
# Uso: npm run ci            -> lint, build, test unitari (client e server)
#      CI_E2E=1 npm run ci   -> aggiunge i test Playwright
set -euo pipefail
cd "$(dirname "$0")/.."

step() { printf '\n\033[1m▶ %s\033[0m\n' "$1"; }

step "client: lint"
npm run lint
step "client: build"
npm run build
step "client: test unitari"
npm run test:unit
if [ "${CI_E2E:-0}" = "1" ]; then
  step "client: e2e"
  npm run test:e2e
fi

if [ -d server/node_modules ]; then
  step "server: build"
  (cd server && npm run build)
  step "server: test"
  (cd server && npm test)
  rm -rf server/dist
else
  echo "server/node_modules assente: salto i controlli del server (cd server && npm install)"
fi

printf '\n\033[1;32m✔ CI locale superata\033[0m\n'
