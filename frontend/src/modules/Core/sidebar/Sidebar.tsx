import { ReactNode } from "react";
import { SIDEBAR_VARIANTS } from "./sidebar.variants";

interface SidebarProps {
  title?: string;
  variant?: string;
  className?: string;
  children?: ReactNode;
}

export default function Sidebar({
  title = "Navigation",
  variant = "fixed",
  className = "",
  children,
}: SidebarProps) {
  const variantDef =
    SIDEBAR_VARIANTS.find((v) => v.key === variant) ?? SIDEBAR_VARIANTS[0];

  return (
    <aside
      className={`min-h-[200px] p-4 flex flex-col justify-between transition-all rounded-lg shadow-sm border ${variantDef.classNames} ${className}`}
    >
      <div>
        <div className="font-semibold text-xs uppercase tracking-wider mb-3 text-slate-400 select-none">
          {title}
        </div>
        <div className="space-y-1.5">{children}</div>
      </div>
    </aside>
  );
}
