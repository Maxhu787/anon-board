"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BackButton({ onClick }) {
  return (
    <Button
      onClick={onClick}
      className="hover:bg-white border-2 h-9 w-9 bg-white dark:bg-[rgb(23,23,23)] flex items-center gap-2 rounded-full cursor-pointer active:scale-95 hover:scale-110 transition-all"
    >
      <ArrowLeft className="h-3 w-3 text-black dark:text-white" />
    </Button>
  );
}
