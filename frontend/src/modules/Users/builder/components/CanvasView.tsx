import { Plus } from "lucide-react";
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
}: CanvasViewProps) {
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
        : "w-full";

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

      <div
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
