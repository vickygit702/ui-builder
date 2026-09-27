import { useState, useCallback, useMemo } from "react";
import {
  UserRoute,
  CanvasComponentInstance,
  SectionType,
  ViewportMode,
  DraggedItemPayload,
  ElementPosition,
} from "../../../types/builder.types";
import { INITIAL_USER_ROUTES } from "../utils/initialRoutes";
import {
  createNewRoute,
  createNewComponentInstance,
  createNewSection,
  moveCanvasButtonAcrossSections,
} from "../utils/builderHelpers";

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
    const newRoute = createNewRoute(name, rawPath);
    setRoutes((prev) => [...prev, newRoute]);
    setActiveRouteId(newRoute.id);
    setActivePreviewPath(newRoute.path);
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
            return {
              ...route,
              sections: moveCanvasButtonAcrossSections(
                route.sections,
                targetSectionId,
                payload,
              ),
            };
          }

          const newButton = createNewComponentInstance(payload);
          const isStructural =
            payload.componentType === "header" ||
            payload.componentType === "sidebar" ||
            payload.componentType === "footer";

          return {
            ...route,
            sections: route.sections.map((sec) => {
              if (sec.id !== targetSectionId) return sec;
              const filteredButtons = isStructural
                ? sec.buttons.filter(
                    (b) => b.componentType !== payload.componentType,
                  )
                : sec.buttons;
              return {
                ...sec,
                buttons: [...filteredButtons, newButton],
              };
            }),
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
      const newSection = createNewSection(type);
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

  const handleExpandSectionHeight = useCallback(
    (sectionId: string, additionalHeight: number = 400): void => {
      setRoutes((prev) =>
        prev.map((r) =>
          r.id === activeRouteId
            ? {
                ...r,
                sections: r.sections.map((s) =>
                  s.id === sectionId
                    ? {
                        ...s,
                        minHeight: (s.minHeight || 540) + additionalHeight,
                      }
                    : s,
                ),
              }
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

  const handleSetHomeRoute = useCallback((routeId: string): void => {
    setRoutes((prev) => {
      const target = prev.find((r) => r.id === routeId);
      if (!target || target.path === "/") return prev;
      return prev.map((r) => {
        if (r.id === routeId) return { ...r, path: "/" };
        if (r.path === "/") {
          const safeSlug = `/${
            r.name
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-") || "home"
          }`;
          return { ...r, path: safeSlug === "/" ? "/home" : safeSlug };
        }
        return r;
      });
    });
    setActivePreviewPath("/");
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
    handleSetHomeRoute,
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
    handleExpandSectionHeight,
    handleSetRoutes,
  };
}
