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

export const CORE_TABLE_TEMPLATE = `import React from 'react';

export type ColumnAlignment = 'left' | 'center' | 'right';

export interface TableColumn {
  id: string;
  header: string;
  headerAlign?: ColumnAlignment;
  bodyAlign?: ColumnAlignment;
  footerText?: string;
}

export interface TableRow {
  id: string;
  cells: Record<string, string>;
}

export interface TableProps {
  columns?: TableColumn[];
  rows?: TableRow[];
  showFooter?: boolean;
  variant?: string;
  className?: string;
  style?: React.CSSProperties;
}

const VARIANTS: Record<string, string> = {
  standard: 'min-w-full divide-y divide-slate-200 text-sm text-left',
  striped: 'min-w-full divide-y divide-slate-200 text-sm text-left [&_tbody_tr:nth-child(even)]:bg-slate-50/70',
  bordered: 'min-w-full divide-y divide-slate-300 text-sm text-left [&_th]:border-r [&_th]:border-slate-200 [&_td]:border-r [&_td]:border-slate-100',
  compact: 'min-w-full divide-y divide-slate-200 text-xs text-left [&_td]:py-2 [&_td]:px-3 [&_th]:py-2 [&_th]:px-3',
};

function getAlignClass(align?: ColumnAlignment): string {
  if (align === 'center') return 'text-center';
  if (align === 'right') return 'text-right';
  return 'text-left';
}

export default function Table({
  columns = [],
  rows = [],
  showFooter = false,
  variant = 'standard',
  className = '',
  style,
}: TableProps) {
  const tableCls = VARIANTS[variant] || VARIANTS.standard;
  const isCompact = variant === 'compact';

  return (
    <div style={style} className={\`w-full overflow-x-auto rounded-lg border border-slate-200 shadow-xs bg-white \${className}\`}>
      <table className={tableCls}>
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {columns.map((col) => {
              const alignCls = getAlignClass(col.headerAlign);
              return (
                <th
                  key={col.id}
                  scope="col"
                  className={\`\${isCompact ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-xs'} font-semibold text-slate-700 uppercase tracking-wider \${alignCls}\`}
                >
                  {col.header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
              {columns.map((col) => {
                const alignCls = getAlignClass(col.bodyAlign);
                return (
                  <td
                    key={col.id}
                    className={\`\${isCompact ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm'} text-slate-800 whitespace-nowrap \${alignCls}\`}
                  >
                    {row.cells[col.id] ?? '—'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        {showFooter && (
          <tfoot className="bg-slate-100/90 border-t-2 border-slate-200 font-semibold text-slate-900">
            <tr>
              {columns.map((col) => {
                const alignCls = getAlignClass(col.bodyAlign || col.headerAlign);
                return (
                  <td
                    key={col.id}
                    className={\`\${isCompact ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm'} \${alignCls}\`}
                  >
                    {col.footerText ?? ''}
                  </td>
                );
              })}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
`;

export const CORE_CARD_TEMPLATE = `import React from 'react';

export interface CardItemData {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  actionLabel?: string;
}

export interface CardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  actionLabel?: string;
  corner?: string;
  height?: number | string;
  variant?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const CORNER_MAP: Record<string, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
};

const VARIANTS: Record<string, string> = {
  standard: 'bg-white border border-slate-200 text-slate-800',
  elevated: 'bg-white border border-slate-100 text-slate-800 shadow-lg',
  outlined: 'bg-transparent border-2 border-slate-300 text-slate-800',
  dark: 'bg-slate-900 border border-slate-800 text-white',
};

export function Card({
  title = 'Card Title',
  subtitle,
  description,
  badge,
  actionLabel,
  corner = 'xl',
  height,
  variant = 'standard',
  className = '',
  style,
  children,
}: CardProps) {
  const cornerCls = CORNER_MAP[corner] || 'rounded-xl';
  const variantCls = VARIANTS[variant] || VARIANTS.standard;
  const isDark = variant === 'dark';

  const dynamicStyle: React.CSSProperties = {
    ...style,
    ...(height ? { minHeight: typeof height === 'number' ? \`\${height}px\` : height } : {}),
  };

  return (
    <div
      style={dynamicStyle}
      className={\`shadow-md p-5 flex flex-col justify-between transition-all hover:shadow-lg \${cornerCls} \${variantCls} \${className}\`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          {badge && (
            <span className={\`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full \${isDark ? 'bg-slate-800 text-indigo-300' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}\`}>
              {badge}
            </span>
          )}
        </div>
        {title && <h3 className={\`font-bold text-base leading-snug \${isDark ? 'text-white' : 'text-slate-900'}\`}>{title}</h3>}
        {subtitle && <p className={\`text-xs mt-0.5 font-medium \${isDark ? 'text-slate-400' : 'text-indigo-600'}\`}>{subtitle}</p>}
        {description && <p className={\`text-xs mt-2.5 leading-relaxed \${isDark ? 'text-slate-300' : 'text-slate-600'}\`}>{description}</p>}
        {children}
      </div>
      {actionLabel && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
          <button
            type="button"
            className={\`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors \${isDark ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'}\`}
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}

export interface CardGridProps {
  count?: number;
  cards?: CardItemData[];
  gap?: string;
  corner?: string;
  height?: number | string;
  variant?: string;
  className?: string;
  style?: React.CSSProperties;
}

const GRID_COLS_MAP: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
};

const GAP_MAP: Record<string, string> = {
  'gap-2': 'gap-2',
  'gap-4': 'gap-4',
  'gap-6': 'gap-6',
  'gap-8': 'gap-8',
};

export function CardGrid({
  count = 3,
  cards = [],
  gap = 'gap-6',
  corner = 'xl',
  height = 240,
  variant = 'standard',
  className = '',
  style,
}: CardGridProps) {
  const actualCount = Math.max(1, Math.min(count, 4));
  const gridCls = GRID_COLS_MAP[actualCount] || GRID_COLS_MAP[3];
  const gapCls = GAP_MAP[gap] || 'gap-6';
  const displayedCards = cards.slice(0, actualCount);

  return (
    <div style={style} className={\`grid \${gridCls} \${gapCls} w-full \${className}\`}>
      {displayedCards.map((item) => (
        <Card
          key={item.id}
          title={item.title}
          subtitle={item.subtitle}
          description={item.description}
          badge={item.badge}
          actionLabel={item.actionLabel}
          corner={corner}
          height={height}
          variant={variant}
        />
      ))}
    </div>
  );
}

export interface EmptyCardProps {
  width?: number | string;
  height?: number | string;
  corner?: string;
  variant?: string;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function EmptyCard({
  width = '100%',
  height = 360,
  corner = 'xl',
  variant = 'standard',
  label,
  className = '',
  style,
  children,
}: EmptyCardProps) {
  const cornerCls = CORNER_MAP[corner] || 'rounded-xl';
  const variantCls = VARIANTS[variant] || VARIANTS.standard;
  const isDark = variant === 'dark';

  const dynamicWidth = typeof width === 'number' ? \`\${width}px\` : width;
  const dynamicHeight = typeof height === 'number' ? \`\${height}px\` : height;

  return (
    <div
      style={{
        width: dynamicWidth,
        minHeight: dynamicHeight,
        ...style,
      }}
      className={\`shadow-md p-6 flex flex-col justify-between transition-all border \${cornerCls} \${variantCls} \${className}\`}
    >
      <div>
        {label && (
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100/60 dark:border-slate-800">
            <span
              className={\`text-xs font-semibold uppercase tracking-wider \${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }\`}
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

export default CardGrid;
`;
