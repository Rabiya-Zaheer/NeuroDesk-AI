import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function FormField({
  id,
  label,
  error,
  children,
  hint,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        {hint}
      </div>
      {children}
      {error && (
        <p className="text-xs font-medium text-(--color-danger)" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className={cn(
        "rounded-2xl border border-(--color-danger)/20 bg-red-50 px-4 py-3 text-sm font-medium text-(--color-danger)",
      )}
    >
      {message}
    </div>
  );
}
