import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Layers } from "lucide-react";
import { useCoreCatalog } from "../hooks/useCoreCatalog";
import {
  CORE_COMPONENTS_REGISTRY,
  CoreComponentRegistryItem,
} from "../coreRegistry";
import CoreSidebar from "../components/CoreSidebar";
import CoreVariantSection from "../components/CoreVariantSection";

export default function ButtonPlayground() {
  const [selectedKey, setSelectedKey] = useState<string>("button");
  const { existing } = useCoreCatalog();

  const selectedItem: CoreComponentRegistryItem =
    CORE_COMPONENTS_REGISTRY.find((c) => c.key === selectedKey) ??
    CORE_COMPONENTS_REGISTRY[0];

  function handleSelectComponent(key: string) {
    setSelectedKey(key);
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Top Header Bar (Full width across screen) */}
      <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 select-none z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Core Module Playground
          </span>
          <span className="text-xs text-slate-400">/</span>
          <span className="text-xs font-semibold text-slate-700">
            {selectedItem.displayName}
          </span>
        </div>

        <Link
          to="/users/builder"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:border-indigo-300 transition-colors shadow-2xs"
        >
          Go to User Website Builder
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Body: Full width with Left Sidebar on the left, Right content taking flex-1 */}
      <div className="flex-1 flex overflow-hidden">
        <CoreSidebar
          selectedKey={selectedKey}
          onSelectComponent={handleSelectComponent}
        />

        <main className="flex-1 p-1 overflow-y-auto bg-slate-50">
          <CoreVariantSection
            componentItem={selectedItem}
            existingInDb={existing}
          />
        </main>
      </div>
    </div>
  );
}
