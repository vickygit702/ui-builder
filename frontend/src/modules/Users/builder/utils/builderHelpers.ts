import {
  UserRoute,
  CanvasSection,
  CanvasComponentInstance,
  DraggedItemPayload,
  SectionType,
} from "../../../types/builder.types";

export function createNewRoute(name: string, rawPath: string): UserRoute {
  const formattedPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  const newId = `route-${Date.now()}`;
  return {
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
}

export function createNewComponentInstance(
  payload: DraggedItemPayload,
): CanvasComponentInstance {
  return {
    id: `inst-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    componentType: payload.componentType ?? "button",
    coreComponentId: payload.coreComponentId,
    coreVariantId: payload.coreVariantId,
    variant: payload.variantKey ?? "primary",
    label: payload.label ? payload.label : "Component",
    actionType: "none",
    position: payload.position ?? { x: 50, y: 50 },
  };
}

export function createNewSection(type: SectionType): CanvasSection {
  return {
    id: `sec-${Date.now()}`,
    name: `${type.toUpperCase()} Section`,
    type,
    title: type === "cta" ? "Call to Action" : "Content Area",
    subtitle: "Drag components here for pixel-perfect placement.",
    buttons: [],
    minHeight: 280,
  };
}
