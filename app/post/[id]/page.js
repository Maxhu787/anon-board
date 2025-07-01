"use client";

import React from "react";
import { use } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

export default function PostPage(promiseParams) {
  const { id } = use(promiseParams.params);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          profiles:profiles!posts_user_id_fkey (
            full_name,
            avatar_url
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching post:", error);
        setPost(null);
      } else {
        setPost(data);
      }

      setLoading(false);
    }

    fetchPost();
  }, [id]);

  if (loading)
    return <div className="p-8 text-center text-gray-500">Loading post...</div>;

  if (!post)
    return (
      <div className="p-8 text-center text-red-500">
        Post not found or error occurred.
      </div>
    );

  return (
    <div className="max-w-xl mx-auto p-8 mt-15">
      <Link
        href="/"
        className="inline-block mt-2 text-blue-600 hover:underline"
      >
        ← Back to all posts
      </Link>
      <Card className="mt-3 border-1 dark:border-gray-800 border-gray-300 border-solid shadow-none">
        <CardHeader className="flex flex-row gap-3">
          <Avatar
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              toast("avatar clicked");
            }}
            className="cursor-pointer"
          >
            {post.is_anonymous ? (
              <AvatarFallback>A</AvatarFallback>
            ) : post.profiles?.avatar_url ? (
              <AvatarImage src={post.profiles.avatar_url} />
            ) : (
              <AvatarImage src="https://github.com/shadcn.png" />
            )}
          </Avatar>
          <div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toast("username clicked");
              }}
              className="hover:underline cursor-pointer"
            >
              <CardTitle>
                {post.is_anonymous
                  ? "Anonymous user"
                  : post.profiles?.full_name ?? post.user_id}
              </CardTitle>
            </div>
            <CardDescription className="mt-1 text-[12px]">
              {new Date(post.created_at).toLocaleString("zh-TW", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="mt-[-18] pl-17">
          <p className="text-[15px] whitespace-pre-wrap">{post.content}</p>
        </CardContent>
        <CardFooter className="gap-2 mt-[-12] mb-[-8]">
          <Button
            className="w-[70px] cursor-pointer active:bg-gray-200 active:scale-95 transition-all dark:active:bg-[rgb(60,60,60)]"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              toast("Liked");
            }}
          >
            <ThumbsUp />
          </Button>
          <Button
            className="w-[70px] cursor-pointer active:bg-gray-200 active:scale-95 transition-all dark:active:bg-[rgb(60,60,60)]"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              toast("Disliked");
            }}
          >
            <ThumbsDown />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
