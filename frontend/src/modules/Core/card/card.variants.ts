export interface CardVariantDef {
  key: string;
  label: string;
  classNames: string;
  isDefault?: boolean;
}

export const CARD_VARIANTS: CardVariantDef[] = [
  {
    key: "standard",
    label: "Standard White",
    classNames: "bg-white border border-slate-200 text-slate-900",
    isDefault: true,
  },
  {
    key: "elevated",
    label: "Elevated Darker",
    classNames: "bg-white border border-slate-100 text-slate-900 shadow-lg",
    isDefault: false,
  },
  {
    key: "outlined",
    label: "Outlined Flat",
    classNames: "bg-slate-50/50 border border-slate-300 text-slate-900",
    isDefault: false,
  },
  {
    key: "dark",
    label: "Dark Theme",
    classNames: "bg-slate-900 border border-slate-800 text-white",
    isDefault: false,
  },
];
