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
import { MessageSquareText, ThumbsDown, ThumbsUp, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import PostComments from "./PostComments";
import PostCommentForm from "./PostCommentForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getColorFromId } from "@/lib/getColorFromId";

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
      setLoading(false);
      return;
    }

    if (data.length < PAGE_SIZE) setHasMore(false);

    // For each post, get comment count by querying comments table
    const postsWithComments = await Promise.all(
      data.map(async (post) => {
        const { count, error: countError } = await supabase
          .from("comments")
          .select("id", { count: "exact", head: true }) // head:true means only count, no rows
          .eq("post_id", post.id);

        if (countError) {
          console.error(
            "Error fetching comment count for post",
            post.id,
            countError
          );
        }

        return {
          ...post,
          comments: [],
          comment_count: count || 0,
        };
      })
    );

    setPosts((prev) => [...prev, ...postsWithComments]);
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
    if (!user) return toast.error("You must be logged in");

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
        // toast(`${type} removed`);

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
        // toast(`${type === "like" ? "Liked" : "Disliked"}`);

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
    // toast(`${type === "like" ? "Liked" : "Disliked"}`);

    const newPosts = [...posts];
    newPosts[postIndex] = {
      ...post,
      votes: [...(post.votes || []), { user_id: user.id, vote_type: type }],
    };
    setPosts(newPosts);
  };

  async function handleDeletePost(postId, e) {
    e.stopPropagation();
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      toast.error("Something went wrong.");
    } else {
      toast.success(t("postDeleted"));
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    }
  }

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
              className="pb-3 border-1 dark:border-[rgb(23,23,23)] border-gray-300 border-solid shadow-none hover:cursor-pointer"
            >
              <CardHeader className="relative flex flex-row gap-3 justify-between items-start">
                <div className="flex flex-row gap-3">
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
                      <AvatarFallback
                        className={`${getColorFromId(post.user_id)}`}
                      >
                        <User className="w-4 h-4" strokeWidth={3} />
                      </AvatarFallback>
                    ) : post.profiles?.avatar_url ? (
                      <AvatarImage src={post.profiles.avatar_url} />
                    ) : (
                      <AvatarFallback className="bg-red-400 text-white">
                        <User className="w-4 h-4" strokeWidth={3} />
                      </AvatarFallback>
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
                      className={post.is_anonymous ? "" : "hover:underline"}
                    >
                      <CardTitle>
                        {post.is_anonymous
                          ? t("userAnon")
                          : post.profiles?.full_name
                          ? post.profiles?.full_name
                          : t("userDeleted")}
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
                </div>
                <AlertDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0 absolute top-[-16] right-2 cursor-pointer h-9 w-9 rounded-full p-0 text-muted-foreground hover:bg-muted"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                      >
                        <span className="sr-only">Open menu</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="bottom"
                      align="end"
                      className="w-28"
                    >
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(
                            `https://g4o2.me/post/${post.id}`
                          );
                          toast(t("linkcopy"));
                        }}
                        className="cursor-pointer"
                      >
                        {t("share")}
                      </DropdownMenuItem>
                      {post.user_id === userId && (
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="cursor-pointer"
                          >
                            {t("delete")}
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("postDeleteSure")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("noundone")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="cursor-pointer"
                      >
                        {t("cancel")}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 text-white hover:bg-red-600 active:bg-red-700 cursor-pointer"
                        onClick={(e) => handleDeletePost(post.id, e)}
                        type="submit"
                      >
                        {t("delete")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardHeader>

              <CardContent className="mt-[-18] whitespace-pre-wrap wrap-break-word pl-17">
                <p className="text-[15px]">{post.content}</p>
              </CardContent>
              <CardFooter className="gap-2 mt-[-24] mb-[-2] flex flex-wrap items-center">
                <Button
                  className={clsx(
                    "cursor-pointer flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-150",
                    userVote?.vote_type === "like"
                      ? "text-pink-600 dark:text-pink-400 hover:text-pink-600"
                      : "text-gray-500 hover:text-pink-500 dark:text-gray-400 dark:hover:text-pink-400",
                    "hover:bg-red-50 dark:hover:bg-[rgb(40,40,40)] active:scale-95 transition-all"
                  )}
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleVote(post.id, "like");
                  }}
                >
                  <ThumbsUp
                    className={clsx(
                      "w-4 h-4 transition-colors",
                      userVote?.vote_type === "like"
                        ? "fill-pink-500"
                        : "fill-none"
                    )}
                  />
                  <span className="text-sm">{likes}</span>
                </Button>
                <Button
                  className={clsx(
                    "cursor-pointer flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-150",
                    userVote?.vote_type === "dislike"
                      ? "text-pink-600 dark:text-pink-400 hover:text-pink-600"
                      : "text-gray-500 hover:text-pink-500 dark:text-gray-400 dark:hover:text-pink-400",
                    "hover:bg-red-50 dark:hover:bg-[rgb(40,40,40)] active:scale-95 transition-all"
                  )}
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleVote(post.id, "dislike");
                  }}
                >
                  <ThumbsDown
                    className={clsx(
                      "w-4 h-4 transition-colors",
                      userVote?.vote_type === "dislike"
                        ? "fill-pink-500"
                        : "fill-none"
                    )}
                  />
                  <span className="text-sm">{dislikes}</span>
                </Button>
                <Button
                  className={clsx(
                    "cursor-pointer flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-150",
                    isCommenting
                      ? "text-blue-600 dark:text-blue-400 hover:text-blue-600"
                      : "text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400",
                    "hover:bg-blue-50 dark:hover:bg-[rgb(40,40,40)] active:scale-95 transition-all"
                  )}
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setCommentingPostId(isCommenting ? null : post.id);
                  }}
                >
                  <MessageSquareText className="w-4 h-4" />
                  <span className="text-sm">{post.comment_count}</span>
                </Button>
              </CardFooter>

              {isCommenting && (
                <div
                  // onClickCapture={(e) => {
                  //   // e.stopPropagation();
                  // }}
                  className="pl-4 pr-4 mt-[-25]"
                >
                  <PostCommentForm
                    postId={post.id}
                    onCommentAdded={(comment) => {
                      setCommentingPostId(null);
                      appendCommentToPost(post.id, comment);
                      setPosts((prevPosts) =>
                        prevPosts.map((p) =>
                          p.id === post.id
                            ? {
                                ...p,
                                comment_count: (p.comment_count || 0) + 1,
                              }
                            : p
                        )
                      );
                    }}
                    onCancel={() => setCommentingPostId(null)}
                  />
                </div>
              )}
              <PostComments postId={post.id} comments={post.comments} topOnly />
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
