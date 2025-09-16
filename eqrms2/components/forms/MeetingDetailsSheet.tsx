'use client';

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { InteractionDetail } from "@/types/interaction-detail";
import { formatDate } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MeetingDetailsSheetProps {
  meetingData: InteractionDetail;
  children: React.ReactNode;
}

export function MeetingDetailsSheet({ meetingData, children }: MeetingDetailsSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <span 
        onClick={() => setIsOpen(true)}
        className="blue-hyperlink cursor-pointer"
      >
        {children}
      </span>

      {isOpen && (
        <Sheet open={true} onOpenChange={() => setIsOpen(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Meeting Details</SheetTitle>
            </SheetHeader>
            
            <div className="p-4 mt-6">
              <div>
                <h3>{meetingData.meeting_name}  |  {formatDate(meetingData.created_at) }</h3>
                <p></p>
              </div>

              {meetingData.meeting_summary && (
                <div>
                  <div className="bg-gray-100 text-sm p-4"><ReactMarkdown remarkPlugins={[remarkGfm]}>{meetingData.meeting_summary}</ReactMarkdown></div>
                </div>
              )}

              {meetingData.meeting_notes && (
                <div className="text-base p-4">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{meetingData.meeting_notes}</ReactMarkdown>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
