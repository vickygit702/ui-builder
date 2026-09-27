export interface HeaderVariantDef {
  key: string;
  label: string;
  classNames: string;
  isDefault?: boolean;
}

export const HEADER_VARIANTS: HeaderVariantDef[] = [
  {
    key: "standard",
    label: "Standard Light",
    classNames: "bg-white border-b border-slate-200 text-slate-900",
    isDefault: true,
  },
  {
    key: "minimal",
    label: "Minimal",
    classNames: "bg-transparent border-b border-slate-100 text-slate-800",
  },
  {
    key: "dark",
    label: "Dark",
    classNames: "bg-slate-900 border-b border-slate-800 text-white",
  },
];
