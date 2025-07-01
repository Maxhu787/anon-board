"use client";

import React from "react";
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

export default function NavBar() {
  const iconSize = 24;
  const buttonClass =
    "min-w-[58px] min-h-[50px] cursor-pointer active:bg-gray-200 active:scale-95 transition-all dark:active:bg-[rgb(70,70,70)]";

  return (
    <NavigationMenu className="py-4 mt-0 rounded-2xl shadow  w-full max-w-5xl mx-auto fixed z-10 bg-white dark:bg-[rgb(43,43,43)]">
      <NavigationMenuList className="flex w-full justify-between gap-4">
        {/* <NavigationMenuItem>
          <Button asChild className="min-w-[58px] min-h-[50px]">
            <Link href="/">g4o2.me</Link>
          </Button>
        </NavigationMenuItem> */}
        <NavigationMenuItem>
          <Button variant="outline" asChild className={buttonClass}>
            <Link href="/">
              <House style={{ height: iconSize, width: iconSize }} />
            </Link>
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" className={buttonClass}>
                <Plus style={{ height: iconSize, width: iconSize }} />
              </Button>
            </DrawerTrigger>
            <SendPost />
          </Drawer>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Button variant="outline" asChild className={buttonClass}>
            <Link href="/profile">
              <User style={{ height: iconSize, width: iconSize }} />
            </Link>
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <LoginButton
            variant="outline"
            asChild
            className="min-w-[58px] min-h-[50px] cursor-pointer active:scale-95 transition-all"
          />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
