import { useState, useCallback } from "react";
import { api } from "../../../utils/api";
import { UserRoute } from "../../../types/builder.types";

interface ComponentInstancePayload {
  instanceKey: string;
  componentType: string;
  coreComponentId?: number;
  coreVariantId?: number;
  props: Record<string, unknown>;
  position: { x: number; y: number };
  orderIndex: number;
}

interface PagePayload {
  name: string;
  path: string;
  components: ComponentInstancePayload[];
}

interface ProjectSavePayload {
  projectId?: number;
  name: string;
  pages: PagePayload[];
}

interface StoredProjectResponse {
  id: number;
  name: string;
  description: string | null;
  pages: {
    id: number;
    name: string;
    path: string;
    components: {
      id: number;
      instanceKey: string;
      componentType: string;
      coreComponentId: number | null;
      coreVariantId: number | null;
      props: Record<string, unknown>;
      position: { x: number; y: number };
      orderIndex: number;
    }[];
  }[];
}

export function useProjectPersistence() {
  const [projectId, setProjectId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveProjectToDb = useCallback(
    async (projectName: string, routes: UserRoute[]): Promise<boolean> => {
      setSaving(true);
      setError(null);
      setSaved(false);

      const payload: ProjectSavePayload = {
        projectId: projectId ?? undefined,
        name: projectName || "My Website",
        pages: routes.map((route) => {
          const components: ComponentInstancePayload[] = [];
          let order = 0;
          route.sections.forEach((sec) => {
            sec.buttons.forEach((btn) => {
              components.push({
                instanceKey: btn.id,
                componentType: btn.componentType || "button",
                coreComponentId: btn.coreComponentId,
                coreVariantId: btn.coreVariantId,
                props: {
                  label: btn.label,
                  variant: btn.variant,
                  actionType: btn.actionType,
                  actionTarget: btn.actionTarget,
                  sectionType: sec.type,
                  width: btn.width,
                  height: btn.height,
                  ...btn.customProps,
                },
                position: btn.position || { x: 50, y: 50 },
                orderIndex: order++,
              });
            });
          });

          return {
            name: route.name,
            path: route.path,
            components,
          };
        }),
      };

      try {
        const res = await api.post<StoredProjectResponse>(
          "/users/project/save",
          payload,
        );
        setProjectId(res.id);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        return true;
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to save project";
        setError(msg);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [projectId],
  );

  const downloadProjectZip = useCallback(
    async (currentProjectId?: number): Promise<void> => {
      setExporting(true);
      setError(null);
      try {
        const API_BASE =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
        const res = await fetch(`${API_BASE}/users/project/export`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: currentProjectId || projectId || 1,
          }),
        });

        if (!res.ok) {
          throw new Error(`Export failed with status: ${res.status}`);
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `my-website-react-project.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to export project ZIP";
        setError(msg);
      } finally {
        setExporting(false);
      }
    },
    [projectId],
  );

  return {
    projectId,
    saving,
    saved,
    exporting,
    error,
    saveProjectToDb,
    downloadProjectZip,
  };
}
