import { useState, useRef, DragEvent } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  CanvasSection,
  DraggedItemPayload,
  ElementPosition,
  CanvasComponentInstance,
} from "../../../types/builder.types";
import DraggableCanvasButton from "./DraggableCanvasButton";

interface CanvasSectionDropZoneProps {
  section: CanvasSection;
  sectionIndex: number;
  totalSections: number;
  previewMode: boolean;
  selectedButtonId?: string;
  onDropButton: (sectionId: string, payload: DraggedItemPayload) => void;
  onMoveButton: (
    sectionId: string,
    buttonId: string,
    position: ElementPosition,
  ) => void;
  onSelectButton: (sectionId: string, buttonId: string) => void;
  onDeleteSection?: (sectionId: string) => void;
  onRemoveButton?: (sectionId: string, buttonId: string) => void;
  onPreviewNavigate: (path: string) => void;
  onOpenDialog?: (button: CanvasComponentInstance) => void;
}

function getComponentEstimatedHeight(comp: CanvasComponentInstance): number {
  if (comp.height && comp.height > 0) return comp.height;
  if (comp.componentType === "card") return (comp.cardHeight || 240) + 120;
  if (comp.componentType === "table") {
    const rowCount = comp.tableRows?.length || 3;
    const footerAdd = comp.tableShowFooter ? 45 : 0;
    return Math.max(240, rowCount * 45 + 90 + footerAdd);
  }
  if (comp.componentType === "sidebar") return 360;
  if (comp.componentType === "header" || comp.componentType === "footer") {
    return 80;
  }
  return 55;
}

export default function CanvasSectionDropZone({
  section,
  sectionIndex,
  totalSections,
  previewMode,
  selectedButtonId,
  onDropButton,
  onMoveButton,
  onSelectButton,
  onDeleteSection,
  onPreviewNavigate,
  onOpenDialog,
}: CanvasSectionDropZoneProps) {
  const [isOver, setIsOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentStageRef = useRef<HTMLDivElement>(null);

  const contentComponents = section.buttons.filter(
    (b) =>
      b.componentType !== "header" &&
      b.componentType !== "sidebar" &&
      b.componentType !== "footer",
  );

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    if (!isOver) setIsOver(true);
  }

  function handleDragLeave() {
    setIsOver(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsOver(false);
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;

    try {
      const payload = JSON.parse(data) as DraggedItemPayload;
      const isHeader = payload.componentType === "header";
      const isSidebar = payload.componentType === "sidebar";
      const isFooter = payload.componentType === "footer";

      if (isHeader || isSidebar || isFooter) {
        onDropButton(section.id, {
          ...payload,
          position: { x: 0, y: 0 },
        });
        return;
      }

      // Calculate position relative to the content stage
      const rect = contentStageRef.current?.getBoundingClientRect();
      const dropX = rect
        ? Math.max(16, Math.round(e.clientX - rect.left - 45))
        : 50;
      const dropY = rect
        ? Math.max(16, Math.round(e.clientY - rect.top - 18))
        : 50;

      onDropButton(section.id, {
        ...payload,
        position: { x: dropX, y: dropY },
      });
    } catch {
      // Ignore invalid payload
    }
  }

  // Calculate dynamic content height so cards, tables, and buttons never overflow or get cut off
  const maxBottom = contentComponents.reduce((max, b) => {
    const estHeight = getComponentEstimatedHeight(b);
    return Math.max(max, (b.position?.y ?? 0) + estHeight);
  }, 0);

  const baseMin = section.minHeight || 540;
  // Always guarantee at least 380px of clear drop space below the lowest component
  const contentHeight = Math.max(
    baseMin,
    maxBottom > 0 ? maxBottom + 380 : baseMin,
  );

  const showSectionHeader = !previewMode && totalSections > 1;

  return (
    <div
      ref={containerRef}
      onDragOver={!previewMode ? handleDragOver : undefined}
      onDragLeave={!previewMode ? handleDragLeave : undefined}
      onDrop={!previewMode ? handleDrop : undefined}
      className={`relative select-none w-full flex flex-col transition-all ${
        sectionIndex > 0 ? "border-t border-slate-200" : ""
      } ${!previewMode && isOver ? "ring-2 ring-indigo-500 ring-offset-1" : ""}`}
    >
      {/* Section Header Controls when multiple sections exist */}
      {showSectionHeader && (
        <div className="flex items-center justify-between px-4 py-1.5 bg-slate-50/90 border-b border-slate-200 text-xs shrink-0 select-none">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 capitalize text-[11px]">
              {section.name || `${section.type} Section`}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              ({contentComponents.length} items)
            </span>
          </div>
          {totalSections > 1 && onDeleteSection && (
            <button
              type="button"
              onClick={() => onDeleteSection(section.id)}
              className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
              title="Delete Section"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Freeform Content Canvas Area */}
      <div
        ref={contentStageRef}
        style={{ minHeight: `${contentHeight}px` }}
        className={`flex-1 relative transition-all ${
          !previewMode
            ? "bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]"
            : ""
        }`}
      >
        {contentComponents.map((btn) => (
          <DraggableCanvasButton
            key={btn.id}
            button={btn}
            sectionId={section.id}
            previewMode={previewMode}
            isSelected={selectedButtonId === btn.id}
            onSelect={onSelectButton}
            onMove={onMoveButton}
            onPreviewNavigate={onPreviewNavigate}
            onOpenDialog={onOpenDialog}
          />
        ))}

        {!previewMode && contentComponents.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-xs pointer-events-none p-8">
            <PlusCircle className="w-6 h-6 mb-2 text-slate-300" />
            <span className="font-semibold text-slate-600 text-sm">
              {section.title || "Spacious Content Canvas Area"}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 text-center max-w-sm">
              {section.subtitle ||
                "Drop buttons, cards, tables, and dialogs here. Expands dynamically as you scroll and add items."}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
