"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Posts from "@/components/Posts";
import GoogleOneTap from "@/components/GoogleOneTap";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();
  const { t } = useTranslation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isLoggedOut = params.get("logout");

    if (isLoggedOut) {
      const url = new URL(window.location.href);
      url.search = "";
      window.history.replaceState({}, "", url.toString());
      window.location.reload();
    }

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

  const handleOneTapSuccess = (user) => {
    setUser(user);
    // Optional: redirect to home page or show success message
  };

  const handleOneTapError = (error) => {
    console.error("One Tap authentication failed:", error);
    // Optional: show error message to user
  };

  if (!mounted) return null;
  if (loading) return <></>;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Google One Tap - only show if user is not logged in */}
      {!user && (
        <GoogleOneTap
          onSuccess={handleOneTapSuccess}
          onError={handleOneTapError}
        />
      )}

      <main className="flex flex-col md:flex-row flex-grow w-full">
        <section className="w-full md:w-1/2 p-8 flex items-center justify-center bg-white dark:bg-black">
          <div className="space-y-5 md:space-y-7 max-w-xl text-left pt-25 md:pt-18 md:pl-12 md:pr-0">
            <div className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-3 py-1 rounded-full mb-3">
              {t("madeby")}
            </div>
            <h1 className="text-[46px] md:text-[52px] font-extrabold leading-[50px] md:leading-[50px] text-blue-500 dark:text-blue-400">
              {t("title1")}
            </h1>
            <h2 className="text-[43px] md:text-[50px] font-extrabold leading-[50px] md:leading-[50px] mt-[-10] text-black dark:text-white">
              {t("title2")}
            </h2>
            <p className="text-lg md:text-[18px] text-gray-700 dark:text-gray-300">
              <span className="font-semibold">g4o2.me</span> {t("description1")}
            </p>
            <p className="text-lg mt-[-12] md:text-[18px] text-gray-700 dark:text-gray-300">
              {t("description2")}
            </p>
            {user ? (
              <Link
                href="/home"
                className="active:scale-95 transition-all inline-block px-6 py-3 bg-blue-500 text-white rounded-xl text-lg hover:bg-blue-600 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600"
              >
                {t("browseposts")}
              </Link>
            ) : (
              <Link
                href="/login"
                className="active:scale-95 transition-all inline-block px-6 py-3 bg-black text-white rounded-xl text-lg hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                {t("getstarted")}
              </Link>
            )}
            <div className="border-t-2 mt-10 md:mt-5 pt-4 pl-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex flex-row space-x-2.5">
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
            </div>
          </div>
        </section>

        <section className="w-full pt-8 md:pt-28 md:w-1/2 p-6 bg-gray-50 dark:bg-[#111] overflow-y-auto md:max-h-[100vh]">
          <Posts />
        </section>
      </main>
    </div>
  );
}
