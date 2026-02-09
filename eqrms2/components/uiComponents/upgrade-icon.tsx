"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import YouTube from "@/components/uiComponents/youtube";

type UpgradePath = "create-account" | "validate-account" | "free-trial";

interface UpgradeIconProps {
  text?: string;
  backgroundColor?: string;
  clickThroughPath?: UpgradePath;
  className?: string;
}

// Content mapping for different upgrade paths
const upgradePathContent: Record<UpgradePath, { title: string; content: React.ReactNode }> = {
  "create-account": {
    title: "Reactivate Premium Features",
    content: (
      <>
        <p>Premium Services of the IME RMS (access to IME Ratings, a dedicated private banker, editing of investments & financial plans and more) are available to clients of IME Capital.</p>
        <p className="mt-2">If you would like to evaluate becoming an IME Client, or would like to request an extension of your trial of the IME RMS, please WhatsApp us at <a href="https://wa.me/918088770050" className="text-blue-500 font-bold" target="_blank" rel="noopener noreferrer">+918088770050</a>.</p>
      </>
    ),
  },
  "validate-account": {
    title: "Validate Account",
    content: "To access this content, please validate your account. Account validation ensures you have the appropriate access level.",
  },
  "free-trial": {
    title: "Free 15-Day All-Access Trial",
    content: <><p>Get complimentary access to the revolutionary IME RMS App (direct access to IME's central team insights across 1000's of MFs, PMSs, AIFs & Global funds - a first in the industry).</p>

    <p>Additionally, a dedicated private banker will help build your financial plan, investment mandate & undertake a comprehensive portfolio review for free.</p>
    
    <Button className="w-full mb-6">
                <Link href="https://rms.imecapital.in"> Activate Free Trial</Link>
    </Button>
    <YouTube url="https://youtu.be/3WnkkjU5S0g" />
    </>,
  },
};

export function UpgradeIcon({
  text = "Upgrade",
  backgroundColor,
  clickThroughPath = "free-trial",
  className
}: UpgradeIconProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { title, content } = upgradePathContent[clickThroughPath];

  return (
    <>
      <div
        onClick={() => setIsSheetOpen(true)}
        className={cn(
          "flex items-center cursor-pointer bg-gray-100 hover:bg-gray-400 p-1 rounded-md w-full justify-center border",
          text && "gap-2", // Only add gap if text is present
          backgroundColor && `p-2 rounded`,
          className
        )}
        style={backgroundColor ? { backgroundColor } : undefined}
      >
        <Lock className="h-3 w-3 flex-shrink-0" />
        {text && <span className="text-xs">{text}</span>}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          <div className="mt-6 p-4">
            {content}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

