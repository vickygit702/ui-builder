import { CSSProperties, ReactNode } from "react";
import { CARD_VARIANTS } from "./card.variants";

export interface EmptyCardProps {
  width?: number | string;
  height?: number | string;
  corner?: string;
  variant?: string;
  label?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const CORNER_MAP: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "rounded-none": "rounded-none",
  "rounded-md": "rounded-md",
  "rounded-lg": "rounded-lg",
  "rounded-xl": "rounded-xl",
  "rounded-2xl": "rounded-2xl",
};

export default function EmptyCard({
  width = "100%",
  height = 360,
  corner = "xl",
  variant = "standard",
  label,
  className = "",
  style,
  children,
}: EmptyCardProps) {
  const variantDef =
    CARD_VARIANTS.find((v) => v.key === variant) ?? CARD_VARIANTS[0];
  const cornerClass = CORNER_MAP[corner] ?? "rounded-xl";
  const isDark = variant === "dark";

  const dynamicWidth = typeof width === "number" ? `${width}px` : width;
  const dynamicHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      style={{
        width: dynamicWidth,
        minHeight: dynamicHeight,
        ...style,
      }}
      className={`shadow-md p-6 flex flex-col justify-between transition-all border ${cornerClass} ${variantDef.classNames} ${className}`}
    >
      <div>
        {label && (
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100/60 dark:border-slate-800">
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {label}
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              Base Container
            </span>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
