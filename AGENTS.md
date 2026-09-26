# AGENTS.md — UI Builder Platform

Standing instructions for any agent (Antigravity, or any other AGENTS.md-compatible
tool) working in this repo. Read this fully before starting any task.

## 1. Tech Stack

- **Frontend:** React + TypeScript (Vite), Tailwind CSS, React Router, `lucide-react` for icons. No third-party component libraries — all UI primitives are built in-house under `modules/Core`.
- **Backend:** Node.js + Express + TypeScript, PostgreSQL (raw `pg`, no ORM yet). Core-library tables live under the Postgres `core` schema.
- **Package manager:** npm.

## 2. Architecture — Where Things Go

Both FE and BE are split into the same three domains. Never mix them:

```
core    -> reusable building blocks (button, dialog, card, table, ...) — no business/user data
Admin   -> admin-only features (auth, subscription config, user management)
users   -> end-user features (auth, prototype, user's own components/projects)
```

**Backend module folder** (`src/modules/<domain>/<feature>/`):
- `*.routes.ts` — Express route definitions only, no logic
- `*.controller.ts` — request/response handling, calls the service, no SQL
- `*.service.ts` — business logic + SQL queries (via `shared/utils/db.ts` pool)
- Shared types go in `shared/types/`, never redefined per module
- New tables/migrations go in `db/migration/NNN_description.sql`, and `db/schema.ts` must be updated by hand to match

**Frontend module folder** (`src/modules/<Domain>/<feature>/`):
- One component = one file. A page-level component composes smaller pieces, it does not contain all the logic itself.
- Data fetching NEVER happens inline in a component — see Section 4.
- Shared types in `modules/types/`, shared fetch helper in `modules/utils/api.ts`.

Before adding a new component or endpoint, check whether something equivalent already exists under `core` — never duplicate a core primitive inside `Admin` or `users`.

## 3. Code Rules (non-negotiable)

- **TypeScript:** `strict` mode stays on. No `any` unless truly unavoidable (and then with a one-line comment why). Every function's params/return are typed. Prefer `interface` for object shapes, `type` for unions/aliases.
- **React:** functional components + hooks only. No class components.
- **Component size:** keep components under **300 lines**. If a component grows past that, split it (extract a sub-component, extract a hook, extract a helper) rather than letting it grow.
- **No inline handlers in JSX.** Don't write logic directly inside `onClick={() => { ... }}` etc. Define a named handler function (in the component body, or in a hook if it involves data/state logic) and pass a reference: `onClick={handleSave}`. A one-line pass-through (`onClick={() => onSelect(item.id)}`) is the only acceptable inline case.
- **All API calls go through a custom hook**, never a raw `fetch`/`axios` call inside a component. Pattern: `use<Thing>()` in a `hooks/` folder (module-local if only used there, `modules/utils/hooks/` if shared) that wraps `modules/utils/api.ts` and returns `{ data, loading, error, refetch/mutate }`. Components only consume the hook's return value.
- **Optimization:** memoize expensive derived values (`useMemo`) and stable callbacks passed to children (`useCallback`) where it actually matters (child re-renders, large lists) — don't wrap everything reflexively. Code-split routes with `React.lazy` as the page count grows.
- **Reusability:** if the same logic appears twice, extract it (hook, util function, or shared component) before a third copy is written.
- **Clean code:** descriptive names, single responsibility per function/component, no leftover `console.log`/commented-out code in committed files, no dead files.

## 4. Data Fetching Pattern (reference)

```
modules/utils/api.ts          -> low-level fetch wrapper (already exists)
modules/<Domain>/<feature>/
  hooks/
    useComponents.ts          -> calls api.ts, exposes { data, loading, error, refetch }
  <Feature>Playground.tsx     -> calls useComponents(), renders only
```

Components should read like: call the hook, render based on `{ data, loading, error }`. No `fetch(` or `await api.` inside a `.tsx` component file.

## 5. FRD / Scope Reference

The functional scope to build toward is the SRS document already produced for this project (component library → canvas → routing → prototype bindings → preview → export). Current phase scope is intentionally narrow — **Core module, one component at a time, no auth yet.** Do not build ahead into Admin/Users/export unless explicitly asked for in the task.

## 6. Agent Working Style

- **Minimal exploration:** don't grep/search the whole repo to "get context." Open only the files directly relevant to the task (the module folder in question, its shared types, its routes). If genuinely unsure which file something belongs in, ask rather than searching broadly.
- **Ask when ambiguous:** if a task doesn't specify which module, which table, or which variant of an existing pattern to follow, ask one short clarifying question instead of guessing.
- **Token-efficient:** prefer small, targeted edits over rewriting whole files. Don't re-explain the whole architecture back in every response — assume this file is already known.
- **No test files.** Do not generate `*.test.ts(x)` or spec files. After finishing a task, just confirm the project still builds cleanly:
  - Backend: `npm run build` (tsc) with zero errors
  - Frontend: `npm run build` (tsc + vite build) with zero errors
  If the build fails, fix it before considering the task done.

## 7. Documentation After Every Task

After completing each prompt/task, add one file: `docs/<feature-name>.md` (kebab-case name matching the feature). Contents:

```markdown
# <Feature Name>

## What was done
- Bullet list of concrete changes (files added/changed, endpoints added, tables changed)

## Where it lives
- Backend: <paths>
- Frontend: <paths>

## Notes / follow-ups
- Anything deliberately deferred or worth knowing next time this feature is touched
```

Keep it short — this is a changelog for future-you/future-agents, not a full spec.
