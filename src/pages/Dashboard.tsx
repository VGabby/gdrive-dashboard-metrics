
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
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">View statistics and monitor your Google Drive files</p>
        </div>
        
        {!isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-blue-700 mb-2">Connect to Google Drive</h3>
            <p className="text-blue-600 mb-4">Connect your Google Drive account to enable real-time data processing.</p>
            <GoogleDriveAuth className="max-w-lg" />
          </div>
        )}
        
        <ProcessingLogs className="animate-scale-in" />
        
        <FileStatistics className="animate-scale-in" />
        
        <FolderMonitor className="animate-slide-in animate-delay-200" />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
