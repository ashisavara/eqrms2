"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AcademyWhitepaperDetail } from "@/types/academy-whitepaper-detail";
import { formatDate } from "@/lib/utils";

export function WhitepaperDetailSheet({
  whitepaper,
  trigger
}: {
  whitepaper: AcademyWhitepaperDetail;
  trigger: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <span onClick={() => setIsOpen(true)} className="cursor-pointer">
        {trigger}
      </span>

      {isOpen && (
        <Sheet open={true} onOpenChange={() => setIsOpen(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>{whitepaper.whitepaper_name}</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)] space-y-4 mt-4">
              {whitepaper.whitepaper_date && (
                <div>
                  <label className="font-bold">Date</label>
                  <p>{formatDate(whitepaper.whitepaper_date)}</p>
                </div>
              )}

              <div>
                <label className="font-bold">Summary</label>
                <p>{whitepaper.whitepaper_summary}</p>
              </div>

              {whitepaper.whitepaper_url && (
                <div>
                  <label className="font-bold">File Link</label>
                  <p>
                    <a 
                      href={whitepaper.whitepaper_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Whitepaper
                    </a>
                  </p>
                </div>
              )}

              <div>
                <label className="font-bold">Whitepaper Body</label>
                <div className="whitespace-pre-wrap">{whitepaper.whitepaper_body}</div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
