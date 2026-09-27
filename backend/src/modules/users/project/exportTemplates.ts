export function getPackageJson(projectName: string) {
  return {
    name: projectName.toLowerCase().replace(/[^a-z0-9_-]/g, "-"),
    private: true,
    version: "0.1.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "tsc && vite build",
      preview: "vite preview",
    },
    dependencies: {
      react: "^18.3.1",
      "react-dom": "^18.3.1",
      "react-router-dom": "^6.23.1",
      "lucide-react": "^0.378.0",
    },
    devDependencies: {
      "@types/react": "^18.3.3",
      "@types/react-dom": "^18.3.0",
      "@vitejs/plugin-react": "^4.3.0",
      autoprefixer: "^10.4.19",
      postcss: "^8.4.38",
      tailwindcss: "^3.4.3",
      typescript: "^5.4.5",
      vite: "^5.2.11",
    },
  };
}

export const VITE_CONFIG_TEMPLATE = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`;

export const TSCONFIG_TEMPLATE = JSON.stringify(
  {
    compilerOptions: {
      target: "ES2020",
      useDefineForClassFields: true,
      lib: ["ES2020", "DOM", "DOM.Iterable"],
      module: "ESNext",
      skipLibCheck: true,
      moduleResolution: "bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: "react-jsx",
      strict: true,
    },
    include: ["src"],
  },
  null,
  2,
);

export const TAILWIND_CONFIG_TEMPLATE = `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;

export const POSTCSS_CONFIG_TEMPLATE = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

export const CORE_BUTTON_TEMPLATE = `import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  style?: React.CSSProperties;
}

const VARIANTS: Record<string, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
  secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300',
  outline: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50',
  ghost: 'text-indigo-600 hover:bg-indigo-50',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
};

export default function Button({ variant = 'primary', className = '', style, children, ...rest }: ButtonProps) {
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  return (
    <button style={style} className={\`px-4 py-2 rounded-md text-sm font-medium transition-colors \${variantClass} \${className}\`} {...rest}>
      {children}
    </button>
  );
}
`;

export const CORE_HEADER_TEMPLATE = `import React from 'react';

interface HeaderProps {
  title?: string;
  variant?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function Header({ title = 'Website', variant = 'standard', style, children }: HeaderProps) {
  const isDark = variant === 'dark';
  return (
    <header style={style} className={\`py-4 px-6 flex items-center justify-between border-b \${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}\`}>
      <div className="font-bold text-lg tracking-tight">{title}</div>
      <div className="flex items-center gap-3">{children}</div>
    </header>
  );
}
`;

export const CORE_SIDEBAR_TEMPLATE = `import React from 'react';

interface SidebarProps {
  title?: string;
  variant?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function Sidebar({ title = 'Navigation', variant = 'fixed', style, children }: SidebarProps) {
  const isDark = variant === 'dark';
  return (
    <aside style={style} className={\`h-full min-h-full w-full p-4 flex flex-col justify-between \${isDark ? 'bg-slate-900 border-r border-slate-800 text-slate-200' : 'bg-slate-50 border-r border-slate-200 text-slate-800'}\`}>
      <div>
        <div className="font-semibold text-xs uppercase tracking-wider mb-4 text-slate-400">{title}</div>
        <nav className="space-y-2">{children}</nav>
      </div>
    </aside>
  );
}
`;

export const CORE_FOOTER_TEMPLATE = `import React from 'react';

interface FooterProps {
  title?: string;
  variant?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function Footer({ title = '© 2026 SaaSify Inc.', variant = 'standard', style, children }: FooterProps) {
  const isDark = variant === 'dark' || variant === 'standard';
  return (
    <footer style={style} className={\`py-6 px-6 text-center border-t \${isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'}\`}>
      <p className="text-xs mb-2">{title}</p>
      <div className="flex justify-center gap-4">{children}</div>
    </footer>
  );
}
`;

export const CORE_DIALOG_TEMPLATE = `import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  isOpen?: boolean;
  title?: string;
  variant?: string;
  onClose?: () => void;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

const SIZES: Record<string, string> = {
  compact: 'max-w-md w-full',
  medium: 'max-w-2xl w-full',
  large: 'max-w-4xl w-full',
  full: 'max-w-6xl w-[95vw] h-[90vh]',
};

export default function Dialog({
  isOpen = true,
  title = 'Modal Dialog',
  variant = 'medium',
  onClose,
  children,
  footer,
}: DialogProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = SIZES[variant] || SIZES.medium;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm transition-all"
    >
      <div className={\`bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden max-h-[90vh] transition-all \${sizeClass}\`}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
          <h3 className="font-bold text-slate-900 text-base md:text-lg">{title}</h3>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="px-6 py-5 overflow-y-auto flex-1 text-sm text-slate-600 bg-white">
          {children}
        </div>
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5 shrink-0">
          {footer || (
            <>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300"
                >
                  Close
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-md text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs"
              >
                Confirm
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
`;
