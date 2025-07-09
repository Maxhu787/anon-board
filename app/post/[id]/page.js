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
import {
  ArrowLeft,
  MessageSquareText,
  ThumbsDown,
  ThumbsUp,
  User,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";
import PostComments from "@/components/PostComments";
import PostCommentForm from "@/components/PostCommentForm";
import BackButton from "@/components/BackButton";
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
import { useTranslation } from "react-i18next";
import { getColorFromId } from "@/lib/getColorFromId";

export default function PostPage(promiseParams) {
  const { id } = use(promiseParams.params);
  const [post, setPost] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [localComments, setLocalComments] = useState([]);
  const { t } = useTranslation();
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

        // Fetch post data
        const { data: postData, error: postError } = await supabase
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

        if (postError || !postData) throw new Error("Post not found");

        // Fetch comment count for this post
        const { count, error: countError } = await supabase
          .from("comments")
          .select("id", { count: "exact", head: true })
          .eq("post_id", id);

        if (countError) {
          console.error(
            "Error fetching comment count for post",
            id,
            countError
          );
        }

        setPost({
          ...postData,
          comment_count: count || 0,
        });
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
    if (!user) return toast.error("You must be logged in");

    const existingVote = post.votes?.find((v) => v.user_id === user.id);

    if (existingVote) {
      if (existingVote.vote_type === type) {
        await supabase
          .from("votes")
          .delete()
          .eq("user_id", user.id)
          .eq("post_id", post.id);
        // toast(`${type} removed`);

        const updatedVotes = post.votes.filter((v) => v.user_id !== user.id);
        setPost({ ...post, votes: updatedVotes });
        return;
      } else {
        await supabase
          .from("votes")
          .update({ vote_type: type })
          .eq("user_id", user.id)
          .eq("post_id", post.id);
        // toast(`${type === "like" ? "Liked" : "Disliked"}`);

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
    // toast(`${type === "like" ? "Liked" : "Disliked"}`);

    setPost({
      ...post,
      votes: [...(post.votes || []), { user_id: user.id, vote_type: type }],
    });
  };

  async function handleDeletePost(e) {
    e.stopPropagation();
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      toast.error("Something went wrong.");
    } else {
      toast.success(t("postDeleted"));
      router.replace("/home");
    }
  }

  if (loading)
    return (
      <div className="max-w-xl mx-auto p-8 mt-15">
        <BackButton
          onClick={() => {
            router.replace("/home");
          }}
        />
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
          {/* <CardFooter className="gap-2 mt-[-12] mb-[-8]">
            <Skeleton className="h-9 w-[70px] rounded-md" />
            <Skeleton className="h-9 w-[70px] rounded-md" />
          </CardFooter> */}
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
          onClick={() => router.replace("/home")}
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

  const date = new Date(post.created_at);
  const now = new Date();
  const showYear = date.getFullYear() !== now.getFullYear();

  const formattedDate = `${showYear ? date.getFullYear() + "/" : ""}${
    date.getMonth() + 1
  }/${date.getDate()} ${date.getHours()}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className="max-w-xl mx-auto p-8 mt-15">
      <BackButton
        onClick={() => {
          router.back();
        }}
      />
      <Card className="mt-3 border-1 dark:border-[rgb(23,23,23)] border-gray-300 border-solid shadow-none">
        <CardHeader className="relative flex flex-row gap-3">
          <Avatar
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (!post.is_anonymous) {
                router.push(`/user/${post.user_id}`);
              }
            }}
            className="cursor-pointer w-10 h-10"
          >
            {post.is_anonymous ? (
              <AvatarFallback className={`${getColorFromId(post.user_id)}`}>
                <User className="w-5 h-5" strokeWidth={3} />
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
            <CardTitle className="flex flex-row items-center gap-1.5">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (!post.is_anonymous) {
                    router.push(`/user/${post.user_id}`);
                  }
                }}
                className={
                  post.is_anonymous ? "" : "cursor-pointer hover:underline"
                }
              >
                <span className="text-[15px]">
                  {post.is_anonymous
                    ? t("userAnon")
                    : post.profiles?.full_name
                    ? post.profiles?.full_name
                    : t("userDeleted")}
                </span>
              </div>
              <div className="text-[12px] mt-[2px] text-gray-500 dark:text-gray-400">
                {/* {formattedDate} */}
                {new Date(post.created_at).toLocaleString("zh-TW", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </CardTitle>

            <CardContent className="ml-[-25] mt-1">
              <p className="text-[15px] whitespace-pre-wrap wrap-break-word">
                {post.content}
              </p>
            </CardContent>
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
              <DropdownMenuContent side="bottom" align="end" className="w-28">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(window.location.href);
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
                <AlertDialogDescription>{t("noundone")}</AlertDialogDescription>
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
                  onClick={(e) => handleDeletePost(e)}
                  type="submit"
                >
                  {t("delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>
        <CardFooter className="gap-2 mt-[-20] mb-[-18] flex flex-wrap items-center">
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
              handleVote("like");
            }}
          >
            <ThumbsUp
              className={clsx(
                "w-4 h-4 transition-colors",
                userVote?.vote_type === "like" ? "fill-pink-500" : "fill-none"
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
              handleVote("dislike");
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
              commenting
                ? "text-blue-600 dark:text-blue-400 hover:text-blue-600"
                : "text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400",
              "hover:bg-blue-50 dark:hover:bg-[rgb(40,40,40)] active:scale-95 transition-all"
            )}
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setCommenting((c) => !c);
            }}
          >
            <MessageSquareText className="w-4 h-4" />
            <span className="text-sm">{post.comment_count}</span>{" "}
          </Button>
        </CardFooter>
        {commenting && (
          <div className="p-4 mt-[-20] mb-[-30]">
            <PostCommentForm
              postId={post.id}
              onCommentAdded={(comment) => {
                setCommenting(false);
                setLocalComments((prev) => [...prev, comment]);
                setPost((prevPost) => ({
                  ...prevPost,
                  comment_count: (prevPost.comment_count || 0) + 1,
                }));
              }}
              onCancel={() => setCommenting(false)}
            />
          </div>
        )}
        <PostComments postId={post.id} comments={localComments} />
      </Card>
    </div>
  );
}
