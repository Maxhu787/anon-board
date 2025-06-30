import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default async function UserPage({ params }) {
  const supabase = createClient();
  const { id } = params;

  // fetch profile by id from 'profiles' table
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name, email, avatar_url")
    .eq("id", id)
    .single();

  if (error || !profile) {
    return <div className="p-8">User not found</div>;
  }

  const fullName = profile.full_name || "Anonymous";
  const email = profile.email || "No email";
  const avatarUrl = profile.avatar_url || "";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900">
      <div className="bg-white dark:bg-zinc-800 text-black dark:text-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-28 h-28 mt-6 mb-2">
            <AvatarImage src={avatarUrl} alt={fullName} />
            <AvatarFallback>
              {fullName
                .split(" ")
                .map((w) => w[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          <p className="mb-2">
            <span className="font-semibold">Name:</span> {fullName}
          </p>
          <p className="mb-6">
            <span className="font-semibold">Email:</span> {email}
          </p>
          <Link href="/" className="text-blue-500 hover:underline">
            ← Back to all posts
          </Link>
        </div>
      </div>
    </div>
  );
}
