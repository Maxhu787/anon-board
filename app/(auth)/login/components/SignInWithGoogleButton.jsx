"use-client";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth-actions";
import React from "react";
import { useTranslation } from "react-i18next";

export const SignInWithGoogleButton = () => {
  const { t } = useTranslation();
  return (
    <Button
      type="button"
      // variant="outline"
      className="w-full cursor-pointer active:scale-95 transition-all"
      onClick={() => {
        signInWithGoogle();
      }}
    >
      {t("goog")}
    </Button>
  );
};
