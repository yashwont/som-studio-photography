"use client";

import { useActionState, useState } from "react";
import { updateSocialLinks } from "./actions";
import { initialEditSocialLinksState } from "./types";
import type { ContactInfo } from "@/src/types/site";

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

type SocialLinkDraft = {
  clientId: string;
  platform: string;
  label: string;
  href: string;
};

function createEmptyLink(): SocialLinkDraft {
  return { clientId: crypto.randomUUID(), platform: "", label: "", href: "" };
}

export default function SocialLinksForm({ contact }: { contact: ContactInfo }) {
  const [state, formAction, pending] = useActionState(
    updateSocialLinks,
    initialEditSocialLinksState
  );
  const [links, setLinks] = useState<SocialLinkDraft[]>(() =>
    contact.socialLinks.length > 0
      ? contact.socialLinks.map((link) => ({ clientId: crypto.randomUUID(), ...link }))
      : [createEmptyLink()]
  );

  function updateLink(clientId: string, patch: Partial<SocialLinkDraft>) {
    setLinks((current) =>
      current.map((link) => (link.clientId === clientId ? { ...link, ...patch } : link))
    );
  }

  function removeLink(clientId: string) {
    setLinks((current) => current.filter((link) => link.clientId !== clientId));
  }

  return (
    <form action={formAction} className="space-y-6">
      {links.map((link) => (
        <input
          key={`id-${link.clientId}`}
          type="hidden"
          name="linkIds"
          value={link.clientId}
          readOnly
        />
      ))}

      <div className="grid gap-4 sm:grid-cols-2">
        {links.map((link, index) => (
          <div
            key={link.clientId}
            className="space-y-3 rounded border border-neutral-800 bg-neutral-950/40 p-4"
          >
            <div className="flex items-center justify-between">
              <p className={labelClassName}>Link {index + 1}</p>
              <button
                type="button"
                onClick={() => removeLink(link.clientId)}
                className="rounded border border-red-900/60 px-2.5 py-1 text-xs font-semibold text-red-400 transition-colors hover:border-red-500 hover:text-red-300"
              >
                Remove
              </button>
            </div>

            <div>
              <label
                htmlFor={`platform-${link.clientId}`}
                className={labelClassName}
              >
                Platform{" "}
                <span className="normal-case text-neutral-500">
                  (instagram, facebook, tiktok, linkedin, twitter, youtube,
                  pinterest, whatsapp, telegram, or email - anything else
                  shows a generic link icon)
                </span>
              </label>
              <input
                id={`platform-${link.clientId}`}
                name={`platform__${link.clientId}`}
                type="text"
                value={link.platform}
                onChange={(event) => updateLink(link.clientId, { platform: event.target.value })}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor={`label-${link.clientId}`} className={labelClassName}>
                Label
              </label>
              <input
                id={`label-${link.clientId}`}
                name={`label__${link.clientId}`}
                type="text"
                value={link.label}
                onChange={(event) => updateLink(link.clientId, { label: event.target.value })}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor={`href-${link.clientId}`} className={labelClassName}>
                URL
              </label>
              <input
                id={`href-${link.clientId}`}
                name={`href__${link.clientId}`}
                type="text"
                value={link.href}
                onChange={(event) => updateLink(link.clientId, { href: event.target.value })}
                className={inputClassName}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setLinks((current) => [...current, createEmptyLink()])}
        className="rounded border border-dashed border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-300 transition-colors hover:border-gold hover:text-gold"
      >
        + Add Link
      </button>

      <div className="flex flex-wrap items-center gap-4 border-t border-neutral-800 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-gold px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>

        <p aria-live="polite" className="text-sm text-red-300">
          {state.error}
        </p>

        {!state.error && state.success && (
          <p aria-live="polite" className="text-sm text-green-400">
            Saved.
          </p>
        )}
      </div>
    </form>
  );
}
