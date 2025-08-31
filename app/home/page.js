"use client";

import Posts from "@/components/Posts";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
    document.title = "靠北屏中 5.0 | Home";

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="h-10 mt-23 w-full flex justify-center items-center">
        <svg
          className="animate-spin h-6 w-6 text-gray-500 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <p className="text-sm text-gray-500">載入中...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="p-8 flex-grow">
        <div className="mt-15">
          <Posts />
        </div>
      </main>
    </div>
  );
}
