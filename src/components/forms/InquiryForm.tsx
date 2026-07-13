"use client";

import { FormEvent, useMemo, useState } from "react";
import { contactInfo } from "@/src/data/contact";
import { submitInquiry } from "@/src/lib/actions/inquiry";

type ServiceOption = {
  id: string;
  title: string;
};

interface InquiryFormProps {
  idPrefix?: string;
  defaultServiceId?: string;
  services: ServiceOption[];
}

const inputClass =
  "w-full rounded border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-950 placeholder:text-neutral-900 focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-colors duration-200";

function getValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function buildWhatsAppMessage(formData: FormData, services: ServiceOption[]) {
  const name = getValue(formData, "name");
  const phone = getValue(formData, "phone");
  const email = getValue(formData, "email");
  const serviceId = getValue(formData, "service");
  const preferredDate = getValue(formData, "date");
  const message = getValue(formData, "message");
  const service =
    services.find((item: ServiceOption) => item.id === serviceId)?.title ??
    serviceId;

  return [
    "New photography inquiry",
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    email ? `Email: ${email}` : null,
    `Service: ${service}`,
    preferredDate ? `Preferred date: ${preferredDate}` : null,
    message ? `Message: ${message}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export default function InquiryForm({
  idPrefix = "inquiry",
  defaultServiceId = "",
  services,
}: InquiryFormProps) {
  const [status, setStatus] = useState("");

  const whatsappBaseUrl = useMemo(
    () => `https://wa.me/${contactInfo.whatsapp.replace("+", "")}`,
    [],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const message = buildWhatsAppMessage(formData, services);
    const url = `${whatsappBaseUrl}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
    setStatus("Opening WhatsApp with your inquiry details...");

    const result = await submitInquiry(formData);

    if (result.ok) {
      setStatus(
        "Inquiry saved and WhatsApp opened - we'll be in touch shortly.",
      );
      form.reset();
    } else {
      setStatus(
        `${result.error} WhatsApp is still open so you can send your message there.`,
      );
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`${idPrefix}-name`}
            className="mb-1.5 block text-xs text-neutral-900"
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
            className="mb-1.5 block text-xs text-neutral-900"
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
          className="mb-1.5 block text-xs text-neutral-900"
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
          className="mb-1.5 block text-xs text-neutral-900"
        >
          Service Type
        </label>
        <select
          id={`${idPrefix}-service`}
          name="service"
          defaultValue={defaultServiceId}
          required={services.length > 0}
          className={inputClass}
        >
          <option value="" disabled={services.length > 0}>
            {services.length > 0 ? "Select a service" : "General inquiry"}
          </option>
          {services.map((service: ServiceOption) => (
            <option key={service.id} value={service.id}>
              {service.title}
            </option>
          ))}
          {defaultServiceId &&
            !services.some(
              (service: ServiceOption) => service.id === defaultServiceId
            ) && (
              <option value={defaultServiceId}>Selected service</option>
            )}
        </select>
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-date`}
          className="mb-1.5 block text-xs text-neutral-900"
        >
          Preferred Date
        </label>
        <input
          id={`${idPrefix}-date`}
          type="date"
          name="date"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-message`}
          className="mb-1.5 block text-xs text-neutral-900"
        >
          Message
        </label>
        <textarea
          id={`${idPrefix}-message`}
          name="message"
          rows={5}
          required
          placeholder="Tell us about your shoot - style, location, any special requests..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      >
        Send Inquiry on WhatsApp: {contactInfo.whatsapp}
      </button>

      <p aria-live="polite" className="min-h-5 text-xs text-neutral-900">
        {status}
      </p>
    </form>
  );
}
