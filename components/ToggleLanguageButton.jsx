"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Languages } from "lucide-react";

export function ToggleLanguageButton({ className }) {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const toggleLang = () => {
    const newLang = i18n.language === "en" ? "zh" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      className={className}
      onClick={toggleLang}
      variant="outline"
      size="icon"
    >
      <Languages className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Toggle language</span>
    </Button>
  );
}
