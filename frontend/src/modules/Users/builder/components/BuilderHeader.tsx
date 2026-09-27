import { Link } from "react-router-dom";
import {
  Eye,
  Edit3,
  Monitor,
  Tablet,
  Smartphone,
  ArrowLeft,
  Save,
  Download,
  Loader2,
  Check,
  LogOut,
  User,
} from "lucide-react";
import { ViewportMode } from "../../../types/builder.types";

interface BuilderHeaderProps {
  currentRoutePath: string;
  previewMode: boolean;
  viewport: ViewportMode;
  canvasWidth?: number;
  userEmail?: string;
  saving?: boolean;
  saved?: boolean;
  exporting?: boolean;
  onTogglePreview: () => void;
  onSetViewport: (viewport: ViewportMode) => void;
  onSaveToDb: () => void;
  onExportZip: () => void;
  onLogout: () => void;
}

export default function BuilderHeader({
  currentRoutePath,
  previewMode,
  viewport,
  canvasWidth,
  userEmail,
  saving,
  saved,
  exporting,
  onTogglePreview,
  onSetViewport,
  onSaveToDb,
  onExportZip,
  onLogout,
}: BuilderHeaderProps) {
  function handleSelectDesktop() {
    onSetViewport("desktop");
  }

  function handleSelectTablet() {
    onSetViewport("tablet");
  }

  function handleSelectMobile() {
    onSetViewport("mobile");
  }

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-20 shrink-0 select-none">
      <div className="flex items-center gap-3">
        <Link
          to="/core/button"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Core Button
        </Link>
        <div className="h-4 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900 text-sm tracking-tight">
            Website Builder
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-mono font-medium">
            {currentRoutePath}
          </span>
        </div>
      </div>

      {/* Viewport switchers */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
        <button
          type="button"
          title="Desktop view (Active focus - auto-updating pixels)"
          onClick={handleSelectDesktop}
          className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition-colors ${
            viewport === "desktop"
              ? "bg-white text-slate-900 shadow-sm font-medium"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Monitor className="w-4 h-4 text-indigo-600" />
          <span>Desktop</span>
          {canvasWidth && canvasWidth > 0 ? (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
              {canvasWidth}px
            </span>
          ) : null}
        </button>

        <button
          type="button"
          title="Tablet view (Future responsive focus)"
          onClick={handleSelectTablet}
          className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
            viewport === "tablet"
              ? "bg-white text-slate-900 shadow-sm font-medium"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Tablet className="w-4 h-4" />
          <span className="hidden sm:inline">Tablet</span>
          <span className="text-[9px] text-slate-400 font-normal">
            (future)
          </span>
        </button>

        <button
          type="button"
          title="Mobile view (Future responsive focus)"
          onClick={handleSelectMobile}
          className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
            viewport === "mobile"
              ? "bg-white text-slate-900 shadow-sm font-medium"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span className="hidden sm:inline">Mobile</span>
          <span className="text-[9px] text-slate-400 font-normal">
            (future)
          </span>
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {/* Save to DB */}
        <button
          type="button"
          onClick={onSaveToDb}
          disabled={saving}
          title="Save layout and component instances to PostgreSQL"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
          ) : saved ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Save className="w-3.5 h-3.5 text-slate-600" />
          )}
          {saving ? "Saving..." : saved ? "Saved to DB" : "Save to DB"}
        </button>

        {/* Download ZIP */}
        <button
          type="button"
          onClick={onExportZip}
          disabled={exporting}
          title="Download production React + Vite project ZIP"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors disabled:opacity-50"
        >
          {exporting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          {exporting ? "Generating ZIP..." : "Export ZIP"}
        </button>

        {/* Toggle Preview */}
        <button
          type="button"
          onClick={onTogglePreview}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            previewMode
              ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {previewMode ? (
            <>
              <Edit3 className="w-3.5 h-3.5" />
              Edit Mode
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              Preview
            </>
          )}
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1" />

        {/* User profile & Logout */}
        <div className="flex items-center gap-2">
          {userEmail && (
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 font-medium">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span className="truncate max-w-[120px]">{userEmail}</span>
            </div>
          )}
          <button
            type="button"
            onClick={onLogout}
            title="Log out"
            className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
