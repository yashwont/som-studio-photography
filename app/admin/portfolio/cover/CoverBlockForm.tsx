"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  createPortfolioCoverBlock,
  updatePortfolioCoverBlock,
} from "./actions";
import { initialPortfolioCoverBlockState } from "./types";

type CoverBlockValues = {
  id: string;
  title: string;
  description: string;
  displayOrder: number;
  active: boolean;
  coverUrl: string | null;
};

type ServiceOption = {
  id: string;
  title: string;
  description: string;
  displayOrder: number;
  active: boolean;
  coverUrl: string | null;
};

type CoverBlockFormProps =
  | {
      mode: "create";
      nextDisplayOrder: number;
      services: ServiceOption[];
    }
  | {
      mode: "edit";
      block: CoverBlockValues;
    };

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const fileInputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 file:mr-4 file:rounded file:border-0 file:bg-gold file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-neutral-950 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-neutral-300";

export default function CoverBlockForm(props: CoverBlockFormProps) {
  const router = useRouter();
  const action =
    props.mode === "edit"
      ? updatePortfolioCoverBlock.bind(null, props.block.id)
      : createPortfolioCoverBlock;
  const [state, formAction, pending] = useActionState(
    action,
    initialPortfolioCoverBlockState
  );
  const initialCoverUrl = props.mode === "edit" ? props.block.coverUrl : null;
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
    if (state.success) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      router.refresh();
    }
  }, [router, state.success]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const file = event.target.files?.[0];
    const nextPreview = file ? URL.createObjectURL(file) : null;
    objectUrlRef.current = nextPreview;
    setSelectedPreviewUrl(nextPreview);
  }

  const previewUrl = selectedPreviewUrl ?? initialCoverUrl;
  const title = props.mode === "edit" ? props.block.title : "";
  const description = props.mode === "edit" ? props.block.description : "";
  const displayOrder =
    props.mode === "edit" ? props.block.displayOrder + 1 : props.nextDisplayOrder;
  const active = props.mode === "edit" ? props.block.active : true;

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
        <div>
          {props.mode === "create" ? (
            <>
              <label htmlFor="serviceId" className={labelClassName}>
                Service
              </label>
              <select
                id="serviceId"
                name="serviceId"
                required
                className={inputClassName}
                defaultValue=""
              >
                <option value="" disabled>
                  Choose a service
                </option>
                {props.services.map((service: ServiceOption) => (
                  <option key={service.id} value={service.id}>
                    {service.title}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <>
              <label
                htmlFor={`${props.mode}-title-${title}`}
                className={labelClassName}
              >
                Title
              </label>
              <input
                id={`${props.mode}-title-${title}`}
                name="title"
                type="text"
                required
                defaultValue={title}
                className={inputClassName}
              />
            </>
          )}
        </div>

        <div>
          <label
            htmlFor={`${props.mode}-displayOrder-${title}`}
            className={labelClassName}
          >
            Number
          </label>
          <input
            id={`${props.mode}-displayOrder-${title}`}
            name="displayOrder"
            type="number"
            min={1}
            required
            defaultValue={displayOrder}
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor={`${props.mode}-description-${title}`}
          className={labelClassName}
        >
          Description
        </label>
        <textarea
          id={`${props.mode}-description-${title}`}
          name="description"
          required
          rows={4}
          defaultValue={description}
          className={inputClassName}
        />
      </div>

      <div>
        <span className={labelClassName}>Main picture</span>
        {previewUrl ? (
          <div
            aria-label="Portfolio cover preview"
            role="img"
            className="mb-3 h-44 rounded border border-neutral-800 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${JSON.stringify(previewUrl)})` }}
          />
        ) : (
          <div className="mb-3 flex h-44 items-center justify-center rounded border border-dashed border-neutral-800 bg-neutral-950 text-sm text-neutral-500">
            No main picture
          </div>
        )}
        <input
          ref={fileInputRef}
          name="coverImage"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className={fileInputClassName}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-200">
        <input
          type="checkbox"
          name="active"
          defaultChecked={active}
          className="h-4 w-4 rounded border-neutral-600 bg-neutral-900 text-gold focus:ring-gold/40"
        />
        Show on public portfolio
      </label>

      <div className="flex flex-wrap items-center gap-3 border-t border-neutral-800 pt-5">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-gold px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending
            ? props.mode === "edit"
              ? "Saving..."
              : "Creating..."
            : props.mode === "edit"
              ? "Save Cover Block"
              : "Create Cover Block"}
        </button>

        <p aria-live="polite" className="min-h-5 text-sm">
          {state.error && <span className="text-red-300">{state.error}</span>}
          {!state.error && state.success && (
            <span className="text-emerald-300">{state.success}</span>
          )}
        </p>
      </div>
    </form>
  );
}
