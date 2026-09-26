# UI Builder Platform — Current Build

This is the first solid, module-based FE + BE setup. Scope for this phase is
intentionally narrow: **prove the Core module end-to-end with one component
(Button)** before building out the rest of the catalog. Auth and the Admin /
Users modules are deliberately skipped for now.

## What's actually built right now

**Backend**
- Express + TypeScript app, module-based folder structure (`core`, `Admin`, `users`, `shared`, `middleware`, `routing`, `db`)
- PostgreSQL, using a dedicated **`core`** schema (not the public schema) for all core-library tables
- Two tables: `core.component` and `core.component_variant`, with real constraints (unique keys, FK + `ON DELETE CASCADE`, status `CHECK`, indexes)
- One working module: **Core → Button**
  - `POST /api/core/components` — finalize (create or re-save) a component + its variants
  - `GET /api/core/components` — list every *finalized* component
- Centralized error handler + request logger middleware
- `GET /api/health` health check

**Frontend**
- React + Vite + TypeScript, Tailwind, React Router, `lucide-react` icons
- Module-based folder structure (`Core`, `Admin`, `Users`, `utils`, `types`, `routings`)
- One working page: **Core → Button Playground** (`/core/button`)
  - Renders all 5 button variants (primary, secondary, outline, ghost, danger) live from a local `button.variants.ts` definition — this is the "draft" state
  - "Finalize & Save to Backend" button — only this action calls the API and writes to Postgres
  - Lists whatever is currently finalized in the database, fetched on load

**Not built yet (by design, this phase)**
- Admin/Users auth
- Any other core component besides Button (dialog, card, table, etc.)
- Canvas / drag-and-drop
- Prototype bindings, export/zip pipeline

## Why the `core` schema + these two tables

- `core.component` — one row per reusable component (`button`, later `dialog`, `card`, ...). Only rows with `status = 'finalized'` are considered "real" — drafts on the frontend never reach this table.
- `core.component_variant` — one row per variant belonging to a component, `ON DELETE CASCADE`'d to its parent, with a `UNIQUE (component_id, variant_key)` constraint so the same variant key can't be duplicated under one component.

This structure is meant to hold every future core component (not just Button) —
new components just add rows here, no schema change required.

## Backend setup

```bash
cd backend
cp .env.example .env      # adjust DB credentials if needed
npm install

# create the database first (once), e.g.:
#   createdb ui_builder

npm run migrate           # runs db/migration/*.sql in order
npm run dev                # starts on http://localhost:4000
```

Verify it's up: `curl http://localhost:4000/api/health` → `{"status":"ok"}`

## Frontend setup

```bash
cd frontend
cp .env.example .env      # points at the backend API base URL
npm install
npm run dev                # starts on http://localhost:5173
```

Open `http://localhost:5173` — it redirects to `/core/button`.

## Folder structure

```
backend/
  src/
    app.ts / server.ts
    routing/index.ts
    middleware/ (errorHandler, requestLogger)
    modules/
      core/button/ (routes, controller, service)
      Admin/ (placeholder README)
      users/ (placeholder README)
    shared/ (utils/db.ts, types/component.types.ts)
    db/
      schema.ts
      migration/ (001, 002, 003 .sql + run-migrations.ts)

frontend/
  src/
    App.tsx / main.tsx
    modules/
      Core/button/ (Button.tsx, button.variants.ts, ButtonPlayground.tsx)
      Admin/ (placeholder README)
      Users/ (placeholder README)
      utils/api.ts
      types/component.types.ts
      routings/AppRoutes.tsx
```

## Next steps (suggested order)

1. Add a second core component (e.g., Card) the same way Button was done, to confirm the pattern generalizes cleanly.
2. Build the component panel + drag-and-drop canvas that reads from `GET /api/core/components`.
3. Add Users Auth, then Admin Auth.
4. Start on page/route persistence (`projects`, `pages` tables) once more than one component exists.
