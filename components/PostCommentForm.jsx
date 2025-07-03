"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function PostCommentForm({ postId, onCommentAdded, onCancel }) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!content.trim()) return toast.error("Comment cannot be empty");

    setSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You must be logged in to comment");
      setSubmitting(false);
      return;
    }

    const { data, error } = await supabase.from("comments").insert({
      post_id: postId,
      parent_id: null,
      user_id: user.id,
      content,
      is_anonymous: false,
    });

    setSubmitting(false);

    if (error) {
      toast.error("Failed to submit comment");
      console.error(error);
    } else {
      setContent("");
      if (onCommentAdded) onCommentAdded();
      if (onCancel) onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2">
      <textarea
        className="w-full rounded border p-2"
        rows={3}
        placeholder="Write your comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={submitting}
      />
      <div className="flex gap-2 justify-end">
        <Button
          className="w-[70px] cursor-pointer active:scale-95 transition-all active:bg-gray-200 dark:active:bg-[rgb(60,60,60)]"
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          className="cursor-pointer active:scale-95 transition-all"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
