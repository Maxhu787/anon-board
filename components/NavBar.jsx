"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import { Plus, House, User } from "lucide-react";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import LoginButton from "./LoginLogoutButton";
import SendPost from "./SendPost";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

export default function NavBar() {
  const iconSize = 24;
  const buttonClass =
    "min-w-[58px] min-h-[50px] cursor-pointer active:bg-gray-200 active:scale-95 transition-all dark:active:bg-[rgb(70,70,70)]";

  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    checkUser();
  }, []);

  if (!mounted) {
    // Prevent hydration mismatch by not rendering until mounted
    return null;
  }

  return (
    <NavigationMenu className="py-4 mt-0 rounded-b-2xl shadow w-full max-w-5xl mx-auto fixed z-10 bg-white dark:bg-[rgb(43,43,43)]">
      <div className="relative w-full pl-5 pr-4">
        <div className="float-left list-none">
          <NavigationMenuItem>
            <Button
              variant="none"
              asChild
              className="p-0 min-w-[50px] min-h-[50px] cursor-pointer active:scale-85 transition-all"
            >
              <Link href="/">
                <Image
                  src="/logo.png"
                  width={iconSize + 18}
                  height={iconSize + 18}
                  className="rounded-full"
                  alt="logo"
                />
              </Link>
            </Button>
          </NavigationMenuItem>
        </div>
        <div className="float-right flex items-center gap-3 list-none">
          <NavigationMenuItem>
            <Button variant="outline" asChild className={buttonClass}>
              <Link href="/">
                <House style={{ height: iconSize, width: iconSize }} />
              </Link>
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            {user ? (
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" className={buttonClass}>
                    <Plus style={{ height: iconSize, width: iconSize }} />
                  </Button>
                </DrawerTrigger>
                <SendPost />
              </Drawer>
            ) : (
              <Button variant="outline" asChild className={buttonClass}>
                <Link href="/login">
                  <Plus style={{ height: iconSize, width: iconSize }} />
                </Link>
              </Button>
            )}
          </NavigationMenuItem>
          <NavigationMenuItem>
            {user ? (
              <Button variant="outline" asChild className={buttonClass}>
                <Link href="/profile">
                  <User style={{ height: iconSize, width: iconSize }} />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" asChild className={buttonClass}>
                <Link href="/login">
                  <User style={{ height: iconSize, width: iconSize }} />
                </Link>
              </Button>
            )}
          </NavigationMenuItem>
          <NavigationMenuItem>
            <LoginButton
              variant="outline"
              asChild
              className="min-w-[58px] min-h-[50px] cursor-pointer active:scale-95 transition-all"
            />
          </NavigationMenuItem>
        </div>
      </div>
    </NavigationMenu>
  );
}
