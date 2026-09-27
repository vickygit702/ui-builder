# Core Playground & Builder UX Enhancements

## What was done

- **Core Module Playground Master-Detail Layout (`/core/button`, `/core`)**:
  - Transformed `/core/button` from a static single-component view into a master-detail catalog.
  - Added left `<aside>` navigation (`CoreSidebar.tsx`) listing all core components (Button, Header, Sidebar, Footer) with icons, variant counts, and PostgreSQL database synchronization indicators.
  - Added right-hand detail pane (`CoreVariantSection.tsx`) rendering live interactive previews for all working draft variants of whichever component is selected.
  - Created `useCoreCatalog.ts` hook adhering to strict data fetching rules (custom hook wrapping `api.ts`).
  - Created `coreRegistry.tsx` defining metadata, variants, and live preview renderers for Button, Header, Sidebar, and Footer.
  - Added individual "Finalize & Save {Component} to Backend" action wired to `POST /api/core/components`.
  - Added route redirect from `/core` to `/core/button`.
- **Collapsible Builder Sidebars (`/users/builder`)**:
  - Made `RouteManager` collapsible with smooth expand/collapse chevron toggles and a compact `w-12` vertical rail with page count indicator.
  - Made `ComponentSidebar` panel collapsible with expand/collapse chevron toggles and compact `w-12` rail.
  - Added `ComponentCategoryAccordion.tsx` allowing users to collapse/expand individual component categories (Buttons, Headers, Sidebars, Footers) inside the component palette.
- **Plain Area Canvas Surface**:
  - Removed "Blank Canvas" static title and subtitle headers from `CanvasSectionDropZone.tsx` when rendering the canvas stage.
  - Updated `createEmptyCanvasSection` in `initialRoutes.ts` and `handleAddRoute` in `useWebsiteBuilder.ts` to initialize routes with plain empty titles, creating an unobstructed canvas.

## Where it lives

- Frontend:
  - `src/modules/Core/hooks/useCoreCatalog.ts`
  - `src/modules/Core/coreRegistry.tsx`
  - `src/modules/Core/components/CoreSidebar.tsx`
  - `src/modules/Core/components/CoreVariantSection.tsx`
  - `src/modules/Core/button/ButtonPlayground.tsx`
  - `src/modules/Users/builder/components/RouteManager.tsx`
  - `src/modules/Users/builder/components/ComponentSidebar.tsx`
  - `src/modules/Users/builder/components/ComponentCategoryAccordion.tsx`
  - `src/modules/Users/builder/components/SidebarDraggableCard.tsx`
  - `src/modules/Users/builder/components/CanvasSectionDropZone.tsx`
  - `src/modules/Users/builder/utils/initialRoutes.ts`
  - `src/modules/Users/builder/hooks/useWebsiteBuilder.ts`
  - `src/modules/routings/AppRoutes.tsx`

## Notes / follow-ups

- All components remain well under the 300-line limit (strict adherence to `AGENTS.md`).
- Handlers are named functions without inline handler logic.
- Both frontend and backend build cleanly with zero errors (`tsc -b && vite build` and `tsc -p tsconfig.json`).
