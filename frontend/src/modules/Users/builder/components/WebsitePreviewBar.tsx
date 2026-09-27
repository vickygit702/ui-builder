import { ChangeEvent } from "react";
import { Lock, ArrowLeft, ArrowRight, RotateCw, X } from "lucide-react";
import { UserRoute } from "../../../types/builder.types";

interface WebsitePreviewBarProps {
  currentPath: string;
  routes: UserRoute[];
  onNavigate: (path: string) => void;
  onClosePreview: () => void;
}

export default function WebsitePreviewBar({
  currentPath,
  routes,
  onNavigate,
  onClosePreview,
}: WebsitePreviewBarProps) {
  function handleRouteChange(e: ChangeEvent<HTMLSelectElement>) {
    onNavigate(e.target.value);
  }

  function handleHomeClick() {
    onNavigate("/");
  }

  return (
    <div className="bg-slate-900 text-slate-300 px-4 py-2 flex items-center justify-between text-xs border-b border-slate-800 shadow-md">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleHomeClick}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          title="Back to Root (/)"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          disabled
          className="p-1 rounded text-slate-600 cursor-not-allowed"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          title="Refresh"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 max-w-xl mx-4">
        <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 text-xs">
          <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="text-slate-400 select-none">
            https://website.local
          </span>
          <select
            value={currentPath}
            onChange={handleRouteChange}
            className="bg-transparent text-white font-mono font-medium focus:outline-none cursor-pointer"
          >
            {routes.map((r) => (
              <option
                key={r.id}
                value={r.path}
                className="bg-slate-800 text-white"
              >
                {r.path} ({r.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full font-medium">
          Interactive Live Mode
        </span>
        <button
          type="button"
          onClick={onClosePreview}
          className="inline-flex items-center gap-1 px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Exit Preview
        </button>
      </div>
    </div>
  );
}
