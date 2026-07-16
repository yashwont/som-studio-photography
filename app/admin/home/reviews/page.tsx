import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getHomeContent } from "@/src/lib/db/home";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import HomeNav from "../HomeNav";
import ReviewsForm from "./ReviewsForm";

export const metadata: Metadata = {
  title: "Reviews | Home Page | Admin | SomStudioPhotography",
};

export default async function AdminHomeReviewsPage() {
  const admin = await requireAdmin();
  const content = await getHomeContent();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Reviews"
        description="The client review testimonials shown on the home page."
      />

      <div className="mt-8">
        <HomeNav active="/admin/home/reviews" />

        <div className="max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
          <ReviewsForm content={content} />
        </div>
      </div>
    </AdminShell>
  );
}
