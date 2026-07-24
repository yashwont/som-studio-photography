"use client";

import { FormEvent, useState } from "react";
import { submitInquiry } from "@/src/lib/actions/inquiry";

type ServiceOption = {
  id: string;
  title: string;
};

interface InquiryFormProps {
  idPrefix?: string;
  defaultServiceId?: string;
  defaultMessage?: string;
  services: ServiceOption[];
}

const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-white/70 px-4 py-3 text-sm text-neutral-950 placeholder:text-neutral-400 backdrop-blur-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 transition-all duration-200";

export default function InquiryForm({
  idPrefix = "inquiry",
  defaultServiceId = "",
  defaultMessage = "",
  services,
}: InquiryFormProps) {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    setIsSubmitting(true);
    setStatus("Submitting your inquiry...");

    const result = await submitInquiry(formData);

    if (result.ok) {
      setStatus("Inquiry submitted. We'll be in touch shortly.");
      form.reset();
    } else {
      setStatus(result.error);
    }

    setIsSubmitting(false);
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
          defaultValue={defaultMessage}
          placeholder="Tell us about your shoot - style, location, any special requests..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-shimmer w-full rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>

      <p aria-live="polite" className="min-h-5 text-xs text-neutral-900">
        {status}
      </p>
    </form>
  );
}
