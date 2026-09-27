import { ChangeEvent } from "react";
import { Trash2, MoveHorizontal, CheckCircle2 } from "lucide-react";
import { CanvasComponentInstance } from "../../../../types/builder.types";
import { SidebarVariantDef } from "../../../../Core/sidebar/sidebar.variants";

interface SidebarPropertiesFormProps {
  component: CanvasComponentInstance;
  sectionId: string;
  variants: SidebarVariantDef[];
  onUpdate: (
    sectionId: string,
    buttonId: string,
    updates: Partial<CanvasComponentInstance>,
  ) => void;
  onRemove: (sectionId: string, buttonId: string) => void;
}

export default function SidebarPropertiesForm({
  component,
  sectionId,
  variants,
  onUpdate,
  onRemove,
}: SidebarPropertiesFormProps) {
  function handleLabelChange(e: ChangeEvent<HTMLInputElement>) {
    onUpdate(sectionId, component.id, { label: e.target.value });
  }

  function handleVariantChange(e: ChangeEvent<HTMLSelectElement>) {
    onUpdate(sectionId, component.id, { variant: e.target.value });
  }

  function handleWidthChange(e: ChangeEvent<HTMLInputElement>) {
    const val = parseInt(e.target.value, 10);
    onUpdate(sectionId, component.id, {
      width: isNaN(val) || val <= 0 ? undefined : Math.max(160, val),
    });
  }

  function handlePresetWidth(width: number) {
    onUpdate(sectionId, component.id, { width });
  }

  function handleClearWidth() {
    onUpdate(sectionId, component.id, { width: undefined });
  }

  function handleDelete() {
    onRemove(sectionId, component.id);
  }

  const currentWidth = component.width ?? 256;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Sidebar Title / Nav Header
        </label>
        <input
          type="text"
          value={component.label}
          onChange={handleLabelChange}
          placeholder="e.g. Navigation"
          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Style Variant
        </label>
        <select
          value={component.variant}
          onChange={handleVariantChange}
          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-500 bg-white"
        >
          {variants.map((v) => (
            <option key={v.key} value={v.key}>
              {v.label} ({v.key})
            </option>
          ))}
        </select>
      </div>

      {/* Width Sizing & Auto-align */}
      <div className="border-t border-slate-100 pt-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
          <MoveHorizontal className="w-3.5 h-3.5 text-indigo-600" />
          Size Adjustment (Width)
        </div>

        <div className="mb-2">
          <label className="block text-[11px] text-slate-500 mb-1">
            Sidebar Width:{" "}
            <span className="font-mono text-slate-700 font-semibold">
              {currentWidth}px
            </span>
          </label>
          <input
            type="number"
            min={160}
            max={420}
            value={component.width ?? 256}
            onChange={handleWidthChange}
            className="w-full text-xs px-2.5 py-1.5 font-mono border border-slate-300 rounded-md focus:outline-none focus:border-indigo-500 mb-2"
          />
        </div>

        <label className="block text-[11px] text-slate-500 mb-1.5">
          Quick Width Presets
        </label>
        <div className="grid grid-cols-3 gap-1.5 mb-1.5">
          <button
            type="button"
            onClick={() => handlePresetWidth(200)}
            className={`py-1 px-1.5 text-[11px] font-medium rounded transition-colors ${
              component.width === 200
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            Compact (200px)
          </button>
          <button
            type="button"
            onClick={() => handlePresetWidth(256)}
            className={`py-1 px-1.5 text-[11px] font-medium rounded transition-colors ${
              component.width === 256
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            Standard (256px)
          </button>
          <button
            type="button"
            onClick={() => handlePresetWidth(320)}
            className={`py-1 px-1.5 text-[11px] font-medium rounded transition-colors ${
              component.width === 320
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            Wide (320px)
          </button>
        </div>
        <button
          type="button"
          onClick={handleClearWidth}
          className="text-[10px] text-slate-500 hover:text-slate-800 underline block mb-3"
        >
          Reset to DB Default Width (256px)
        </button>

        <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong>Auto-aligned Height:</strong> Stretches automatically to
            match 100% of website content height and remains fixed during
            scroll.
          </span>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-3">
        <button
          type="button"
          onClick={handleDelete}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors border border-red-200"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remove Sidebar from Layout
        </button>
      </div>
    </div>
  );
}
