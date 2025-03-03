
import { useNavigate } from 'react-router-dom';
import { useGoogleDrive } from '@/hooks/useGoogleDrive';
import { FileStatistics } from '@/components/dashboard/FileStatistics';
import { FolderMonitor } from '@/components/dashboard/FolderMonitor';
import { ProcessingLogs } from '@/components/dashboard/ProcessingLogs';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GoogleDriveAuth } from '@/components/auth/GoogleDriveAuth';

const Dashboard = () => {
  const { isAuthenticated } = useGoogleDrive();
  const navigate = useNavigate();
  
  return (
    <DashboardLayout>
      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Connect to Google Drive</h2>
          <GoogleDriveAuth className="max-w-lg" />
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600">View statistics and monitor your Google Drive files</p>
          </div>
          
          <ProcessingLogs className="animate-scale-in" />
          
          <FileStatistics className="animate-scale-in" />
          
          <FolderMonitor className="animate-slide-in animate-delay-200" />
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
