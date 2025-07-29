import { RoleProvider, useRoles } from "@/lib/auth/RoleProvider";
import { can } from "@/lib/permissions";

// Component that uses roles from context for conditional rendering
function RMSSection() {
  const userRoles = useRoles();
  
  return (
    <div className="p-4 border rounded bg-blue-50">
      <h3 className="font-bold">RMS Dashboard</h3>
      
      {can(userRoles, 'rms', 'view') && (
        <div className="mt-2">
          <p>📊 RMS Data visible</p>
          
          {can(userRoles, 'rms', 'edit') && (
            <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
              Edit Data
            </button>
          )}
          
          {can(userRoles, 'rms', 'create') && (
            <button className="bg-green-500 text-white px-2 py-1 rounded mr-2">
              Create New
            </button>
          )}
          
          {can(userRoles, 'rms', 'delete') && (
            <button className="bg-red-500 text-white px-2 py-1 rounded">
              Delete
            </button>
          )}
        </div>
      )}
      
      {!can(userRoles, 'rms', 'view') && (
        <p className="text-gray-500">No access to RMS data</p>
      )}
    </div>
  );
}

// Component that shows research permissions
function ResearchSection() {
  const userRoles = useRoles();
  
  return (
    <div className="p-4 border rounded bg-green-50">
      <h3 className="font-bold">Research Portal</h3>
      
      {can(userRoles, 'research', 'view') && (
        <div className="mt-2">
          <p>🔬 Research reports available</p>
          
          {can(userRoles, 'research', 'edit') && (
            <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
              Edit Reports
            </button>
          )}
          
          {can(userRoles, 'research', 'create') && (
            <button className="bg-green-500 text-white px-2 py-1 rounded mr-2">
              New Report
            </button>
          )}
          
          {can(userRoles, 'research', 'delete') && (
            <button className="bg-red-500 text-white px-2 py-1 rounded">
              Delete Reports
            </button>
          )}
        </div>
      )}
      
      {!can(userRoles, 'research', 'view') && (
        <p className="text-gray-500">No research access</p>
      )}
    </div>
  );
}

// Component that shows admin functions
function AdminSection() {
  const userRoles = useRoles();
  
  return (
    <div className="p-4 border rounded bg-yellow-50">
      <h3 className="font-bold">Admin Panel</h3>
      
      {can(userRoles, 'admin', 'view') && (
        <div className="mt-2">
          <p>⚙️ Admin functions</p>
          
          {can(userRoles, 'admin', 'edit') && (
            <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
              Edit Settings
            </button>
          )}
          
          {can(userRoles, 'admin', 'delete') && (
            <button className="bg-red-500 text-white px-2 py-1 rounded">
              Delete Users
            </button>
          )}
        </div>
      )}
      
      {!can(userRoles, 'admin', 'view') && (
        <p className="text-gray-500">No admin access</p>
      )}
    </div>
  );
}

// Component to show current user info
function UserInfo() {
  const userRoles = useRoles();
  
  return (
    <div className="p-4 border rounded bg-gray-50">
      <h3 className="font-bold">User Information</h3>
      <p><strong>Current Roles:</strong> {userRoles.join(', ')}</p>
      <p><strong>Role Count:</strong> {userRoles.length}</p>
    </div>
  );
}

// Main page component
export default async function Test2Page() {
  return (
    <RoleProvider>
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Role-Based Conditional Rendering Test</h1>
        
        <div className="space-y-6">
          <UserInfo />
          <RMSSection />
          <ResearchSection />
          <AdminSection />
          
          <div className="mt-8 p-4 bg-blue-100 rounded">
            <h3 className="font-bold">What you should see:</h3>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>RMS: View ✅, Edit/Create/Delete ❌ (research removed from edit)</li>
              <li>Research: All buttons ✅ (research role has full access)</li>
              <li>Admin: "No admin access" ❌ (research/lead don't have admin)</li>
            </ul>
          </div>
        </div>
      </div>
    </RoleProvider>
  );
} 