"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

const PAGE_SIZE = 10;

export default function Posts() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [userId, setUserId] = useState(null);
  const loaderRef = useRef(null);

  const supabase = createClient();
  const { t } = useTranslation();

  const fetchPosts = async (pageIndex) => {
    if (!hasMore) return;

    setLoading(true);

    // get user on first load
    if (!userId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id);
    }

    const from = pageIndex * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

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
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      if (data.length < PAGE_SIZE) setHasMore(false);
      if (data.length) setPosts((prev) => [...prev, ...data]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPosts(0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loading, hasMore]);

  useEffect(() => {
    if (page > 0) fetchPosts(page);
  }, [page]);

  const handleVote = async (postId, type) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return toast("You must be logged in");

    const existingVote = posts
      .find((p) => p.id === postId)
      ?.votes.find((v) => v.user_id === user.id);

    // If already voted the same, remove the vote (toggle off)
    if (existingVote && existingVote.vote_type === type) {
      await supabase
        .from("votes")
        .delete()
        .eq("user_id", user.id)
        .eq("post_id", postId);
      toast(`${type} removed`);
    } else {
      // Upsert (insert or replace) the vote
      await supabase.from("votes").upsert({
        user_id: user.id,
        post_id: postId,
        vote_type: type,
      });
      toast(`${type === "like" ? "Liked" : "Disliked"}`);
    }

    // Refresh post list (ideally just that one post)
    setPosts([]);
    setPage(0);
    setHasMore(true);
    fetchPosts(0);
  };

  return (
    <ul className="mb-8 flex flex-col items-center space-y-2">
      {posts.map((post) => {
        const likes =
          post.votes?.filter((v) => v.vote_type === "like").length || 0;
        const dislikes =
          post.votes?.filter((v) => v.vote_type === "dislike").length || 0;

        const userVote = post.votes?.find((v) => v.user_id === userId);

        return (
          <li key={post.id} className="w-full max-w-xl">
            <Card
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                router.push(`/post/${post.id}`);
              }}
              className="border-1 dark:border-gray-800 border-gray-300 border-solid shadow-none hover:cursor-pointer"
            >
              <CardHeader className="flex flex-row gap-3">
                <Avatar
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (!post.is_anonymous) {
                      router.push(`/user/${post.user_id}`);
                    }
                  }}
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
                    className="hover:underline"
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
              <CardContent className="mt-[-18] whitespace-pre-wrap pl-17">
                <p className="text-[15px]">
                  {post.content} {/*  */}
                  <span className="text-xs text-gray-500">
                    ({likes}👍 {dislikes}👎)
                  </span>
                  {/*  */}
                </p>
              </CardContent>
              <CardFooter className="gap-2 mt-[-12] mb-[-8]">
                <Button
                  // className="w-[70px] cursor-pointer active:bg-gray-200 active:scale-95 transition-all dark:active:bg-[rgb(60,60,60)]"
                  className={clsx(
                    "w-[70px] cursor-pointer active:scale-95 transition-all",
                    userVote?.vote_type === "like"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                      : "bg-transparent border",
                    "active:bg-gray-200 dark:active:bg-[rgb(60,60,60)]"
                  )}
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    // toast("Liked");
                    handleVote(post.id, "like");
                  }}
                >
                  <ThumbsUp />
                </Button>
                <Button
                  // className="w-[70px] cursor-pointer active:bg-gray-200 active:scale-95 transition-all dark:active:bg-[rgb(60,60,60)]"
                  className={clsx(
                    "w-[70px] cursor-pointer active:scale-95 transition-all",
                    userVote?.vote_type === "dislike"
                      ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                      : "bg-transparent border",
                    "active:bg-gray-200 dark:active:bg-[rgb(60,60,60)]"
                  )}
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    // toast("Disliked");
                    handleVote(post.id, "dislike");
                  }}
                >
                  <ThumbsDown />
                </Button>
              </CardFooter>
            </Card>
          </li>
        );
      })}

      <li
        ref={loaderRef}
        className="h-10 w-full flex justify-center items-center"
      >
        {loading && hasMore && (
          <span className="text-sm text-gray-500">{t("loading")}</span>
        )}
        {!hasMore && (
          <span className="text-sm text-gray-400">{t("nomore")}</span>
        )}
      </li>
    </ul>
  );
}
