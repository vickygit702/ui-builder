import { CoreComponentRegistryItem, VariantDefinition } from "../coreRegistry";
import { ComponentResponse } from "../../types/component.types";

interface CoreVariantSectionProps {
  componentItem: CoreComponentRegistryItem;
  existingInDb: ComponentResponse[];
}

export default function CoreVariantSection({
  componentItem,
  existingInDb,
}: CoreVariantSectionProps) {
  const Icon = componentItem.icon;
  const currentDbEntry = existingInDb.find((c) => c.key === componentItem.key);
  const status = currentDbEntry?.status ?? "draft";

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-xs w-full">
      {/* Merged Single Card Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900">
              {componentItem.displayName}
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              core.{componentItem.key}
            </span>
          </div>
        </div>

        {/* Status indicator: finalized / draft */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize flex items-center gap-1.5 ${
              status === "finalized"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                status === "finalized" ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            {status}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            ({componentItem.variants.length} variants)
          </span>
        </div>
      </div>

      {/* Variants Grid inside the single merged card */}
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
  );
}
