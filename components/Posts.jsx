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
import { MessageSquareText, ThumbsDown, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import PostComments from "./PostComments";
import PostCommentForm from "./PostCommentForm";

const PAGE_SIZE = 10;

export default function Posts() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [userId, setUserId] = useState(null);
  const [commentingPostId, setCommentingPostId] = useState(null);
  const loaderRef = useRef(null);

  const supabase = createClient();
  const { t } = useTranslation();

  // Add a comments property to each post after fetching
  const fetchPosts = async (pageIndex) => {
    if (!hasMore) return;

    setLoading(true);

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
      if (data.length) {
        // Add comments: [] to each post for local state
        const postsWithComments = data.map((post) => ({
          ...post,
          comments: [],
        }));
        setPosts((prev) => [...prev, ...postsWithComments]);
      }
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

    const postIndex = posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) return;

    const post = posts[postIndex];
    const existingVote = post.votes?.find((v) => v.user_id === user.id);

    if (existingVote) {
      if (existingVote.vote_type === type) {
        await supabase
          .from("votes")
          .delete()
          .eq("user_id", user.id)
          .eq("post_id", postId);
        toast(`${type} removed`);

        const updatedVotes = post.votes.filter((v) => v.user_id !== user.id);
        const newPosts = [...posts];
        newPosts[postIndex] = { ...post, votes: updatedVotes };
        setPosts(newPosts);
        return;
      } else {
        await supabase
          .from("votes")
          .update({ vote_type: type })
          .eq("user_id", user.id)
          .eq("post_id", postId);
        toast(`${type === "like" ? "Liked" : "Disliked"}`);

        const updatedVotes = post.votes.map((v) =>
          v.user_id === user.id ? { ...v, vote_type: type } : v
        );
        const newPosts = [...posts];
        newPosts[postIndex] = { ...post, votes: updatedVotes };
        setPosts(newPosts);
        return;
      }
    }

    await supabase.from("votes").insert({
      user_id: user.id,
      post_id: postId,
      vote_type: type,
    });
    toast(`${type === "like" ? "Liked" : "Disliked"}`);

    const newPosts = [...posts];
    newPosts[postIndex] = {
      ...post,
      votes: [...(post.votes || []), { user_id: user.id, vote_type: type }],
    };
    setPosts(newPosts);
  };

  // Helper to append a comment to a post in state
  const appendCommentToPost = (postId, comment) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [...(p.comments || []), comment],
            }
          : p
      )
    );
  };

  return (
    <ul className="mb-8 flex flex-col items-center space-y-2">
      {posts.map((post) => {
        const likes =
          post.votes?.filter((v) => v.vote_type === "like").length || 0;
        const dislikes =
          post.votes?.filter((v) => v.vote_type === "dislike").length || 0;

        const userVote = post.votes?.find((v) => v.user_id === userId);
        const isCommenting = commentingPostId === post.id;

        return (
          <li key={post.id} className="w-full max-w-xl">
            <Card
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                router.push(`/post/${post.id}`);
              }}
              className="border-1 dark:border-[rgb(23,23,23)] border-gray-300 border-solid shadow-none hover:cursor-pointer"
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
                    <AvatarFallback>
                      {post.is_anonymous
                        ? "A"
                        : post.profiles?.full_name?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
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
                <p className="text-[15px]">{post.content}</p>
              </CardContent>
              {/* Pass comments and appendCommentToPost to PostComments */}
              <PostComments postId={post.id} comments={post.comments} />
              <CardFooter className="gap-2 mt-[-12] mb-[-8] flex flex-wrap items-center">
                <Button
                  className={clsx(
                    "w-[65px] cursor-pointer active:scale-95 transition-all",
                    userVote?.vote_type === "like"
                      ? "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-600 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                      : "bg-transparent border",
                    "active:bg-gray-200 dark:active:bg-[rgb(60,60,60)]"
                  )}
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleVote(post.id, "like");
                  }}
                >
                  <span className="mr-[-3]">{likes}</span>
                  <ThumbsUp />
                </Button>
                <Button
                  className={clsx(
                    "w-[65px] cursor-pointer active:scale-95 transition-all",
                    userVote?.vote_type === "dislike"
                      ? "bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-600 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                      : "bg-transparent border",
                    "active:bg-gray-200 dark:active:bg-[rgb(60,60,60)]"
                  )}
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleVote(post.id, "dislike");
                  }}
                >
                  <span className="mr-[-3]">{dislikes}</span>
                  <ThumbsDown />
                </Button>
                <Button
                  className="w-[65px] cursor-pointer active:scale-95 transition-all active:bg-gray-200 dark:active:bg-[rgb(60,60,60)]"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setCommentingPostId(isCommenting ? null : post.id);
                  }}
                >
                  <MessageSquareText />
                </Button>
              </CardFooter>
            </Card>
            {isCommenting && (
              <div>
                <PostCommentForm
                  postId={post.id}
                  onCommentAdded={(comment) => {
                    setCommentingPostId(null);
                    toast.success("Comment added");
                    // Append the new comment to the post's comments
                    appendCommentToPost(post.id, comment);
                  }}
                  onCancel={() => setCommentingPostId(null)}
                />
              </div>
            )}
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
