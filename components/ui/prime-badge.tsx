import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export function PrimeBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-xs font-black italic text-[#0d6ba8]", className)}>
      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#0d6ba8] not-italic">
        <Check className="h-2.5 w-2.5 text-white" strokeWidth={3.5} />
      </span>
      prime
    </span>
  );
}
