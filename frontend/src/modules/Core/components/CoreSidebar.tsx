import {
  CORE_COMPONENTS_REGISTRY,
  CoreComponentRegistryItem,
} from "../coreRegistry";
import { Box } from "lucide-react";

interface CoreSidebarProps {
  selectedKey: string;
  onSelectComponent: (componentKey: string) => void;
}

export default function CoreSidebar({
  selectedKey,
  onSelectComponent,
}: CoreSidebarProps) {
  function handleSelect(key: string) {
    onSelectComponent(key);
  }

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full p-3 select-none">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-indigo-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Components
          </h2>
        </div>
        <span className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
          {CORE_COMPONENTS_REGISTRY.length}
        </span>
      </div>

      <nav className="space-y-1 flex-1 overflow-y-auto">
        {CORE_COMPONENTS_REGISTRY.map((item: CoreComponentRegistryItem) => {
          const isSelected = item.key === selectedKey;
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleSelect(item.key)}
              className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-all ${
                isSelected
                  ? "bg-indigo-50 border border-indigo-200 text-indigo-950 shadow-2xs"
                  : "hover:bg-slate-50 border border-transparent text-slate-700"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-1.5 rounded-md ${
                    isSelected
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold leading-tight">
                    {item.displayName}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {item.variants.length} variants
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
