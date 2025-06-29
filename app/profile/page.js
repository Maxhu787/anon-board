import Link from "next/link";

export default function ProfilePage() {
  // Mock user data
  const user = { name: "Anonymous", bio: "This is your profile page." };
  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-2">Profile</h1>
      <p className="mb-1">Name: {user.name}</p>
      <p className="mb-4">{user.bio}</p>
      <Link href="/" className="text-blue-500 hover:underline">
        ← Back to all posts
      </Link>
    </div>
  );
}
