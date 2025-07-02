"use client";
import React from "react";
import { useTranslation } from "react-i18next";

export default function TermsOfService() {
  const { t } = useTranslation("tos");

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 mt-18">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>

      <p className="mb-4">{t("effectiveDate")}</p>

      <p className="mb-4">{t("intro")}</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">{t("section1.title")}</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>{t("section1.point1")}</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">{t("section2.title")}</h2>
      <p className="mb-4">{t("section2.content")}</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">{t("section3.title")}</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>{t("section3.point1")}</li>
        <li>{t("section3.point2")}</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">{t("section4.title")}</h2>
      <p className="mb-4">{t("section4.content")}</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">{t("section5.title")}</h2>
      <p className="mb-4">{t("section5.content")}</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">{t("section6.title")}</h2>
      <p className="mb-4">{t("section6.content")}</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">{t("section7.title")}</h2>
      <p className="mb-4">{t("section7.content")}</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">{t("section8.title")}</h2>
      <p className="mb-4">
        {t("section8.content")}{" "}
        <a href={`mailto:${t("email")}`} className="text-blue-400 underline">
          {t("email")}
        </a>
        .
      </p>
    </div>
  );
}
