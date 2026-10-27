import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://learn.whpp.site/",
      lastModified: new Date(),
    },
    {
      url: "https://learn.whpp.site/verify",
      lastModified: new Date(),
    },
  ];
}
