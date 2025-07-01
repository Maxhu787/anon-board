"use client";

import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function SendPost() {
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const closeRef = useRef(null);

  const supabase = createClient();

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setLoading(true);
    const { data: user } = await supabase.auth.getUser();

    const { error } = await supabase.from("posts").insert({
      content,
      is_anonymous: isAnonymous,
      user_id: user?.user?.id ?? null,
    });

    setLoading(false);
    if (!error) {
      setContent("");
      setIsAnonymous(false);
      closeRef.current?.click();
      toast("Posted!");
    } else {
      console.error("Error posting:", error);
    }
  };

  return (
    <DrawerContent>
      <DrawerHeader className="text-center mt-2">
        <DrawerTitle>Create a post</DrawerTitle>
        <DrawerDescription>
          Share your thoughts anonymously or publicly.
        </DrawerDescription>
      </DrawerHeader>
      <div className="w-full flex justify-center">
        <div className="w-full max-w-md px-4 space-y-4">
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={4}
              className="mt-2 min-h-40 max-h-40 overflow-y-auto resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="anonymous">Post Anonymously</Label>
            <Switch
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
      <DrawerFooter>
        <div className="w-full flex justify-center">
          <div className="w-full max-w-md px-4 space-y-2 mb-4">
            <Button
              className="w-full cursor-pointer active:bg-[rgb(57,57,57)] active:scale-95 transition-all dark:active:bg-gray-200"
              disabled={loading || !content.trim()}
              onClick={handleSubmit}
            >
              {loading ? "Posting..." : "Post"}
            </Button>

            <DrawerClose asChild>
              <button ref={closeRef} className="hidden" />
            </DrawerClose>

            <DrawerClose asChild>
              <Button
                variant="outline"
                className="w-full cursor-pointer active:bg-gray-200 active:scale-95 transition-all dark:active:bg-[rgb(70,70,70)]"
              >
                Cancel
              </Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerFooter>
    </DrawerContent>
  );
}
