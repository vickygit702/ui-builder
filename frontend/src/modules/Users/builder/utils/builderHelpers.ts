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
  const isTable = payload.componentType === "table";
  const isCard = payload.componentType === "card";

  const instance: CanvasComponentInstance = {
    id: `inst-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    componentType: isDialog ? "button" : (payload.componentType ?? "button"),
    coreComponentId: payload.coreComponentId,
    coreVariantId: payload.coreVariantId,
    variant: isDialog ? "primary" : (payload.variantKey ?? "primary"),
    label: isDialog
      ? `Open ${payload.label || "Dialog"}`
      : payload.label
        ? payload.label
        : isTable
          ? "Data Table"
          : isCard
            ? "Card Grid"
            : "Component",
    actionType: isDialog ? "dialog" : "none",
    position: payload.position ?? { x: 50, y: 50 },
  };

  if (isDialog) {
    instance.dialogTitle = `${payload.label || "Feature"} Modal`;
    instance.dialogSize =
      (payload.variantKey as "compact" | "medium" | "large" | "full") ||
      "medium";
    instance.dialogContent =
      "This is the dialog content area. It opens full screen with blurred page background. You can dynamically insert feature blocks, details, or forms here.";
    instance.dialogActionLabel = "Confirm";
  }

  if (isTable) {
    instance.width = 720;
    instance.tableShowFooter = false;
    instance.tableColumns = [
      {
        id: "col-1",
        header: "Item",
        headerAlign: "left",
        bodyAlign: "left",
        footerText: "Total",
      },
      {
        id: "col-2",
        header: "Category",
        headerAlign: "center",
        bodyAlign: "center",
        footerText: "—",
      },
      {
        id: "col-3",
        header: "Status",
        headerAlign: "center",
        bodyAlign: "center",
        footerText: "Active",
      },
      {
        id: "col-4",
        header: "Amount",
        headerAlign: "right",
        bodyAlign: "right",
        footerText: "$2,400.00",
      },
    ];
    instance.tableRows = [
      {
        id: "row-1",
        cells: {
          "col-1": "Pro Plan Subscription",
          "col-2": "Software",
          "col-3": "Active",
          "col-4": "$499.00",
        },
      },
      {
        id: "row-2",
        cells: {
          "col-1": "Cloud Infrastructure",
          "col-2": "Hosting",
          "col-3": "Active",
          "col-4": "$1,400.00",
        },
      },
      {
        id: "row-3",
        cells: {
          "col-1": "Dedicated Support SLA",
          "col-2": "Services",
          "col-3": "Active",
          "col-4": "$501.00",
        },
      },
    ];
  }

  if (isCard) {
    const isBase = payload.isBaseCard || payload.cardCount === 0;
    if (isBase) {
      instance.width = payload.width || 880;
      instance.height = payload.height || 420;
      instance.cardHeight = payload.height || 420;
      instance.cardCount = 0;
      instance.isBaseCard = true;
      instance.cardCorner = "xl";
      instance.label = payload.label || "Container Panel";
    } else {
      const cardCount = payload.cardCount ?? 3;
      instance.width = 820;
      instance.cardCount = cardCount;
      instance.isBaseCard = false;
      instance.cardGap = "gap-6";
      instance.cardCorner = "xl";
      instance.cardHeight = 240;
      instance.cardItems = [
        {
          id: "card-1",
          title: "Analytics Engine",
          subtitle: "Real-time Metrics",
          description:
            "Monitor visitor engagement and conversion metrics with automated visual dashboards.",
          badge: "Analytics",
        },
        {
          id: "card-2",
          title: "Cloud Hosting",
          subtitle: "Edge Scalability",
          description:
            "Deploy apps on low-latency edge servers with instant auto-scaling and zero downtime.",
          badge: "Cloud",
        },
        {
          id: "card-3",
          title: "Enterprise Security",
          subtitle: "Compliance",
          description:
            "End-to-end data encryption, SOC2 certified hosting, and role-based access control.",
          badge: "Secure",
        },
        {
          id: "card-4",
          title: "Automations",
          subtitle: "Productivity",
          description:
            "Build custom event-driven workflows and automate repetitive administrative tasks.",
          badge: "Fast",
        },
      ];
    }
  }

  return instance;
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

export function moveCanvasButtonAcrossSections(
  sections: CanvasSection[],
  targetSectionId: string,
  payload: DraggedItemPayload,
): CanvasSection[] {
  let movedBtn: CanvasComponentInstance | undefined;
  const updatedSections = sections.map((sec) => {
    if (sec.id === payload.sourceSectionId) {
      movedBtn = sec.buttons.find((b) => b.id === payload.buttonId);
      return {
        ...sec,
        buttons: sec.buttons.filter((b) => b.id !== payload.buttonId),
      };
    }
    return sec;
  });

  if (!movedBtn) return sections;

  const finalBtn: CanvasComponentInstance = payload.position
    ? { ...movedBtn, position: payload.position }
    : movedBtn;

  return updatedSections.map((sec) =>
    sec.id === targetSectionId
      ? { ...sec, buttons: [...sec.buttons, finalBtn] }
      : sec,
  );
}
