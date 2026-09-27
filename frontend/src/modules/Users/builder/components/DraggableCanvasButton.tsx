import { useState, useRef, PointerEvent as ReactPointerEvent } from "react";
import Button from "../../../Core/button/Button";
import Header from "../../../Core/header/Header";
import Sidebar from "../../../Core/sidebar/Sidebar";
import Footer from "../../../Core/footer/Footer";
import {
  CanvasComponentInstance,
  ElementPosition,
} from "../../../types/builder.types";

interface DraggableCanvasButtonProps {
  button: CanvasComponentInstance;
  sectionId: string;
  previewMode: boolean;
  isSelected: boolean;
  onSelect: (sectionId: string, buttonId: string) => void;
  onMove: (
    sectionId: string,
    buttonId: string,
    position: ElementPosition,
  ) => void;
  onPreviewNavigate: (path: string) => void;
}

export default function DraggableCanvasButton({
  button,
  sectionId,
  previewMode,
  isSelected,
  onSelect,
  onMove,
  onPreviewNavigate,
}: DraggableCanvasButtonProps) {
  const [isLiveDragging, setIsLiveDragging] = useState(false);
  const [livePos, setLivePos] = useState<ElementPosition | null>(null);

  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    hasMoved: boolean;
  } | null>(null);

  const posX = livePos ? livePos.x : (button.position?.x ?? 0);
  const posY = livePos ? livePos.y : (button.position?.y ?? 0);

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (previewMode) return;
    if (e.button !== 0) return;

    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = button.position?.x ?? 0;
    const initialY = button.position?.y ?? 0;

    dragStartRef.current = {
      startX,
      startY,
      initialX,
      initialY,
      hasMoved: false,
    };

    function onPointerMove(moveEvent: PointerEvent) {
      if (!dragStartRef.current) return;
      const deltaX = moveEvent.clientX - dragStartRef.current.startX;
      const deltaY = moveEvent.clientY - dragStartRef.current.startY;

      if (!dragStartRef.current.hasMoved && Math.hypot(deltaX, deltaY) > 3) {
        dragStartRef.current.hasMoved = true;
        setIsLiveDragging(true);
      }

      if (dragStartRef.current.hasMoved) {
        const nextX = Math.max(
          0,
          Math.round(dragStartRef.current.initialX + deltaX),
        );
        const nextY = Math.max(
          0,
          Math.round(dragStartRef.current.initialY + deltaY),
        );
        setLivePos({ x: nextX, y: nextY });
      }
    }

    function onPointerUp(upEvent: PointerEvent) {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);

      if (dragStartRef.current?.hasMoved) {
        const deltaX = upEvent.clientX - dragStartRef.current.startX;
        const deltaY = upEvent.clientY - dragStartRef.current.startY;
        const finalX = Math.max(
          0,
          Math.round(dragStartRef.current.initialX + deltaX),
        );
        const finalY = Math.max(
          0,
          Math.round(dragStartRef.current.initialY + deltaY),
        );
        onMove(sectionId, button.id, { x: finalX, y: finalY });
        onSelect(sectionId, button.id);
      } else {
        onSelect(sectionId, button.id);
      }

      setIsLiveDragging(false);
      setLivePos(null);
      dragStartRef.current = null;
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  function handleButtonClick() {
    if (!previewMode) return;

    if (button.actionType === "navigate" && button.actionTarget) {
      onPreviewNavigate(button.actionTarget);
    } else if (button.actionType === "url" && button.actionTarget) {
      window.open(button.actionTarget, "_blank", "noopener,noreferrer");
    } else if (button.actionType === "alert" && button.actionTarget) {
      alert(button.actionTarget);
    }
  }

  function renderComponentContent() {
    if (button.componentType === "header") {
      return (
        <div className="w-[720px] max-w-full">
          <Header title={button.label} variant={button.variant} />
        </div>
      );
    }
    if (button.componentType === "sidebar") {
      return (
        <div className="w-56">
          <Sidebar title={button.label} variant={button.variant}>
            <div className="text-xs text-slate-500 py-0.5">• Home</div>
            <div className="text-xs text-slate-500 py-0.5">• About</div>
          </Sidebar>
        </div>
      );
    }
    if (button.componentType === "footer") {
      return (
        <div className="w-[720px] max-w-full">
          <Footer title={button.label} variant={button.variant} />
        </div>
      );
    }
    return <Button variant={button.variant}>{button.label}</Button>;
  }

  const containerStyle = {
    position: "absolute" as const,
    left: `${posX}px`,
    top: `${posY}px`,
  };

  return (
    <div
      style={containerStyle}
      onPointerDown={handlePointerDown}
      onClick={handleButtonClick}
      className={`group select-none transition-shadow ${
        previewMode
          ? "cursor-pointer"
          : isLiveDragging
            ? "cursor-grabbing z-30"
            : "cursor-grab z-10"
      } ${
        !previewMode && isSelected
          ? "ring-2 ring-indigo-600 ring-offset-2 rounded-md"
          : !previewMode
            ? "hover:ring-1 hover:ring-indigo-400 rounded-md"
            : ""
      }`}
    >
      {!previewMode && (isSelected || isLiveDragging) && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900 text-white text-[10px] font-mono rounded shadow pointer-events-none whitespace-nowrap z-40">
          [{button.componentType || "button"}] X: {posX}px, Y: {posY}px
        </div>
      )}

      <div className={!previewMode ? "pointer-events-none" : ""}>
        {renderComponentContent()}
      </div>
    </div>
  );
}
