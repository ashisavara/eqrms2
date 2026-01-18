"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AcademyWebinarDetail } from "@/types/academy-webinar-detail";
import YouTube from "@/components/uiComponents/youtube";
import { formatDate } from "@/lib/utils";

export function WebinarDetailSheet({
  webinar,
  trigger
}: {
  webinar: AcademyWebinarDetail;
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
              <SheetTitle>{webinar.webinar_name}</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)] space-y-4 mt-4">
              {webinar.webinar_date && (
                <div>
                  <label className="font-bold">Date</label>
                  <p>{formatDate(webinar.webinar_date)}</p>
                </div>
              )}

              <div>
                <label className="font-bold">Summary</label>
                <p>{webinar.webinar_summary}</p>
              </div>

              {webinar.youtube_url && (
                <div>
                  <label className="font-bold">Video</label>
                  <YouTube url={webinar.youtube_url} />
                </div>
              )}

              <div>
                <label className="font-bold">Webinar Body</label>
                <div className="whitespace-pre-wrap">{webinar.webinar_body}</div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
