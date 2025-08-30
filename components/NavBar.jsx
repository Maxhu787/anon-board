"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import { Plus, House, User, Send } from "lucide-react";
import LoginButton from "./LoginLogoutButton";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie =
    name +
    "=" +
    encodeURIComponent(value) +
    "; expires=" +
    expires +
    "; path=/";
}
function getCookie(name) {
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, "");
}

export default function NavBar() {
  const iconSize = 24;
  const buttonClass =
    "min-w-[58px] min-h-[50px] cursor-pointer active:bg-gray-200 active:scale-95 transition-all dark:active:bg-[rgb(70,70,70)]";

  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const plusClickedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    checkUser();
    // Check cookie for bubble
    if (getCookie("hidePlusBubble") === "1") setShowBubble(false);
  }, []);

  const handlePlusClick = () => {
    if (!plusClickedRef.current) {
      setShowBubble(false);
      setCookie("hidePlusBubble", "1");
      plusClickedRef.current = true;
    }
  };

  if (!mounted) {
    // Prevent hydration mismatch by not rendering until mounted
    return null;
  }

  return (
    // backdrop-blur-[3px] bg-transparent
    <NavigationMenu className="dark:bg-[rgb(33,33,33)] bg-white py-3 mt-0 rounded-b-2xl shadow w-full max-w-5xl mx-auto fixed z-10">
      <div className="relative w-full pl-5 pr-4">
        <div className="float-left list-none">
          <NavigationMenuItem>
            <Button
              variant="none"
              asChild
              className="p-0 ml-1 min-w-[50px] min-h-[50px] cursor-pointer active:scale-85 transition-all"
            >
              <Link href="/">
                <Image
                  src="/logo.png"
                  width={iconSize + 19}
                  height={iconSize + 19}
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
              <Link href="/home">
                <House style={{ height: iconSize, width: iconSize }} />
              </Link>
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            {/* <div className="relative flex flex-col items-center"> */}
            {user ? (
              <>
                <Button
                  variant="outline"
                  asChild
                  className={buttonClass}
                  onClick={handlePlusClick}
                >
                  <Link href="/send">
                    <Plus style={{ height: iconSize, width: iconSize }} />
                  </Link>
                </Button>
                {showBubble && (
                  <span
                    className="absolute top-[120%] left-1/2 -translate-x-1/2 
  bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full 
  shadow-md whitespace-nowrap z-20 
  before:content-[''] before:absolute before:top-0 before:left-1/2 
  before:-translate-x-1/2 before:-translate-y-full
  before:border-l-8 before:border-r-8 before:border-b-[8px] 
  before:border-l-transparent before:border-r-transparent before:border-b-red-500"
                  >
                    馬上發布貼文
                  </span>
                )}
              </>
            ) : (
              <Button variant="outline" asChild className={buttonClass}>
                <Link href="/login">
                  <Plus style={{ height: iconSize, width: iconSize }} />
                </Link>
              </Button>
            )}
            {/* </div> */}
          </NavigationMenuItem>
          <NavigationMenuItem>
            {user ? (
              <Button variant="outline" asChild className={buttonClass}>
                <Link href="/profile">
                  <User style={{ height: iconSize, width: iconSize }} />
                </Link>
              </Button>
            ) : (
              <LoginButton
                variant="outline"
                asChild
                className="min-w-[58px] min-h-[50px] cursor-pointer active:scale-95 transition-all"
              />
            )}
          </NavigationMenuItem>
        </div>
      </div>
    </NavigationMenu>
  );
}
