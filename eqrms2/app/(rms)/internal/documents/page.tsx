import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import UserLog from '@/components/rms/UserLog';

export default async function Page() {
  const userRoles = await getUserRoles();
  // Check permission first
  if (!can(userRoles, 'internal', 'view')) {
    redirect('/404'); // or wherever you want to send them
  }

  return (
    <main>
      <UserLog segment="internal" entityTitle="Documentation" pagePath="/internal/documents" entitySlug="internal-documents" />
      <div className="pageHeadingBox"><h1 className="text-white">Documentation</h1></div>
      <Tabs defaultValue="newDoc" className="w-full mx-auto mt-6 text-sm">
        <TabsList className="w-full">
          <TabsTrigger value="newDoc">Documentation</TabsTrigger>
          <TabsTrigger value="pmsaif">PMS-AIF</TabsTrigger>
          <TabsTrigger value="fundcomparisons">Fund Comparisons</TabsTrigger>
        </TabsList>
        <TabsContent value="newDoc">
          <div className="w-full mx-auto" style={{ aspectRatio: '16 / 9' }}>
          <iframe src="https://bush-juniper-c4a.notion.site/ebd//32055ec789e18000a954e4320f5246c9" className="w-full h-full" allowFullScreen={true} />
          </div>

        </TabsContent>
        <TabsContent value="pmsaif">
        <div className="w-full mx-auto" style={{ aspectRatio: '16 / 9' }}>
        <iframe src="https://bush-juniper-c4a.notion.site/ebd//32255ec789e1805a8cc6eb6e26220521" className="w-full h-full" allowFullScreen={true} />
        </div>
        </TabsContent>
        <TabsContent value="fundcomparisons">
          <div className="w-full max-w-screen-2xl mx-auto" style={{ aspectRatio: '16 / 9' }}>
            <iframe
              src="https://lookerstudio.google.com/embed/reporting/7d679259-ac87-4f4f-af11-452f84566330/page/EXSbE"
              title="Looker Studio Report"
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              style={{ border: 0 }}
            />
          </div>

        </TabsContent>
        

    </Tabs>
      
    </main>
  );
}
