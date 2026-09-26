// Hand-maintained mirror of the SQL migrations in db/migration/*.sql.
// Keep this in sync manually whenever a migration changes a table shape.

export const SCHEMA = 'core';

export const TABLES = {
  COMPONENT: `${SCHEMA}.component`,
  COMPONENT_VARIANT: `${SCHEMA}.component_variant`,
} as const;

export type ComponentStatus = 'draft' | 'finalized' | 'deprecated';

export interface ComponentRow {
  id: number;
  key: string;
  display_name: string;
  description: string | null;
  version: number;
  status: ComponentStatus;
  created_at: Date;
  updated_at: Date;
}

export interface ComponentVariantRow {
  id: number;
  component_id: number;
  variant_key: string;
  label: string;
  class_names: string;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}
