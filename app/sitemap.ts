import type { MetadataRoute } from "next";
import { absoluteUrl, siteRoutes } from "@/src/lib/seo";
import { portfolioWorks } from "@/src/data/portfolio";
import type { PortfolioWork } from "@/src/types/site";

type SiteRoute = { path: string; priority: number };

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes = siteRoutes.map((route: SiteRoute) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: (route.path === "/" ? "weekly" : "monthly") as
      | "weekly"
      | "monthly",
    priority: route.priority,
  }));

  const portfolioWorkRoutes = portfolioWorks.map((work: PortfolioWork) => ({
    url: absoluteUrl(`/portfolio/${work.id}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...portfolioWorkRoutes];
}
