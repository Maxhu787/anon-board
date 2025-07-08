"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Separator } from "./ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageSquareText, User } from "lucide-react";
import clsx from "clsx";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
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

export default function PostComments({
  postId,
  comments: localComments = [],
  topOnly = false,
}) {
  const [comments, setComments] = useState([]);
  const [userId, setUserId] = useState(null);
  const supabase = createClient();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return;

      const baseQuery = supabase
        .from("comments")
        .select(
          `
          *,
          profiles:profiles!comments_user_id_fkey (
            full_name,
            avatar_url
          ),
          comment_votes (
            user_id,
            vote_type
          )
        `
        )
        .eq("post_id", postId)
        .is("parent_id", null);

      const { data, error } = topOnly
        ? await baseQuery.order("created_at", { ascending: false }).limit(1)
        : await baseQuery.order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching comments:", error);
        return;
      }

      setComments(data || []);
    };

    fetchComments();
  }, [postId, supabase, topOnly]);

  const allComments = !topOnly
    ? [
        ...comments,
        ...localComments.filter((lc) => !comments.some((c) => c.id === lc.id)),
      ]
    : comments;

  const handleCommentVote = async (commentId, type) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return toast.error("You must be logged in");

    const commentIndex = comments.findIndex((c) => c.id === commentId);
    if (commentIndex === -1) return;

    const comment = comments[commentIndex];
    const existingVote = comment.comment_votes?.find(
      (v) => v.user_id === user.id
    );

    if (existingVote) {
      if (existingVote.vote_type === type) {
        await supabase
          .from("comment_votes")
          .delete()
          .eq("user_id", user.id)
          .eq("comment_id", commentId);

        toast(`${type} removed`);
        const updatedVotes = comment.comment_votes.filter(
          (v) => v.user_id !== user.id
        );
        const newComments = [...comments];
        newComments[commentIndex] = { ...comment, comment_votes: updatedVotes };
        setComments(newComments);
        return;
      } else {
        await supabase
          .from("comment_votes")
          .update({ vote_type: type })
          .eq("user_id", user.id)
          .eq("comment_id", commentId);

        toast(`${type === "like" ? "Liked" : "Disliked"}`);
        const updatedVotes = comment.comment_votes.map((v) =>
          v.user_id === user.id ? { ...v, vote_type: type } : v
        );
        const newComments = [...comments];
        newComments[commentIndex] = { ...comment, comment_votes: updatedVotes };
        setComments(newComments);
        return;
      }
    }

    await supabase.from("comment_votes").insert({
      user_id: user.id,
      comment_id: commentId,
      vote_type: type,
    });

    toast(`${type === "like" ? "Liked" : "Disliked"}`);
    const newComments = [...comments];
    newComments[commentIndex] = {
      ...comment,
      comment_votes: [
        ...(comment.comment_votes || []),
        { user_id: user.id, vote_type: type },
      ],
    };
    setComments(newComments);
  };

  async function handleDeleteComment(commentId, e) {
    e.stopPropagation();
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      toast.error("Something went wrong.");
    } else {
      toast.success(t("commentDeleted"));
      setComments((prev) => prev.filter((p) => p.id !== commentId));
    }
  }

  return topOnly ? (
    <div className="mt-[-15]">
      <Separator />
      {allComments.length === 0 ? (
        <p className="text-[14px] pl-8 pt-3 pb-3 text-gray-500 mb-[-10]">
          {t("nocomment")}
        </p>
      ) : (
        <ScrollArea className="w-full">
          <ul className="space-y-0 pl-8 pb-0 pt-2 max-h-[150px] max-w-[300px] pr-4">
            {allComments.map((comment) => {
              const date = new Date(comment.created_at);
              const now = new Date();
              const showYear = date.getFullYear() !== now.getFullYear();
              const formattedDate = `${
                showYear ? date.getFullYear() + "/" : ""
              }${
                date.getMonth() + 1
              }/${date.getDate()} ${date.getHours()}:${date
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;

              return (
                <li key={comment.id}>
                  <div className="flex items-center gap-1">
                    <strong className="text-[14px]">
                      {comment.is_anonymous
                        ? t("userAnon")
                        : comment.profiles?.full_name || t("userDeleted")}
                    </strong>
                    <small className="font-bold text-[12px] text-gray-500 dark:text-gray-400">
                      {formattedDate}
                    </small>
                  </div>
                  <p className="text-[14px] ml-0 whitespace-pre-wrap wrap-break-word">
                    {comment.content}
                  </p>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      )}
    </div>
  ) : (
    <div className="border-t-2">
      <div className="pl-4 pt-2 pb-0">
        <span className="font-semibold text-gray-500 dark:text-gray-300 text-[15px]">
          {t("comments")}
        </span>
      </div>
      {allComments.length === 0 ? (
        <p className="text-[14px] pl-8 pt-3 text-gray-500 mb-[-10]">
          {t("nocomment")}
        </p>
      ) : (
        <ul>
          {allComments.map((comment) => {
            const date = new Date(comment.created_at);
            const now = new Date();
            const showYear = date.getFullYear() !== now.getFullYear();
            const formattedDate = `${showYear ? date.getFullYear() + "/" : ""}${
              date.getMonth() + 1
            }/${date.getDate()} ${date.getHours()}:${date
              .getMinutes()
              .toString()
              .padStart(2, "0")}`;

            const likes =
              comment.comment_votes?.filter((v) => v.vote_type === "like")
                .length || 0;
            const dislikes =
              comment.comment_votes?.filter((v) => v.vote_type === "dislike")
                .length || 0;
            const userVote = comment.comment_votes?.find(
              (v) => v.user_id === userId
            );

            return (
              <li
                key={comment.id}
                className="pl-8 pt-1 pb-1 border-b-2 relative"
              >
                <div className="flex items-center gap-1">
                  <Avatar
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (!comment.is_anonymous) {
                        router.push(`/user/${comment.user_id}`);
                      }
                    }}
                    className="cursor-pointer w-6 h-6 mt-3"
                  >
                    {comment.is_anonymous ? (
                      <AvatarFallback
                        className={`${getColorFromId(comment.user_id)}`}
                      >
                        <User className="w-3 h-3" strokeWidth={3} />
                      </AvatarFallback>
                    ) : comment.profiles?.avatar_url ? (
                      <AvatarImage src={comment.profiles.avatar_url} />
                    ) : (
                      <AvatarFallback className="bg-red-400 text-white">
                        <User className="w-3 h-3" strokeWidth={3} />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <strong
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (!comment.is_anonymous) {
                        router.push(`/user/${comment.user_id}`);
                      }
                    }}
                    className={
                      comment.is_anonymous
                        ? "text-[12px] ml-1"
                        : "text-[12px] ml-1 cursor-pointer hover:underline"
                    }
                  >
                    {comment.is_anonymous
                      ? t("userAnon")
                      : comment.profiles?.full_name || t("userDeleted")}
                  </strong>
                  <small className="font-bold text-[12px] text-gray-500 dark:text-gray-400">
                    {formattedDate}
                  </small>
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0 absolute top-1 right-1 cursor-pointer h-9 w-9 rounded-full p-0 text-muted-foreground hover:bg-muted"
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
                            navigator.clipboard.writeText(window.location.href);
                            toast(t("linkcopy"));
                          }}
                          className="cursor-pointer"
                        >
                          {t("share")}
                        </DropdownMenuItem>
                        {comment.user_id === userId && (
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
                        <AlertDialogTitle>
                          {t("commentDeleteSure")}
                        </AlertDialogTitle>
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
                          onClick={(e) => handleDeleteComment(comment.id, e)}
                          type="submit"
                        >
                          {t("delete")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <p className="text-[14px] ml-8 mt-[-13] whitespace-pre-wrap wrap-break-word">
                  {comment.content}
                </p>
                <div className="flex items-center gap-2 mt-0">
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
                      handleCommentVote(comment.id, "like");
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
                      handleCommentVote(comment.id, "dislike");
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
                  {/* <Button
                    className={clsx(
                      "cursor-pointer flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-150",
                      false
                        ? "text-blue-600 dark:text-blue-400 hover:text-blue-600"
                        : "text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400",
                      "hover:bg-blue-50 dark:hover:bg-[rgb(40,40,40)] active:scale-95 transition-all"
                    )}
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      // handleCommentReply(comment.id);
                      // setCommentingPostId(isCommenting ? null : post.id);
                    }}
                  >
                    <MessageSquareText className="w-4 h-4" />
                    <span className="text-sm">{0}</span>
                  </Button> */}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
