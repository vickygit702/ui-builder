import { useState, DragEvent } from "react";
import {
  MousePointerClick,
  Layers,
  ChevronLeft,
  PanelTop,
  PanelLeft,
  PanelBottom,
  AppWindow,
} from "lucide-react";
import Button from "../../../Core/button/Button";
import Header from "../../../Core/header/Header";
import Sidebar from "../../../Core/sidebar/Sidebar";
import Footer from "../../../Core/footer/Footer";
import { ButtonVariantDef } from "../../../Core/button/button.variants";
import { HeaderVariantDef } from "../../../Core/header/header.variants";
import { SidebarVariantDef } from "../../../Core/sidebar/sidebar.variants";
import { FooterVariantDef } from "../../../Core/footer/footer.variants";
import { DialogVariantDef } from "../../../Core/dialog/dialog.variants";
import {
  DraggedItemPayload,
  CoreComponentType,
} from "../../../types/builder.types";
import { ComponentResponse } from "../../../types/component.types";
import ComponentCategoryAccordion from "./ComponentCategoryAccordion";
import SidebarDraggableCard from "./SidebarDraggableCard";
import ComponentSidebarRail from "./ComponentSidebarRail";

interface ComponentSidebarProps {
  components: ComponentResponse[];
  buttonVariants: ButtonVariantDef[];
  headerVariants: HeaderVariantDef[];
  sidebarVariants: SidebarVariantDef[];
  footerVariants: FooterVariantDef[];
  dialogVariants?: DialogVariantDef[];
  loading: boolean;
}

export default function ComponentSidebar({
  components,
  buttonVariants,
  headerVariants,
  sidebarVariants,
  footerVariants,
  dialogVariants = [],
  loading,
}: ComponentSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [tab, setTab] = useState<"all" | "buttons" | "layout">("all");

  function handleToggleCollapse() {
    setIsCollapsed((prev) => !prev);
  }

  function handleSetTabAll() {
    setTab("all");
  }

  function handleSetTabButtons() {
    setTab("buttons");
  }

  function handleSetTabLayout() {
    setTab("layout");
  }

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

  if (isCollapsed) {
    return <ComponentSidebarRail onExpand={handleToggleCollapse} />;
  }

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 select-none transition-all">
      <div className="p-3 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            Core Components (DB)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              DB Connected
            </span>
            <button
              type="button"
              onClick={handleToggleCollapse}
              className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Collapse Component Palette"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-[11px] text-slate-500">
          Drag components directly onto the plain canvas area.
        </p>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 mt-2.5 p-1 bg-slate-100 rounded-lg text-xs">
          <button
            type="button"
            onClick={handleSetTabAll}
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
            onClick={handleSetTabButtons}
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
            onClick={handleSetTabLayout}
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

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {loading ? (
          <div className="text-center py-6 text-xs text-slate-400">
            Loading catalog from DB...
          </div>
        ) : (
          <>
            {/* 1. BUTTONS */}
            {(tab === "all" || tab === "buttons") && (
              <ComponentCategoryAccordion
                title="Buttons"
                count={buttonVariants.length}
                icon={MousePointerClick}
              >
                {buttonVariants.map((variant) => (
                  <SidebarDraggableCard
                    key={`btn-${variant.key}`}
                    componentType="button"
                    variantKey={variant.key}
                    label={variant.label}
                    onDragStart={handleDragStart}
                  >
                    <Button variant={variant.key}>{variant.label}</Button>
                  </SidebarDraggableCard>
                ))}
              </ComponentCategoryAccordion>
            )}

            {/* 2. HEADERS */}
            {(tab === "all" || tab === "layout") && (
              <ComponentCategoryAccordion
                title="Headers"
                count={headerVariants.length}
                icon={PanelTop}
              >
                {headerVariants.map((variant) => (
                  <SidebarDraggableCard
                    key={`hdr-${variant.key}`}
                    componentType="header"
                    variantKey={variant.key}
                    label={variant.label}
                    badgeText="header"
                    previewWrapperClassName="pointer-events-none transform scale-90 origin-left"
                    onDragStart={handleDragStart}
                  >
                    <Header title="Brand Header" variant={variant.key} />
                  </SidebarDraggableCard>
                ))}
              </ComponentCategoryAccordion>
            )}

            {/* 3. SIDEBARS */}
            {(tab === "all" || tab === "layout") && (
              <ComponentCategoryAccordion
                title="Sidebars"
                count={sidebarVariants.length}
                icon={PanelLeft}
              >
                {sidebarVariants.map((variant) => (
                  <SidebarDraggableCard
                    key={`sd-${variant.key}`}
                    componentType="sidebar"
                    variantKey={variant.key}
                    label={variant.label}
                    badgeText="sidebar"
                    previewWrapperClassName="pointer-events-none"
                    onDragStart={handleDragStart}
                  >
                    <Sidebar title="Sidebar Nav" variant={variant.key}>
                      <div className="text-[10px] text-slate-500">
                        • Dashboard
                      </div>
                      <div className="text-[10px] text-slate-500">
                        • Analytics
                      </div>
                    </Sidebar>
                  </SidebarDraggableCard>
                ))}
              </ComponentCategoryAccordion>
            )}

            {/* 4. FOOTERS */}
            {(tab === "all" || tab === "layout") && (
              <ComponentCategoryAccordion
                title="Footers"
                count={footerVariants.length}
                icon={PanelBottom}
              >
                {footerVariants.map((variant) => (
                  <SidebarDraggableCard
                    key={`ft-${variant.key}`}
                    componentType="footer"
                    variantKey={variant.key}
                    label={variant.label}
                    badgeText="footer"
                    previewWrapperClassName="pointer-events-none transform scale-90 origin-left"
                    onDragStart={handleDragStart}
                  >
                    <Footer title="© 2026 Website Inc." variant={variant.key} />
                  </SidebarDraggableCard>
                ))}
              </ComponentCategoryAccordion>
            )}

            {/* 5. DIALOGS */}
            {(tab === "all" || tab === "layout") &&
              dialogVariants.length > 0 && (
                <ComponentCategoryAccordion
                  title="Dialogs / Modals"
                  count={dialogVariants.length}
                  icon={AppWindow}
                >
                  {dialogVariants.map((variant) => (
                    <SidebarDraggableCard
                      key={`dlg-${variant.key}`}
                      componentType="dialog"
                      variantKey={variant.key}
                      label={`${variant.label} Dialog`}
                      badgeText="dialog"
                      onDragStart={handleDragStart}
                    >
                      <div className="flex items-center gap-1.5 py-1 px-2 bg-indigo-50/80 border border-indigo-200 text-indigo-700 rounded text-xs font-medium">
                        <AppWindow className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{variant.label}</span>
                      </div>
                    </SidebarDraggableCard>
                  ))}
                </ComponentCategoryAccordion>
              )}
          </>
        )}
      </div>
    </div>
  );
}
