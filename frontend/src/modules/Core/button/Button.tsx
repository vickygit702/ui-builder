import { ButtonHTMLAttributes } from 'react';
import { BUTTON_VARIANTS } from './button.variants';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
}

// This is the actual reusable core Button -- the same component that will
// later be copied verbatim into an exported user project.
export default function Button({ variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  const variantDef = BUTTON_VARIANTS.find((v) => v.key === variant) ?? BUTTON_VARIANTS[0];

  return (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantDef.classNames} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
