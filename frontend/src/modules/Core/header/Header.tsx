import { ReactNode } from "react";
import { HEADER_VARIANTS } from "./header.variants";

interface HeaderProps {
  title?: string;
  variant?: string;
  className?: string;
  children?: ReactNode;
}

export default function Header({
  title = "My Website",
  variant = "standard",
  className = "",
  children,
}: HeaderProps) {
  const variantDef =
    HEADER_VARIANTS.find((v) => v.key === variant) ?? HEADER_VARIANTS[0];

  return (
    <header
      className={`w-full py-3 px-6 flex items-center justify-between transition-colors shadow-sm ${variantDef.classNames} ${className}`}
    >
      <div className="font-bold text-lg tracking-tight select-none">
        {title}
      </div>
      <div className="flex items-center gap-3">{children}</div>
    </header>
  );
}
