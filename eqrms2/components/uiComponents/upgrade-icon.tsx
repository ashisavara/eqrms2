"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type UpgradePath = "create-account" | "validate-account" | "free-trial";

interface UpgradeIconProps {
  text?: string;
  backgroundColor?: string;
  clickThroughPath: UpgradePath;
  className?: string;
}

// Content mapping for different upgrade paths
const upgradePathContent: Record<UpgradePath, { title: string; content: string }> = {
  "create-account": {
    title: "Reactivate Premium Features",
    content: ""
  },
  "validate-account": {
    title: "Validate Account",
    content: "To access this content, please validate your account. Account validation ensures you have the appropriate access level."
  },
  "free-trial": {
    title: "Free 30-Day Trial",
    content: "Start your free 30-day trial to access this content. No credit card required. Cancel anytime during the trial period."
  }
};

export function UpgradeIcon({
  text = "Upgrade",
  backgroundColor,
  clickThroughPath,
  className
}: UpgradeIconProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const upgradeContent = upgradePathContent[clickThroughPath];

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
            <SheetTitle>Reactivate Premium Features</SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 p-4">
            <p>Premium Services of the IME RMS (access to IME Ratings, a dedicated private banker, editing of investments & financial plans and more) are available to clients of IME Capital.</p><p> If you would like to evaluate becoming an IME Client, or would like to request an extension of you trial of the IME RMS, please WhatsApp us at <a href="https://wa.me/918088770050" className="text-blue-500 font-bold" target="_blank">+918088770050</a>.</p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

