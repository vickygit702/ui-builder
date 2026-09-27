import { pool } from "../../../shared/utils/db";
import {
  SaveProjectInput,
  ProjectResponse,
} from "../../../shared/types/user.types";
import { generateProjectZip } from "./exportGenerator";

export async function getOrCreateUserProject(
  userId: number,
  projectId?: number,
): Promise<ProjectResponse> {
  const client = await pool.connect();
  try {
    let projectRes = projectId
      ? await client.query(
          `SELECT id, name, description FROM users.project WHERE id = $1 AND user_id = $2`,
          [projectId, userId],
        )
      : await client.query(
          `SELECT id, name, description FROM users.project WHERE user_id = $1 ORDER BY updated_at DESC, id DESC LIMIT 1`,
          [userId],
        );

    if (projectRes.rows.length === 0) {
      projectRes = await client.query(
        `INSERT INTO users.project (user_id, name, description)
         VALUES ($1, 'My Awesome Website', 'Built with UI Builder Platform')
         RETURNING id, name, description`,
        [userId],
      );

      const newProjectId = projectRes.rows[0].id;
      const pageRes = await client.query(
        `INSERT INTO users.page (project_id, name, path)
         VALUES ($1, 'Home', '/')
         RETURNING id`,
        [newProjectId],
      );

      return {
        id: newProjectId,
        name: "My Awesome Website",
        description: "Built with UI Builder Platform",
        pages: [
          {
            id: pageRes.rows[0].id,
            name: "Home",
            path: "/",
            components: [],
          },
        ],
      };
    }

    const project = projectRes.rows[0];

    const pagesRes = await client.query(
      `SELECT id, name, path FROM users.page WHERE project_id = $1 ORDER BY id ASC`,
      [project.id],
    );

    const pages = [];
    for (const page of pagesRes.rows) {
      const componentsRes = await client.query(
        `SELECT id, instance_key, component_type, core_component_id, core_variant_id, props, position, order_index
         FROM users.component_instance
         WHERE page_id = $1
         ORDER BY order_index ASC, id ASC`,
        [page.id],
      );

      pages.push({
        id: page.id,
        name: page.name,
        path: page.path,
        components: componentsRes.rows.map((r) => ({
          id: r.id,
          instanceKey: r.instance_key,
          componentType: r.component_type,
          coreComponentId: r.core_component_id,
          coreVariantId: r.core_variant_id,
          props: r.props,
          position: r.position,
          orderIndex: r.order_index,
        })),
      });
    }

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      pages,
    };
  } finally {
    client.release();
  }
}

export async function saveUserProject(
  userId: number,
  input: SaveProjectInput,
): Promise<ProjectResponse> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let projectId = input.projectId;
    if (!projectId) {
      const existing = await client.query(
        `SELECT id FROM users.project WHERE user_id = $1 ORDER BY updated_at DESC, id DESC LIMIT 1`,
        [userId],
      );
      if (existing.rows.length > 0) {
        projectId = existing.rows[0].id;
        await client.query(
          `UPDATE users.project SET name = $1, description = $2, updated_at = now()
           WHERE id = $3 AND user_id = $4`,
          [input.name, input.description ?? "", projectId, userId],
        );
      } else {
        const projRes = await client.query(
          `INSERT INTO users.project (user_id, name, description)
           VALUES ($1, $2, $3)
           RETURNING id`,
          [userId, input.name, input.description ?? ""],
        );
        projectId = projRes.rows[0].id;
      }
    } else {
      await client.query(
        `UPDATE users.project SET name = $1, description = $2, updated_at = now()
         WHERE id = $3 AND user_id = $4`,
        [input.name, input.description ?? "", projectId, userId],
      );
    }

    const coreComponentsRes = await client.query(
      `SELECT c.id AS comp_id, c.key, v.id AS var_id, v.variant_key
       FROM core.component c
       LEFT JOIN core.component_variant v ON v.component_id = c.id`,
    );

    const coreLookup = new Map<
      string,
      { compId: number; variants: Map<string, number> }
    >();
    for (const row of coreComponentsRes.rows) {
      if (!coreLookup.has(row.key)) {
        coreLookup.set(row.key, { compId: row.comp_id, variants: new Map() });
      }
      if (row.variant_key && row.var_id) {
        coreLookup.get(row.key)!.variants.set(row.variant_key, row.var_id);
      }
    }

    await client.query(`DELETE FROM users.page WHERE project_id = $1`, [
      projectId,
    ]);

    const savedPages = [];
    for (const pageInput of input.pages) {
      const pageRes = await client.query(
        `INSERT INTO users.page (project_id, name, path)
         VALUES ($1, $2, $3)
         RETURNING id, name, path`,
        [projectId, pageInput.name, pageInput.path],
      );
      const pageRow = pageRes.rows[0];

      const savedComponents = [];
      let order = 0;
      for (const compInput of pageInput.components) {
        const coreInfo = coreLookup.get(compInput.componentType);
        const compId = compInput.coreComponentId ?? coreInfo?.compId ?? null;
        const variantKey = (compInput.props?.variant as string) || "primary";
        const varId =
          compInput.coreVariantId ??
          (coreInfo ? (coreInfo.variants.get(variantKey) ?? null) : null);

        const compRes = await client.query(
          `INSERT INTO users.component_instance
           (page_id, core_component_id, core_variant_id, instance_key, component_type, props, position, order_index)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id, instance_key, component_type, core_component_id, core_variant_id, props, position, order_index`,
          [
            pageRow.id,
            compId,
            varId,
            compInput.instanceKey,
            compInput.componentType,
            JSON.stringify(compInput.props || {}),
            JSON.stringify(compInput.position || { x: 0, y: 0 }),
            order++,
          ],
        );

        savedComponents.push({
          id: compRes.rows[0].id,
          instanceKey: compRes.rows[0].instance_key,
          componentType: compRes.rows[0].component_type,
          coreComponentId: compRes.rows[0].core_component_id,
          coreVariantId: compRes.rows[0].core_variant_id,
          props: compRes.rows[0].props,
          position: compRes.rows[0].position,
          orderIndex: compRes.rows[0].order_index,
        });
      }

      savedPages.push({
        id: pageRow.id,
        name: pageRow.name,
        path: pageRow.path,
        components: savedComponents,
      });
    }

    await client.query("COMMIT");

    return {
      id: projectId as number,
      name: input.name,
      description: input.description ?? null,
      pages: savedPages,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function exportUserProject(
  userId: number,
  projectId?: number,
  projectData?: SaveProjectInput,
): Promise<{ zipBuffer: Buffer; filename: string }> {
  let project: ProjectResponse;
  if (projectData) {
    project = await saveUserProject(userId, projectData);
  } else {
    project = await getOrCreateUserProject(userId, projectId);
  }

  const zipBuffer = await generateProjectZip(project);

  const manifest = {
    projectName: project.name,
    exportedAt: new Date().toISOString(),
    pagesCount: project.pages.length,
    componentsCount: project.pages.reduce(
      (acc, p) => acc + p.components.length,
      0,
    ),
  };

  await pool.query(
    `INSERT INTO users.project_export (project_id, manifest)
     VALUES ($1, $2)`,
    [project.id, JSON.stringify(manifest)],
  );

  const cleanName = project.name.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
  return {
    zipBuffer,
    filename: `${cleanName}-react-project.zip`,
  };
}
