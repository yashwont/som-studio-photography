"use client";

import { useActionState } from "react";
import { loginAdmin } from "./actions";
import { initialAdminLoginState } from "./types";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAdmin,
    initialAdminLoginState
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-gold px-5 py-3 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Signing in..." : "Sign In"}
      </button>

      <p aria-live="polite" className="min-h-5 text-sm text-red-300">
        {state.error}
      </p>
    </form>
  );
}
