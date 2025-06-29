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
  const iconSize = 24;
  return (
    <NavigationMenu className="px-6 py-4 mt-3 rounded-2xl shadow bg-white">
      <NavigationMenuList className="flex gap-4">
        <NavigationMenuItem>
          <Button
            variant="outline"
            asChild
            className="min-w-[58px] min-h-[50px]"
          >
            <Link href="/">
              <HouseIcon
                style={{ height: iconSize, width: iconSize }}
                color="#000"
                // strokeWidth={3}
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
              <UserIcon
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
