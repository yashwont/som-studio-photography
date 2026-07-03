"use client";

import { FormEvent, useMemo, useState } from "react";
import { contactInfo } from "@/src/data/contact";
import { services } from "@/src/data/services";

interface InquiryFormProps {
  idPrefix?: string;
}

const inputClass =
  "w-full rounded border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-950 placeholder:text-neutral-400 focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-colors duration-200";

function getValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function buildWhatsAppMessage(formData: FormData) {
  const name = getValue(formData, "name");
  const phone = getValue(formData, "phone");
  const email = getValue(formData, "email");
  const serviceId = getValue(formData, "service");
  const preferredDate = getValue(formData, "date");
  const message = getValue(formData, "message");
  const service = services.find((item) => item.id === serviceId)?.title ?? serviceId;

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

export default function InquiryForm({ idPrefix = "inquiry" }: InquiryFormProps) {
  const [status, setStatus] = useState("");

  const whatsappBaseUrl = useMemo(
    () => `https://wa.me/${contactInfo.whatsapp.replace("+", "")}`,
    [],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const message = buildWhatsAppMessage(formData);
    const url = `${whatsappBaseUrl}?text=${encodeURIComponent(message)}`;

    setStatus("Opening WhatsApp with your inquiry details.");
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
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
          defaultValue=""
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

      <div>
        <label
          htmlFor={`${idPrefix}-date`}
          className="mb-1.5 block text-xs text-neutral-500"
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

      <button
        type="submit"
        className="w-full rounded bg-gold px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
      >
        Send Inquiry on WhatsApp
      </button>

      <p aria-live="polite" className="min-h-5 text-xs text-neutral-500">
        {status}
      </p>
    </form>
  );
}
