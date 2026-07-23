import type { MetadataRoute } from "next";
import { absoluteUrl, siteRoutes } from "@/src/lib/seo";

type SiteRoute = { path: string; priority: number };

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return siteRoutes.map((route: SiteRoute) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: (route.path === "/" ? "weekly" : "monthly") as
      | "weekly"
      | "monthly",
    priority: route.priority,
  }));
}
