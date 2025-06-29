"use client";
import React from "react";
import { LoginForm } from "./components/LoginForm";
import { useSearchParams } from "next/navigation";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const toastParam = searchParams.get("toast");

  return (
    <div className="flex flex-col items-center justify-center mt-35">
      {toastParam === "email_sent" && (
        <div className="mb-4 px-4 py-2 bg-green-100 text-green-800 rounded-lg shadow text-center">
          Confirmation email sent!
        </div>
      )}
      <LoginForm />
    </div>
  );
};

export default LoginPage;
