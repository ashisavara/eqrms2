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
    <div className="w-full max-w-screen-2xl mx-auto" style={{ aspectRatio: '16 / 9' }}>
        <iframe 
        src="https://coda.io/embed/vkfdhO_kCG/_suNs9GEZ?hideSections=true " 
        style={{ width:1800, height:1000, maxWidth: '100%' }} 
        allow="fullscreen"
        />
    </div>
  );
}

