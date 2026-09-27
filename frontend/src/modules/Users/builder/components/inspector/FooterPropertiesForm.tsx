import { ChangeEvent } from "react";
import { Trash2, MoveVertical } from "lucide-react";
import { CanvasComponentInstance } from "../../../../types/builder.types";
import { FooterVariantDef } from "../../../../Core/footer/footer.variants";

interface FooterPropertiesFormProps {
  component: CanvasComponentInstance;
  sectionId: string;
  variants: FooterVariantDef[];
  onUpdate: (
    sectionId: string,
    buttonId: string,
    updates: Partial<CanvasComponentInstance>,
  ) => void;
  onRemove: (sectionId: string, buttonId: string) => void;
}

export default function FooterPropertiesForm({
  component,
  sectionId,
  variants,
  onUpdate,
  onRemove,
}: FooterPropertiesFormProps) {
  function handleLabelChange(e: ChangeEvent<HTMLInputElement>) {
    onUpdate(sectionId, component.id, { label: e.target.value });
  }

  function handleVariantChange(e: ChangeEvent<HTMLSelectElement>) {
    onUpdate(sectionId, component.id, { variant: e.target.value });
  }

  function handleHeightChange(e: ChangeEvent<HTMLInputElement>) {
    const val = parseInt(e.target.value, 10);
    onUpdate(sectionId, component.id, {
      height: isNaN(val) || val <= 0 ? undefined : Math.max(48, val),
    });
  }

  function handlePresetHeight(height: number) {
    onUpdate(sectionId, component.id, { height });
  }

  function handleClearHeight() {
    onUpdate(sectionId, component.id, { height: undefined });
  }

  function handleDelete() {
    onRemove(sectionId, component.id);
  }

  const currentHeight = component.height ?? 80;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Footer Text / Copyright
        </label>
        <input
          type="text"
          value={component.label}
          onChange={handleLabelChange}
          placeholder="e.g. © 2026 My Website Inc."
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

      <div className="border-t border-slate-100 pt-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
          <MoveVertical className="w-3.5 h-3.5 text-indigo-600" />
          Size Adjustment (Height)
        </div>

        <div className="mb-2">
          <label className="block text-[11px] text-slate-500 mb-1">
            Footer Height:{" "}
            <span className="font-mono text-slate-700 font-semibold">
              {currentHeight}px
            </span>
          </label>
          <input
            type="number"
            min={48}
            max={260}
            value={component.height ?? 80}
            onChange={handleHeightChange}
            className="w-full text-xs px-2.5 py-1.5 font-mono border border-slate-300 rounded-md focus:outline-none focus:border-indigo-500 mb-2"
          />
        </div>

        <label className="block text-[11px] text-slate-500 mb-1.5">
          Quick Height Presets
        </label>
        <div className="grid grid-cols-3 gap-1.5 mb-1.5">
          <button
            type="button"
            onClick={() => handlePresetHeight(56)}
            className={`py-1 px-1.5 text-[11px] font-medium rounded transition-colors ${
              component.height === 56
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            Compact (56px)
          </button>
          <button
            type="button"
            onClick={() => handlePresetHeight(80)}
            className={`py-1 px-1.5 text-[11px] font-medium rounded transition-colors ${
              component.height === 80
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            Standard (80px)
          </button>
          <button
            type="button"
            onClick={() => handlePresetHeight(140)}
            className={`py-1 px-1.5 text-[11px] font-medium rounded transition-colors ${
              component.height === 140
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            Tall (140px)
          </button>
        </div>
        <button
          type="button"
          onClick={handleClearHeight}
          className="text-[10px] text-slate-500 hover:text-slate-800 underline block"
        >
          Reset to Auto Height
        </button>
      </div>

      <div className="border-t border-slate-200 pt-3">
        <button
          type="button"
          onClick={handleDelete}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors border border-red-200"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remove Footer from Layout
        </button>
      </div>
    </div>
  );
}
