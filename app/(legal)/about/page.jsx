"use client";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation("about");
  useEffect(() => {
    document.title = "g4o2.me | About";
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 mt-18 space-y-8">
      <h1 className="text-5xl font-bold">{t("title")}</h1>
      <p className="text-xl">{t("intro")}</p>
      <section>
        <ul className="list-disc text-xl pl-6 space-y-2">
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
          {/* <li>{t("creatorSection.school")}</li>
          <li>{t("creatorSection.club")}</li>
          <li>{t("creatorSection.grade")}</li> */}
        </ul>
      </section>
    </div>
  );
}
