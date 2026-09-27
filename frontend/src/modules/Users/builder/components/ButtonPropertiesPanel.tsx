import { ChangeEvent } from "react";
import {
  X,
  Trash2,
  Sliders,
  ExternalLink,
  Navigation,
  Bell,
  Zap,
  Crosshair,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import {
  CanvasButton,
  ButtonActionType,
  UserRoute,
} from "../../../types/builder.types";
import { ButtonVariantDef } from "../../../Core/button/button.variants";

interface ButtonPropertiesPanelProps {
  button: CanvasButton | null;
  sectionId: string | null;
  routes: UserRoute[];
  variants: ButtonVariantDef[];
  onUpdate: (
    sectionId: string,
    buttonId: string,
    updates: Partial<CanvasButton>,
  ) => void;
  onRemove: (sectionId: string, buttonId: string) => void;
  onClose: () => void;
}

export default function ButtonPropertiesPanel({
  button,
  sectionId,
  routes,
  variants,
  onUpdate,
  onRemove,
  onClose,
}: ButtonPropertiesPanelProps) {
  if (!button || !sectionId) return null;

  function handleLabelChange(e: ChangeEvent<HTMLInputElement>) {
    if (!button || !sectionId) return;
    onUpdate(sectionId, button.id, { label: e.target.value });
  }

  function handleVariantChange(e: ChangeEvent<HTMLSelectElement>) {
    if (!button || !sectionId) return;
    onUpdate(sectionId, button.id, { variant: e.target.value });
  }

  function handlePosXChange(e: ChangeEvent<HTMLInputElement>) {
    if (!button || !sectionId) return;
    const x = Math.max(0, parseInt(e.target.value, 10) || 0);
    onUpdate(sectionId, button.id, {
      position: { x, y: button.position?.y ?? 0 },
    });
  }

  function handlePosYChange(e: ChangeEvent<HTMLInputElement>) {
    if (!button || !sectionId) return;
    const y = Math.max(0, parseInt(e.target.value, 10) || 0);
    onUpdate(sectionId, button.id, {
      position: { x: button.position?.x ?? 0, y },
    });
  }

  function handleAlignLeft() {
    if (!button || !sectionId) return;
    onUpdate(sectionId, button.id, {
      position: { x: 30, y: button.position?.y ?? 20 },
    });
  }

  function handleAlignCenter() {
    if (!button || !sectionId) return;
    onUpdate(sectionId, button.id, {
      position: { x: 320, y: button.position?.y ?? 20 },
    });
  }

  function handleAlignRight() {
    if (!button || !sectionId) return;
    onUpdate(sectionId, button.id, {
      position: { x: 620, y: button.position?.y ?? 20 },
    });
  }

  function handleAlignTop() {
    if (!button || !sectionId) return;
    onUpdate(sectionId, button.id, {
      position: { x: button.position?.x ?? 30, y: 20 },
    });
  }

  function handleAlignMiddle() {
    if (!button || !sectionId) return;
    onUpdate(sectionId, button.id, {
      position: { x: button.position?.x ?? 30, y: 110 },
    });
  }

  function handleActionTypeChange(e: ChangeEvent<HTMLSelectElement>) {
    if (!button || !sectionId) return;
    const nextType = e.target.value as ButtonActionType;
    let defaultTarget = "";
    if (nextType === "navigate") {
      defaultTarget = routes[0]?.path ?? "/";
    } else if (nextType === "url") {
      defaultTarget = "https://";
    } else if (nextType === "alert") {
      defaultTarget = "Action clicked!";
    }
    onUpdate(sectionId, button.id, {
      actionType: nextType,
      actionTarget: defaultTarget,
    });
  }

  function handleActionTargetChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    if (!button || !sectionId) return;
    onUpdate(sectionId, button.id, { actionTarget: e.target.value });
  }

  function handleDelete() {
    if (!button || !sectionId) return;
    onRemove(sectionId, button.id);
  }

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 shadow-lg z-10 select-none">
      <div className="p-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 uppercase tracking-wider">
          <Sliders className="w-3.5 h-3.5 text-indigo-600" />
          Component Settings (FR-4)
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
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

        {/* Prototype Binding */}
        <div className="border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Prototype Binding (FR-6)
          </div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Trigger: On Click → Action
          </label>
          <select
            value={button.actionType}
            onChange={handleActionTypeChange}
            className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-500 bg-white"
          >
            <option value="none">No Action</option>
            <option value="navigate">Navigate to Page / Route</option>
            <option value="url">Open External URL</option>
            <option value="alert">Show Notification / Dialog</option>
          </select>
        </div>

        {button.actionType === "navigate" && (
          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-slate-700 mb-1">
              <Navigation className="w-3 h-3 text-indigo-600" />
              Target User Route
            </label>
            <select
              value={button.actionTarget ?? ""}
              onChange={handleActionTargetChange}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-500 bg-white font-mono"
            >
              {routes.map((r) => (
                <option key={r.id} value={r.path}>
                  {r.name} ({r.path})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400 mt-1">
              Clicking this button in preview mode will route to this page.
            </p>
          </div>
        )}

        {button.actionType === "url" && (
          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-slate-700 mb-1">
              <ExternalLink className="w-3 h-3 text-indigo-600" />
              Target Web URL
            </label>
            <input
              type="url"
              value={button.actionTarget ?? ""}
              onChange={handleActionTargetChange}
              placeholder="https://example.com"
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        )}

        {button.actionType === "alert" && (
          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-slate-700 mb-1">
              <Bell className="w-3 h-3 text-indigo-600" />
              Notification Message
            </label>
            <input
              type="text"
              value={button.actionTarget ?? ""}
              onChange={handleActionTargetChange}
              placeholder="Button action triggered"
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-200 bg-slate-50">
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
