import { useState, useRef, DragEvent } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  CanvasSection,
  DraggedItemPayload,
  ElementPosition,
} from "../../../types/builder.types";
import DraggableCanvasButton from "./DraggableCanvasButton";

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
  onPreviewNavigate: (path: string) => void;
}

export default function CanvasSectionDropZone({
  section,
  previewMode,
  selectedButtonId,
  onDropButton,
  onMoveButton,
  onSelectButton,
  onDeleteSection,
  onPreviewNavigate,
}: CanvasSectionDropZoneProps) {
  const [isOver, setIsOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
      const rect = containerRef.current?.getBoundingClientRect();
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

  function handleDelete() {
    if (onDeleteSection) {
      onDeleteSection(section.id);
    }
  }

  const isCanvas = section.type === "canvas";
  const isNav = section.type === "navbar";
  const isHero = section.type === "hero";
  const isFooter = section.type === "footer";

  // Calculate dynamic canvas surface height so placed buttons are never cropped
  const defaultHeight = isNav ? 70 : isFooter ? 110 : 220;
  const contentHeight = section.buttons.reduce(
    (max, b) => Math.max(max, (b.position?.y ?? 0) + 70),
    defaultHeight,
  );

  return (
    <section
      ref={containerRef}
      onDragOver={!previewMode ? handleDragOver : undefined}
      onDragLeave={!previewMode ? handleDragLeave : undefined}
      onDrop={!previewMode ? handleDrop : undefined}
      className={`relative transition-all select-none ${
        isNav
          ? "py-4 px-6 bg-white border-b border-slate-200"
          : isHero
            ? "pt-10 pb-6 px-8 bg-gradient-to-b from-indigo-50/50 to-white text-center"
            : isFooter
              ? "pt-8 pb-6 px-6 bg-slate-900 text-slate-400 text-center"
              : isCanvas
                ? "p-6 bg-white border-b border-slate-100"
                : "pt-8 pb-6 px-8 bg-white border-b border-slate-100 text-center"
      } ${
        !previewMode && isOver
          ? "ring-2 ring-indigo-500 ring-offset-1 bg-indigo-50/30"
          : !previewMode
            ? "hover:ring-1 hover:ring-slate-300"
            : ""
      }`}
    >
      {/* Section Header Controls */}
      {!previewMode && (
        <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity z-20">
          <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
            {section.type} • pixel canvas
          </span>
          {!isNav && !isFooter && onDeleteSection && (
            <button
              type="button"
              onClick={handleDelete}
              title="Delete Section"
              className="p-1 text-slate-400 hover:text-red-600 rounded"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Static text header (hidden on plain canvas sections) */}
      {!isCanvas &&
        (section.title || section.subtitle) &&
        (isNav ? (
          <div className="flex items-center justify-between max-w-5xl mx-auto mb-2">
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              {section.title}
            </span>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto pointer-events-none mb-4">
            {section.title && (
              <h3
                className={`text-2xl md:text-3xl font-extrabold tracking-tight mb-2 ${
                  isFooter
                    ? "text-slate-300 text-sm font-normal"
                    : "text-slate-900"
                }`}
              >
                {section.title}
              </h3>
            )}
            {section.subtitle && (
              <p className="text-xs md:text-sm text-slate-600 max-w-xl mx-auto">
                {section.subtitle}
              </p>
            )}
          </div>
        ))}

      {/* Freeform Pixel Canvas Stage */}
      <div
        style={{ minHeight: `${contentHeight}px` }}
        className={`relative w-full max-w-5xl mx-auto rounded-lg transition-all ${
          !previewMode
            ? "bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] border border-dashed border-slate-200/80"
            : ""
        }`}
      >
        {section.buttons.map((btn) => (
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

        {!previewMode && section.buttons.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-xs pointer-events-none">
            <PlusCircle className="w-5 h-5 mb-1 text-slate-300" />
            <span>
              Drop buttons anywhere on this canvas grid for pixel-perfect
              placement
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
