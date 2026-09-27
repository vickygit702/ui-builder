import { MouseEvent } from "react";
import { Trash2 } from "lucide-react";
import Sidebar from "../../../Core/sidebar/Sidebar";
import { CanvasComponentInstance } from "../../../types/builder.types";

interface CanvasSidebarSlotProps {
  component: CanvasComponentInstance;
  sectionId: string;
  previewMode: boolean;
  isSelected: boolean;
  onSelect: (sectionId: string, buttonId: string) => void;
  onRemove?: (sectionId: string, buttonId: string) => void;
}

export default function CanvasSidebarSlot({
  component,
  sectionId,
  previewMode,
  isSelected,
  onSelect,
  onRemove,
}: CanvasSidebarSlotProps) {
  function handleSelect() {
    onSelect(sectionId, component.id);
  }

  function handleRemove(e: MouseEvent) {
    e.stopPropagation();
    if (onRemove) onRemove(sectionId, component.id);
  }

  return (
    <aside
      onClick={handleSelect}
      className={`w-60 shrink-0 sticky top-0 self-stretch border-r border-slate-200 bg-white z-10 transition-all group ${
        previewMode ? "" : "cursor-pointer"
      } ${
        !previewMode && isSelected
          ? "ring-2 ring-indigo-600 ring-offset-2"
          : !previewMode
            ? "hover:ring-1 hover:ring-indigo-400"
            : ""
      }`}
    >
      <Sidebar title={component.label} variant={component.variant}>
        <div className="text-xs text-slate-500 py-1 px-2 rounded hover:bg-slate-50 select-none">
          • Dashboard
        </div>
        <div className="text-xs text-slate-500 py-1 px-2 rounded hover:bg-slate-50 select-none">
          • Analytics
        </div>
        <div className="text-xs text-slate-500 py-1 px-2 rounded hover:bg-slate-50 select-none">
          • Settings
        </div>
      </Sidebar>

      {!previewMode && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 z-30">
          <span className="text-[10px] font-mono bg-slate-900/80 text-white px-2 py-0.5 rounded shadow-xs">
            sidebar
          </span>
          {onRemove && (
            <button
              type="button"
              title="Remove Sidebar"
              onClick={handleRemove}
              className="p-1 rounded bg-white text-slate-500 hover:text-red-600 shadow-xs border border-slate-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
