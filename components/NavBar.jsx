import React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import { HouseIcon } from "lucide-react";
import { UserIcon } from "lucide-react";

function NavBar() {
  return (
    <NavigationMenu className="px-6 py-4 mt-3 rounded-2xl shadow bg-white">
      <NavigationMenuList className="flex gap-4">
        <NavigationMenuItem>
          <Button asChild className="min-w-[58px] min-h-[50px]">
            <Link href="/">
              <HouseIcon style={{ height: 25, width: 25 }} />
            </Link>
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Button asChild className="min-w-[58px] min-h-[50px]">
            <Link href="/profile">
              <UserIcon style={{ height: 25, width: 25 }} />
            </Link>
          </Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default NavBar;
