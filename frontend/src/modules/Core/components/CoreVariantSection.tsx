import {
  Check,
  Loader2,
  Save,
  ArrowRight,
  Database,
  Layers,
} from "lucide-react";
import { Link } from "react-router-dom";
import { CoreComponentRegistryItem, VariantDefinition } from "../coreRegistry";
import { ComponentResponse } from "../../types/component.types";

interface CoreVariantSectionProps {
  componentItem: CoreComponentRegistryItem;
  saving: boolean;
  saved: ComponentResponse | null;
  error: string | null;
  existingInDb: ComponentResponse[];
  onFinalize: () => void;
}

export default function CoreVariantSection({
  componentItem,
  saving,
  saved,
  error,
  existingInDb,
  onFinalize,
}: CoreVariantSectionProps) {
  const Icon = componentItem.icon;
  const currentDbEntry = existingInDb.find((c) => c.key === componentItem.key);

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  {componentItem.displayName}
                </h1>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  core.{componentItem.key}
                </span>
                {currentDbEntry && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Finalized in DB (v{currentDbEntry.version})
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {componentItem.description}
              </p>
            </div>
          </div>

          <Link
            to="/users/builder"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 bg-white border border-slate-200 px-3 py-2 rounded-lg hover:border-indigo-300 transition-colors shadow-xs"
          >
            Open Website Builder
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Action button to finalize */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onFinalize}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-xs"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            Finalize &amp; Save "{componentItem.displayName}" to Backend
          </button>

          {saved && saved.key === componentItem.key && (
            <p className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <Check className="w-4 h-4" /> Saved as "{saved.displayName}" (v
              {saved.version}, {saved.variants.length} variants)
            </p>
          )}

          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>

      {/* Variants (Working Draft) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {componentItem.displayName} Variants (
              {componentItem.variants.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live preview of all style and layout variants defined for this
              component.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            working draft
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {componentItem.variants.map((v: VariantDefinition) => (
            <div
              key={v.key}
              className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-800">
                    {v.label}
                  </span>
                  {v.isDefault && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-200">
                      default
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {v.key}
                </span>
              </div>

              {/* Rendered Live Preview */}
              <div className="min-h-[70px] flex items-center justify-center p-3 bg-white rounded-md border border-slate-200/80 mb-3 overflow-hidden">
                {componentItem.renderVariantPreview(v)}
              </div>

              {/* Classnames snippet */}
              <div className="text-[10px] font-mono text-slate-400 truncate bg-slate-100 px-2 py-1 rounded">
                class: {v.classNames}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Database Finalized Overview */}
      {existingInDb.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
            <Database className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              PostgreSQL Core Catalog ({existingInDb.length} Finalized)
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {existingInDb.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    {c.displayName}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                    {c.key} • v{c.version}
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 mt-2 font-medium">
                  {c.variants.length} variants
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
