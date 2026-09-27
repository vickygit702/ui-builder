# Scrollable Content Area and Section Elaboration

## What was done

- **Accurate Dynamic Content Area Height Calculation (`CanvasSectionDropZone.tsx`)**:
  - Replaced the hardcoded `(position.y + 80)` calculation with `getComponentEstimatedHeight(comp)`, which accurately computes component bottom edges for cards (`cardHeight + 120px`), tables (`rowCount * 45px + 90px + footer`), sidebars (`360px`), headers/footers (`80px`), and buttons (`55px`).
  - Added a generous `380px` drop zone buffer below the lowest placed component on the canvas (`Math.max(baseMin, maxBottom + 380)`). Components never get cropped or overflow past the bottom of the canvas, and users always have dedicated empty space to drop new elements.
- **Section Elaboration & Expansion Toolbar (`CanvasView.tsx`)**:
  - Restored the section addition and content area elaboration toolbar directly at the bottom of the scrollable content area:
    - `+ Feature Block`: Appends a new feature section block below the existing content.
    - `+ Call to Action`: Appends a new CTA section block below the existing content.
    - `+ Expand Canvas (+400px)`: Directly extends the content canvas height by 400px so users can immediately scroll down into more empty canvas space.
- **Sticky Page Layout Architecture (`CanvasView.tsx`)**:
  - Unified the page hierarchy: Top Header (`CanvasHeaderSlot`), Sticky Left Sidebar (`CanvasSidebarSlot`), and Bottom Footer (`CanvasFooterSlot`) are cleanly separated from the scrollable right Content Column.
  - Multi-section support: All content sections in `route.sections` are rendered sequentially in the right content column, allowing users to build long, scrollable landing pages while keeping the Sidebar anchored on the left.
  - Provided delete section controls when more than one section exists.
- **State & Helper Optimization (`useWebsiteBuilder.ts`, `builderHelpers.ts`)**:
  - Added `handleExpandSectionHeight` to `useWebsiteBuilder` for increasing section minHeight.
  - Extracted `moveCanvasButtonAcrossSections` into `builderHelpers.ts`.
  - Maintained all components and hooks strictly under 300 lines per `AGENTS.md`.

## Where it lives

- Frontend:
  - `frontend/src/modules/Users/builder/components/CanvasSectionDropZone.tsx`
  - `frontend/src/modules/Users/builder/components/CanvasView.tsx`
  - `frontend/src/modules/Users/builder/WebsiteBuilder.tsx`
  - `frontend/src/modules/Users/builder/hooks/useWebsiteBuilder.ts`
  - `frontend/src/modules/Users/builder/utils/builderHelpers.ts`

## Notes / follow-ups

- In preview mode, section banners and elaboration toolbars are automatically hidden, presenting a seamless scrollable web page.
- Both frontend and backend compile and build with zero errors.
