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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";

const posts = [
  {
    id: "1",
    user: "Anonymous user",
    date: "5月12日 10:42",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "2",
    user: "Anonymous user",
    date: "5月24日 11:07",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "3",
    user: "Anonymous user",
    date: "6月1日 10:42",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "4",
    user: "Anonymous user",
    date: "6月8日 11:07",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "5",
    user: "Anonymous user",
    date: "6月22日 10:42",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "6",
    user: "Anonymous user",
    date: "6月23日 11:07",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
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
              <Card className="border-1 border-gray-300 border-solid shadow-none">
                <CardHeader className="flex flex-row gap-3 ">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link href={`/user/${1}`} className="hover:underline">
                      <CardTitle>{post.user}</CardTitle>
                    </Link>
                    <CardDescription className="mt-1 text-[12px]">
                      {post.date}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="mt-[-18] pl-17">
                  <p className="text-[15px]">{post.content}</p>
                </CardContent>
                <CardFooter className="gap-2 mt-[-12] mb-[-8]">
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
