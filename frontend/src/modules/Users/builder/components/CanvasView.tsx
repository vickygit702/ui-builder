import { useEffect, useRef, useState } from "react";
import { Monitor, Plus, ArrowDownCircle } from "lucide-react";
import {
  UserRoute,
  ViewportMode,
  DraggedItemPayload,
  ElementPosition,
  CanvasComponentInstance,
  SectionType,
} from "../../../types/builder.types";
import CanvasSectionDropZone from "./CanvasSectionDropZone";
import WebsitePreviewBar from "./WebsitePreviewBar";
import CanvasHeaderSlot from "./CanvasHeaderSlot";
import CanvasSidebarSlot from "./CanvasSidebarSlot";
import CanvasFooterSlot from "./CanvasFooterSlot";

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
  onAddSection?: (type: SectionType) => void;
  onDeleteSection: (sectionId: string) => void;
  onExpandSectionHeight?: (
    sectionId: string,
    additionalHeight?: number,
  ) => void;
  onRemoveButton?: (sectionId: string, buttonId: string) => void;
  onPreviewNavigate: (path: string) => void;
  onClosePreview: () => void;
  onCanvasWidthChange?: (width: number) => void;
  onOpenDialog?: (button: CanvasComponentInstance) => void;
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
  onAddSection,
  onDeleteSection,
  onExpandSectionHeight,
  onRemoveButton,
  onPreviewNavigate,
  onClosePreview,
  onCanvasWidthChange,
  onOpenDialog,
}: CanvasViewProps) {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [screenPixels, setScreenPixels] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  // Dynamically update pixel dimensions
  useEffect(() => {
    const el = canvasContainerRef.current;
    if (!el) return;

    function handleResize() {
      if (el) {
        const rect = el.getBoundingClientRect();
        const roundedWidth = Math.round(rect.width);
        const roundedHeight = Math.round(rect.height);
        setScreenPixels({
          width: roundedWidth,
          height: roundedHeight,
        });
        if (onCanvasWidthChange) {
          onCanvasWidthChange(roundedWidth);
        }
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

  const viewportClasses =
    viewport === "mobile"
      ? "max-w-sm my-6 rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden"
      : viewport === "tablet"
        ? "max-w-2xl my-6 rounded-xl border border-slate-300 shadow-xl overflow-hidden"
        : "w-full min-h-full";

  // Locate structural components across all sections of the active route
  const headerSection = route.sections.find((s) =>
    s.buttons.some((b) => b.componentType === "header"),
  );
  const headerComponent = headerSection?.buttons.find(
    (b) => b.componentType === "header",
  );

  const sidebarSection = route.sections.find((s) =>
    s.buttons.some((b) => b.componentType === "sidebar"),
  );
  const sidebarComponent = sidebarSection?.buttons.find(
    (b) => b.componentType === "sidebar",
  );

  const footerSection = route.sections.find((s) =>
    s.buttons.some((b) => b.componentType === "footer"),
  );
  const footerComponent = footerSection?.buttons.find(
    (b) => b.componentType === "footer",
  );

  function handleAddFeaturesSection() {
    if (onAddSection) onAddSection("features");
  }

  function handleAddCtaSection() {
    if (onAddSection) onAddSection("cta");
  }

  function handleExpandLastSection() {
    if (!onExpandSectionHeight) return;
    const targetSectionId =
      route.sections[route.sections.length - 1]?.id || route.sections[0]?.id;
    if (targetSectionId) {
      onExpandSectionHeight(targetSectionId, 400);
    }
  }

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

      {/* Page Canvas Container with Top Header, Left Sidebar, Content Sections, and Bottom Footer */}
      <div
        ref={canvasContainerRef}
        className={`transition-all duration-200 bg-white flex flex-col min-h-screen ${viewportClasses}`}
      >
        {/* 1. TOP HEADER SLOT */}
        {headerComponent && headerSection && (
          <CanvasHeaderSlot
            component={headerComponent}
            sectionId={headerSection.id}
            previewMode={previewMode}
            isSelected={selectedButtonId === headerComponent.id}
            onSelect={onSelectButton}
            onRemove={onRemoveButton}
          />
        )}

        {/* 2. BODY AREA: Sticky Left Sidebar + Scrollable Content Canvas */}
        <div className="flex-1 flex w-full relative min-h-[520px]">
          {sidebarComponent && sidebarSection && (
            <CanvasSidebarSlot
              component={sidebarComponent}
              sectionId={sidebarSection.id}
              previewMode={previewMode}
              isSelected={selectedButtonId === sidebarComponent.id}
              onSelect={onSelectButton}
              onRemove={onRemoveButton}
            />
          )}

          {/* Right Content Column: All Page Sections + Elaboration Toolbar */}
          <div className="flex-1 flex flex-col min-w-0 relative">
            {route.sections.map((section, idx) => (
              <CanvasSectionDropZone
                key={section.id}
                section={section}
                sectionIndex={idx}
                totalSections={route.sections.length}
                previewMode={previewMode}
                selectedButtonId={selectedButtonId}
                onDropButton={onDropButton}
                onMoveButton={onMoveButton}
                onSelectButton={onSelectButton}
                onDeleteSection={onDeleteSection}
                onRemoveButton={onRemoveButton}
                onPreviewNavigate={onPreviewNavigate}
                onOpenDialog={onOpenDialog}
              />
            ))}

            {/* Elaborate Content Area Toolbar */}
            {!previewMode && (
              <div className="p-3.5 bg-slate-50 border-t border-dashed border-slate-300 flex flex-wrap items-center justify-center gap-2.5 select-none shrink-0">
                <span className="text-xs text-slate-500 font-medium">
                  Elaborate Content Area:
                </span>
                {onAddSection && (
                  <>
                    <button
                      type="button"
                      onClick={handleAddFeaturesSection}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 shadow-2xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Feature Block
                    </button>
                    <button
                      type="button"
                      onClick={handleAddCtaSection}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 shadow-2xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Call to Action
                    </button>
                  </>
                )}
                {onExpandSectionHeight && (
                  <button
                    type="button"
                    onClick={handleExpandLastSection}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 shadow-2xs transition-colors"
                  >
                    <ArrowDownCircle className="w-3.5 h-3.5" /> Expand Canvas
                    (+400px)
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 3. BOTTOM FOOTER SLOT */}
        {footerComponent && footerSection && (
          <CanvasFooterSlot
            component={footerComponent}
            sectionId={footerSection.id}
            previewMode={previewMode}
            isSelected={selectedButtonId === footerComponent.id}
            onSelect={onSelectButton}
            onRemove={onRemoveButton}
          />
        )}
      </div>
    </div>
  );
}
