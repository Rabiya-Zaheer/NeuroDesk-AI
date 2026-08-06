import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "h-12 w-full rounded-(--radius-input) border bg-(--color-surface) px-5 text-sm text-(--color-ink) placeholder:text-(--color-ink-faint) transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)/40 focus-visible:border-(--color-primary)",
          error
            ? "border-(--color-danger) focus-visible:ring-(--color-danger)/30"
            : "border-(--color-border)",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
