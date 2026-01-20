import TableAcademyLessons from "./TableAcademyLessons";
import TableAcademyWebinars from "./TableAcademyWebinars";
import TableAcademyWhitepapers from "./TableAcademyWhitepapers";
import { AcademyLessonDetail } from "@/types/academy-lesson-detail";
import { AcademyWebinarDetail } from "@/types/academy-webinar-detail";
import { AcademyWhitepaperDetail } from "@/types/academy-whitepaper-detail";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { AddAcademyLessonButton } from "@/components/forms/AddAcademyLesson";
import { AddAcademyWebinarButton } from "@/components/forms/AddAcademyWebinar";
import { AddAcademyWhitepaperButton } from "@/components/forms/AddAcademyWhitepaper";
import { can } from '@/lib/permissions';
import RmsPageTitle from "@/components/uiComponents/rms-page-title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from "next/navigation";

export default async function AcademyPage() {
  const userRoles = await getUserRoles();
  const canEdit = can(userRoles, 'blogs', 'edit');

    // Check permission first
    if (!canEdit) {
      redirect('/uservalidation'); // or wherever you want to send them
    }


  const [lessons, webinars, whitepapers] = await Promise.all([
    supabaseListRead<AcademyLessonDetail>({
      table: "v_academy_lessons",
      columns: "*",
      filters: [
        (query) => query.order('sort_order', { ascending: true }),
      ],
    }),
    supabaseListRead<AcademyWebinarDetail>({
      table: "academy_webinar",
      columns: "*",
      filters: [
        (query) => query.order('webinar_date', { ascending: false }),
      ],
    }),
    supabaseListRead<AcademyWhitepaperDetail>({
      table: "academy_whitepapers",
      columns: "*",
      filters: [
        (query) => query.order('whitepaper_date', { ascending: false }),
      ],
    })
  ]);

  return (
    <div>
      <div className="pageHeadingBox">
      <RmsPageTitle 
                title="IME Academy" 
                caption="Improve your investment knowlege with micro-content lessons." 
            />
      </div>
      <div className="px-6 text-sm">

        <Tabs defaultValue="lessons" className="ime-tabs">
        <TabsList className="w-full">
                <TabsTrigger value="lessons">Lessons</TabsTrigger>
                <TabsTrigger value="webinars">Webinars</TabsTrigger>
                <TabsTrigger value="whitepapers">WhitePapers</TabsTrigger>
        </TabsList>
            <TabsContent value="lessons">
                {canEdit && <AddAcademyLessonButton />}
                <TableAcademyLessons data={lessons} canEdit={canEdit} />
            </TabsContent>
            <TabsContent value="webinars">
                {canEdit && <AddAcademyWebinarButton />}
                <TableAcademyWebinars data={webinars} canEdit={canEdit} />
            </TabsContent>
            <TabsContent value="whitepapers">
                {canEdit && <AddAcademyWhitepaperButton />}
                <TableAcademyWhitepapers data={whitepapers} canEdit={canEdit} />
            </TabsContent>  
            </Tabs>
      </div>
    </div>
  );
}
