import { ReactNode, MouseEvent, useEffect } from "react";
import { X } from "lucide-react";
import { DIALOG_VARIANTS } from "./dialog.variants";

interface DialogProps {
  isOpen?: boolean;
  title?: string;
  description?: string;
  variant?: string;
  className?: string;
  onClose?: () => void;
  children?: ReactNode;
  footer?: ReactNode;
  isStaticPreview?: boolean;
}

export default function Dialog({
  isOpen = true,
  title = "Modal Dialog",
  description,
  variant = "medium",
  className = "",
  onClose,
  children,
  footer,
  isStaticPreview = false,
}: DialogProps) {
  const variantDef =
    DIALOG_VARIANTS.find((v) => v.key === variant) ?? DIALOG_VARIANTS[1];

  useEffect(() => {
    if (isStaticPreview || !isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isStaticPreview, onClose]);

  if (!isOpen) return null;

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  }

  const dialogCard = (
    <div
      className={`bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden max-h-[90vh] transition-all select-auto ${variantDef.classNames} ${className}`}
    >
      {/* 1. DIALOG HEADER */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
        <div>
          <h3 className="font-bold text-slate-900 text-base md:text-lg leading-tight">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. DIALOG CONTENT AREA (Dynamically updatable) */}
      <div className="px-6 py-5 overflow-y-auto flex-1 text-sm text-slate-600 space-y-3 bg-white">
        {children || (
          <p className="text-slate-500 text-xs">
            Dialog content goes here. You can dynamically insert feature blocks,
            forms, or details.
          </p>
        )}
      </div>

      {/* 3. DIALOG FOOTER */}
      <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-2.5 shrink-0">
        {footer !== undefined ? (
          footer
        ) : (
          <>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-colors"
              >
                Close
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-md text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
            >
              Confirm
            </button>
          </>
        )}
      </div>
    </div>
  );

  if (isStaticPreview) {
    return <div className="w-full flex justify-center p-2">{dialogCard}</div>;
  }

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm transition-all"
    >
      {dialogCard}
    </div>
  );
}
