"use client";

import Posts from "@/components/Posts";
import UserGreetText from "@/components/UserGreetText";

export default function Home() {
  return (
    <div className="p-8 mt-20">
      {/* <h1 className="text-2xl font-bold mb-4">Latest Posts</h1> */}
      {/* <UserGreetText /> */}
      <Posts />
    </div>
  );
}
