import { useRef, useState, useEffect } from "react";
import { Plus, Monitor } from "lucide-react";
import {
  UserRoute,
  ViewportMode,
  DraggedItemPayload,
  ElementPosition,
  SectionType,
} from "../../../types/builder.types";
import CanvasSectionDropZone from "./CanvasSectionDropZone";
import WebsitePreviewBar from "./WebsitePreviewBar";

interface CanvasViewProps {
  route: UserRoute;
  allRoutes: UserRoute[];
  previewMode: boolean;
  activePreviewPath: string;
  viewport: ViewportMode;
  selectedButtonId?: string;
  onDropButton: (sectionId: string, payload: DraggedItemPayload) => void;
  onMoveButton: (
    sectionId: string,
    buttonId: string,
    position: ElementPosition,
  ) => void;
  onSelectButton: (sectionId: string, buttonId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddSection: (type: SectionType) => void;
  onPreviewNavigate: (path: string) => void;
  onClosePreview: () => void;
  onCanvasWidthChange?: (width: number) => void;
}

export default function CanvasView({
  route,
  allRoutes,
  previewMode,
  activePreviewPath,
  viewport,
  selectedButtonId,
  onDropButton,
  onMoveButton,
  onSelectButton,
  onDeleteSection,
  onAddSection,
  onPreviewNavigate,
  onClosePreview,
  onCanvasWidthChange,
}: CanvasViewProps) {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [screenPixels, setScreenPixels] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const el = canvasContainerRef.current;
    if (!el) return;

    function handleResize() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      setScreenPixels({ width: w, height: h });
      if (onCanvasWidthChange) {
        onCanvasWidthChange(w);
      }
    }

    handleResize();

    const ro = new ResizeObserver(() => {
      handleResize();
    });
    ro.observe(el);

    window.addEventListener("resize", handleResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [onCanvasWidthChange]);

  function handleAddCtaSection() {
    onAddSection("cta");
  }

  function handleAddFeaturesSection() {
    onAddSection("features");
  }

  const viewportClasses =
    viewport === "mobile"
      ? "max-w-sm my-6 rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden"
      : viewport === "tablet"
        ? "max-w-2xl my-6 rounded-xl border border-slate-300 shadow-xl overflow-hidden"
        : "w-full min-h-full";

  return (
    <div className="flex-1 bg-slate-100 overflow-y-auto flex flex-col items-center">
      {previewMode && (
        <div className="w-full sticky top-0 z-30">
          <WebsitePreviewBar
            currentPath={activePreviewPath}
            routes={allRoutes}
            onNavigate={onPreviewNavigate}
            onClosePreview={onClosePreview}
          />
        </div>
      )}

      {/* Screen Resolution Bar for Desktop (Auto-updating pixels) */}
      {!previewMode && (
        <div className="w-full bg-white border-b border-slate-200 px-4 py-1.5 flex items-center justify-between text-xs select-none shrink-0 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-indigo-600" />
              Desktop Canvas
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold">
              {screenPixels.width > 0
                ? `${screenPixels.width}px`
                : "Full Width"}{" "}
              (auto-updating)
            </span>
            <span className="text-[10px] text-slate-400 font-medium hidden md:inline">
              • Pixels dynamically update when sidebars collapse or window
              resizes
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              100% Full Width
            </span>
          </div>
        </div>
      )}

      <div
        ref={canvasContainerRef}
        className={`transition-all duration-200 bg-white ${viewportClasses}`}
      >
        {route.sections.map((section) => (
          <CanvasSectionDropZone
            key={section.id}
            section={section}
            previewMode={previewMode}
            selectedButtonId={selectedButtonId}
            onDropButton={onDropButton}
            onMoveButton={onMoveButton}
            onSelectButton={onSelectButton}
            onDeleteSection={onDeleteSection}
            onPreviewNavigate={onPreviewNavigate}
          />
        ))}

        {!previewMode && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-center gap-2">
            <span className="text-xs text-slate-500 font-medium">
              Add Section to Route:
            </span>
            <button
              type="button"
              onClick={handleAddCtaSection}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Call to Action
            </button>
            <button
              type="button"
              onClick={handleAddFeaturesSection}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Feature Block
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
