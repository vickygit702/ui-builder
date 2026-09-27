import { ReactNode } from "react";
import {
  MousePointerClick,
  PanelTop,
  PanelLeft,
  PanelBottom,
  LucideIcon,
} from "lucide-react";
import Button from "./button/Button";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import Footer from "./footer/Footer";
import { BUTTON_VARIANTS } from "./button/button.variants";
import { HEADER_VARIANTS } from "./header/header.variants";
import { SIDEBAR_VARIANTS } from "./sidebar/sidebar.variants";
import { FOOTER_VARIANTS } from "./footer/footer.variants";

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
];
