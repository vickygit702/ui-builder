import { useState, useCallback } from "react";
import { api } from "../../../utils/api";
import {
  UserRoute,
  CoreComponentType,
  ButtonActionType,
  TableColumnConfig,
  TableRowConfig,
  CardItemConfig,
} from "../../../types/builder.types";
import { INITIAL_USER_ROUTES } from "../utils/initialRoutes";

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

function buildSavePayload(
  projectId: number | null,
  projectName: string,
  routes: UserRoute[],
): ProjectSavePayload {
  return {
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
              dialogTitle: btn.dialogTitle,
              dialogContent: btn.dialogContent,
              dialogSize: btn.dialogSize,
              dialogActionLabel: btn.dialogActionLabel,
              tableColumns: btn.tableColumns,
              tableRows: btn.tableRows,
              tableShowFooter: btn.tableShowFooter,
              cardCount: btn.cardCount,
              cardGap: btn.cardGap,
              cardCorner: btn.cardCorner,
              cardHeight: btn.cardHeight,
              cardItems: btn.cardItems,
              isBaseCard: btn.isBaseCard,
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
}

function mapDbProjectToRoutes(project: StoredProjectResponse): UserRoute[] {
  return project.pages.map((page) => ({
    id: `route-${page.id}`,
    name: page.name,
    path: page.path,
    sections: [
      {
        id: `sec-${page.id}-main`,
        name: "Main Canvas",
        type: "canvas",
        title: "",
        subtitle: "",
        minHeight: 480,
        buttons: page.components.map((c) => {
          const props = c.props || {};
          return {
            id: c.instanceKey,
            componentType: (c.componentType as CoreComponentType) || "button",
            coreComponentId: c.coreComponentId ?? undefined,
            coreVariantId: c.coreVariantId ?? undefined,
            variant: (props.variant as string) || "primary",
            label:
              (props.label as string) || (props.title as string) || "Button",
            actionType: (props.actionType as ButtonActionType) || "none",
            actionTarget: props.actionTarget as string | undefined,
            position: c.position || { x: 50, y: 50 },
            width: props.width as number | undefined,
            height: props.height as number | undefined,
            dialogTitle: props.dialogTitle as string | undefined,
            dialogContent: props.dialogContent as string | undefined,
            dialogSize: props.dialogSize as
              | "compact"
              | "medium"
              | "large"
              | "full"
              | undefined,
            dialogActionLabel: props.dialogActionLabel as string | undefined,
            tableColumns: props.tableColumns as TableColumnConfig[] | undefined,
            tableRows: props.tableRows as TableRowConfig[] | undefined,
            tableShowFooter: props.tableShowFooter as boolean | undefined,
            cardCount: props.cardCount as number | undefined,
            cardGap: props.cardGap as string | undefined,
            cardCorner: props.cardCorner as string | undefined,
            cardHeight: props.cardHeight as number | undefined,
            cardItems: props.cardItems as CardItemConfig[] | undefined,
            isBaseCard: Boolean(props.isBaseCard) || props.cardCount === 0,
            customProps: props,
          };
        }),
      },
    ],
  }));
}

export function useProjectPersistence() {
  const [projectId, setProjectId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjectFromDb = useCallback(async (): Promise<{
    projectId: number;
    projectName: string;
    routes: UserRoute[];
  } | null> => {
    try {
      const res = await api.get<StoredProjectResponse>("/users/project");
      if (res && res.id) {
        setProjectId(res.id);
        const mappedRoutes = mapDbProjectToRoutes(res);
        return {
          projectId: res.id,
          projectName: res.name || "My Website",
          routes: mappedRoutes.length > 0 ? mappedRoutes : INITIAL_USER_ROUTES,
        };
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  const saveProjectToDb = useCallback(
    async (projectName: string, routes: UserRoute[]): Promise<boolean> => {
      setSaving(true);
      setError(null);
      setSaved(false);

      const payload = buildSavePayload(projectId, projectName, routes);

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

  const exportProjectZip = useCallback(
    async (projectName: string, routes: UserRoute[]): Promise<boolean> => {
      setExporting(true);
      setError(null);
      try {
        const payload = buildSavePayload(projectId, projectName, routes);

        const API_BASE =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
        const res = await fetch(`${API_BASE}/users/project/export`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: projectId ?? undefined,
            projectData: payload,
          }),
        });

        if (!res.ok) {
          throw new Error(`Export failed with status: ${res.status}`);
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const cleanName = (projectName || "website")
          .toLowerCase()
          .replace(/[^a-z0-9_-]/g, "-");
        a.download = `${cleanName}-react-project.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        return true;
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to export project ZIP";
        setError(msg);
        return false;
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
    loadProjectFromDb,
    saveProjectToDb,
    exportProjectZip,
  };
}
