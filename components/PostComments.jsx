"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

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
    <div>
      <h2>Comments</h2>
      {comments.length === 0 && <p>No comments yet.</p>}
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <strong>
              {comment.is_anonymous
                ? "Anonymous"
                : comment.profiles?.full_name || "Unknown"}
            </strong>
            <p>{comment.content}</p>
            <small>{new Date(comment.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
