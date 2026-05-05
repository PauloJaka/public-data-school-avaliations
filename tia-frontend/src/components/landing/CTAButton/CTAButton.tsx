import './style.css';
import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
}

export function CTAButton({ variant = 'primary', className, children, ...rest }: CTAButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        'inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        variant === 'primary' &&
          'bg-cta text-white shadow-[0_8px_24px_rgba(249,115,22,0.35)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(249,115,22,0.45)]',
        variant === 'ghost' &&
          'border border-border bg-surface text-text backdrop-blur hover:bg-soft shadow-sm',
        className,
      )}
    >
      {children}
    </button>
  );
}
