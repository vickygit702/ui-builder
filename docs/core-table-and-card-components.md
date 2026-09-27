# Core Table and Card Components

## What was done

- **Postgres Database Migration (`007_seed_table_and_card_components.sql`)**:
  - Seeded `table` component in `core.components` with 4 variants: `standard`, `striped`, `bordered`, `compact`.
  - Seeded `card` component in `core.components` with 4 variants: `standard`, `elevated`, `outlined`, `dark`.
- **Core UI Primitives (`frontend/src/modules/Core/`)**:
  - `table/Table.tsx` & `table/table.variants.ts`: Table component supporting columns, rows, header alignment per column (left/center/right), body alignment per column (left/center/right), and toggleable footer summary row.
  - `card/Card.tsx`, `card/CardGrid.tsx` & `card/card.variants.ts`: Card and CardGrid components supporting basic shadow (`shadow-md`), configurable corner radius (`none` to `2xl`), height slider, flexible width, and configurable gap (`gap-2` to `gap-8`).
  - Registered both in `coreRegistry.tsx` for core component catalog rendering.
- **UI Builder Integration (`frontend/src/modules/Users/builder/`)**:
  - `types/builder.types.ts`: Extended `CoreComponentType` with `"table" | "card"`, added `TableColumnConfig`, `TableRowConfig`, `CardItemConfig`, and corresponding properties to `CanvasComponentInstance` and `DraggedItemPayload`.
  - `utils/builderHelpers.ts`: Updated `createNewComponentInstance` to initialize default column, row, alignment, footer, card count, gap, and height configurations.
  - `hooks/useComponentCatalog.ts`: Added extraction and memoization for `tableVariants` and `cardVariants`.
  - `components/ComponentSidebar.tsx` & `components/CardAndTableAccordions.tsx`: Added pre-drag card count selector (1, 2, 3, 4 cards) so user selects the count before dragging, plus draggable preview cards for Card Grid and Data Tables.
  - `components/DraggableCanvasButton.tsx`: Added canvas rendering for `table` and `card` instances with user-configured width.
  - `components/inspector/TablePropertiesForm.tsx` & `components/inspector/TableColumnItem.tsx`: Inspector allowing column-by-column header entry, individual header and body alignment selectors (left, center, right), footer toggle and footer text per column, row addition/removal, and width slider.
  - `components/inspector/CardPropertiesForm.tsx`: Inspector allowing card count adjustment, gap spacing, corner radius, card height slider, width slider, and per-card title, subtitle, and badge customization.
  - `components/ButtonPropertiesPanel.tsx`: Wired inspector forms for Table and Card components.
  - `hooks/useProjectPersistence.ts`: Ensured table configuration (`tableColumns`, `tableRows`, `tableShowFooter`) and card configuration (`cardCount`, `cardGap`, `cardCorner`, `cardHeight`, `cardItems`) are serialized to the database on save and restored upon loading.
- **Export System (`backend/src/modules/users/project/`)**:
  - `exportTemplates.ts`: Added `CORE_TABLE_TEMPLATE` and `CORE_CARD_TEMPLATE` (including `CardGrid`).
  - `exportGenerator.ts`: Generates `src/components/Core/Table.tsx` and `src/components/Core/Card.tsx` inside the exported ZIP, renders `<Table ... />` and `<CardGrid ... />` components within exported page components, and selectively imports only the components actually used on each page.

## Where it lives

- Backend:
  - `backend/src/db/migration/007_seed_table_and_card_components.sql`
  - `backend/src/modules/users/project/exportTemplates.ts`
  - `backend/src/modules/users/project/exportGenerator.ts`
- Frontend:
  - `frontend/src/modules/Core/table/Table.tsx`
  - `frontend/src/modules/Core/table/table.variants.ts`
  - `frontend/src/modules/Core/card/Card.tsx`
  - `frontend/src/modules/Core/card/CardGrid.tsx`
  - `frontend/src/modules/Core/card/card.variants.ts`
  - `frontend/src/modules/Core/coreRegistry.tsx`
  - `frontend/src/modules/types/builder.types.ts`
  - `frontend/src/modules/Users/builder/WebsiteBuilder.tsx`
  - `frontend/src/modules/Users/builder/components/DraggableCanvasButton.tsx`
  - `frontend/src/modules/Users/builder/components/ComponentSidebar.tsx`
  - `frontend/src/modules/Users/builder/components/CardAndTableAccordions.tsx`
  - `frontend/src/modules/Users/builder/components/ButtonPropertiesPanel.tsx`
  - `frontend/src/modules/Users/builder/components/inspector/TablePropertiesForm.tsx`
  - `frontend/src/modules/Users/builder/components/inspector/TableColumnItem.tsx`
  - `frontend/src/modules/Users/builder/components/inspector/CardPropertiesForm.tsx`
  - `frontend/src/modules/Users/builder/hooks/useComponentCatalog.ts`
  - `frontend/src/modules/Users/builder/hooks/useProjectPersistence.ts`
  - `frontend/src/modules/Users/builder/utils/builderHelpers.ts`

## Notes / follow-ups

- Pre-drag card count is selected via the sidebar (1 to 4 cards) and persists onto the canvas instance; users can still dynamically increase or decrease the card count after placing it using the properties inspector.
- All components strictly adhere to the <300 line limit specified in `AGENTS.md`.
- Both frontend and backend compile and build with 0 errors.
