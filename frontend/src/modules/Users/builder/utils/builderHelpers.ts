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
  const isDialog = payload.componentType === "dialog";
  return {
    id: `inst-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    componentType: isDialog ? "button" : (payload.componentType ?? "button"),
    coreComponentId: payload.coreComponentId,
    coreVariantId: payload.coreVariantId,
    variant: isDialog ? "primary" : (payload.variantKey ?? "primary"),
    label: isDialog
      ? `Open ${payload.label || "Dialog"}`
      : payload.label
        ? payload.label
        : "Component",
    actionType: isDialog ? "dialog" : "none",
    dialogTitle: isDialog
      ? `${payload.label || "Feature"} Modal`
      : "Feature Section Modal",
    dialogSize:
      (payload.variantKey as "compact" | "medium" | "large" | "full") ||
      "medium",
    dialogContent:
      "This is the dialog content area. It opens full screen with blurred page background. You can dynamically insert feature blocks, details, or forms here.",
    dialogActionLabel: "Confirm",
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
