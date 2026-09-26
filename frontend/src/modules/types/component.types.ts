// Mirrors backend/src/shared/types/component.types.ts by hand for now.
export type ComponentStatus = 'draft' | 'finalized' | 'deprecated';

export interface ComponentVariantInput {
  variantKey: string;
  label: string;
  classNames: string;
  isDefault?: boolean;
}

export interface CreateComponentInput {
  key: string;
  displayName: string;
  description?: string;
  variants: ComponentVariantInput[];
}

export interface ComponentVariantResponse {
  id: number;
  variantKey: string;
  label: string;
  classNames: string;
  isDefault: boolean;
}

export interface ComponentResponse {
  id: number;
  key: string;
  displayName: string;
  description: string | null;
  version: number;
  status: ComponentStatus;
  variants: ComponentVariantResponse[];
}
