"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-400 text-white px-4">
      <h1 className="text-9xl font-extrabold mb-6 select-none">404</h1>
      <p className="text-2xl md:text-3xl mb-8 max-w-md text-center">
        Oops! The page you were looking for does not exist.
      </p>
      <button
        onClick={() => router.replace("/home")}
        className="px-6 py-3 bg-white text-orange-700 font-semibold rounded-lg shadow-lg hover:bg-orange-50 active:bg-orange-200 active:scale-95 transition-all cursor-pointer"
      >
        Go Back Home
      </button>
    </div>
  );
}
