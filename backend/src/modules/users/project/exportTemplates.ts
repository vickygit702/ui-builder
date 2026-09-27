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
}

const VARIANTS: Record<string, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
  secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300',
  outline: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50',
  ghost: 'text-indigo-600 hover:bg-indigo-50',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
};

export default function Button({ variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  return (
    <button className={\`px-4 py-2 rounded-md text-sm font-medium transition-colors \${variantClass} \${className}\`} {...rest}>
      {children}
    </button>
  );
}
`;

export const CORE_HEADER_TEMPLATE = `import React from 'react';

interface HeaderProps {
  title?: string;
  variant?: string;
  children?: React.ReactNode;
}

export default function Header({ title = 'Website', variant = 'standard', children }: HeaderProps) {
  const isDark = variant === 'dark';
  return (
    <header className={\`py-4 px-6 flex items-center justify-between border-b \${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}\`}>
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
  children?: React.ReactNode;
}

export default function Sidebar({ title = 'Navigation', variant = 'fixed', children }: SidebarProps) {
  const isDark = variant === 'dark';
  return (
    <aside className={\`w-64 p-4 border rounded-lg shadow-sm \${isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}\`}>
      <div className="font-semibold text-xs uppercase tracking-wider mb-4 text-slate-400">{title}</div>
      <nav className="space-y-2">{children}</nav>
    </aside>
  );
}
`;

export const CORE_FOOTER_TEMPLATE = `import React from 'react';

interface FooterProps {
  title?: string;
  variant?: string;
  children?: React.ReactNode;
}

export default function Footer({ title = '© 2026 SaaSify Inc.', variant = 'standard', children }: FooterProps) {
  const isDark = variant === 'dark' || variant === 'standard';
  return (
    <footer className={\`py-6 px-6 text-center border-t \${isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'}\`}>
      <p className="text-xs mb-2">{title}</p>
      <div className="flex justify-center gap-4">{children}</div>
    </footer>
  );
}
`;
