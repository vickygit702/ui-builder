export type ButtonActionType = "navigate" | "url" | "alert" | "dialog" | "none";

export type CoreComponentType =
  | "button"
  | "header"
  | "sidebar"
  | "footer"
  | "dialog"
  | "table"
  | "card";

export type ColumnAlignment = "left" | "center" | "right";

export interface TableColumnConfig {
  id: string;
  header: string;
  headerAlign?: ColumnAlignment;
  bodyAlign?: ColumnAlignment;
  footerText?: string;
}

export interface TableRowConfig {
  id: string;
  cells: Record<string, string>;
}

export interface CardItemConfig {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  actionLabel?: string;
}

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
  // Table-specific properties
  tableColumns?: TableColumnConfig[];
  tableRows?: TableRowConfig[];
  tableShowFooter?: boolean;
  // Card-specific properties
  cardCount?: number;
  cardGap?: string;
  cardCorner?: string;
  cardHeight?: number;
  cardItems?: CardItemConfig[];
  isBaseCard?: boolean;
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
  cardCount?: number;
  isBaseCard?: boolean;
}

export interface UserAuthData {
  id: number;
  email: string;
  role: string;
  token: string;
}
