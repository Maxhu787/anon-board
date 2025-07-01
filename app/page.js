"use client";

import Posts from "@/components/Posts";
import UserGreetText from "@/components/UserGreetText";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "g4o2.me | Home";
  }, []);

  return (
    <div className="p-8 mt-20">
      {/* <h1 className="text-2xl font-bold mb-4">Latest Posts</h1> */}
      {/* <UserGreetText /> */}
      <Posts />
    </div>
  );
}
