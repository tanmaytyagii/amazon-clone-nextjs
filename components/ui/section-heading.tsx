import Link from "next/link";

export function SectionHeading({
  title,
  subtitle,
  href
}: {
  title: string;
  subtitle?: string;
  href?: string;
}) {
  return (
    <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-lg font-bold tracking-normal text-slate-950 dark:text-white sm:text-xl">{title}</h2>
        {subtitle && <p className="mt-0.5 max-w-2xl text-xs text-slate-600 dark:text-slate-300 sm:text-sm">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="text-sm font-bold text-amazon-teal hover:text-amazon-orange hover:underline">
          See all
        </Link>
      )}
    </div>
  );
}
