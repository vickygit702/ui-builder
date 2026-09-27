import { CSSProperties, ReactNode } from "react";
import { SIDEBAR_VARIANTS } from "./sidebar.variants";

interface SidebarProps {
  title?: string;
  variant?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export default function Sidebar({
  title = "Navigation",
  variant = "fixed",
  className = "",
  style,
  children,
}: SidebarProps) {
  const variantDef =
    SIDEBAR_VARIANTS.find((v) => v.key === variant) ?? SIDEBAR_VARIANTS[0];

  return (
    <aside
      style={style}
      className={`h-full min-h-full w-full p-4 flex flex-col justify-between transition-all ${variantDef.classNames} ${className}`}
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
