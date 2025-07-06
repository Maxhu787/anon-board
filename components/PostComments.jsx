"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Separator } from "./ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageSquareText } from "lucide-react";
import clsx from "clsx";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useTranslation } from "react-i18next";

export default function PostComments({
  postId,
  comments: localComments = [],
  topOnly = false,
}) {
  const [comments, setComments] = useState([]);
  const supabase = createClient();
  const { t } = useTranslation();

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
          )
        `
        )
        .eq("post_id", postId)
        .is("parent_id", null);

      const { data, error } = topOnly
        ? await baseQuery.order("created_at", { ascending: false }).limit(3)
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
    // Implement like/dislike vote handling here
  };

  const handleCommentReply = (commentId) => {
    // Implement reply-to-comment behavior here
  };

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
                        ? "Anonymous"
                        : comment.profiles?.full_name || "Deleted user"}
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

            return (
              <li key={comment.id} className="pl-8 pt-1 pb-1 border-b-2">
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
                      <AvatarFallback>A</AvatarFallback>
                    ) : comment.profiles?.avatar_url ? (
                      <AvatarImage src={comment.profiles.avatar_url} />
                    ) : (
                      <AvatarFallback>D</AvatarFallback>
                    )}
                  </Avatar>
                  <strong className="text-[12px] ml-1">
                    {comment.is_anonymous
                      ? "Anonymous"
                      : comment.profiles?.full_name || "Deleted user"}
                  </strong>
                  <small className="font-bold text-[12px] text-gray-500 dark:text-gray-400">
                    {formattedDate}
                  </small>
                </div>
                <p className="text-[14px] ml-8 mt-[-13] whitespace-pre-wrap wrap-break-word">
                  {comment.content}
                </p>
                <div className="flex items-center gap-2 mt-0">
                  <Button
                    className={clsx(
                      "cursor-pointer flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-150",
                      false === "like"
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
                        false === "like" ? "fill-pink-500" : "fill-none"
                      )}
                    />
                    <span className="text-sm">{0}</span>
                  </Button>
                  <Button
                    className={clsx(
                      "cursor-pointer flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-150",
                      false === "dislike"
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
                        false === "dislike" ? "fill-pink-500" : "fill-none"
                      )}
                    />
                    <span className="text-sm">{0}</span>
                  </Button>
                  <Button
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
                      handleCommentReply(comment.id);
                      // setCommentingPostId(isCommenting ? null : post.id);
                    }}
                  >
                    <MessageSquareText className="w-4 h-4" />
                    <span className="text-sm">{0}</span>
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
