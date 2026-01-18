"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AcademyLessonDetail } from "@/types/academy-lesson-detail";
import { LessonDetailSheet } from "./LessonDetailSheet";
import { EditAcademyLessonButton } from "@/components/forms/EditAcademyLesson";

export function getColumns(canEdit: boolean): ColumnDef<AcademyLessonDetail>[] {
  return [
    {
      accessorKey: "lesson_name",
      header: "Lesson Name",
      size: 200,
      cell: ({ getValue, row }) => {
        const lessonName = getValue() as string;
        const lessonData = row.original;
        return lessonName == null ? null : (
          <>
            <span className="blue-hyperlink"><LessonDetailSheet lesson={lessonData} trigger={<span>{lessonName}</span>} /></span>
            {canEdit && <EditAcademyLessonButton lessonData={lessonData} lessonId={lessonData.lesson_id} />}
          </>
        );
      }
    },
    {
      accessorKey: "course",
      header: "Course",
      size: 150,
      cell: ({ getValue }) => getValue() as string
    },
    {
      accessorKey: "time",
      header: "Time (min)",
      size: 100,
      cell: ({ getValue }) => getValue() as number
    },
    {
      accessorKey: "difficulty",
      header: "Difficulty",
      size: 120,
      cell: ({ getValue }) => getValue() as string
    },
    {
      accessorKey: "summary",
      header: "Summary",
      size: 250,
      cell: ({ getValue }) => getValue() as string
    }
  ];
}
