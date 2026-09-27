import { useState, useRef, DragEvent } from "react";
import { PlusCircle } from "lucide-react";
import {
  CanvasSection,
  DraggedItemPayload,
  ElementPosition,
} from "../../../types/builder.types";
import DraggableCanvasButton from "./DraggableCanvasButton";
import CanvasHeaderSlot from "./CanvasHeaderSlot";
import CanvasSidebarSlot from "./CanvasSidebarSlot";
import CanvasFooterSlot from "./CanvasFooterSlot";

interface CanvasSectionDropZoneProps {
  section: CanvasSection;
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
}

export default function CanvasSectionDropZone({
  section,
  previewMode,
  selectedButtonId,
  onDropButton,
  onMoveButton,
  onSelectButton,
  onRemoveButton,
  onPreviewNavigate,
}: CanvasSectionDropZoneProps) {
  const [isOver, setIsOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentStageRef = useRef<HTMLDivElement>(null);

  const headerComponent = section.buttons.find(
    (b) => b.componentType === "header",
  );
  const sidebarComponent = section.buttons.find(
    (b) => b.componentType === "sidebar",
  );
  const footerComponent = section.buttons.find(
    (b) => b.componentType === "footer",
  );
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

  // Dynamic content height so buttons are never cropped and footer moves down
  const minContentHeight = 520;
  const contentHeight = contentComponents.reduce(
    (max, b) => Math.max(max, (b.position?.y ?? 0) + 80),
    minContentHeight,
  );

  return (
    <section
      ref={containerRef}
      onDragOver={!previewMode ? handleDragOver : undefined}
      onDragLeave={!previewMode ? handleDragLeave : undefined}
      onDrop={!previewMode ? handleDrop : undefined}
      className={`relative transition-all select-none w-full min-h-[calc(100vh-140px)] flex flex-col justify-between bg-white ${
        !previewMode && isOver ? "ring-2 ring-indigo-500 ring-offset-1" : ""
      }`}
    >
      {/* 1. TOP HEADER (Takes natural height, full width) */}
      {headerComponent && (
        <CanvasHeaderSlot
          component={headerComponent}
          sectionId={section.id}
          previewMode={previewMode}
          isSelected={selectedButtonId === headerComponent.id}
          onSelect={onSelectButton}
          onRemove={onRemoveButton}
        />
      )}

      {/* 2. BODY AREA: Contains Sidebar (left) and Content Canvas (right) */}
      <div className="flex-1 flex w-full relative min-h-[500px]">
        {/* SIDEBAR: Fixed for full height when scrolling, does not move */}
        {sidebarComponent && (
          <CanvasSidebarSlot
            component={sidebarComponent}
            sectionId={section.id}
            previewMode={previewMode}
            isSelected={selectedButtonId === sidebarComponent.id}
            onSelect={onSelectButton}
            onRemove={onRemoveButton}
          />
        )}

        {/* CONTENT CANVAS AREA: Takes remaining width, full height, scrolls */}
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
            />
          ))}

          {!previewMode && contentComponents.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-xs pointer-events-none p-8">
              <PlusCircle className="w-6 h-6 mb-2 text-slate-300" />
              <span className="font-semibold text-slate-600 text-sm">
                Spacious Content Canvas Area
              </span>
              <span className="text-[11px] text-slate-400 mt-1 text-center max-w-sm">
                Drop buttons and feature blocks here. Expands dynamically as you
                add items.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. FOOTER: Pushed to bottom of page (mt-auto), never overlaps content! */}
      {footerComponent && (
        <CanvasFooterSlot
          component={footerComponent}
          sectionId={section.id}
          previewMode={previewMode}
          isSelected={selectedButtonId === footerComponent.id}
          onSelect={onSelectButton}
          onRemove={onRemoveButton}
        />
      )}
    </section>
  );
}
