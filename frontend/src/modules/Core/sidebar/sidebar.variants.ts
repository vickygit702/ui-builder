export interface SidebarVariantDef {
  key: string;
  label: string;
  classNames: string;
  isDefault?: boolean;
}

export const SIDEBAR_VARIANTS: SidebarVariantDef[] = [
  {
    key: "fixed",
    label: "Fixed Light",
    classNames: "w-64 bg-slate-50 border-r border-slate-200 text-slate-800",
    isDefault: true,
  },
  {
    key: "collapsible",
    label: "Minimal/Compact",
    classNames:
      "w-24 hover:w-64 transition-all bg-white border-r border-slate-200 text-slate-700",
  },
  {
    key: "dark",
    label: "Dark Sidebar",
    classNames: "w-64 bg-slate-900 border-r border-slate-800 text-slate-200",
  },
];
