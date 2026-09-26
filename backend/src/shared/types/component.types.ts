// API-facing DTOs for the "component" concept in the core schema.
// Kept separate from raw DB row shapes (see db/schema.ts) so the API
// contract can stay stable even if internal column names change.

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
