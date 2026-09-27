import { ChangeEvent } from "react";
import {
  Trash2,
  Crosshair,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { CanvasButton, UserRoute } from "../../../../types/builder.types";
import { ButtonVariantDef } from "../../../../Core/button/button.variants";
import ButtonActionSettings from "./ButtonActionSettings";

interface ButtonPropertiesFormProps {
  button: CanvasButton;
  sectionId: string;
  routes: UserRoute[];
  variants: ButtonVariantDef[];
  onUpdate: (
    sectionId: string,
    buttonId: string,
    updates: Partial<CanvasButton>,
  ) => void;
  onRemove: (sectionId: string, buttonId: string) => void;
  onPreviewDialog?: (button: CanvasButton) => void;
}

export default function ButtonPropertiesForm({
  button,
  sectionId,
  routes,
  variants,
  onUpdate,
  onRemove,
  onPreviewDialog,
}: ButtonPropertiesFormProps) {
  function handleLabelChange(e: ChangeEvent<HTMLInputElement>) {
    onUpdate(sectionId, button.id, { label: e.target.value });
  }

  function handleVariantChange(e: ChangeEvent<HTMLSelectElement>) {
    onUpdate(sectionId, button.id, { variant: e.target.value });
  }

  function handlePosXChange(e: ChangeEvent<HTMLInputElement>) {
    const x = Math.max(0, parseInt(e.target.value, 10) || 0);
    onUpdate(sectionId, button.id, {
      position: { x, y: button.position?.y ?? 0 },
    });
  }

  function handlePosYChange(e: ChangeEvent<HTMLInputElement>) {
    const y = Math.max(0, parseInt(e.target.value, 10) || 0);
    onUpdate(sectionId, button.id, {
      position: { x: button.position?.x ?? 0, y },
    });
  }

  function handleAlignLeft() {
    onUpdate(sectionId, button.id, {
      position: { x: 30, y: button.position?.y ?? 20 },
    });
  }

  function handleAlignCenter() {
    onUpdate(sectionId, button.id, {
      position: { x: 320, y: button.position?.y ?? 20 },
    });
  }

  function handleAlignRight() {
    onUpdate(sectionId, button.id, {
      position: { x: 620, y: button.position?.y ?? 20 },
    });
  }

  function handleAlignTop() {
    onUpdate(sectionId, button.id, {
      position: { x: button.position?.x ?? 30, y: 20 },
    });
  }

  function handleAlignMiddle() {
    onUpdate(sectionId, button.id, {
      position: { x: button.position?.x ?? 30, y: 110 },
    });
  }

  function handleDelete() {
    onRemove(sectionId, button.id);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Button Text
        </label>
        <input
          type="text"
          value={button.label}
          onChange={handleLabelChange}
          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Style Variant
        </label>
        <select
          value={button.variant}
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

      {/* Pixel Placement & Alignment */}
      <div className="border-t border-slate-100 pt-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
          <Crosshair className="w-3.5 h-3.5 text-indigo-600" />
          Pixel Placement (FR-2.3)
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="block text-[11px] text-slate-500 mb-0.5">
              X Position (px)
            </label>
            <input
              type="number"
              min={0}
              value={button.position?.x ?? 0}
              onChange={handlePosXChange}
              className="w-full text-xs px-2.5 py-1.5 font-mono border border-slate-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 mb-0.5">
              Y Position (px)
            </label>
            <input
              type="number"
              min={0}
              value={button.position?.y ?? 0}
              onChange={handlePosYChange}
              className="w-full text-xs px-2.5 py-1.5 font-mono border border-slate-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <label className="block text-[11px] text-slate-500 mb-1.5">
          Quick Alignment Presets
        </label>
        <div className="grid grid-cols-3 gap-1.5 mb-1.5">
          <button
            type="button"
            onClick={handleAlignLeft}
            className="inline-flex items-center justify-center gap-1 py-1 px-1.5 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
          >
            <AlignLeft className="w-3 h-3" /> Left
          </button>
          <button
            type="button"
            onClick={handleAlignCenter}
            className="inline-flex items-center justify-center gap-1 py-1 px-1.5 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
          >
            <AlignCenter className="w-3 h-3" /> Center
          </button>
          <button
            type="button"
            onClick={handleAlignRight}
            className="inline-flex items-center justify-center gap-1 py-1 px-1.5 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
          >
            <AlignRight className="w-3 h-3" /> Right
          </button>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={handleAlignTop}
            className="py-1 px-1.5 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors text-center"
          >
            Align Top
          </button>
          <button
            type="button"
            onClick={handleAlignMiddle}
            className="py-1 px-1.5 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors text-center"
          >
            Align Middle
          </button>
        </div>
      </div>

      {/* Prototype Call to Action Binding */}
      <ButtonActionSettings
        button={button}
        sectionId={sectionId}
        routes={routes}
        onUpdate={onUpdate}
        onPreviewDialog={onPreviewDialog}
      />

      <div className="border-t border-slate-200 pt-3">
        <button
          type="button"
          onClick={handleDelete}
          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete from Canvas
        </button>
      </div>
    </div>
  );
}
