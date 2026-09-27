import { ChangeEvent } from "react";
import {
  Zap,
  Navigation,
  ExternalLink,
  Bell,
  AppWindow,
  Eye,
} from "lucide-react";
import {
  CanvasButton,
  ButtonActionType,
  UserRoute,
} from "../../../../types/builder.types";

interface ButtonActionSettingsProps {
  button: CanvasButton;
  sectionId: string;
  routes: UserRoute[];
  onUpdate: (
    sectionId: string,
    buttonId: string,
    updates: Partial<CanvasButton>,
  ) => void;
  onPreviewDialog?: (button: CanvasButton) => void;
}

export default function ButtonActionSettings({
  button,
  sectionId,
  routes,
  onUpdate,
  onPreviewDialog,
}: ButtonActionSettingsProps) {
  function handleActionTypeChange(e: ChangeEvent<HTMLSelectElement>) {
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
      dialogTitle: button.dialogTitle || "Feature Section Modal",
      dialogSize: button.dialogSize || "medium",
      dialogContent:
        button.dialogContent ||
        "This is the dialog content area. It opens full screen with blurred page background.",
      dialogActionLabel: button.dialogActionLabel || "Confirm",
    });
  }

  function handleActionTargetChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    onUpdate(sectionId, button.id, { actionTarget: e.target.value });
  }

  function handleDialogTitleChange(e: ChangeEvent<HTMLInputElement>) {
    onUpdate(sectionId, button.id, { dialogTitle: e.target.value });
  }

  function handleDialogSizeChange(e: ChangeEvent<HTMLSelectElement>) {
    onUpdate(sectionId, button.id, {
      dialogSize: e.target.value as "compact" | "medium" | "large" | "full",
    });
  }

  function handleDialogContentChange(e: ChangeEvent<HTMLTextAreaElement>) {
    onUpdate(sectionId, button.id, { dialogContent: e.target.value });
  }

  function handleDialogActionLabelChange(e: ChangeEvent<HTMLInputElement>) {
    onUpdate(sectionId, button.id, { dialogActionLabel: e.target.value });
  }

  function handleTriggerPreview() {
    if (onPreviewDialog) {
      onPreviewDialog(button);
    }
  }

  return (
    <div className="border-t border-slate-100 pt-3 space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 uppercase tracking-wider">
        <Zap className="w-3.5 h-3.5 text-amber-500" />
        Call to Action Binding
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Trigger: On Click → Action
        </label>
        <select
          value={button.actionType}
          onChange={handleActionTypeChange}
          className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-500 bg-white"
        >
          <option value="none">No Action</option>
          <option value="dialog">Open Dialog / Modal (Call to Action)</option>
          <option value="navigate">Navigate to Page / Route</option>
          <option value="url">Open External URL</option>
          <option value="alert">Show Notification / Alert</option>
        </select>
      </div>

      {/* DIALOG CONFIGURATION */}
      {button.actionType === "dialog" && (
        <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-900">
              <AppWindow className="w-3.5 h-3.5 text-indigo-600" />
              Modal Dialog Configuration
            </span>
            <button
              type="button"
              onClick={handleTriggerPreview}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors shadow-2xs"
            >
              <Eye className="w-3 h-3" />
              Preview Dialog
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
              Dialog Title
            </label>
            <input
              type="text"
              value={button.dialogTitle ?? "Feature Section Modal"}
              onChange={handleDialogTitleChange}
              placeholder="e.g. Special Offer or Feature Details"
              className="w-full text-xs px-2 py-1 bg-white border border-slate-300 rounded focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
              Dialog Size
            </label>
            <select
              value={button.dialogSize ?? "medium"}
              onChange={handleDialogSizeChange}
              className="w-full text-xs px-2 py-1 bg-white border border-slate-300 rounded focus:outline-none focus:border-indigo-500"
            >
              <option value="compact">Compact (Small - 420px)</option>
              <option value="medium">Medium (Standard - 640px)</option>
              <option value="large">Large (Spacious - 900px)</option>
              <option value="full">Full Screen (95vw × 90vh)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
              Content Area Text / Description
            </label>
            <textarea
              rows={3}
              value={
                button.dialogContent ??
                "This is the dialog content area. It opens full screen with blurred page background."
              }
              onChange={handleDialogContentChange}
              placeholder="Enter dynamic content or feature block details..."
              className="w-full text-xs px-2 py-1 bg-white border border-slate-300 rounded focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
              Action Button Text
            </label>
            <input
              type="text"
              value={button.dialogActionLabel ?? "Confirm"}
              onChange={handleDialogActionLabelChange}
              className="w-full text-xs px-2 py-1 bg-white border border-slate-300 rounded focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      )}

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
  );
}
