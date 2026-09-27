import { ReactNode } from "react";
import {
  MousePointerClick,
  PanelTop,
  PanelLeft,
  PanelBottom,
  AppWindow,
  Table as TableIcon,
  LayoutGrid,
  LucideIcon,
} from "lucide-react";
import Button from "./button/Button";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import Footer from "./footer/Footer";
import Dialog from "./dialog/Dialog";
import Table from "./table/Table";
import CardGrid from "./card/CardGrid";
import { BUTTON_VARIANTS } from "./button/button.variants";
import { HEADER_VARIANTS } from "./header/header.variants";
import { SIDEBAR_VARIANTS } from "./sidebar/sidebar.variants";
import { FOOTER_VARIANTS } from "./footer/footer.variants";
import { DIALOG_VARIANTS } from "./dialog/dialog.variants";
import { TABLE_VARIANTS } from "./table/table.variants";
import { CARD_VARIANTS } from "./card/card.variants";

export interface VariantDefinition {
  key: string;
  label: string;
  classNames: string;
  isDefault?: boolean;
}

export interface CoreComponentRegistryItem {
  key: string;
  displayName: string;
  description: string;
  category: "Element" | "Layout";
  icon: LucideIcon;
  variants: VariantDefinition[];
  renderVariantPreview: (variant: VariantDefinition) => ReactNode;
}

export const CORE_COMPONENTS_REGISTRY: CoreComponentRegistryItem[] = [
  {
    key: "button",
    displayName: "Button",
    description:
      "Core reusable interactive button with style and intent variants.",
    category: "Element",
    icon: MousePointerClick,
    variants: BUTTON_VARIANTS,
    renderVariantPreview: (v) => <Button variant={v.key}>{v.label}</Button>,
  },
  {
    key: "header",
    displayName: "Header",
    description:
      "Top navigation header bar with brand title, actions, and theme styling.",
    category: "Layout",
    icon: PanelTop,
    variants: HEADER_VARIANTS,
    renderVariantPreview: (v) => (
      <div className="w-full border border-slate-200 rounded-md overflow-hidden shadow-xs">
        <Header variant={v.key} title="Acme Inc.">
          <span className="text-xs px-2.5 py-1 bg-indigo-600 text-white rounded font-medium shadow-xs">
            Sign In
          </span>
        </Header>
      </div>
    ),
  },
  {
    key: "sidebar",
    displayName: "Sidebar",
    description:
      "Side navigation column with structured sections and menu items.",
    category: "Layout",
    icon: PanelLeft,
    variants: SIDEBAR_VARIANTS,
    renderVariantPreview: (v) => (
      <div className="w-full max-w-xs border border-slate-200 rounded-md overflow-hidden shadow-xs">
        <Sidebar variant={v.key} title="Workspace">
          <div className="text-xs py-1.5 px-2.5 rounded bg-indigo-50 text-indigo-700 font-medium">
            Dashboard
          </div>
          <div className="text-xs py-1.5 px-2.5 rounded text-slate-600 hover:bg-slate-100">
            Pages
          </div>
          <div className="text-xs py-1.5 px-2.5 rounded text-slate-600 hover:bg-slate-100">
            Settings
          </div>
        </Sidebar>
      </div>
    ),
  },
  {
    key: "footer",
    displayName: "Footer",
    description:
      "Page footer with copyright notices, secondary links, and branding.",
    category: "Layout",
    icon: PanelBottom,
    variants: FOOTER_VARIANTS,
    renderVariantPreview: (v) => (
      <div className="w-full border border-slate-200 rounded-md overflow-hidden shadow-xs">
        <Footer variant={v.key} title="© 2026 Acme Corp. All rights reserved.">
          <span className="text-xs hover:underline cursor-pointer">
            Privacy
          </span>
          <span className="text-xs hover:underline cursor-pointer">Terms</span>
          <span className="text-xs hover:underline cursor-pointer">
            Support
          </span>
        </Footer>
      </div>
    ),
  },
  {
    key: "dialog",
    displayName: "Dialog",
    description:
      "Modal dialog with blurred page backdrop, dynamic content, and compact, medium, large, full sizes.",
    category: "Layout",
    icon: AppWindow,
    variants: DIALOG_VARIANTS,
    renderVariantPreview: (v) => (
      <div className="w-full max-w-sm">
        <Dialog
          variant={v.key}
          title="Sample Dialog"
          description="Modal dialog preview with header, body, and actions."
          isStaticPreview={true}
        >
          <p className="text-xs text-slate-600">
            This is dynamic content inside the dialog. You can place feature
            blocks, details, or forms here.
          </p>
        </Dialog>
      </div>
    ),
  },
  {
    key: "table",
    displayName: "Table",
    description:
      "Core data table with custom header columns, column-wise text alignments, and optional footer.",
    category: "Element",
    icon: TableIcon,
    variants: TABLE_VARIANTS,
    renderVariantPreview: (v) => (
      <div className="w-full max-w-md">
        <Table variant={v.key} showFooter={true} />
      </div>
    ),
  },
  {
    key: "card",
    displayName: "Card Grid",
    description:
      "Responsive card grid with basic shadow (md), configurable card count, gaps, corners, and heights.",
    category: "Layout",
    icon: LayoutGrid,
    variants: CARD_VARIANTS,
    renderVariantPreview: (v) => (
      <div className="w-full max-w-md">
        <CardGrid variant={v.key} count={2} gap="gap-3" height={160} />
      </div>
    ),
  },
];
