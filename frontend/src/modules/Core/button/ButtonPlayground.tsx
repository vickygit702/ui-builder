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
import { CreateComponentInput } from "../../types/component.types";

export default function ButtonPlayground() {
  const [selectedKey, setSelectedKey] = useState<string>("button");
  const { existing, saving, saved, error, saveComponent } = useCoreCatalog();

  const selectedItem: CoreComponentRegistryItem =
    CORE_COMPONENTS_REGISTRY.find((c) => c.key === selectedKey) ??
    CORE_COMPONENTS_REGISTRY[0];

  function handleSelectComponent(key: string) {
    setSelectedKey(key);
  }

  function handleFinalize() {
    const payload: CreateComponentInput = {
      key: selectedItem.key,
      displayName: selectedItem.displayName,
      description: selectedItem.description,
      variants: selectedItem.variants.map((v) => ({
        variantKey: v.key,
        label: v.label,
        classNames: v.classNames,
        isDefault: v.isDefault ?? false,
      })),
    };

    void saveComponent(payload);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
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
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:border-indigo-300 transition-colors shadow-xs"
          >
            Go to User Website Builder
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Master-Detail Playground Layout: Left Aside Components, Right Variants */}
        <div className="flex flex-col lg:flex-row items-start gap-6">
          <CoreSidebar
            selectedKey={selectedKey}
            onSelectComponent={handleSelectComponent}
            existingInDb={existing}
          />

          <CoreVariantSection
            componentItem={selectedItem}
            saving={saving}
            saved={saved}
            error={error}
            existingInDb={existing}
            onFinalize={handleFinalize}
          />
        </div>
      </div>
    </div>
  );
}
