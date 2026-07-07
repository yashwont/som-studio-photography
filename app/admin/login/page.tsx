import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/src/lib/auth/admin";
import { absoluteUrl } from "@/src/lib/seo";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login | SomStudioPhotography",
  alternates: {
    canonical: absoluteUrl("/admin/login"),
  },
};

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-16">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            SomStudioPhotography Admin
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            Sign in to continue
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-300">
            Use your admin email and password to access the dashboard.
          </p>
        </div>

        <div className="rounded border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
