export type ButtonActionType = "navigate" | "url" | "alert" | "dialog" | "none";

export type CoreComponentType =
  | "button"
  | "header"
  | "sidebar"
  | "footer"
  | "dialog";

export interface ElementPosition {
  x: number;
  y: number;
}

export interface CanvasComponentInstance {
  id: string;
  componentType: CoreComponentType;
  coreComponentId?: number;
  coreVariantId?: number;
  variant: string;
  label: string;
  actionType: ButtonActionType;
  actionTarget?: string;
  position?: ElementPosition;
  width?: number;
  height?: number;
  dialogTitle?: string;
  dialogContent?: string;
  dialogSize?: "compact" | "medium" | "large" | "full";
  dialogActionLabel?: string;
  customProps?: Record<string, unknown>;
}

// Backwards-compatible alias
export type CanvasButton = CanvasComponentInstance;

export type SectionType =
  | "navbar"
  | "hero"
  | "features"
  | "cta"
  | "footer"
  | "canvas";

export interface CanvasSection {
  id: string;
  name: string;
  type: SectionType;
  title?: string;
  subtitle?: string;
  buttons: CanvasComponentInstance[];
  minHeight?: number;
}

export interface UserRoute {
  id: string;
  path: string;
  name: string;
  sections: CanvasSection[];
}

export type ViewportMode = "desktop" | "tablet" | "mobile";

export interface DraggedItemPayload {
  source: "palette" | "canvas";
  componentType?: CoreComponentType;
  coreComponentId?: number;
  coreVariantId?: number;
  variantKey?: string;
  label?: string;
  buttonId?: string;
  sourceSectionId?: string;
  offsetX?: number;
  offsetY?: number;
  position?: ElementPosition;
  width?: number;
  height?: number;
}

export interface UserAuthData {
  id: number;
  email: string;
  role: string;
  token: string;
}
