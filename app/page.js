"use client";

import Posts from "@/components/Posts";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    document.title = "g4o2.me | Home";

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="p-8 mt-20 text-center text-gray-500">Loading...</div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="p-8 mt-20 flex-grow">
        {user ? (
          <Posts />
        ) : (
          <div className="mt-40 max-w-2xl mx-auto text-center space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight text-black dark:text-white">
              g4o2.me
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              A place to post your thoughts freely - choose to share anonymously
              or not.
            </p>
          </div>
        )}
      </main>

      <footer className="border-t mt-12 py-6 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <div className="space-x-4 mb-2">
          <Link href="/terms-of-service" className="hover:underline">
            Terms of Service
          </Link>
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
        <div>© {new Date().getFullYear()} g4o2.me — All rights reserved.</div>
      </footer>
    </div>
  );
}
