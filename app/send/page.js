"use client";

import SendPost from "@/components/SendPost";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import BackButton from "@/components/BackButton";

export default function SendPage() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#111]">
      <div className="w-full max-w-md px-4 py-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg">
        <BackButton
          onClick={() => {
            router.back();
          }}
        />
        <SendPost
          onSent={() => {
            router.replace("/home");
          }}
        />
      </div>
    </div>
  );
}
