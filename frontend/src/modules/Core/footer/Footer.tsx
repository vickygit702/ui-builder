import { ReactNode } from "react";
import { FOOTER_VARIANTS } from "./footer.variants";

interface FooterProps {
  title?: string;
  variant?: string;
  className?: string;
  children?: ReactNode;
}

export default function Footer({
  title = "© 2026 My Website Inc. All rights reserved.",
  variant = "standard",
  className = "",
  children,
}: FooterProps) {
  const variantDef =
    FOOTER_VARIANTS.find((v) => v.key === variant) ?? FOOTER_VARIANTS[0];

  return (
    <footer
      className={`w-full transition-colors rounded-lg shadow-sm border ${variantDef.classNames} ${className}`}
    >
      <p className="text-xs mb-3 select-none">{title}</p>
      {children && (
        <div className="flex items-center justify-center gap-4">{children}</div>
      )}
    </footer>
  );
}
