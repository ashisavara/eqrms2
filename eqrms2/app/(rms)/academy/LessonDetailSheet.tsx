"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AcademyLessonDetail } from "@/types/academy-lesson-detail";
import YouTube from "@/components/uiComponents/youtube";

export function LessonDetailSheet({
  lesson,
  trigger
}: {
  lesson: AcademyLessonDetail;
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
          <SheetContent className="!w-400px md:!w-900px !max-w-[90vw] flex flex-col overflow-hidden">
            <SheetHeader className="flex-shrink-0">
              <SheetTitle>{lesson.lesson_name}</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-gray-200 p-2 rounded-md text-center">{lesson.course} | {lesson.difficulty} | {lesson.time} min </div>
                <div className="text-center"><p>{lesson.summary}</p></div>


            {lesson.youtube_url && (
                <div className="border-box">
                  <YouTube url={lesson.youtube_url} />
                </div>
              )}
            
            <div><p dangerouslySetInnerHTML={{__html: lesson.lesson_body ?? ''}} /></div>

              </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
