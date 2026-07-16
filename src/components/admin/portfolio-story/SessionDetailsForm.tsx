"use client";

import { useId } from "react";
import type { SessionDetailsDraft } from "./types";
import { inputClassName, labelClassName } from "./fieldStyles";

export default function SessionDetailsForm({
  value,
  onChange,
}: {
  value: SessionDetailsDraft;
  onChange: (next: SessionDetailsDraft) => void;
}) {
  const uid = useId();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor={`${uid}-studio`} className={labelClassName}>
          Studio <span className="normal-case text-neutral-500">(optional)</span>
        </label>
        <input
          id={`${uid}-studio`}
          name="studio"
          type="text"
          defaultValue={value.studio}
          onChange={(event) => onChange({ ...value, studio: event.target.value })}
          placeholder="SomStudioPhotography"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor={`${uid}-service`} className={labelClassName}>
          Service <span className="normal-case text-neutral-500">(optional)</span>
        </label>
        <input
          id={`${uid}-service`}
          name="service"
          type="text"
          defaultValue={value.service}
          onChange={(event) => onChange({ ...value, service: event.target.value })}
          placeholder="Newborn Photography"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor={`${uid}-location`} className={labelClassName}>
          Location <span className="normal-case text-neutral-500">(optional)</span>
        </label>
        <input
          id={`${uid}-location`}
          name="location"
          type="text"
          defaultValue={value.location}
          onChange={(event) => onChange({ ...value, location: event.target.value })}
          placeholder="Basundhara Studio, Kathmandu"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor={`${uid}-style`} className={labelClassName}>
          Style <span className="normal-case text-neutral-500">(optional)</span>
        </label>
        <input
          id={`${uid}-style`}
          name="style"
          type="text"
          defaultValue={value.style}
          onChange={(event) => onChange({ ...value, style: event.target.value })}
          placeholder="Soft & Natural"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor={`${uid}-setting`} className={labelClassName}>
          Setting <span className="normal-case text-neutral-500">(optional)</span>
        </label>
        <input
          id={`${uid}-setting`}
          name="setting"
          type="text"
          defaultValue={value.setting}
          onChange={(event) => onChange({ ...value, setting: event.target.value })}
          placeholder="Indoor Studio"
          className={inputClassName}
        />
      </div>

      <p className="text-xs text-neutral-500 sm:col-span-2">
        Empty fields are simply omitted from the public page - none of these are required.
      </p>
    </div>
  );
}
