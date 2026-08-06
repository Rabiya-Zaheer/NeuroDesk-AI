import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full resize-none rounded-2xl border bg-(--color-surface) px-5 py-4 text-sm text-(--color-ink) placeholder:text-(--color-ink-faint) transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)/40 focus-visible:border-(--color-primary)",
          error ? "border-(--color-danger) focus-visible:ring-(--color-danger)/30" : "border-(--color-border)",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
