import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/auth/admin";
import { logoutAdmin } from "./actions";

export const metadata: Metadata = {
  title: "Admin Dashboard | SomStudioPhotography",
};

export default async function AdminPage() {
  const admin = await requireAdmin();

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10">
        <header className="flex items-center justify-between border-b border-neutral-800 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              SomStudioPhotography Admin
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Admin dashboard
            </h1>
          </div>

          <form action={logoutAdmin}>
            <button
              type="submit"
              className="rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            >
              Logout
            </button>
          </form>
        </header>

        <section className="grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded border border-neutral-800 bg-neutral-900 p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-neutral-400">
              Logged in as
            </p>
            <p className="mt-2 text-lg font-semibold text-neutral-50">
              {admin.name}
            </p>
            <p className="mt-1 text-sm text-neutral-300">{admin.email}</p>
          </div>

          <div className="rounded border border-neutral-800 bg-neutral-900 p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-neutral-400">
              Admin tools
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-300">
              Dashboard shell only. CRUD screens arrive in later phases.
            </p>
          </div>

          <div className="rounded border border-neutral-800 bg-neutral-900 p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-neutral-400">
              Next phase
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-300">
              Services CRUD is the first admin area planned after auth.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
