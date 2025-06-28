import React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import { HomeIcon } from "./svg/HomeIcon";
import { UserIcon } from "./svg/UserIcon";

function NavBar() {
  return (
    <NavigationMenu className="px-6 py-4 mt-3 rounded-2xl shadow">
      <NavigationMenuList className="flex gap-4">
        <NavigationMenuItem>
          <Button asChild>
            <Link href="/">
              <HomeIcon className="text-white" />
            </Link>
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Button asChild>
            <Link href="/profile">
              <UserIcon className="text-white" />
            </Link>
          </Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default NavBar;
