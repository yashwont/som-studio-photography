type AdminPageHeaderProps = {
  title: string;
  description?: string;
};

export default function AdminPageHeader({
  title,
  description,
}: AdminPageHeaderProps) {
  return (
    <div className="border-b border-neutral-800 pb-6">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-50 sm:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-300">
          {description}
        </p>
      )}
    </div>
  );
}
