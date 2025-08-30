"use client";

import SendPost from "@/components/SendPost";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import BackButton from "@/components/BackButton";

export default function SendPage() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#111] pt-10">
      <div className="w-full max-w-xl px-4 py-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg">
        <div className="flex flex-row items-center gap-3 mb-6">
          <BackButton
            onClick={() => {
              router.back();
            }}
          />
          <h2 className="text-2xl font-bold">{t("cardTitle")}</h2>
        </div>
        <SendPost
          onSent={() => {
            router.replace("/home");
          }}
          hideTitle // pass a prop to hide the title inside SendPost
        />
      </div>
    </div>
  );
}
