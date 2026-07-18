import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aiclaritysessions.com";
  const lastModified = new Date();

  return [
    ["", 1, "weekly"],
    ["/contact", 0.7, "monthly"],
    ["/dallas-ai-training", 0.9, "weekly"],
    ["/reviews", 0.5, "monthly"],
    ["/refunds", 0.5, "monthly"],
    ["/privacy", 0.4, "yearly"],
    ["/terms", 0.4, "yearly"],
  ].map(([path, priority, changeFrequency]) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: changeFrequency as "weekly" | "monthly" | "yearly",
    priority: priority as number,
  }));
}
