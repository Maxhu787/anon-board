"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useTranslation } from "react-i18next";
// import Posts from "@/components/Posts";
import GoogleOneTap from "@/components/GoogleOneTap";
// import Announcements from "@/components/Announcements";
import { ChevronRight } from "lucide-react";
import SendPost from "@/components/SendPost"; // Add import for SendPost

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
    document.title = "靠北屏中 5.0";

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
            <div className="select-none inline-block bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs font-medium px-3 py-1 rounded-full mb-3">
              屏東高中生開發 Made in PTHS
            </div>
            <div className="select-none ml-2 inline-block bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 text-xs font-medium px-3 py-1 rounded-full mb-3">
              Beta 測試版
            </div>
            <h1 className="text-[46px] md:text-[52px] font-extrabold leading-[50px] md:leading-[50px] text-yellow-500 dark:text-yellow-400">
              靠北屏中 5.0
            </h1>
            <h2 className="text-[43px] md:text-[50px] font-extrabold leading-[50px] md:leading-[50px] mt-[-10] text-black dark:text-white">
              匿名發文、留言
            </h2>
            <p className="text-lg md:text-[18px] text-gray-700 dark:text-gray-300">
              靠北屏中 5.0，全新獨立留言平台，學生自行開發
            </p>
            <p className="text-lg mt-[-12] md:text-[18px] text-gray-700 dark:text-gray-300">
              自由發布貼文，享受簡潔瀏覽體驗
            </p>
            {user ? (
              <Link
                href="/home"
                className="select-none active:scale-95 transition-all inline-flex items-center px-6 py-3 bg-yellow-500 text-white rounded-xl text-lg hover:bg-yellow-400 dark:bg-yellow-600 dark:text-white dark:hover:bg-yellow-500"
              >
                {t("browseposts")}
                <ChevronRight className="ml-2 mr-[-8]" />
              </Link>
            ) : (
              // <Link
              //   href="/login"
              //   // className="select-none active:scale-95 transition-all inline-flex px-6 py-3 bg-black text-white rounded-xl text-lg hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              //   className="select-none active:scale-95 transition-all inline-flex items-center px-6 py-3 bg-yellow-500 text-white rounded-xl text-lg hover:bg-yellow-400 dark:bg-yellow-600 dark:text-white dark:hover:bg-yellow-500"
              // >
              //   開始使用
              //   <ChevronRight className="ml-1 mt-[2] mr-[-11]" />
              // </Link>
              <Link
                href="/home"
                className="select-none active:scale-95 transition-all inline-flex items-center px-6 py-3 bg-yellow-500 text-white rounded-xl text-lg hover:bg-yellow-400 dark:bg-yellow-600 dark:text-white dark:hover:bg-yellow-500"
              >
                瀏覽貼文
                <ChevronRight className="ml-2 mr-[-8]" />
              </Link>
            )}
            <div className="border-t-2 mt-10 md:mt-5 pt-4 pl-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex flex-row space-x-2.5">
                <Link href="/about" className="hover:underline">
                  關於我們
                </Link>
                <Link href="/terms-of-service" className="hover:underline">
                  服務條款
                </Link>
                <Link href="/privacy-policy" className="hover:underline">
                  隱私政策
                </Link>
              </div>
              <div>
                © {new Date().getFullYear()} 靠北屏中 5.0 - 保留所有權利。
              </div>
            </div>
          </div>
        </section>

        <section className="w-full pt-8 md:pt-28 md:w-1/2 p-6 bg-gray-50 dark:bg-[#111] overflow-y-auto md:max-h-[100vh]">
          {/* <Posts /> */}
          {/* <Announcements /> */}
          <SendPost onSent={() => {}} />
        </section>
      </main>
    </div>
  );
}
