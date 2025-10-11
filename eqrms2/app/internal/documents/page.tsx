import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';

export default async function Page() {
  const userRoles = await getUserRoles();
  // Check permission first
  if (!can(userRoles, 'internal', 'view')) {
    redirect('/404'); // or wherever you want to send them
  }

  return (
    <main>
      <div className="pageHeadingBox"><h1>Documentation</h1></div>
      <Tabs defaultValue="documentation" className="w-full mx-auto mt-6 text-sm">
        <TabsList className="w-full">
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="mktmaterial">Mkt Material</TabsTrigger>
          <TabsTrigger value="pmsaif">PMS-AIF</TabsTrigger>
        </TabsList>
        <TabsContent value="documentation">
            <div className="w-full max-w-screen-2xl mx-auto" style={{ aspectRatio: '16 / 9' }}>
                <iframe 
                src="https://coda.io/embed/Bnen8d1pZ1/_suA_SeFp?viewMode=embedplay&hideSections=true" 
                style={{ width:1800, height:1000, maxWidth: '100%' }} 
                allow="fullscreen"
                />
            </div>
        </TabsContent>
        <TabsContent value="mktmaterial">
            <div className="w-full max-w-screen-2xl mx-auto" style={{ aspectRatio: '16 / 9' }}>
                <iframe 
                src="https://coda.io/embed/R5UZH6vtl1/_su80T6pZ?viewMode=embedplay&hideSections=true" 
                style={{ width:1800, height:1000, maxWidth: '100%' }} 
                allow="fullscreen"
                />
            </div>
        </TabsContent>
        <TabsContent value="pmsaif">
        <div className="w-full max-w-screen-2xl mx-auto" style={{ aspectRatio: '16 / 9' }}>
                <iframe 
                src="https://coda.io/embed/L-jmocDPu-/_sugrIsir?viewMode=embedplay" 
                style={{ width:1800, height:1000, maxWidth: '100%' }} 
                allow="fullscreen"
                />
            </div>
        </TabsContent>
    </Tabs>
      
    </main>
  );
}
