import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://learn.whpp.site/",
      lastModified: new Date(),
    },
  ];
}
