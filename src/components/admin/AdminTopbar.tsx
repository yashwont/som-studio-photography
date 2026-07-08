import { logoutAdmin } from "@/app/admin/actions";

type AdminTopbarProps = {
  adminName: string;
  adminEmail: string;
  onMenuClick: () => void;
};

export default function AdminTopbar({
  adminName,
  adminEmail,
  onMenuClick,
}: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-neutral-800 bg-neutral-950/95 px-4 py-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded border border-neutral-700 text-neutral-200 hover:border-gold hover:text-gold md:hidden"
        >
          <span className="relative block h-3.5 w-4" aria-hidden="true">
            <span className="absolute left-0 top-0 h-px w-4 bg-current" />
            <span className="absolute left-0 top-1.5 h-px w-4 bg-current" />
            <span className="absolute left-0 top-3 h-px w-4 bg-current" />
          </span>
        </button>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            SomStudioPhotography Admin
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-neutral-50">
            {adminName}
          </p>
          <p className="text-xs text-neutral-400">{adminEmail}</p>
        </div>

        <form action={logoutAdmin}>
          <button
            type="submit"
            className="rounded border border-neutral-700 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-100 transition-colors hover:border-gold hover:text-gold sm:px-4 sm:text-sm"
          >
            Logout
          </button>
        </form>
      </div>
    </header>
  );
}
