import { useState, useCallback, useMemo } from "react";
import {
  UserRoute,
  CanvasSection,
  CanvasComponentInstance,
  SectionType,
  ViewportMode,
  DraggedItemPayload,
  ElementPosition,
} from "../../../types/builder.types";
import { INITIAL_USER_ROUTES } from "../utils/initialRoutes";

export function useWebsiteBuilder() {
  const [routes, setRoutes] = useState<UserRoute[]>(INITIAL_USER_ROUTES);
  const [projectName, setProjectName] = useState<string>("My Website");
  const [activeRouteId, setActiveRouteId] = useState<string>("route-home");
  const [selectedButtonRef, setSelectedButtonRef] = useState<{
    sectionId: string;
    buttonId: string;
  } | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [activePreviewPath, setActivePreviewPath] = useState<string>("/");
  const [viewport, setViewport] = useState<ViewportMode>("desktop");

  const activeRoute = useMemo(() => {
    return routes.find((r) => r.id === activeRouteId) ?? routes[0];
  }, [routes, activeRouteId]);

  const activePreviewRoute = useMemo(() => {
    return routes.find((r) => r.path === activePreviewPath) ?? activeRoute;
  }, [routes, activePreviewPath, activeRoute]);

  const handleSelectRoute = useCallback(
    (routeId: string): void => {
      setActiveRouteId(routeId);
      setSelectedButtonRef(null);
      const found = routes.find((r) => r.id === routeId);
      if (found) setActivePreviewPath(found.path);
    },
    [routes],
  );

  const handleAddRoute = useCallback((name: string, rawPath: string): void => {
    const formattedPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
    const newId = `route-${Date.now()}`;
    const newRoute: UserRoute = {
      id: newId,
      name,
      path: formattedPath,
      sections: [
        {
          id: `sec-canvas-${Date.now()}`,
          name: "Main Canvas",
          type: "canvas",
          title: "",
          subtitle: "",
          buttons: [],
          minHeight: 480,
        },
      ],
    };

    setRoutes((prev) => [...prev, newRoute]);
    setActiveRouteId(newId);
    setActivePreviewPath(formattedPath);
  }, []);

  const handleDeleteRoute = useCallback((routeId: string): void => {
    setRoutes((prev) => {
      const target = prev.find((r) => r.id === routeId);
      if (target?.path === "/") return prev;
      return prev.filter((r) => r.id !== routeId);
    });
    setActiveRouteId((currentId) =>
      currentId === routeId ? "route-home" : currentId,
    );
  }, []);

  const handleDropButton = useCallback(
    (targetSectionId: string, payload: DraggedItemPayload): void => {
      setRoutes((prevRoutes) =>
        prevRoutes.map((route) => {
          if (route.id !== activeRouteId) return route;

          if (
            payload.source === "canvas" &&
            payload.buttonId &&
            payload.sourceSectionId
          ) {
            let movedBtn: CanvasComponentInstance | undefined;
            const updatedSections = route.sections.map((sec) => {
              if (sec.id === payload.sourceSectionId) {
                movedBtn = sec.buttons.find((b) => b.id === payload.buttonId);
                return {
                  ...sec,
                  buttons: sec.buttons.filter((b) => b.id !== payload.buttonId),
                };
              }
              return sec;
            });

            if (!movedBtn) return route;

            const finalBtn: CanvasComponentInstance = payload.position
              ? { ...movedBtn, position: payload.position }
              : movedBtn;

            return {
              ...route,
              sections: updatedSections.map((sec) =>
                sec.id === targetSectionId
                  ? { ...sec, buttons: [...sec.buttons, finalBtn] }
                  : sec,
              ),
            };
          }

          const newButton: CanvasComponentInstance = {
            id: `inst-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            componentType: payload.componentType ?? "button",
            coreComponentId: payload.coreComponentId,
            coreVariantId: payload.coreVariantId,
            variant: payload.variantKey ?? "primary",
            label: payload.label ? payload.label : "Component",
            actionType: "none",
            position: payload.position ?? { x: 50, y: 50 },
          };

          return {
            ...route,
            sections: route.sections.map((sec) =>
              sec.id === targetSectionId
                ? { ...sec, buttons: [...sec.buttons, newButton] }
                : sec,
            ),
          };
        }),
      );
    },
    [activeRouteId],
  );

  const handleMoveButton = useCallback(
    (sectionId: string, buttonId: string, position: ElementPosition): void => {
      setRoutes((prev) =>
        prev.map((route) => {
          if (route.id !== activeRouteId) return route;
          return {
            ...route,
            sections: route.sections.map((sec) => {
              if (sec.id === sectionId) {
                return {
                  ...sec,
                  buttons: sec.buttons.map((b) =>
                    b.id === buttonId ? { ...b, position } : b,
                  ),
                };
              }
              return sec;
            }),
          };
        }),
      );
    },
    [activeRouteId],
  );

  const handleRemoveButton = useCallback(
    (sectionId: string, buttonId: string): void => {
      setRoutes((prev) =>
        prev.map((route) => ({
          ...route,
          sections: route.sections.map((sec) =>
            sec.id === sectionId
              ? {
                  ...sec,
                  buttons: sec.buttons.filter((b) => b.id !== buttonId),
                }
              : sec,
          ),
        })),
      );
      setSelectedButtonRef(null);
    },
    [],
  );

  const handleUpdateButton = useCallback(
    (
      sectionId: string,
      buttonId: string,
      updates: Partial<CanvasComponentInstance>,
    ): void => {
      setRoutes((prev) =>
        prev.map((route) => ({
          ...route,
          sections: route.sections.map((sec) =>
            sec.id === sectionId
              ? {
                  ...sec,
                  buttons: sec.buttons.map((b) =>
                    b.id === buttonId ? { ...b, ...updates } : b,
                  ),
                }
              : sec,
          ),
        })),
      );
    },
    [],
  );

  const handleSelectButton = useCallback(
    (sectionId: string | null, buttonId: string | null): void => {
      if (sectionId && buttonId) {
        setSelectedButtonRef({ sectionId, buttonId });
      } else {
        setSelectedButtonRef(null);
      }
    },
    [],
  );

  const handleTogglePreview = useCallback((): void => {
    setPreviewMode((prev) => {
      const next = !prev;
      if (next && activeRoute) setActivePreviewPath(activeRoute.path);
      return next;
    });
    setSelectedButtonRef(null);
  }, [activeRoute]);

  const handlePreviewNavigate = useCallback((targetPath: string): void => {
    setActivePreviewPath(targetPath);
  }, []);

  const handleAddSection = useCallback(
    (type: SectionType): void => {
      const newSection: CanvasSection = {
        id: `sec-${Date.now()}`,
        name: `${type.toUpperCase()} Section`,
        type,
        title: type === "cta" ? "Call to Action" : "Content Area",
        subtitle: "Drag components here for pixel-perfect placement.",
        buttons: [],
        minHeight: 280,
      };
      setRoutes((prev) =>
        prev.map((r) =>
          r.id === activeRouteId
            ? { ...r, sections: [...r.sections, newSection] }
            : r,
        ),
      );
    },
    [activeRouteId],
  );

  const handleDeleteSection = useCallback(
    (sectionId: string): void => {
      setRoutes((prev) =>
        prev.map((r) =>
          r.id === activeRouteId
            ? { ...r, sections: r.sections.filter((s) => s.id !== sectionId) }
            : r,
        ),
      );
    },
    [activeRouteId],
  );

  const handleSetRoutes = useCallback((newRoutes: UserRoute[]): void => {
    setRoutes(newRoutes);
    if (newRoutes.length > 0) {
      setActiveRouteId(newRoutes[0].id);
      setActivePreviewPath(newRoutes[0].path);
    }
  }, []);

  return {
    routes,
    projectName,
    setProjectName,
    activeRoute,
    activePreviewRoute,
    activeRouteId,
    previewMode,
    activePreviewPath,
    viewport,
    selectedButtonRef,
    handleSelectRoute,
    handleAddRoute,
    handleDeleteRoute,
    handleDropButton,
    handleMoveButton,
    handleRemoveButton,
    handleUpdateButton,
    handleSelectButton,
    handleTogglePreview,
    handlePreviewNavigate,
    setViewport,
    handleAddSection,
    handleDeleteSection,
    handleSetRoutes,
  };
}
