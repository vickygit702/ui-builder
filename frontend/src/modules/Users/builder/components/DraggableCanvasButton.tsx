import { useState, useRef, PointerEvent as ReactPointerEvent } from "react";
import Button from "../../../Core/button/Button";
import Header from "../../../Core/header/Header";
import Sidebar from "../../../Core/sidebar/Sidebar";
import Footer from "../../../Core/footer/Footer";
import Table from "../../../Core/table/Table";
import CardGrid from "../../../Core/card/CardGrid";
import EmptyCard from "../../../Core/card/EmptyCard";
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
  onOpenDialog?: (button: CanvasComponentInstance) => void;
}

export default function DraggableCanvasButton({
  button,
  sectionId,
  previewMode,
  isSelected,
  onSelect,
  onMove,
  onPreviewNavigate,
  onOpenDialog,
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

    const isFullWidth =
      button.componentType === "header" || button.componentType === "footer";

    function onPointerMove(moveEvent: PointerEvent) {
      if (!dragStartRef.current) return;
      const deltaX = moveEvent.clientX - dragStartRef.current.startX;
      const deltaY = moveEvent.clientY - dragStartRef.current.startY;

      if (!dragStartRef.current.hasMoved && Math.hypot(deltaX, deltaY) > 3) {
        dragStartRef.current.hasMoved = true;
        setIsLiveDragging(true);
      }

      if (dragStartRef.current.hasMoved) {
        const nextX = isFullWidth
          ? 0
          : Math.max(0, Math.round(dragStartRef.current.initialX + deltaX));
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
        const finalX = isFullWidth
          ? 0
          : Math.max(0, Math.round(dragStartRef.current.initialX + deltaX));
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
    if (button.actionType === "dialog") {
      if (onOpenDialog) onOpenDialog(button);
      return;
    }

    if (!previewMode) return;

    if (button.actionType === "navigate" && button.actionTarget) {
      onPreviewNavigate(button.actionTarget);
    } else if (button.actionType === "url" && button.actionTarget) {
      window.open(button.actionTarget, "_blank", "noopener,noreferrer");
    } else if (button.actionType === "alert" && button.actionTarget) {
      alert(button.actionTarget);
    }
  }

  const isFullWidthComponent =
    button.componentType === "header" || button.componentType === "footer";

  function renderComponentContent() {
    if (button.componentType === "header") {
      return (
        <div className="w-full">
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
        <div className="w-full">
          <Footer title={button.label} variant={button.variant} />
        </div>
      );
    }
    if (button.componentType === "table") {
      const tableWidth = button.width ? `${button.width}px` : "720px";
      return (
        <div style={{ width: tableWidth, maxWidth: "100%" }}>
          <Table
            columns={button.tableColumns}
            rows={button.tableRows}
            showFooter={button.tableShowFooter}
            variant={button.variant}
          />
        </div>
      );
    }
    if (button.componentType === "card") {
      const isBase = button.isBaseCard || button.cardCount === 0;
      if (isBase) {
        const cardWidth = button.width ? `${button.width}px` : "880px";
        return (
          <div style={{ width: cardWidth, maxWidth: "100%" }}>
            <EmptyCard
              width={cardWidth}
              height={button.cardHeight || button.height || 420}
              corner={button.cardCorner}
              variant={button.variant}
              label={button.label}
            />
          </div>
        );
      }
      const cardWidth = button.width ? `${button.width}px` : "820px";
      return (
        <div style={{ width: cardWidth, maxWidth: "100%" }}>
          <CardGrid
            count={button.cardCount ?? 3}
            cards={button.cardItems}
            gap={button.cardGap ?? "gap-6"}
            corner={button.cardCorner ?? "xl"}
            height={button.cardHeight ?? 240}
            variant={button.variant}
          />
        </div>
      );
    }
    return <Button variant={button.variant}>{button.label}</Button>;
  }

  const isBaseCard =
    button.componentType === "card" &&
    (button.isBaseCard || button.cardCount === 0);

  const containerStyle = isFullWidthComponent
    ? {
        position: "absolute" as const,
        left: 0,
        right: 0,
        top: `${posY}px`,
        width: "100%",
      }
    : {
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
            : isBaseCard
              ? isSelected
                ? "cursor-grab z-[2]"
                : "cursor-grab z-0"
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
          [{button.componentType || "button"}]{" "}
          {isFullWidthComponent
            ? `Y: ${posY}px (Full Width)`
            : `X: ${posX}px, Y: ${posY}px`}
        </div>
      )}

      <div className={!previewMode ? "pointer-events-none" : ""}>
        {renderComponentContent()}
      </div>
    </div>
  );
}
