import type { MetadataRoute } from "next";
import { tools } from "@/data/tools";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/tools`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/dashboard`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/dashboard/comparison`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/dashboard/trends`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/methodology`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/tools?category=bi`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/tools?category=visualization`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/tools?category=crawler`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteUrl}/tools/${tool.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const alternativesPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteUrl}/alternatives/${tool.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.78,
  }));

  const bestPages: MetadataRoute.Sitemap = [];
  const categories = ["bi", "visualization", "crawler"];
  const scenarios = ["small-team", "enterprise", "fast-launch"];
  for (const category of categories) {
    for (const scenario of scenarios) {
      bestPages.push({
        url: `${siteUrl}/best/${category}/${scenario}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.76,
      });
    }
  }

  const comparePages: MetadataRoute.Sitemap = [];
  for (let i = 0; i < tools.length; i += 1) {
    for (let j = i + 1; j < tools.length; j += 1) {
      comparePages.push({
        url: `${siteUrl}/compare/${tools[i].id}-vs-${tools[j].id}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.75,
      });
    }
  }

  const guidesPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${siteUrl}/guides/bi-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/guides/viz-comparison`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/guides/crawler-guide-2026`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/guides/open-source-vs-commercial`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/guides/build-data-platform`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/quiz`, lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
  ];

  return [...staticPages, ...toolPages, ...alternativesPages, ...bestPages, ...guidesPages];
}
