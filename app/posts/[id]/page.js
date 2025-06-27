import Link from "next/link";

// Mock posts data (should be shared or fetched in real app)
const posts = [
  { id: "1", title: "First Post", content: "Full content of the first post." },
  {
    id: "2",
    title: "Second Post",
    content: "Full content of the second post.",
  },
];

export default async function PostPage({ params }) {
  const { id } = await params;
  const post = posts.find((p) => p.id === id);
  if (!post) return <div className="p-8">Post not found</div>;
  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-2">{post.title}</h1>
      <p className="mb-4">{post.content}</p>
      <Link href="/" className="text-blue-600 hover:underline">
        ← Back to all posts
      </Link>
    </div>
  );
}
