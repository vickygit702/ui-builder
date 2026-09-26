export interface ButtonVariantDef {
  key: string;
  label: string;
  classNames: string;
  isDefault?: boolean;
}

// This is the *working draft* of variants shown in the playground.
// Nothing here is persisted until "Finalize & Save to Backend" is clicked --
// only that action writes to core.component / core.component_variant.
export const BUTTON_VARIANTS: ButtonVariantDef[] = [
  {
    key: 'primary',
    label: 'Primary',
    classNames: 'bg-indigo-600 text-white hover:bg-indigo-700',
    isDefault: true,
  },
  {
    key: 'secondary',
    label: 'Secondary',
    classNames: 'bg-slate-200 text-slate-900 hover:bg-slate-300',
  },
  {
    key: 'outline',
    label: 'Outline',
    classNames: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50',
  },
  {
    key: 'ghost',
    label: 'Ghost',
    classNames: 'text-indigo-600 hover:bg-indigo-50',
  },
  {
    key: 'danger',
    label: 'Danger',
    classNames: 'bg-red-600 text-white hover:bg-red-700',
  },
];
