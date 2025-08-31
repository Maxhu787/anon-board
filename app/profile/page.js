"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import LoginButton from "@/components/LoginLogoutButton";
import { ToggleThemeButton } from "@/components/ToggleThemeButton";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);

      // Fetch profile from the profiles table
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        toast.error("Failed to fetch profile.");
      } else {
        setProfile(profileData);
      }

      setLoading(false);
    };

    fetchUserProfile();
    document.title = "靠北屏中 5.0 | Profile";
  }, [supabase.auth, router]);

  if (loading || !user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900">
        <Card className="w-full max-w-md p-8 rounded-2xl shadow-lg">
          <CardHeader className="flex justify-center">
            <Skeleton className="w-28 h-28 mt-6 mb-6 rounded-full" />
          </CardHeader>
          <CardContent>
            <CardTitle>
              <Skeleton className="h-8 w-3/4 mb-4" />
            </CardTitle>
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-6" />
            <Skeleton className="h-6 w-1/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const fullName = profile.full_name || "Anonymous";
  const email = profile.email || user.email || "No email";
  const avatarUrl = profile.avatar_url || "";

  async function handleSaveName() {
    if (!newName.trim()) return;
    setSavingName(true);

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: newName })
      .eq("id", user.id);

    setSavingName(false);

    if (!error) {
      setEditingName(false);
      setProfile((prev) => ({ ...prev, full_name: newName }));
      toast.success("Name updated!");
    } else {
      toast.error("Failed to update name.");
    }
  }

  return (
    <div className="flex items-center flex-col justify-center min-h-screen bg-[rgb(250,250,250)] dark:bg-[rgb(10,10,10)]">
      <div className="bg-white dark:bg-zinc-900 text-black dark:text-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-28 h-28 mt-6 mb-2">
            <AvatarImage src={avatarUrl} alt={fullName} />
            <AvatarFallback>
              {fullName
                .split(" ")
                .map((word) => word[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold mb-4">{t("profile")}</h1>
          <p className="mb-2 flex items-center gap-2">
            <span className="font-semibold">Name:</span>
            {editingName ? (
              <>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="border rounded px-2 py-1 text-black dark:text-white bg-white dark:bg-zinc-800"
                  disabled={savingName}
                  style={{ minWidth: "120px" }}
                />
                <Button
                  onClick={handleSaveName}
                  disabled={savingName || !newName.trim()}
                  className="w-9 cursor-pointer active:bg-[rgb(57,57,57)] active:scale-95 transition-all dark:active:bg-gray-200"
                >
                  <Check />
                </Button>
                <Button
                  onClick={() => setEditingName(false)}
                  disabled={savingName}
                  variant="outline"
                  className="w-9 cursor-pointer active:bg-gray-200 active:scale-95 transition-all dark:active:bg-[rgb(70,70,70)]"
                >
                  <X />
                </Button>
              </>
            ) : (
              <>
                {fullName}
                <Button
                  onClick={() => {
                    setEditingName(true);
                    setNewName(fullName);
                  }}
                  className="cursor-pointer active:scale-95 transition-all w-7 h-7"
                  aria-label="Edit name"
                >
                  <Pencil className="h-[1rem] w-[1rem]" />
                </Button>
              </>
            )}
          </p>
          <p className="mb-6">
            <span className="font-semibold">Email:</span> {email}
          </p>
          <div className="gap-2 flex">
            <ToggleThemeButton
              asChild
              className="cursor-pointer active:scale-95 transition-all"
            />
            <LoginButton className="cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}
