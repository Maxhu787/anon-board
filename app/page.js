import Link from "next/link";
import { Button } from "@/components/ui/button";

// Mock posts data
const posts = [
  { id: "1", title: "First Post", summary: "This is the first post." },
  { id: "2", title: "Second Post", summary: "This is the second post." },
];

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">All Posts</h1>
      <ul className="mb-8 space-y-2">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/posts/${post.id}`}
              className="text-blue-500 hover:underline"
            >
              <strong>{post.title}</strong> - {post.summary}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
