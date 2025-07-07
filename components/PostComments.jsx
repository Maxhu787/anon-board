"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Separator } from "./ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageSquareText } from "lucide-react";
import clsx from "clsx";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

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
