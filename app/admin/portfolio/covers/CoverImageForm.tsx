"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import { deletePortfolioCover, updatePortfolioCover } from "./actions";
import { initialPortfolioCoverState } from "./types";

type CoverImageFormProps = {
  serviceId: string;
  serviceTitle: string;
  currentCoverUrl: string | null;
};

const fileInputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 file:mr-4 file:rounded file:border-0 file:bg-gold file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-neutral-950 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

export default function CoverImageForm({
  serviceId,
  serviceTitle,
  currentCoverUrl,
}: CoverImageFormProps) {
  const router = useRouter();
  const updateCoverWithId = updatePortfolioCover.bind(null, serviceId);
  const deleteCoverWithId = deletePortfolioCover.bind(null, serviceId);
  const [updateState, updateAction, updatePending] = useActionState(
    updateCoverWithId,
    initialPortfolioCoverState
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteCoverWithId,
    initialPortfolioCoverState
  );
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState<string | null>(
    null
  );
  const objectUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (updateState.success || deleteState.success) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      router.refresh();
    }
  }, [deleteState.success, router, updateState.success]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const file = event.target.files?.[0];
    const nextPreview = file ? URL.createObjectURL(file) : currentCoverUrl;
    objectUrlRef.current = file ? nextPreview : null;
    setSelectedPreviewUrl(file ? nextPreview : null);
  }

  const message = updateState.error ?? deleteState.error;
  const success = updateState.success ?? deleteState.success;
  const pending = updatePending || deletePending;
  const previewUrl = selectedPreviewUrl ?? currentCoverUrl;

  return (
    <div className="space-y-4">
      {previewUrl ? (
        <div
          aria-label={`${serviceTitle} cover preview`}
          role="img"
          className="h-48 rounded border border-neutral-800 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${JSON.stringify(previewUrl)})` }}
        />
      ) : (
        <div className="flex h-48 items-center justify-center rounded border border-dashed border-neutral-800 bg-neutral-950 text-sm text-neutral-500">
          No cover image
        </div>
      )}

      <form action={updateAction} className="space-y-3">
        <label
          htmlFor={`coverImage-${serviceId}`}
          className="block text-xs font-semibold uppercase tracking-[0.15em] text-neutral-300"
        >
          Cover image
        </label>
        <input
          ref={fileInputRef}
          id={`coverImage-${serviceId}`}
          name="coverImage"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className={fileInputClassName}
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-gold px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {currentCoverUrl ? "Update Cover" : "Add Cover"}
        </button>
      </form>

      {currentCoverUrl && (
        <form action={deleteAction}>
          <button
            type="submit"
            disabled={pending}
            className="rounded border border-red-900/60 px-4 py-2 text-sm font-semibold text-red-400 transition-colors hover:border-red-500 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Remove Cover
          </button>
        </form>
      )}

      <p aria-live="polite" className="min-h-5 text-sm">
        {message && <span className="text-red-300">{message}</span>}
        {!message && success && <span className="text-emerald-300">{success}</span>}
      </p>
    </div>
  );
}
