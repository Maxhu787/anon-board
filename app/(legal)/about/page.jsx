"use client";
import React from "react";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation("about");

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 mt-18 space-y-8">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-[-20]">{t("intro")}</p>
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          {t("creatorSection.title")}
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <a
              href={t("creatorSection.websiteUrl")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {t("creatorSection.websiteText")}
            </a>
          </li>
          <li>{t("creatorSection.school")}</li>
          <li>{t("creatorSection.club")}</li>
          <li>{t("creatorSection.grade")}</li>
        </ul>
      </section>
    </div>
  );
}
