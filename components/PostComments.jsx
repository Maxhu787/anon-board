"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Separator } from "./ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PostComments({
  postId,
  comments: localComments = [],
  topOnly = false, // NEW PROP: set true to show top 2–3 most liked comments
}) {
  const [comments, setComments] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return;

      if (topOnly) {
        const { data, error } = await supabase
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
          .is("parent_id", null)
          .order("created_at", { ascending: false }) // newest first
          .limit(3); // only top 3 by recency

        if (error) {
          console.error("Error fetching top comments:", error);
          return;
        }

        setComments(data || []);
      } else {
        // Default: show all comments by created_at
        const { data, error } = await supabase
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
          .is("parent_id", null)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error fetching comments:", error);
        } else {
          setComments(data);
        }
      }
    };

    fetchComments();
  }, [postId, supabase, topOnly]);

  const allComments = !topOnly
    ? [
        ...comments,
        ...localComments.filter((lc) => !comments.some((c) => c.id === lc.id)),
      ]
    : comments;

  return topOnly ? (
    <div className="mt-[-15]">
      <Separator />
      {allComments.length === 0 ? (
        <p className="text-[14px] pl-8 pt-3 text-gray-500 mb-[-10]">
          No comments yet.
        </p>
      ) : (
        <ScrollArea className="w-full ">
          <ul className="space-y-0 pl-8 pt-2 max-h-[300px]">
            {allComments.map((comment) => (
              <li key={comment.id}>
                <strong className="text-[14px]">
                  {comment.is_anonymous
                    ? "Anonymous"
                    : comment.profiles?.full_name || "Unknown"}
                </strong>
                <small className="text-[12px] ml-1">
                  {new Date(comment.created_at).toLocaleString("zh-TW", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
                <p className="text-[14px] ml-0">{comment.content}</p>
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}
    </div>
  ) : (
    <div className="mt-[-15]">
      <Separator />
      {allComments.length === 0 ? (
        <p className="text-[14px] pl-8 pt-3 text-gray-500 mb-[-10]">
          No comments yet.
        </p>
      ) : (
        <ScrollArea className="w-full ">
          <ul className="space-y-0 pl-8 pt-2 max-h-[300px]">
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
                  <strong className="text-[14px]">
                    {comment.is_anonymous
                      ? "Anonymous"
                      : comment.profiles?.full_name || "Unknown"}
                  </strong>
                  <small className="font-bold text-[12px] ml-1 text-gray-500 dark:text-gray-400">
                    {formattedDate}
                  </small>
                  <p className="text-[14px] ml-0">{comment.content}</p>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      )}
    </div>
  );
}
