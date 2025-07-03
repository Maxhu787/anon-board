"use client";

import React, { useEffect, useState, use } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquareText, ThumbsDown, ThumbsUp } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";
import PostComments from "@/components/PostComments";
import PostCommentForm from "@/components/PostCommentForm";

export default function PostPage(promiseParams) {
  const { id } = use(promiseParams.params);
  const [post, setPost] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [commenting, setCommenting] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        setHasError(false);

        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUserId(user?.id);

        const { data, error } = await supabase
          .from("posts")
          .select(
            `
            *,
            profiles:profiles!posts_user_id_fkey (
              full_name,
              avatar_url
            ),
            votes (
              user_id,
              vote_type
            )
          `
          )
          .eq("id", id)
          .single();

        if (error || !data) throw new Error("Post not found");
        setPost(data);
      } catch (err) {
        toast.error("Failed to load post.");
        setHasError(true);
        setPost(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
    document.title = "g4o2.me | Post";
  }, [id, supabase]);

  const handleVote = async (type) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return toast("You must be logged in");

    const existingVote = post.votes?.find((v) => v.user_id === user.id);

    if (existingVote) {
      if (existingVote.vote_type === type) {
        await supabase
          .from("votes")
          .delete()
          .eq("user_id", user.id)
          .eq("post_id", post.id);
        toast(`${type} removed`);

        const updatedVotes = post.votes.filter((v) => v.user_id !== user.id);
        setPost({ ...post, votes: updatedVotes });
        return;
      } else {
        await supabase
          .from("votes")
          .update({ vote_type: type })
          .eq("user_id", user.id)
          .eq("post_id", post.id);
        toast(`${type === "like" ? "Liked" : "Disliked"}`);

        const updatedVotes = post.votes.map((v) =>
          v.user_id === user.id ? { ...v, vote_type: type } : v
        );
        setPost({ ...post, votes: updatedVotes });
        return;
      }
    }

    await supabase.from("votes").insert({
      user_id: user.id,
      post_id: post.id,
      vote_type: type,
    });
    toast(`${type === "like" ? "Liked" : "Disliked"}`);

    setPost({
      ...post,
      votes: [...(post.votes || []), { user_id: user.id, vote_type: type }],
    });
  };

  if (loading)
    return (
      <div className="max-w-xl mx-auto p-8 mt-15">
        <Link
          href="/"
          className="inline-block mt-2 text-blue-600 hover:underline"
        >
          ← Back to all posts
        </Link>
        <Card className="mt-3 border-none">
          <CardHeader className="flex flex-row gap-3 items-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 mt-[-18] pl-17">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </CardContent>
          <CardFooter className="gap-2 mt-[-12] mb-[-8]">
            <Skeleton className="h-9 w-[70px] rounded-md" />
            <Skeleton className="h-9 w-[70px] rounded-md" />
          </CardFooter>
        </Card>
      </div>
    );

  if (hasError)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-400 text-white px-4">
        <h1 className="text-9xl font-extrabold mb-6 select-none">Oops...</h1>
        <p className="text-2xl md:text-3xl mb-8 max-w-md text-center">
          Sorry, something went wrong.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-white text-orange-700 font-semibold rounded-lg shadow-lg hover:bg-orange-50 active:bg-orange-200 active:scale-95 transition-all cursor-pointer"
        >
          Go Back Home
        </button>
      </div>
    );

  const likes = post.votes?.filter((v) => v.vote_type === "like").length || 0;
  const dislikes =
    post.votes?.filter((v) => v.vote_type === "dislike").length || 0;
  const userVote = post.votes?.find((v) => v.user_id === userId);

  return (
    <div className="max-w-xl mx-auto p-8 mt-15">
      <Link
        href="/"
        className="inline-block mt-2 text-blue-600 hover:underline"
      >
        ← Back to all posts
      </Link>
      <Card className="mt-3 border-1 dark:border-[rgb(23,23,23)] border-gray-300 border-solid shadow-none">
        <CardHeader className="flex flex-row gap-3">
          <Avatar
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (!post.is_anonymous) {
                router.push(`/user/${post.user_id}`);
              }
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
                if (!post.is_anonymous) {
                  router.push(`/user/${post.user_id}`);
                }
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
        <PostComments postId={post.id} />
        <CardFooter className="gap-2 mt-[-12] mb-[-8] flex flex-wrap items-center">
          <Button
            className={clsx(
              "w-[70px] cursor-pointer active:scale-95 transition-all",
              userVote?.vote_type === "like"
                ? "bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-300 dark:hover:bg-blue-900"
                : "bg-transparent border",
              "active:bg-gray-200 dark:active:bg-[rgb(60,60,60)]"
            )}
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleVote("like");
            }}
          >
            {likes}
            <ThumbsUp />
          </Button>
          <Button
            className={clsx(
              "w-[70px] cursor-pointer active:scale-95 transition-all",
              userVote?.vote_type === "dislike"
                ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-800 dark:text-red-300 dark:hover:bg-red-900"
                : "bg-transparent border",
              "active:bg-gray-200 dark:active:bg-[rgb(60,60,60)]"
            )}
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleVote("dislike");
            }}
          >
            {dislikes}
            <ThumbsDown />
          </Button>

          <Button
            className="w-[70px] cursor-pointer active:scale-95 transition-all active:bg-gray-200 dark:active:bg-[rgb(60,60,60)]"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setCommenting((c) => !c);
            }}
          >
            <MessageSquareText />
          </Button>
        </CardFooter>
      </Card>

      {commenting && (
        <div>
          <PostCommentForm
            postId={post.id}
            onCommentAdded={() => {
              setCommenting(false);
              toast.success("Comment added");
            }}
            onCancel={() => setCommenting(false)}
          />
        </div>
      )}
    </div>
  );
}
