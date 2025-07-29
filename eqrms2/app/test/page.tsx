import { getUserRoles } from "@/lib/auth/getUserRoles";
import { can } from "@/lib/permissions";

export default async function TestPage() {
  const userRoles = await getUserRoles();

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="font-bold text-lg">Current Roles:</h2>
        <p>{JSON.stringify(userRoles, null, 2)}</p>
      </div>

      <div>
        <h2 className="font-bold text-lg">RMS Permissions:</h2>
        <ul className="space-y-1">
          <li>View: {can(userRoles, 'rms', 'view') ? '✅ Yes' : '❌ No'}</li>
          <li>Edit: {can(userRoles, 'rms', 'edit') ? '✅ Yes' : '❌ No'}</li>
          <li>Delete: {can(userRoles, 'rms', 'delete') ? '✅ Yes' : '❌ No'}</li>
          <li>Create: {can(userRoles, 'rms', 'create') ? '✅ Yes' : '❌ No'}</li>
        </ul>
      </div>

      <div>
        <h2 className="font-bold text-lg">Research Permissions:</h2>
        <ul className="space-y-1">
          <li>View: {can(userRoles, 'research', 'view') ? '✅ Yes' : '❌ No'}</li>
          <li>Edit: {can(userRoles, 'research', 'edit') ? '✅ Yes' : '❌ No'}</li>
          <li>Delete: {can(userRoles, 'research', 'delete') ? '✅ Yes' : '❌ No'}</li>
          <li>Create: {can(userRoles, 'research', 'create') ? '✅ Yes' : '❌ No'}</li>
        </ul>
      </div>

      <div>
        <h2 className="font-bold text-lg">Admin Permissions:</h2>
        <ul className="space-y-1">
          <li>View: {can(userRoles, 'admin', 'view') ? '✅ Yes' : '❌ No'}</li>
          <li>Edit: {can(userRoles, 'admin', 'edit') ? '✅ Yes' : '❌ No'}</li>
          <li>Delete: {can(userRoles, 'admin', 'delete') ? '✅ Yes' : '❌ No'}</li>
          <li>Create: {can(userRoles, 'admin', 'create') ? '✅ Yes' : '❌ No'}</li>
        </ul>
      </div>
    </div>
  );
}
