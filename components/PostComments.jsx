"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Separator } from "./ui/separator";

export default function PostComments({ postId }) {
  const [comments, setComments] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchComments = async () => {
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
    };

    if (postId) fetchComments();
  }, [postId, supabase]);

  return (
    <div className="mt-[-15]">
      <Separator />
      {comments.length === 0 && (
        <p className="text-[14px] pl-8 pt-3 text-gray-500 mb-[-10]">
          No comments yet.
        </p>
      )}
      <ul className="pl-8 pt-3">
        {comments.map((comment) => (
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
    </div>
  );
}
