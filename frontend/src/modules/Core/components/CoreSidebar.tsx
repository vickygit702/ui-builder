import { ComponentResponse } from "../../types/component.types";
import {
  CORE_COMPONENTS_REGISTRY,
  CoreComponentRegistryItem,
} from "../coreRegistry";
import { CheckCircle2, Box } from "lucide-react";

interface CoreSidebarProps {
  selectedKey: string;
  onSelectComponent: (componentKey: string) => void;
  existingInDb: ComponentResponse[];
}

export default function CoreSidebar({
  selectedKey,
  onSelectComponent,
  existingInDb,
}: CoreSidebarProps) {
  function handleSelect(key: string) {
    onSelectComponent(key);
  }

  return (
    <aside className="w-72 bg-white border border-slate-200 rounded-xl p-4 flex flex-col shrink-0 shadow-xs select-none">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-indigo-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Core Components
          </h2>
        </div>
        <span className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
          {CORE_COMPONENTS_REGISTRY.length} items
        </span>
      </div>

      <nav className="space-y-1.5 flex-1">
        {CORE_COMPONENTS_REGISTRY.map((item: CoreComponentRegistryItem) => {
          const isSelected = item.key === selectedKey;
          const Icon = item.icon;
          const dbItem = existingInDb.find((c) => c.key === item.key);

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleSelect(item.key)}
              className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all ${
                isSelected
                  ? "bg-indigo-50 border border-indigo-200 text-indigo-950 shadow-xs"
                  : "hover:bg-slate-50 border border-transparent text-slate-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-md ${
                    isSelected
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold leading-tight">
                    {item.displayName}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {item.variants.length} variants • {item.category}
                  </div>
                </div>
              </div>

              {dbItem && (
                <span
                  title={`Finalized in PostgreSQL (v${dbItem.version})`}
                  className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded"
                >
                  <CheckCircle2 className="w-3 h-3" />v{dbItem.version}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
        Select a component on the left to preview all its variants on the right.
      </div>
    </aside>
  );
}
