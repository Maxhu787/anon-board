"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { signout } from "@/lib/auth-actions";
import { useTranslation } from "react-i18next";

const LoginButton = ({ className }) => {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  if (!mounted) {
    return null;
  }

  if (user) {
    return (
      <Button
        variant="outline"
        onClick={() => {
          signout();
          setUser(null);
        }}
        className={className}
      >
        {t("logOut")}
      </Button>
    );
  }

  return (
    <Button
      onClick={() => {
        router.push("/login");
      }}
      className={className}
    >
      {t("logIn")}
    </Button>
  );
};

export default LoginButton;
