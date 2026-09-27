export interface DialogVariantDef {
  key: string;
  label: string;
  classNames: string;
  isDefault?: boolean;
}

export const DIALOG_VARIANTS: DialogVariantDef[] = [
  {
    key: "compact",
    label: "Compact (Small)",
    classNames: "max-w-md w-full",
  },
  {
    key: "medium",
    label: "Medium (Standard)",
    classNames: "max-w-2xl w-full",
    isDefault: true,
  },
  {
    key: "large",
    label: "Large (Spacious)",
    classNames: "max-w-4xl w-full",
  },
  {
    key: "full",
    label: "Full Screen",
    classNames: "max-w-6xl w-[95vw] h-[88vh]",
  },
];
