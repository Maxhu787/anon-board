// app/sitemap.js
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default async function sitemap() {
  // Fetch all post IDs from Supabase
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch posts for sitemap:", error);
    return [];
  }

  const postRoutes = posts.map((post) => ({
    url: `https://pths-cowbell.vercel.app/post/${post.id}`,
    lastModified: post.created_at,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const staticRoutes = [
    {
      url: "https://pths-cowbell.vercel.app",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://pths-cowbell.vercel.app/home",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://pths-cowbell.vercel.app/send",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // {
    //   url: "https://pths-cowbell.vercel.app/about",
    //   lastModified: new Date(),
    //   changeFrequency: "monthly",
    //   priority: 0.7,
    // },
    {
      url: "https://pths-cowbell.vercel.app/user",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.2,
    },
  ];

  return [...staticRoutes, ...postRoutes];
}
