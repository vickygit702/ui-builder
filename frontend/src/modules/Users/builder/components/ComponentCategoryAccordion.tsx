import { ReactNode, useState } from "react";
import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";

interface ComponentCategoryAccordionProps {
  title: string;
  count: number;
  icon?: LucideIcon;
  defaultExpanded?: boolean;
  children: ReactNode;
}

export default function ComponentCategoryAccordion({
  title,
  count,
  icon: Icon,
  defaultExpanded = true,
  children,
}: ComponentCategoryAccordionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  function handleToggle() {
    setExpanded((prev) => !prev);
  }

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors select-none"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-3.5 h-3.5 text-indigo-600" />}
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            {title}
          </span>
          <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-600">
            {count}
          </span>
        </div>
        {expanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        )}
      </button>

      {expanded && <div className="p-2 space-y-2">{children}</div>}
    </div>
  );
}
