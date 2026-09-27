import { ReactNode, DragEvent } from "react";
import { GripVertical } from "lucide-react";
import { CoreComponentType } from "../../../types/builder.types";

interface SidebarDraggableCardProps {
  componentType: CoreComponentType;
  variantKey: string;
  label: string;
  badgeText?: string;
  previewWrapperClassName?: string;
  onDragStart: (
    e: DragEvent<HTMLDivElement>,
    componentType: CoreComponentType,
    variantKey: string,
    label: string,
  ) => void;
  children: ReactNode;
}

export default function SidebarDraggableCard({
  componentType,
  variantKey,
  label,
  badgeText,
  previewWrapperClassName = "flex items-center justify-center p-1.5 bg-slate-50 rounded border border-slate-100 pointer-events-none",
  onDragStart,
  children,
}: SidebarDraggableCardProps) {
  function handleDrag(e: DragEvent<HTMLDivElement>) {
    onDragStart(e, componentType, variantKey, label);
  }

  return (
    <div
      draggable
      onDragStart={handleDrag}
      className="group border border-slate-200 rounded-lg p-2 bg-white hover:border-indigo-400 hover:shadow-xs cursor-grab active:cursor-grabbing transition-all select-none"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <GripVertical className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500" />
          <span className="text-xs font-medium text-slate-700">{label}</span>
        </div>
        <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-slate-100 text-slate-500">
          {badgeText ?? variantKey}
        </span>
      </div>
      <div className={previewWrapperClassName}>{children}</div>
    </div>
  );
}
