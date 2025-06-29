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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function NavBar() {
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
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                className="min-w-[58px] min-h-[50px] cursor-pointer"
              >
                <Plus
                  style={{ height: iconSize, width: iconSize }}
                  color="#000"
                />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Are you fucking sure?</DrawerTitle>
                <DrawerDescription>
                  This action cannot be undone.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button>YES</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
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
