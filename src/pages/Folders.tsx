import { useGoogleDrive } from '@/hooks/useGoogleDrive';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FolderManagement } from '@/components/dashboard/FolderManagement';
import { GoogleDriveAuth } from '@/components/auth/GoogleDriveAuth';

const Folders = () => {
  const { isAuthenticated } = useGoogleDrive();
  
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Folder Management</h1>
          <p className="text-gray-600">Add, monitor, and configure folders for AI processing</p>
        </div>
        
        {!isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-blue-700 mb-2">Connect to Google Drive</h3>
            <p className="text-blue-600 mb-4">Connect your Google Drive account to enable folder monitoring.</p>
            <GoogleDriveAuth className="max-w-lg" />
          </div>
        )}
        
        <FolderManagement className="animate-scale-in" />
      </div>
    </DashboardLayout>
  );
};

export default Folders;