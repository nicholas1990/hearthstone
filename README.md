# hearthstone

App per costruire mazzi di Hearthstone con le carte dell'API Blizzard. Ionic 9, Angular 22 (standalone), Capacitor 8, per Android e iOS.

Il codice precedente (Ionic 4, Angular 8, Cordova) è nel branch `legacy`, solo come riferimento.

## Comandi

```bash
npm install
npm start          # ng serve
npm run build
npm run lint
npm run test:unit
```

## CI locale

Non c'è nessun workflow su GitHub (le Actions restano disattivate): i controlli girano sulla macchina.

- `npm run ci` — lint, build e test unitari di client e server (`CI_E2E=1 npm run ci` aggiunge Playwright).
- Il hook `.githooks/pre-push` lancia la stessa CI prima di ogni `git push`; `npm install` lo attiva
  (`core.hooksPath`). In emergenza: `git push --no-verify`.
