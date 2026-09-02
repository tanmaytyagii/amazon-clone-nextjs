import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

const perks = ["Unlimited FREE fast delivery", "Prime Video included", "Early access to deals", "Cancel anytime"];

export function PrimePanel() {
  return (
    <section className="amazon-section">
      <div className="flex flex-col gap-4 rounded border border-slate-200 bg-gradient-to-r from-[#0d2b45] to-[#146eb4] p-5 text-white shadow-card dark:border-white/10 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <p className="text-2xl font-black italic tracking-tight text-amazon-gold">prime</p>
          <h2 className="mt-1 text-xl font-bold sm:text-2xl">Fast, FREE delivery on eligible orders</h2>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-100">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-amazon-gold" />
                {perk}
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/prime"
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-[4px] bg-amazon-gold px-5 text-sm font-bold text-slate-950 shadow-sm hover:bg-[#f5c078]"
        >
          Try Prime free
        </Link>
      </div>
    </section>
  );
}
