"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  href?: string;
};

const variantClass: Record<NonNullable<Props["variant"]>, string> = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-400 focus-visible:outline-brand-400",
  secondary:
    "border border-white/10 bg-white/5 text-white hover:bg-white/10 focus-visible:outline-white/50",
  ghost: "text-white hover:bg-white/5 focus-visible:outline-white/40",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    { className, variant = "primary", loading, children, disabled, href, ...rest },
    ref
  ) => {
    const common = clsx(
      "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
      variantClass[variant],
      className
    );

    if (href) {
      return (
        <a
          href={href}
          className={common}
          aria-disabled={disabled || loading}
          onClick={(e) => {
            if (disabled || loading) e.preventDefault();
          }}
        >
          {loading && (
            <span className="size-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
          )}
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        className={common}
        disabled={disabled || loading}
        {...rest}
      >
        {loading && (
          <span className="size-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

