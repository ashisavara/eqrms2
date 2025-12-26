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
    title: "Create Account",
    content: "To access this content, please create an account. Creating an account will give you access to premium features and content."
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
            <SheetTitle>{upgradeContent.title}</SheetTitle>
          </SheetHeader>
          
          <div className="mt-6">
            <p>{upgradeContent.content}</p>
            
            {/* Placeholder for upgrade path options */}
            <div className="mt-6 space-y-2">
              <div>Create Account</div>
              <div>Validate Account</div>
              <div>Free 30-Day Trial</div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

