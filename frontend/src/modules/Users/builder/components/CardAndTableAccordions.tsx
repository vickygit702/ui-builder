import { DragEvent } from "react";
import { LayoutGrid, Table as TableIcon } from "lucide-react";
import { CardVariantDef } from "../../../Core/card/card.variants";
import { TableVariantDef } from "../../../Core/table/table.variants";
import {
  DraggedItemPayload,
  CoreComponentType,
} from "../../../types/builder.types";
import ComponentCategoryAccordion from "./ComponentCategoryAccordion";
import SidebarDraggableCard from "./SidebarDraggableCard";

interface CardAndTableAccordionsProps {
  tab: "all" | "buttons" | "layout";
  cardVariants: CardVariantDef[];
  tableVariants: TableVariantDef[];
  cardCountToDrag: number;
  onSetCardCountToDrag: (count: number) => void;
  onDragStart: (
    e: DragEvent<HTMLDivElement>,
    componentType: CoreComponentType,
    variantKey: string,
    label: string,
    extraPayload?: Partial<DraggedItemPayload>,
  ) => void;
}

export default function CardAndTableAccordions({
  tab,
  cardVariants,
  tableVariants,
  cardCountToDrag,
  onSetCardCountToDrag,
  onDragStart,
}: CardAndTableAccordionsProps) {
  return (
    <>
      {/* CARD GRID (shadow-md) */}
      {(tab === "all" || tab === "layout") && cardVariants.length > 0 && (
        <ComponentCategoryAccordion
          title="Card Grid (shadow-md)"
          count={cardVariants.length}
          icon={LayoutGrid}
        >
          {/* Pre-drag Card Count Selector */}
          <div className="mb-2.5 p-2 bg-slate-50 border border-slate-200 rounded-md">
            <div className="text-[10px] font-semibold text-slate-600 mb-1.5 flex items-center justify-between">
              <span>Selected Mode:</span>
              <span className="text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">
                {cardCountToDrag === 0
                  ? "Empty Base Card"
                  : `${cardCountToDrag} ${cardCountToDrag === 1 ? "Card" : "Cards"}`}
              </span>
            </div>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onSetCardCountToDrag(n)}
                  className={`flex-1 py-1 rounded text-[11px] font-semibold border transition-colors ${
                    cardCountToDrag === n
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                  }`}
                  title={
                    n === 0 ? "Empty Base Card (Container)" : `${n} Cards Grid`
                  }
                >
                  {n === 0 ? "Empty" : n}
                </button>
              ))}
            </div>
            {cardCountToDrag === 0 && (
              <p className="text-[10px] text-indigo-600 mt-1.5 font-medium leading-tight">
                • Empty base card for placing tables, cards, or buttons above
                it.
              </p>
            )}
          </div>

          {cardVariants.map((variant) => (
            <SidebarDraggableCard
              key={`card-${variant.key}`}
              componentType="card"
              variantKey={variant.key}
              label={
                cardCountToDrag === 0
                  ? `${variant.label} Base Card`
                  : `${variant.label} Cards`
              }
              badgeText={
                cardCountToDrag === 0 ? "base card" : `${cardCountToDrag} cards`
              }
              onDragStart={(e, ct, vk, lbl) =>
                onDragStart(e, ct, vk, lbl, {
                  cardCount: cardCountToDrag,
                  isBaseCard: cardCountToDrag === 0,
                  width: cardCountToDrag === 0 ? 880 : 820,
                  height: cardCountToDrag === 0 ? 420 : 240,
                })
              }
            >
              <div className="flex items-center gap-1.5 py-1 px-2 bg-white border border-slate-200 rounded text-xs font-medium text-slate-800 shadow-xs">
                <LayoutGrid className="w-3.5 h-3.5 text-indigo-600" />
                <span>
                  {variant.label}{" "}
                  {cardCountToDrag === 0
                    ? "Base Card"
                    : `(${cardCountToDrag} Cards)`}
                </span>
              </div>
            </SidebarDraggableCard>
          ))}
        </ComponentCategoryAccordion>
      )}

      {/* DATA TABLES */}
      {(tab === "all" || tab === "buttons") && tableVariants.length > 0 && (
        <ComponentCategoryAccordion
          title="Data Tables"
          count={tableVariants.length}
          icon={TableIcon}
        >
          {tableVariants.map((variant) => (
            <SidebarDraggableCard
              key={`tbl-${variant.key}`}
              componentType="table"
              variantKey={variant.key}
              label={`${variant.label} Table`}
              badgeText="table"
              onDragStart={onDragStart}
            >
              <div className="flex items-center gap-1.5 py-1 px-2 bg-white border border-slate-200 rounded text-xs font-medium text-slate-800 shadow-xs">
                <TableIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span>{variant.label} Table</span>
              </div>
            </SidebarDraggableCard>
          ))}
        </ComponentCategoryAccordion>
      )}
    </>
  );
}
