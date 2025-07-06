"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Posts from "@/components/Posts";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
    document.title = "g4o2.me";

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (!mounted) return null;
  if (loading) return <></>;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-col md:flex-row flex-grow w-full">
        {/* Left Section: Landing Text */}
        <section className="w-full md:w-1/2 p-8 flex items-center justify-center bg-white dark:bg-black">
          <div className="space-y-8 max-w-xl text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-black dark:text-white">
              Got something to rant about?
              <br />
              Or just need to talk?
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
              <span className="font-semibold">g4o2.me</span> {t("description")}
            </p>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
              {t("description2")}
            </p>
            {!user && (
              <Link
                href="/login"
                className="inline-block px-6 py-3 bg-black text-white rounded-xl text-lg hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition"
              >
                Get Started
              </Link>
            )}
          </div>
        </section>

        {/* Right Section: Posts Preview */}
        <section className="w-full md:w-1/2 p-6 bg-gray-50 dark:bg-[#111] overflow-y-auto max-h-[100vh]">
          <Posts />
        </section>
      </main>

      <footer className="border-t py-6 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <div className="space-x-4 mb-2">
          <Link href="/about" className="hover:underline">
            {t("aboutus")}
          </Link>
          <Link href="/terms-of-service" className="hover:underline">
            {t("tos")}
          </Link>
          <Link href="/privacy-policy" className="hover:underline">
            {t("privacyPolicy")}
          </Link>
        </div>
        <div>
          © {new Date().getFullYear()} g4o2.me - {t("legal")}
        </div>
      </footer>
    </div>
  );
}
