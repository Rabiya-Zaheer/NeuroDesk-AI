"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createWorkspace } from "@/features/workspace/workspace-actions";

export function CreateWorkspaceDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCreate = () => {
    if (!name.trim() || isPending) return;
    setError(null);

    startTransition(async () => {
      const result = await createWorkspace(name);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setOpen(false);
      setName("");
      router.push(`/workspace/${result.workspace.id}`);
      router.refresh();
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setError(null);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a workspace</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="workspace-name">Name</Label>
            <Input
              id="workspace-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Thesis Research"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
              }}
              autoFocus
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <Button onClick={handleCreate} disabled={isPending || !name.trim()} size="sm" className="mt-1">
            {isPending ? "Creating…" : "Create workspace"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}