"use server";

import { supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { AcademyLessonDetail } from "@/types/academy-lesson-detail";

export async function fetchLessonById(lessonId: number): Promise<AcademyLessonDetail | null> {
  try {
    const lesson = await supabaseSingleRead<AcademyLessonDetail>({
      table: "v_academy_lessons",
      columns: "*",
      filters: [
        (query) => query.eq('lesson_id', lessonId)
      ],
    });
    return lesson;
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return null;
  }
}
