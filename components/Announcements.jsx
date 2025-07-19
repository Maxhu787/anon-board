"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "./ui/separator";

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: " 🎉 測試版網站正式上線 🎉",
    content:
      "測試版 2025/7/6 正式上線！\n測試期間，會有不斷的功能＆介面更新，\n這期間註冊帳號也會有特殊標籤。",
    author: "Admin",
    date: "2024-07-06T10:00:00Z",
  },
];

export default function Announcements() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ posts: 0, users: 0 });
  const [displayStats, setDisplayStats] = useState({ posts: 0, users: 0 });
  const [suggestion, setSuggestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    document.title = "g4o2.me | Announcements";
    async function fetchStats() {
      const [{ count: posts }, { count: users }] = await Promise.all([
        supabase.from("posts").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);
      const finalStats = {
        posts: posts || 0,
        users: users || 0,
      };
      setStats(finalStats);
      animateStats(finalStats);
    }

    fetchStats();
  }, [supabase]);

  function animateStats(targetStats) {
    const duration = 800;
    const start = performance.now();
    // const initialStats = { ...displayStats }; // or { posts: 0, users: 0 } if you want to always animate from 0
    const initialStats = { posts: 0, users: 0 };

    function animate(now) {
      const progress = Math.min((now - start) / duration, 1);

      setDisplayStats({
        posts: Math.floor(
          initialStats.posts +
            (targetStats.posts - initialStats.posts) * progress
        ),
        users: Math.floor(
          initialStats.users +
            (targetStats.users - initialStats.users) * progress
        ),
      });

      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  async function handleSuggestionSubmit(e) {
    e.preventDefault();
    if (!suggestion.trim()) {
      toast.error("Please enter a suggestion.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("suggestions").insert({
      content: suggestion,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Failed to submit suggestion.");
    } else {
      toast.success("Thank you for your suggestion!");
      setSuggestion("");
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="w-full max-w-xl mb-8">
        <Card
          onClick={() => animateStats(stats)}
          className="pb-10 border-1 dark:border-[rgb(23,23,23)] border-gray-300 border-solid shadow-none cursor-pointer hover:opacity-90 transition-opacity"
        >
          <CardHeader>
            <CardTitle className="text-2xl">平台統計</CardTitle>
          </CardHeader>
          <CardContent className="mt-[-12] flex flex-row gap-35 justify-center items-center">
            <div className="flex flex-col items-center">
              <span className="text-7xl font-bold text-blue-600 dark:text-blue-400">
                {displayStats.posts}
              </span>
              <span className="text-gray-600 dark:text-gray-300 text-[18px]">
                發布貼文
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-7xl font-bold text-green-600 dark:text-green-400">
                {displayStats.users}
              </span>
              <span className="text-gray-600 dark:text-gray-300 text-[18px]">
                註冊帳號
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full max-w-xl mb-8">
        <Card className="pb-3 border-1 dark:border-[rgb(23,23,23)] border-gray-300 border-solid shadow-none hover:cursor-pointer">
          <CardHeader>
            <CardTitle className="text-xl">Follow Us</CardTitle>
            <CardDescription>Stay updated via our social media</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-row gap-4">
              <li>
                <a
                  href="https://instagram.com/g4o2.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:underline"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://threads.com/g4o2.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 dark:text-gray-200 hover:underline"
                >
                  Threads
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="w-full max-w-xl mb-8">
        <h1 className="text-4xl font-bold mb-8 text-blue-600 dark:text-blue-400">
          {t("announcements") || "Announcements"}
        </h1>
        <ul className="flex flex-col items-center space-y-4 w-full max-w-xl">
          {ANNOUNCEMENTS.map((a) => (
            <li key={a.id} className="w-full">
              <Card className="border-1 dark:border-[rgb(23,23,23)] border-gray-300 border-solid shadow-none">
                <CardHeader className="flex flex-row gap-3 items-center">
                  <Avatar>
                    <AvatarFallback className="bg-blue-400 text-white">
                      <User className="w-4 h-4" strokeWidth={3} />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{a.title}</CardTitle>
                    <CardDescription className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                      {a.author} ·{" "}
                      {new Date(a.date).toLocaleString("zh-TW", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="mt-[-18] whitespace-pre-wrap wrap-break-word pl-17">
                  <p className="text-[15px]">{a.content}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full max-w-xl mb-8">
        <Separator className="mb-8" />
        <Card className="pb-3 border-1 dark:border-[rgb(23,23,23)] border-gray-300 border-solid shadow-none hover:cursor-pointer">
          <CardHeader>
            <CardTitle className="text-xl">💡 意見回饋</CardTitle>
            <CardDescription>意見回饋、你想要的新功能</CardDescription>
          </CardHeader>
          <form onSubmit={handleSuggestionSubmit}>
            <CardContent>
              <Textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder={"Type your suggestion here..."}
                rows={3}
                className="mt-[-12] mb-3 min-h-40 max-h-40 overflow-y-auto resize-none"
                maxLength={1000}
                disabled={submitting}
              />
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full cursor-pointer active:scale-95 transition-all"
                disabled={submitting || !suggestion.trim()}
              >
                {submitting
                  ? t("submitting") || "Submitting..."
                  : t("submit") || "Submit"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
