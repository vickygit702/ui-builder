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
- **Full-Width Canvas & Auto-Updating Desktop Pixels (`/users/builder`)**:
  - Removed `max-w-5xl` (1024px) constraint from `CanvasSectionDropZone.tsx` and `CanvasView.tsx`; canvas stage now expands to **100% full width** of the desktop screen.
  - Removed `{section.type} • pixel canvas` header badge overlay and controls from canvas sections, creating a clean, unobstructed, edge-to-edge drop surface.
  - Implemented dynamic desktop canvas pixel tracking using `ResizeObserver` in `CanvasView.tsx` with live screen dimensions (`{width}px × {height}px`) that auto-update whenever sidebars are collapsed/expanded or the browser window is resized.
  - Connected live `canvasWidth` to `BuilderHeader.tsx`, showing the active pixel resolution directly on the Desktop viewport switcher (`Desktop • {width}px`) while annotating Tablet and Mobile as future targets (`(future)`).
  - Updated `DraggableCanvasButton.tsx` so Header and Footer components automatically span 100% full width (`left: 0, right: 0, width: 100%`) across the canvas with vertical Y-axis drag positioning.

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
