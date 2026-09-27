# Core Playground & Builder UX Enhancements

## What was done

- **Core Module Playground Full-Screen Master-Detail Layout (`/core/button`, `/core`)**:
  - Transformed `/core/button` to use the **100% full screen width** (`w-screen h-screen overflow-hidden`).
  - Docked the left component navigation (`CoreSidebar.tsx`) flush against the left screen edge with reduced width (`w-60`), removed `v1` badge, and clean component list.
  - Merged the right-hand inspection view into a **single unified card** (`CoreVariantSection.tsx`), removing separate redundant cards, descriptions, and the "working draft" tag.
  - Added live status pill (`draft` / `finalized` based on `component.status`) and variant count in the single card header.
  - Removed the "Open Website Builder" and "Finalize & Save..." buttons from the variant section for a cleaner UI.
  - Removed the bottom PostgreSQL Core Catalog database overview cards.
  - Added route redirect from `/core` to `/core/button`.
- **Collapsible Builder Sidebars (`/users/builder`)**:
  - Made `RouteManager` collapsible with smooth expand/collapse chevron toggles and a compact `w-12` vertical rail with page count indicator.
  - Made `ComponentSidebar` panel collapsible with expand/collapse chevron toggles and compact `w-12` rail (`ComponentSidebarRail.tsx`).
  - Added `ComponentCategoryAccordion.tsx` allowing users to collapse/expand individual component categories (Buttons, Headers, Sidebars, Footers, Dialogs) inside the component palette.
- **Full-Width Canvas & Auto-Updating Desktop Pixels (`/users/builder`)**:
  - Removed `max-w-5xl` (1024px) constraint from `CanvasSectionDropZone.tsx` and `CanvasView.tsx`; canvas stage now expands to **100% full width** of the desktop screen.
  - Removed `{section.type} • pixel canvas` header badge overlay and controls from canvas sections, creating a clean, unobstructed, edge-to-edge drop surface.
  - Implemented dynamic desktop canvas pixel tracking using `ResizeObserver` in `CanvasView.tsx` with live screen dimensions (`{width}px × {height}px`) that auto-update whenever sidebars are collapsed/expanded or the browser window is resized.
  - Connected live `canvasWidth` to `BuilderHeader.tsx`, showing the active pixel resolution directly on the Desktop viewport switcher (`Desktop • {width}px`) while annotating Tablet and Mobile as future targets (`(future)`).
- **Spacious Full-Height Layout with Structural Slots (`/users/builder`)**:
  - Redesigned `CanvasSectionDropZone.tsx` to adopt a flex column full-height layout (`min-h-[calc(100vh-140px)] flex flex-col justify-between`).
  - **Header Slot** (`CanvasHeaderSlot.tsx`): Positioned at the top across full width (`shrink-0`), taking natural height with selection ring, variant badge, and delete button.
  - **Sidebar Slot** (`CanvasSidebarSlot.tsx`): Docked to the left edge inside the body flex row with `sticky top-0 self-stretch shrink-0`. Remains fixed for full height when the content area scrolls.
  - **Content Canvas Area**: Takes all remaining width and full height in the center (`flex-1 relative min-h-[500px]`), featuring dynamic height calculation (`contentHeight`) so dropping buttons expands the content area naturally without any truncation.
  - **Footer Slot** (`CanvasFooterSlot.tsx`): Positioned at the bottom (`mt-auto shrink-0 w-full`). As buttons and content blocks are added, the footer moves down automatically and **never overlaps** with buttons, sidebar, or content.
  - Removed confusing duplicate stacked bottom sections and duplicate section-add footer bar in `CanvasView.tsx`.
- **Core Dialog Component & Full-Page Blurred Modal Call-to-Action**:
  - **New Core Dialog Primitive** (`src/modules/Core/dialog/Dialog.tsx` & `dialog.variants.ts`):
    - Reusable Core component with Dialog Header (title, close 'X' button), dynamic Content Area, and Dialog Footer (actions/confirm buttons).
    - Sizes: `compact` (420px), `medium` (640px default), `large` (900px), and `full` (95vw × 90vh full screen).
    - Backdrop: Full page backdrop blur (`bg-slate-950/45 backdrop-blur-sm`), leaving the dialog card itself crisp, solid white, and unblurred.
    - Added database migration (`006_seed_dialog_component.sql`) and registered in `CORE_COMPONENTS_REGISTRY`.
  - **Call to Action Button Modal Trigger**:
    - Added `"dialog"` action type to buttons (`builder.types.ts` & `ButtonActionSettings.tsx`).
    - Configurable dialog title, size, dynamic content text, and action label in inspector.
    - Clicking the button on canvas or preview immediately launches the full-page blurred modal dialog.
  - **React Project Export Synchronization** (`exportGenerator.ts` & `exportTemplates.ts`):
    - Exports `src/components/Core/Dialog.tsx` in exported ZIP and wires modal state to exported page components.

## Where it lives

- Frontend:
  - `src/modules/Core/hooks/useCoreCatalog.ts`
  - `src/modules/Core/coreRegistry.tsx`
  - `src/modules/Core/components/CoreSidebar.tsx`
  - `src/modules/Core/components/CoreVariantSection.tsx`
  - `src/modules/Core/button/ButtonPlayground.tsx`
  - `src/modules/Core/header/Header.tsx`
  - `src/modules/Core/sidebar/Sidebar.tsx`
  - `src/modules/Core/footer/Footer.tsx`
  - `src/modules/Core/dialog/Dialog.tsx`
  - `src/modules/Core/dialog/dialog.variants.ts`
  - `src/modules/Users/builder/WebsiteBuilder.tsx`
  - `src/modules/Users/builder/components/RouteManager.tsx`
  - `src/modules/Users/builder/components/ComponentSidebar.tsx`
  - `src/modules/Users/builder/components/ComponentSidebarRail.tsx`
  - `src/modules/Users/builder/components/ComponentCategoryAccordion.tsx`
  - `src/modules/Users/builder/components/CanvasView.tsx`
  - `src/modules/Users/builder/components/CanvasSectionDropZone.tsx`
  - `src/modules/Users/builder/components/CanvasHeaderSlot.tsx`
  - `src/modules/Users/builder/components/CanvasSidebarSlot.tsx`
  - `src/modules/Users/builder/components/CanvasFooterSlot.tsx`
  - `src/modules/Users/builder/components/DraggableCanvasButton.tsx`
  - `src/modules/Users/builder/components/ButtonPropertiesPanel.tsx`
  - `src/modules/Users/builder/components/inspector/HeaderPropertiesForm.tsx`
  - `src/modules/Users/builder/components/inspector/SidebarPropertiesForm.tsx`
  - `src/modules/Users/builder/components/inspector/FooterPropertiesForm.tsx`
  - `src/modules/Users/builder/components/inspector/ButtonPropertiesForm.tsx`
  - `src/modules/Users/builder/components/inspector/ButtonActionSettings.tsx`
  - `src/modules/Users/builder/utils/builderHelpers.ts`
  - `src/modules/Users/builder/utils/initialRoutes.ts`
  - `src/modules/Users/builder/hooks/useWebsiteBuilder.ts`
  - `src/modules/Users/builder/hooks/useComponentCatalog.ts`
  - `src/modules/Users/builder/hooks/useProjectPersistence.ts`
- Backend:
  - `src/db/migration/006_seed_dialog_component.sql`
  - `src/modules/users/project/exportGenerator.ts`
  - `src/modules/users/project/exportTemplates.ts`

## Notes / follow-ups

- All components remain well under the 300-line limit (strict adherence to `AGENTS.md`).
- Handlers are named functions without inline handler logic.
- Both frontend and backend build cleanly with zero errors (`tsc -b && vite build` and `tsc -p tsconfig.json`).
