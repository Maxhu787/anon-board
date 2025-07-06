"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LogoutPage = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => router.push("/?logout=true"), 2000);
  }, []);
  return (
    <div className="text-center mt-30">
      You have logged out... redirecting in a 3 seconds.
    </div>
  );
};

export default LogoutPage;
