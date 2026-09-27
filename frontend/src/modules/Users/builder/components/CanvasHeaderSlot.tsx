import { MouseEvent } from "react";
import { Trash2 } from "lucide-react";
import Header from "../../../Core/header/Header";
import { CanvasComponentInstance } from "../../../types/builder.types";

interface CanvasHeaderSlotProps {
  component: CanvasComponentInstance;
  sectionId: string;
  previewMode: boolean;
  isSelected: boolean;
  onSelect: (sectionId: string, buttonId: string) => void;
  onRemove?: (sectionId: string, buttonId: string) => void;
}

export default function CanvasHeaderSlot({
  component,
  sectionId,
  previewMode,
  isSelected,
  onSelect,
  onRemove,
}: CanvasHeaderSlotProps) {
  function handleSelect() {
    onSelect(sectionId, component.id);
  }

  function handleRemove(e: MouseEvent) {
    e.stopPropagation();
    if (onRemove) onRemove(sectionId, component.id);
  }

  return (
    <header
      onClick={handleSelect}
      className={`w-full shrink-0 relative transition-all group ${
        previewMode ? "" : "cursor-pointer"
      } ${
        !previewMode && isSelected
          ? "ring-2 ring-indigo-600 ring-offset-2 z-20"
          : !previewMode
            ? "hover:ring-1 hover:ring-indigo-400"
            : ""
      }`}
    >
      <Header title={component.label} variant={component.variant} />

      {!previewMode && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 z-30">
          <span className="text-[10px] font-mono bg-slate-900/80 text-white px-2 py-0.5 rounded shadow-xs">
            header • {component.variant}
          </span>
          {onRemove && (
            <button
              type="button"
              title="Remove Header"
              onClick={handleRemove}
              className="p-1 rounded bg-white text-slate-500 hover:text-red-600 shadow-xs border border-slate-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </header>
  );
}
