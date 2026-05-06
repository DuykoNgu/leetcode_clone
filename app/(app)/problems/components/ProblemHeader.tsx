"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, List, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

type ProblemHeaderProps = {
  title: string;
};

export default function ProblemHeader({ title }: ProblemHeaderProps) {
  return (
    <header className="flex h-[52px] w-full items-center justify-between border-b border-gray-200 bg-white px-4">
      <div className="flex items-center gap-4">
        <Link 
          href="/problems"
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <List className="size-4" />
          Problem List
        </Link>
        <div className="h-4 w-px bg-gray-200" />
        <h1 className="text-sm font-semibold text-gray-900 truncate max-w-[300px]">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-lg bg-gray-100 p-0.5">
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-white hover:shadow-sm">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-white hover:shadow-sm">
            <ChevronRight className="size-4" />
          </Button>
        </div>
        
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
          <Settings className="size-4" />
        </Button>
      </div>
    </header>
  );
}
