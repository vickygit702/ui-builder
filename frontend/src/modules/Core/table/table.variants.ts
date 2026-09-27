export interface TableVariantDef {
  key: string;
  label: string;
  classNames: string;
  isDefault?: boolean;
}

export const TABLE_VARIANTS: TableVariantDef[] = [
  {
    key: "standard",
    label: "Standard",
    classNames:
      "min-w-full divide-y divide-slate-200 bg-white text-slate-800 text-sm",
    isDefault: true,
  },
  {
    key: "striped",
    label: "Striped",
    classNames:
      "min-w-full divide-y divide-slate-200 bg-white text-slate-800 text-sm [&_tbody_tr:nth-child(even)]:bg-slate-50/80",
    isDefault: false,
  },
  {
    key: "bordered",
    label: "Bordered Grid",
    classNames:
      "min-w-full border border-slate-200 divide-y divide-slate-200 bg-white text-slate-800 text-sm [&_th]:border-r [&_th]:border-slate-200 [&_td]:border-r [&_td]:border-slate-200",
    isDefault: false,
  },
  {
    key: "compact",
    label: "Compact",
    classNames:
      "min-w-full divide-y divide-slate-200 bg-white text-slate-800 text-xs [&_th]:py-2 [&_th]:px-3 [&_td]:py-1.5 [&_td]:px-3",
    isDefault: false,
  },
];
