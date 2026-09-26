import { pool } from '../../../shared/utils/db';
import { CreateComponentInput, ComponentResponse } from '../../../shared/types/component.types';

// Saves (or re-finalizes) a component + its variants as ONE transaction.
// Called only when the frontend playground explicitly "finalizes" a component --
// draft experimentation on the frontend never touches the backend.
export async function saveFinalizedComponent(input: CreateComponentInput): Promise<ComponentResponse> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const componentResult = await client.query(
      `INSERT INTO core.component (key, display_name, description, status)
       VALUES ($1, $2, $3, 'finalized')
       ON CONFLICT (key)
       DO UPDATE SET
         display_name = EXCLUDED.display_name,
         description  = EXCLUDED.description,
         status       = 'finalized',
         version      = core.component.version + 1,
         updated_at   = now()
       RETURNING id, key, display_name, description, version, status`,
      [input.key, input.displayName, input.description ?? null]
    );

    const component = componentResult.rows[0];

    // Simplest correct approach for now: replace variants wholesale on every finalize.
    await client.query(`DELETE FROM core.component_variant WHERE component_id = $1`, [component.id]);

    const variantRows = [];
    for (const variant of input.variants) {
      const res = await client.query(
        `INSERT INTO core.component_variant (component_id, variant_key, label, class_names, is_default)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, variant_key, label, class_names, is_default`,
        [component.id, variant.variantKey, variant.label, variant.classNames, variant.isDefault ?? false]
      );
      variantRows.push(res.rows[0]);
    }

    await client.query('COMMIT');

    return {
      id: component.id,
      key: component.key,
      displayName: component.display_name,
      description: component.description,
      version: component.version,
      status: component.status,
      variants: variantRows.map((v) => ({
        id: v.id,
        variantKey: v.variant_key,
        label: v.label,
        classNames: v.class_names,
        isDefault: v.is_default,
      })),
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function listFinalizedComponents(): Promise<ComponentResponse[]> {
  const { rows: components } = await pool.query(
    `SELECT id, key, display_name, description, version, status
     FROM core.component
     WHERE status = 'finalized'
     ORDER BY display_name ASC`
  );

  const results: ComponentResponse[] = [];
  for (const component of components) {
    const { rows: variants } = await pool.query(
      `SELECT id, variant_key, label, class_names, is_default
       FROM core.component_variant
       WHERE component_id = $1
       ORDER BY id ASC`,
      [component.id]
    );

    results.push({
      id: component.id,
      key: component.key,
      displayName: component.display_name,
      description: component.description,
      version: component.version,
      status: component.status,
      variants: variants.map((v) => ({
        id: v.id,
        variantKey: v.variant_key,
        label: v.label,
        classNames: v.class_names,
        isDefault: v.is_default,
      })),
    });
  }

  return results;
}
