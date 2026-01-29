"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AcademyLessonDetail } from "@/types/academy-lesson-detail";
import YouTube from "@/components/uiComponents/youtube";
import { Play } from "lucide-react";
import { fetchLessonById } from "./lessonActions";

interface LessonSheetProps {
  lessonId: number;
  lessonName: string;
  courseTitle: string;
}

export function LessonSheet({
  lessonId,
  lessonName,
  courseTitle
}: LessonSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [lesson, setLesson] = useState<AcademyLessonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = async () => {
    setIsOpen(true);
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedLesson = await fetchLessonById(lessonId);
      if (fetchedLesson) {
        setLesson(fetchedLesson);
      } else {
        setError("Lesson not found");
      }
    } catch (err) {
      setError("Failed to load lesson");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <span 
        onClick={handleOpen} 
        className="inline-flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity border border-gray-300 hover:border-2 hover:border-blue-800 rounded-md p-1"
      >
        <span className="flex-shrink-0 w-4 h-3 bg-red-600 rounded flex items-center justify-center">
          <Play className="w-2 h-2 text-white ml-1" fill="white" />
        </span>
        <span className="blue-hyperlink text-sm">{lessonName}</span>
      </span>

      {isOpen && (
        <Sheet open={true} onOpenChange={() => setIsOpen(false)}>
          <SheetContent className="!w-400px md:!w-900px !max-w-[90vw] flex flex-col overflow-hidden">
            <SheetHeader className="flex-shrink-0">
              <SheetTitle>{lesson?.lesson_name || lessonName}</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-500">Loading lesson...</div>
                </div>
              )}

              {error && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-red-500">{error}</div>
                </div>
              )}

              {!isLoading && !error && lesson && (
                <>
                  <div className="bg-gray-200 p-2 rounded-md text-center">
                    {courseTitle} | {lesson.difficulty} | {lesson.time} min
                  </div>
                  <div className="text-center"><p>{lesson.summary}</p></div>

                  {lesson.youtube_url && (
                    <div className="border-box">
                      <YouTube url={lesson.youtube_url} />
                    </div>
                  )}
                  
                  <div><p dangerouslySetInnerHTML={{__html: lesson.lesson_body ?? ''}} /></div>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
