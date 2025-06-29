"use client";

import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";

const posts = [
  {
    id: "1",
    user: "Anonymous user",
    date: "6月23日 10:42",
    content: "This is the first post.",
  },
  {
    id: "2",
    user: "Anonymous user",
    date: "6月29日 11:07",
    content: "This is the second post.",
  },
];

export default function Home() {
  return (
    <div className="p-8">
      {/* <h1 className="text-2xl font-bold mb-4">Latest Posts</h1> */}
      <ul className="mb-8 flex flex-col items-center space-y-2">
        {posts.map((post) => (
          <li key={post.id} className="w-full max-w-xl">
            <Link href={`/post/${post.id}`}>
              <Card>
                <CardHeader className="flex flex-row">
                  <Link href={`/user/${1}`} className="hover:underline">
                    <CardTitle>{post.user}</CardTitle>
                  </Link>
                  <CardDescription>{post.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{post.content}</p>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button
                    className="hover:cursor-pointer w-[70px]"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    <ThumbsUp />
                  </Button>
                  <Button
                    className="hover:cursor-pointer w-[70px]"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    <ThumbsDown />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
