# Empty Base Card Component

## What was done

- **Core EmptyCard Primitive**: Created `EmptyCard.tsx` under `modules/Core/card/` with `shadow-md`, custom corner radiuses (`none`, `sm`, `md`, `lg`, `xl`, `2xl`), theme variants (`standard`, `elevated`, `outlined`, `dark`), flexible width/height props, optional container header label, and children slot.
- **Sidebar Pre-Drag Card Mode**: Added `0` ("Empty Base Card") mode to the pre-drag count selector in `CardAndTableAccordions.tsx` (`[0, 1, 2, 3, 4]`). Dragging with mode `0` automatically initializes an empty base card container (default `880px × 420px`).
- **Canvas Multi-Layer Stacking**: Configured `DraggableCanvasButton.tsx` to set base cards to `z-0` (or `z-[2]` when selected) while regular cards, tables, and buttons stay at `z-10`. This allows components placed directly on top of base cards to be immediately clickable and draggable without event interception.
- **Inspector Form & Subcomponent Split**: Updated `CardPropertiesForm.tsx` to support switching between base card container mode and 1-4 card grid mode, with independent width slider (up to 1400px), height slider (up to 1000px), container label, and corner radius. Extracted `CardItemsEditor.tsx` to keep all components strictly under the 300-line requirement.
- **Persistence & Export Pipeline**: Updated `useProjectPersistence.ts` to save and restore `isBaseCard` in project JSON definitions. Added `EmptyCard` template to `CORE_CARD_TEMPLATE` in `exportTemplates.ts` and updated `exportGenerator.ts` to generate `EmptyCard` code with appropriate z-index layering (`zIndex: 0` for base cards, `zIndex: 10` for overlaid components).

## Where it lives

- Frontend:
  - `frontend/src/modules/Core/card/EmptyCard.tsx`
  - `frontend/src/modules/Core/card/index.ts`
  - `frontend/src/modules/Users/builder/components/inspector/CardPropertiesForm.tsx`
  - `frontend/src/modules/Users/builder/components/inspector/CardItemsEditor.tsx`
  - `frontend/src/modules/Users/builder/components/DraggableCanvasButton.tsx`
  - `frontend/src/modules/Users/builder/components/CardAndTableAccordions.tsx`
  - `frontend/src/modules/Users/builder/utils/builderHelpers.ts`
  - `frontend/src/modules/Users/builder/hooks/useProjectPersistence.ts`
  - `frontend/src/modules/types/builder.types.ts`
- Backend:
  - `backend/src/modules/users/project/exportTemplates.ts`
  - `backend/src/modules/users/project/exportGenerator.ts`

## Notes / follow-ups

- Base cards can be dragged anywhere in the scrollable content area. Any component placed over them will stay stacked on top thanks to the canvas z-index hierarchy (`z-0` base, `z-10` content items, `z-30` during active drag).
