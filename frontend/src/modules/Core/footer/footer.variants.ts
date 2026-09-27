export interface FooterVariantDef {
  key: string;
  label: string;
  classNames: string;
  isDefault?: boolean;
}

export const FOOTER_VARIANTS: FooterVariantDef[] = [
  {
    key: "standard",
    label: "Standard Dark",
    classNames: "bg-slate-900 text-slate-400 py-8 px-6 text-center",
    isDefault: true,
  },
  {
    key: "minimal",
    label: "Minimal Light",
    classNames:
      "bg-white border-t border-slate-200 text-slate-600 py-6 px-6 text-center",
  },
  {
    key: "columns",
    label: "Multi-Column",
    classNames: "bg-slate-950 text-slate-300 py-10 px-8 text-center",
  },
];
