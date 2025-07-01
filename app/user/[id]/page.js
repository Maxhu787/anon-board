"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserPage({ params }) {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const supabase = createClient();

  React.useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email, avatar_url")
        .eq("id", id)
        .single();

      if (error || !data) {
        setProfile(null);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
    document.title = "g4o2.me | User";
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900">
        <Card className="w-full max-w-md p-8 rounded-2xl shadow-lg">
          <CardHeader className="flex justify-center">
            <Skeleton className="w-28 h-28 mt-6 mb-6 rounded-full" />
          </CardHeader>
          <CardContent>
            <CardTitle>
              <Skeleton className="h-8 w-3/4 mb-4" />
            </CardTitle>
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-6" />
            <Skeleton className="h-6 w-1/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>User not found</p>
      </div>
    );
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
