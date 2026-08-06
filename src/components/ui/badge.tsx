import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        primary: "bg-(--color-primary-soft) text-(--color-primary)",
        secondary: "bg-(--color-secondary-soft) text-(--color-secondary)",
        accent: "bg-(--color-accent-soft) text-(--color-accent)",
        purple: "bg-(--color-purple-soft) text-(--color-purple)",
        outline: "border border-(--color-border) text-(--color-ink-muted)",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
