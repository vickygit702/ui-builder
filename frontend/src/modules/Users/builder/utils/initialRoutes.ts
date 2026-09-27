import { UserRoute, CanvasSection } from "../../../types/builder.types";

export function createEmptyCanvasSection(): CanvasSection[] {
  return [
    {
      id: "sec-canvas-main",
      name: "Main Canvas",
      type: "canvas",
      title: "Blank Canvas",
      subtitle:
        "Drag and drop components (Header, Sidebar, Buttons, Footer) from the library onto this canvas.",
      buttons: [],
      minHeight: 480,
    },
  ];
}

export const INITIAL_USER_ROUTES: UserRoute[] = [
  {
    id: "route-home",
    path: "/",
    name: "Home",
    sections: createEmptyCanvasSection(),
  },
];
