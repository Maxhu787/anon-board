"use client";
import React, { Suspense, useEffect } from "react";
import { LoginForm } from "./components/LoginForm";
import { useSearchParams } from "next/navigation";

function ToastMessage() {
  const searchParams = useSearchParams();
  const toastParam = searchParams.get("toast");

  useEffect(() => {
    document.title = "靠北屏中 5.0 | Login";
  }, []);

  if (toastParam === "email_sent") {
    return (
      <div className="mb-4 px-4 py-2 bg-green-100 text-green-800 rounded-lg shadow text-center">
        Confirmation email sent!
      </div>
    );
  }
  return null;
}

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-35">
      <Suspense fallback={null}>
        <ToastMessage />
      </Suspense>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
