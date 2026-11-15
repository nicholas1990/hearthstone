# Server locale

Proxy NestJS per l'API Blizzard: il segreto resta in `.env` e l'app riceve le carte già nel suo formato.

```bash
cp .env.example .env      # poi inserisci BLIZZARD_CLIENT_ID e BLIZZARD_CLIENT_SECRET
npm install
npm run start:dev         # http://localhost:3000
```

- `GET /cards` — carte collezionabili (cache 12 h in memoria e in `.cache/`); `?refresh=1` forza il ricaricamento
- `GET /health` — stato e data dell'ultimo aggiornamento

Sul telefono, nelle Impostazioni dell'app, inserisci `http://<IP-del-Mac>:3000`.
