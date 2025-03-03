import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGoogleDrive, GoogleDriveStats } from '@/hooks/useGoogleDrive';
import { cn } from '@/lib/utils';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { File, Folder, Database, Clock } from 'lucide-react';

interface FileStatisticsProps {
  className?: string;
}

export function FileStatistics({ className }: FileStatisticsProps) {
  const { stats, formatBytes } = useGoogleDrive();
  
  if (!stats) {
    return null;
  }
  
  // Prepare data for file types pie chart
  const fileTypesData = Object.entries(stats.fileTypes).map(([name, value]) => ({
    name,
    value
  }));
  
  // Prepare data for recent activity bar chart
  const activityData = [
    { name: '24h', value: stats.recentActivity.last24Hours },
    { name: '7d', value: stats.recentActivity.last7Days },
    { name: '30d', value: stats.recentActivity.last30Days },
  ];
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#AAAAAA'];
  
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}>
      <Card className="col-span-1 md:col-span-2 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle>Dashboard Overview</CardTitle>
          <CardDescription>A summary of your Google Drive statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              icon={<File className="text-blue-500" />} 
              title="Total Files" 
              value={stats.totalFiles} 
            />
            <StatCard 
              icon={<Folder className="text-amber-500" />} 
              title="Total Folders" 
              value={stats.totalFolders} 
            />
            <StatCard 
              icon={<Database className="text-emerald-500" />} 
              title="Total Size" 
              value={stats.totalSize}
              formatter={(bytes) => formatBytes(bytes)}
            />
            <StatCard 
              icon={<Clock className="text-purple-500" />} 
              title="Recent Changes" 
              value={stats.recentActivity.last7Days} 
              subtitle="in last 7 days"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle>File Types</CardTitle>
          <CardDescription>Distribution of files by type</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-4">
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fileTypesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                  animationDuration={1000}
                  animationBegin={200}
                >
                  {fileTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} files`, 'Count']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Files modified in recent periods</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-4">
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} files`, 'Modified']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]} 
                  animationDuration={1500}
                  animationBegin={300}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for statistics cards
function StatCard({ 
  icon, 
  title, 
  value, 
  subtitle, 
  formatter = (val: number) => val.toString() 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: number; 
  subtitle?: string;
  formatter?: (value: number) => string;
}) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h4 className="text-2xl font-semibold">
            <AnimatedCounter value={value} formatter={formatter} />
          </h4>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

export default FileStatistics;
