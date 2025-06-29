import Link from "next/link";

const posts = [
  { id: "1", title: "user1", content: "profile" },
  {
    id: "2",
    title: "user2",
    content: "prifle stuff",
  },
];

export default async function UserPage({ params }) {
  const { id } = await params;
  const post = posts.find((p) => p.id === id);
  if (!post) return <div className="p-8">Post not found</div>;
  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-2">{post.title}</h1>
      <p className="mb-4">{post.content}</p>
      <Link href="/" className="text-blue-500 hover:underline">
        ← Back to all posts
      </Link>
    </div>
  );
}
