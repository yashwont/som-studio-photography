"use client";

import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { contactInfo } from "@/src/data/contact";
import { services } from "@/src/data/services";

interface BookingFormProps {
  idPrefix?: string;
}

const inputClass =
  "w-full rounded border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-950 placeholder:text-neutral-400 focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-colors duration-200";

function getValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function buildDetailLines(formData: FormData) {
  const name = getValue(formData, "name");
  const phone = getValue(formData, "phone");
  const email = getValue(formData, "email");
  const serviceId = getValue(formData, "service");
  const preferredDate = getValue(formData, "preferredDate");
  const dueDate = getValue(formData, "dueDate");
  const message = getValue(formData, "message");
  const service =
    services.find((item) => item.id === serviceId)?.title ?? serviceId;

  return [
    `Name: ${name}`,
    `Phone: ${phone}`,
    email ? `Email: ${email}` : null,
    `Service: ${service}`,
    preferredDate ? `Preferred date: ${preferredDate}` : null,
    dueDate ? `Due date: ${dueDate}` : null,
    message ? `Message: ${message}` : null,
  ].filter((line): line is string => Boolean(line));
}

export default function BookingForm({ idPrefix = "book" }: BookingFormProps) {
  const searchParams = useSearchParams();
  const defaultService = searchParams.get("service") ?? "";
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState("");

  const whatsappBaseUrl = useMemo(
    () => `https://wa.me/${contactInfo.whatsapp.replace("+", "")}`,
    [],
  );

  function handleWhatsApp() {
    const form = formRef.current;
    if (!form || !form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const message = ["New booking request", "", ...buildDetailLines(formData)].join(
      "\n",
    );
    const url = `${whatsappBaseUrl}?text=${encodeURIComponent(message)}`;

    setStatus("Opening WhatsApp with your booking details.");
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleEmail() {
    const form = formRef.current;
    if (!form) {
      return;
    }

    const emailInput = form.elements.namedItem(
      "email",
    ) as HTMLInputElement | null;

    if (emailInput) {
      emailInput.required = true;
      const valid = form.reportValidity();
      emailInput.required = false;
      if (!valid) {
        return;
      }
    } else if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const subject = "Booking Request - Som Studio Photography";
    const body = buildDetailLines(formData).join("\n");
    const url = `mailto:${contactInfo.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setStatus("Opening your email app with your booking details.");
    window.location.href = url;
  }

  return (
    <form
      ref={formRef}
      className="space-y-5"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`${idPrefix}-name`}
            className="mb-1.5 block text-xs text-neutral-500"
          >
            Full Name
          </label>
          <input
            id={`${idPrefix}-name`}
            type="text"
            name="name"
            placeholder="Your name"
            autoComplete="name"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor={`${idPrefix}-phone`}
            className="mb-1.5 block text-xs text-neutral-500"
          >
            Phone Number
          </label>
          <input
            id={`${idPrefix}-phone`}
            type="tel"
            name="phone"
            placeholder="+977-98XXXXXXXX"
            autoComplete="tel"
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-email`}
          className="mb-1.5 block text-xs text-neutral-500"
        >
          Email Address
        </label>
        <input
          id={`${idPrefix}-email`}
          type="email"
          name="email"
          placeholder="your@email.com"
          autoComplete="email"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-service`}
          className="mb-1.5 block text-xs text-neutral-500"
        >
          Service Type
        </label>
        <select
          id={`${idPrefix}-service`}
          name="service"
          defaultValue={defaultService}
          required
          className={inputClass}
        >
          <option value="" disabled>
            Select a service
          </option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`${idPrefix}-preferredDate`}
            className="mb-1.5 block text-xs text-neutral-500"
          >
            Preferred Date
          </label>
          <input
            id={`${idPrefix}-preferredDate`}
            type="date"
            name="preferredDate"
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor={`${idPrefix}-dueDate`}
            className="mb-1.5 block text-xs text-neutral-500"
          >
            Due Date (if applicable)
          </label>
          <input
            id={`${idPrefix}-dueDate`}
            type="date"
            name="dueDate"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-message`}
          className="mb-1.5 block text-xs text-neutral-500"
        >
          Message
        </label>
        <textarea
          id={`${idPrefix}-message`}
          name="message"
          rows={5}
          placeholder="Tell us about your shoot - style, location, any special requests..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleWhatsApp}
          className="w-full rounded bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        >
          Send via WhatsApp
        </button>
        <button
          type="button"
          onClick={handleEmail}
          className="w-full rounded border border-accent px-6 py-3.5 text-sm font-semibold text-accent transition-all duration-200 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        >
          Send via Email
        </button>
      </div>

      <p aria-live="polite" className="min-h-5 text-xs text-neutral-500">
        {status}
      </p>
    </form>
  );
}
