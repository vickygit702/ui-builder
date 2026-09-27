# User Website Builder

## What was done

- **Core Components Expansion (Button, Header, Sidebar, Footer)**:
  - Created first-party Core components under `frontend/src/modules/Core/`:
    - `Header` (`Header.tsx`, `header.variants.ts`)
    - `Sidebar` (`Sidebar.tsx`, `sidebar.variants.ts`)
    - `Footer` (`Footer.tsx`, `footer.variants.ts`)
    - `Button` (`Button.tsx`, `button.variants.ts`)
  - Created migration `004_seed_core_components.sql` persisting all 4 core components and their style variants to `core.component` and `core.component_variant` in PostgreSQL.
  - Updated `useComponentCatalog` and `ComponentSidebar` to fetch, display, and allow drag-and-drop of all 4 components with category tab filtering (All, Buttons, Layout).
  - Started canvas in a clean, blank state so users assemble layouts from scratch.

- **User Authentication (Single User Auth)**:
  - Created migration `005_create_users_schema.sql` creating the `users` schema and `users.account` table, seeded with default user credentials (`user@gmail.com` / `password123`).
  - Added backend auth endpoint `POST /api/users/auth/login` (`auth.routes.ts`, `auth.controller.ts`, `auth.service.ts`).
  - Added frontend `useAuth` hook, `LoginPage.tsx` with one-click demo auto-fill, and `ProtectedRoute.tsx` guarding the `/users/builder` route.
  - Added user session badge and logout button in `BuilderHeader`.

- **Database Layout Persistence**:
  - Created `users.project`, `users.page`, and `users.component_instance` tables in PostgreSQL.
  - Component instances on canvas link directly to `core_component_id` and `core_variant_id` from the `core` schema.
  - Added backend endpoints `GET /api/users/project` and `POST /api/users/project/save`.
  - Added `useProjectPersistence` hook and "Save to DB" action in `BuilderHeader`.

- **React Project ZIP Export**:
  - Implemented standalone production-level React + TypeScript + Vite project generation via JSZip in `exportGenerator.ts`.
  - Packages complete folder structure (`package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `index.html`, `src/App.tsx`, `src/pages/`, `src/components/Core/`).
  - First-party Core components (Button, Header, Sidebar, Footer) are copied into the exported project with zero runtime dependency on the builder platform.
  - Added backend endpoint `POST /api/users/project/export` tracking exports in `users.project_export` and streaming the binary ZIP file.
  - Added "Export ZIP" button in `BuilderHeader` that triggers browser download.

## Where it lives

- **Backend**:
  - `src/db/migration/004_seed_core_components.sql`
  - `src/db/migration/005_create_users_schema.sql`
  - `src/db/schema.ts`
  - `src/shared/types/user.types.ts`
  - `src/modules/users/auth/` (`auth.routes.ts`, `auth.controller.ts`, `auth.service.ts`)
  - `src/modules/users/project/` (`project.routes.ts`, `project.controller.ts`, `project.service.ts`, `exportGenerator.ts`)
  - `src/routing/index.ts`
- **Frontend**:
  - `src/modules/Core/header/` (`Header.tsx`, `header.variants.ts`)
  - `src/modules/Core/sidebar/` (`Sidebar.tsx`, `sidebar.variants.ts`)
  - `src/modules/Core/footer/` (`Footer.tsx`, `footer.variants.ts`)
  - `src/modules/Users/auth/` (`useAuth.ts`, `LoginPage.tsx`, `ProtectedRoute.tsx`)
  - `src/modules/Users/builder/hooks/` (`useComponentCatalog.ts`, `useWebsiteBuilder.ts`, `useProjectPersistence.ts`)
  - `src/modules/Users/builder/components/` (`ComponentSidebar.tsx`, `DraggableCanvasButton.tsx`, `CanvasView.tsx`, `CanvasSectionDropZone.tsx`, `BuilderHeader.tsx`, `ButtonPropertiesPanel.tsx`, `RouteManager.tsx`, `WebsitePreviewBar.tsx`)
  - `src/modules/Users/builder/WebsiteBuilder.tsx`
  - `src/modules/routings/AppRoutes.tsx`
  - `src/modules/types/builder.types.ts`

## Notes / follow-ups

- Follows SRS requirements:
  - FR-1: Base Core Component Library (Button, Header, Sidebar, Footer)
  - FR-2: Visual layout canvas with pixel-perfect coordinates
  - FR-3: Multi-page navigation panel
  - FR-4: Property settings panel
  - FR-6: Prototype interaction binding
  - FR-7: Responsive Preview Mode
  - FR-8: Standalone production React project export as ZIP
  - FR-11: User authentication
- Export generator configured with `future={{ v7_relativeSplatPath: true, v7_startTransition: true }}` on `<BrowserRouter>` to silence React Router v7 deprecation warnings and prevent infinite redirect loops on root `/`.
