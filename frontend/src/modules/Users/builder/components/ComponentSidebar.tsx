import { useState, DragEvent } from "react";
import {
  MousePointerClick,
  GripVertical,
  Layers,
  Sparkles,
} from "lucide-react";
import Button from "../../../Core/button/Button";
import Header from "../../../Core/header/Header";
import Sidebar from "../../../Core/sidebar/Sidebar";
import Footer from "../../../Core/footer/Footer";
import { ButtonVariantDef } from "../../../Core/button/button.variants";
import { HeaderVariantDef } from "../../../Core/header/header.variants";
import { SidebarVariantDef } from "../../../Core/sidebar/sidebar.variants";
import { FooterVariantDef } from "../../../Core/footer/footer.variants";
import {
  DraggedItemPayload,
  CoreComponentType,
} from "../../../types/builder.types";
import { ComponentResponse } from "../../../types/component.types";

interface ComponentSidebarProps {
  components: ComponentResponse[];
  buttonVariants: ButtonVariantDef[];
  headerVariants: HeaderVariantDef[];
  sidebarVariants: SidebarVariantDef[];
  footerVariants: FooterVariantDef[];
  loading: boolean;
}

export default function ComponentSidebar({
  components,
  buttonVariants,
  headerVariants,
  sidebarVariants,
  footerVariants,
  loading,
}: ComponentSidebarProps) {
  const [tab, setTab] = useState<"all" | "buttons" | "layout">("all");

  function handleDragStart(
    e: DragEvent<HTMLDivElement>,
    componentType: CoreComponentType,
    variantKey: string,
    label: string,
  ) {
    const compDef = components.find((c) => c.key === componentType);
    const varDef = compDef?.variants.find((v) => v.variantKey === variantKey);

    const payload: DraggedItemPayload = {
      source: "palette",
      componentType,
      variantKey,
      label,
      coreComponentId: compDef?.id,
      coreVariantId: varDef?.id,
    };
    e.dataTransfer.setData("application/json", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "copy";
  }

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-3 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            Core Components (DB)
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
            DB Connected
          </span>
        </div>
        <p className="text-[11px] text-slate-500">
          Drag components from PostgreSQL core catalog directly onto the canvas.
        </p>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 mt-2.5 p-1 bg-slate-100 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setTab("all")}
            className={`flex-1 py-1 rounded text-center font-medium transition-colors ${
              tab === "all"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setTab("buttons")}
            className={`flex-1 py-1 rounded text-center font-medium transition-colors ${
              tab === "buttons"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Buttons
          </button>
          <button
            type="button"
            onClick={() => setTab("layout")}
            className={`flex-1 py-1 rounded text-center font-medium transition-colors ${
              tab === "layout"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Layout
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {loading ? (
          <div className="text-center py-6 text-xs text-slate-400">
            Loading catalog from DB...
          </div>
        ) : (
          <>
            {/* 1. BUTTONS */}
            {(tab === "all" || tab === "buttons") && (
              <div>
                <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <MousePointerClick className="w-3 h-3 text-indigo-600" />{" "}
                  Buttons
                </h4>
                <div className="space-y-2">
                  {buttonVariants.map((variant) => (
                    <div
                      key={`btn-${variant.key}`}
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(
                          e,
                          "button",
                          variant.key,
                          `${variant.label} Button`,
                        )
                      }
                      className="group border border-slate-200 rounded-lg p-2 bg-white hover:border-indigo-400 hover:shadow-sm cursor-grab active:cursor-grabbing transition-all select-none"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <GripVertical className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500" />
                          <span className="text-xs font-medium text-slate-700">
                            {variant.label}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-slate-100 text-slate-500">
                          {variant.key}
                        </span>
                      </div>
                      <div className="flex items-center justify-center p-1.5 bg-slate-50 rounded border border-slate-100 pointer-events-none">
                        <Button variant={variant.key}>{variant.label}</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. HEADERS */}
            {(tab === "all" || tab === "layout") && (
              <div>
                <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Headers / Navbars
                </h4>
                <div className="space-y-2">
                  {headerVariants.map((variant) => (
                    <div
                      key={`hdr-${variant.key}`}
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(
                          e,
                          "header",
                          variant.key,
                          "Navigation Header",
                        )
                      }
                      className="group border border-slate-200 rounded-lg p-2 bg-white hover:border-indigo-400 hover:shadow-sm cursor-grab active:cursor-grabbing transition-all select-none"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <GripVertical className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500" />
                          <span className="text-xs font-medium text-slate-700">
                            {variant.label}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-slate-100 text-slate-500">
                          header
                        </span>
                      </div>
                      <div className="pointer-events-none transform scale-90 origin-left">
                        <Header title="Brand Header" variant={variant.key} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. SIDEBARS */}
            {(tab === "all" || tab === "layout") && (
              <div>
                <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Sidebars
                </h4>
                <div className="space-y-2">
                  {sidebarVariants.map((variant) => (
                    <div
                      key={`sd-${variant.key}`}
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(
                          e,
                          "sidebar",
                          variant.key,
                          "App Sidebar",
                        )
                      }
                      className="group border border-slate-200 rounded-lg p-2 bg-white hover:border-indigo-400 hover:shadow-sm cursor-grab active:cursor-grabbing transition-all select-none"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <GripVertical className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500" />
                          <span className="text-xs font-medium text-slate-700">
                            {variant.label}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-slate-100 text-slate-500">
                          sidebar
                        </span>
                      </div>
                      <div className="pointer-events-none">
                        <Sidebar title="Sidebar Nav" variant={variant.key}>
                          <div className="text-[10px] text-slate-500">
                            • Dashboard
                          </div>
                          <div className="text-[10px] text-slate-500">
                            • Analytics
                          </div>
                        </Sidebar>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. FOOTERS */}
            {(tab === "all" || tab === "layout") && (
              <div>
                <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Footers
                </h4>
                <div className="space-y-2">
                  {footerVariants.map((variant) => (
                    <div
                      key={`ft-${variant.key}`}
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(
                          e,
                          "footer",
                          variant.key,
                          "Website Footer",
                        )
                      }
                      className="group border border-slate-200 rounded-lg p-2 bg-white hover:border-indigo-400 hover:shadow-sm cursor-grab active:cursor-grabbing transition-all select-none"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <GripVertical className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500" />
                          <span className="text-xs font-medium text-slate-700">
                            {variant.label}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-slate-100 text-slate-500">
                          footer
                        </span>
                      </div>
                      <div className="pointer-events-none transform scale-90 origin-left">
                        <Footer
                          title="© 2026 Website Inc."
                          variant={variant.key}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
