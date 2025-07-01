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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading) {
    return (
      <div className="p-8 mt-20 text-center text-gray-500">Loading...</div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="p-8 flex-grow">
        {user ? (
          <Posts />
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[calc(100vh-5rem)]">
            <Link href="https://g4o2.me">
              <h1 className="text-5xl font-extrabold tracking-tight text-black dark:text-white">
                g4o2.me
              </h1>
            </Link>
            {mounted && (
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {t("description")}
              </p>
            )}
          </div>
        )}
      </main>
      {user ? (
        <footer className="border-t mt-12 py-6 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <div className="space-x-4 mb-2">
            <Link href="/terms-of-service" className="hover:underline">
              {t("tos")}
            </Link>
            <Link href="/privacy-policy" className="hover:underline">
              {t("privacyPolicy")}
            </Link>
          </div>
          <div>© {new Date().getFullYear()} g4o2.me - All rights reserved.</div>
        </footer>
      ) : (
        <footer className="border-t mt-12 py-6 px-4 text-center text-sm text-gray-500 dark:text-gray-400 absolute bottom-0 w-full">
          <div className="space-x-4 mb-2">
            <Link href="/terms-of-service" className="hover:underline">
              {t("tos")}
            </Link>
            <Link href="/privacy-policy" className="hover:underline">
              {t("privacyPolicy")}
            </Link>
          </div>
          <div>© {new Date().getFullYear()} g4o2.me - All rights reserved.</div>
        </footer>
      )}
    </div>
  );
}
