type AdminStatCardProps = {
  label: string;
  value: number;
};

export default function AdminStatCard({ label, value }: AdminStatCardProps) {
  return (
    <div className="rounded border border-neutral-800 bg-neutral-900 p-5">
      <p className="text-xs uppercase tracking-[0.15em] text-neutral-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-gold">{value}</p>
    </div>
  );
}
