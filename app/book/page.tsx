import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Container from "@/src/components/layout/Container";
import PageHeader from "@/src/components/ui/PageHeader";
import BookingForm from "@/src/components/forms/BookingForm";
import { absoluteUrl } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "Book a Session",
  description:
    "Book a photography session with SomStudioPhotography in Kathmandu, Nepal. Share your service, dates, and details, then send us your request on WhatsApp or email.",
  alternates: {
    canonical: absoluteUrl("/book"),
  },
};

export default function BookPage() {
  return (
    <>
      <Navbar />

      <PageHeader
        eyebrow="Book Now"
        title="Book your session"
        subtitle="Fill in your details and we'll confirm availability, pricing, and next steps."
        animated={false}
      />

      <section className="border-t border-neutral-200 bg-neutral-50">
        <Container>
          <div className="mx-auto max-w-2xl py-20 sm:py-28">
            <div className="rounded border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
              <Suspense fallback={null}>
                <BookingForm idPrefix="book" />
              </Suspense>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
