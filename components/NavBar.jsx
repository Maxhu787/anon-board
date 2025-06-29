import React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import { Plus, House, Send, User } from "lucide-react";

function NavBar() {
  const iconSize = 24;
  return (
    <NavigationMenu className="py-4 mt-0 rounded-2xl shadow bg-white w-full max-w-5xl mx-auto fixed z-10">
      <NavigationMenuList className="flex w-full justify-between gap-4">
        <NavigationMenuItem>
          <Button
            variant="outline"
            asChild
            className="min-w-[58px] min-h-[50px]"
          >
            <Link href="/">g4o2.me</Link>
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Button
            variant="outline"
            asChild
            className="min-w-[58px] min-h-[50px]"
          >
            <Link href="/">
              <House
                style={{ height: iconSize, width: iconSize }}
                color="#000"
              />
            </Link>
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Button
            variant="outline"
            asChild
            className="min-w-[58px] min-h-[50px]"
          >
            <Link href="/">
              <Plus
                style={{ height: iconSize, width: iconSize }}
                color="#000"
              />
            </Link>
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Button
            variant="outline"
            asChild
            className="min-w-[58px] min-h-[50px]"
          >
            <Link href="/profile">
              <User
                style={{ height: iconSize, width: iconSize }}
                color="#000"
              />
            </Link>
          </Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default NavBar;
