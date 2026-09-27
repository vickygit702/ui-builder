import React, { CSSProperties, ReactNode } from "react";
import { CARD_VARIANTS } from "./card.variants";

export type CardCorner = "none" | "md" | "lg" | "xl" | "2xl";

export interface CardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  actionLabel?: string;
  variant?: string;
  corner?: CardCorner | string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  onClickAction?: () => void;
}

const CORNER_MAP: Record<string, string> = {
  none: "rounded-none",
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

export default function Card({
  title = "Feature Card",
  subtitle = "Interactive Component",
  description = "A versatile card component with configurable shadows, corners, gaps, and heights.",
  badge,
  actionLabel,
  variant = "standard",
  corner = "xl",
  height,
  className = "",
  style,
  children,
  onClickAction,
}: CardProps) {
  const variantDef =
    CARD_VARIANTS.find((v) => v.key === variant) ?? CARD_VARIANTS[0];

  const cornerClass = CORNER_MAP[corner] ?? "rounded-xl";
  const heightStyle: CSSProperties =
    typeof height === "number"
      ? { minHeight: `${height}px` }
      : height
        ? { minHeight: height }
        : {};

  const isDark = variant === "dark";

  return (
    <div
      style={{ ...heightStyle, ...style }}
      className={`shadow-md p-5 flex flex-col justify-between transition-all hover:shadow-lg ${cornerClass} ${variantDef.classNames} ${className}`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          {badge && (
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                isDark
                  ? "bg-slate-800 text-indigo-300 border border-slate-700"
                  : "bg-indigo-50 text-indigo-700 border border-indigo-100"
              }`}
            >
              {badge}
            </span>
          )}
          {subtitle && (
            <span
              className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              {subtitle}
            </span>
          )}
        </div>

        {title && (
          <h4
            className={`font-bold text-base md:text-lg mb-2 leading-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {title}
          </h4>
        )}

        {description && (
          <p
            className={`text-xs md:text-sm line-clamp-4 ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {description}
          </p>
        )}

        {children}
      </div>

      {actionLabel && (
        <div className="mt-4 pt-3 border-t border-slate-100/50 flex justify-end">
          <button
            type="button"
            onClick={onClickAction}
            className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
              isDark
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
            }`}
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}
