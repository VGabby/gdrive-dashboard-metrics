import { useNavigate } from 'react-router-dom';
import { useGoogleDrive } from '@/hooks/useGoogleDrive';
import { FileStatistics } from '@/components/dashboard/FileStatistics';
import { FolderMonitor } from '@/components/dashboard/FolderMonitor';
import { ProcessingLogs } from '@/components/dashboard/ProcessingLogs';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

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
        
        <ProcessingLogs className="animate-scale-in" />
        
        <FileStatistics className="animate-scale-in" />
        
        <FolderMonitor className="animate-slide-in animate-delay-200" />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;