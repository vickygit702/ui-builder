import { ChevronRight, Layers } from "lucide-react";

interface ComponentSidebarRailProps {
  onExpand: () => void;
}

export default function ComponentSidebarRail({
  onExpand,
}: ComponentSidebarRailProps) {
  return (
    <div className="w-12 bg-white border-r border-slate-200 flex flex-col items-center py-3 select-none shrink-0 transition-all">
      <button
        type="button"
        onClick={onExpand}
        title="Expand Component Palette"
        className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={onExpand}
        title="Expand Component Palette"
        className="mt-4 flex flex-col items-center gap-2 group cursor-pointer"
      >
        <div className="p-1.5 rounded bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
          <Layers className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-semibold text-slate-500 group-hover:text-indigo-600 [writing-mode:vertical-lr] rotate-180 uppercase tracking-widest mt-2">
          Components
        </span>
      </button>
    </div>
  );
}
