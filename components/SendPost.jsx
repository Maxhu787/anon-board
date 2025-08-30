"use client";

import React, { useState } from "react";
import { nanoid } from "nanoid";
import { Button } from "./ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function SendPost({ onSent, hideTitle }) {
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!content.trim()) return;
    if (content.length > 2000) {
      toast.error("Content is too long (max 2000 characters)");
      return;
    }

    setLoading(true);
    const { data: user } = await supabase.auth.getUser();

    const postId = nanoid(11); // generate Threads-style ID

    const { error } = await supabase.from("posts").insert({
      id: postId, // custom short ID
      content,
      is_anonymous: isAnonymous,
      user_id: user?.user?.id ?? null,
    });

    setLoading(false);
    if (!error) {
      setContent("");
      setIsAnonymous(false);
      toast.success(t("posted"));
      if (onSent) onSent();
      else window.location.reload(); // fallback
    } else {
      toast.error("Something went wrong.");
      console.error("Error posting:", error);
    }
  };

  return (
    <form
      className="w-full max-w-md mx-auto space-y-6 mt-12"
      onSubmit={handleSubmit}
    >
      {!hideTitle && (
        // <div className="text-center mt-2">
        <div className="mt-2 text-left">
          <h2 className="text-2xl font-bold mb-2">{t("cardTitle")}</h2>
          <p className="text-muted-foreground text-sm mb-4">
            {t("cardSecondary")}
          </p>
        </div>
      )}
      <div>
        <Label htmlFor="content">{t("content")}</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("cardPlaceholder")}
          rows={4}
          maxLength={2000}
          className="mt-2 min-h-40 max-h-40 overflow-y-auto resize-none"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label className="cursor-pointer" htmlFor="anonymous">
          {t("postAnon")}
        </Label>
        <Switch
          id="anonymous"
          checked={isAnonymous}
          onCheckedChange={setIsAnonymous}
          className="cursor-pointer"
        />
      </div>
      <div className="space-y-2 mb-4">
        <Button
          type="submit"
          className="w-full cursor-pointer active:bg-[rgb(57,57,57)] active:scale-95 transition-all dark:active:bg-gray-200"
          disabled={loading || !content.trim()}
        >
          {loading ? t("posting") : t("post")}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full cursor-pointer active:bg-gray-200 active:scale-95 transition-all dark:active:bg-[rgb(70,70,70)]"
          onClick={() => {
            setContent("");
            setIsAnonymous(false);
          }}
        >
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
}
