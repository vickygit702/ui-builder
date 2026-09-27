import { Sliders, X } from "lucide-react";
import {
  CanvasComponentInstance,
  UserRoute,
} from "../../../types/builder.types";
import { ButtonVariantDef } from "../../../Core/button/button.variants";
import { HeaderVariantDef } from "../../../Core/header/header.variants";
import { SidebarVariantDef } from "../../../Core/sidebar/sidebar.variants";
import { FooterVariantDef } from "../../../Core/footer/footer.variants";
import { TableVariantDef } from "../../../Core/table/table.variants";
import { CardVariantDef } from "../../../Core/card/card.variants";
import HeaderPropertiesForm from "./inspector/HeaderPropertiesForm";
import SidebarPropertiesForm from "./inspector/SidebarPropertiesForm";
import FooterPropertiesForm from "./inspector/FooterPropertiesForm";
import ButtonPropertiesForm from "./inspector/ButtonPropertiesForm";
import TablePropertiesForm from "./inspector/TablePropertiesForm";
import CardPropertiesForm from "./inspector/CardPropertiesForm";

interface ButtonPropertiesPanelProps {
  button: CanvasComponentInstance | null;
  sectionId: string | null;
  routes: UserRoute[];
  variants: ButtonVariantDef[];
  headerVariants?: HeaderVariantDef[];
  sidebarVariants?: SidebarVariantDef[];
  footerVariants?: FooterVariantDef[];
  tableVariants?: TableVariantDef[];
  cardVariants?: CardVariantDef[];
  onUpdate: (
    sectionId: string,
    buttonId: string,
    updates: Partial<CanvasComponentInstance>,
  ) => void;
  onRemove: (sectionId: string, buttonId: string) => void;
  onClose: () => void;
  onPreviewDialog?: (button: CanvasComponentInstance) => void;
}

export default function ButtonPropertiesPanel({
  button,
  sectionId,
  routes,
  variants,
  headerVariants = [],
  sidebarVariants = [],
  footerVariants = [],
  tableVariants = [],
  cardVariants = [],
  onUpdate,
  onRemove,
  onClose,
  onPreviewDialog,
}: ButtonPropertiesPanelProps) {
  if (!button || !sectionId) return null;

  const componentType = button.componentType ?? "button";

  const titleMap: Record<string, string> = {
    header: "Header Settings",
    sidebar: "Sidebar Settings",
    footer: "Footer Settings",
    button: "Button Settings",
    table: "Table Settings",
    card: "Card Grid Settings",
  };

  const title = titleMap[componentType] || "Component Settings";

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 shadow-lg z-10 select-none">
      <div className="p-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 uppercase tracking-wider">
          <Sliders className="w-3.5 h-3.5 text-indigo-600" />
          {title}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {componentType === "header" && (
          <HeaderPropertiesForm
            component={button}
            sectionId={sectionId}
            variants={headerVariants}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        )}

        {componentType === "sidebar" && (
          <SidebarPropertiesForm
            component={button}
            sectionId={sectionId}
            variants={sidebarVariants}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        )}

        {componentType === "footer" && (
          <FooterPropertiesForm
            component={button}
            sectionId={sectionId}
            variants={footerVariants}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        )}

        {componentType === "button" && (
          <ButtonPropertiesForm
            button={button}
            sectionId={sectionId}
            routes={routes}
            variants={variants}
            onUpdate={onUpdate}
            onRemove={onRemove}
            onPreviewDialog={onPreviewDialog}
          />
        )}

        {componentType === "table" && (
          <TablePropertiesForm
            component={button}
            sectionId={sectionId}
            variants={tableVariants}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        )}

        {componentType === "card" && (
          <CardPropertiesForm
            component={button}
            sectionId={sectionId}
            variants={cardVariants}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        )}
      </div>
    </div>
  );
}
