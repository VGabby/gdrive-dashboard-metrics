
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGoogleDrive, GoogleDriveFolder, GoogleDriveFile } from '@/hooks/useGoogleDrive';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Folder, File, FileText, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface FolderMonitorProps {
  className?: string;
}

export function FolderMonitor({ className }: FolderMonitorProps) {
  const { isAuthenticated, folders, getFolderFiles, formatBytes } = useGoogleDrive();
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  
  if (!isAuthenticated || !folders.length) {
    return null;
  }
  
  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const isCurrentlyExpanded = !!prev[folderId];
      if (!isCurrentlyExpanded) {
        // Load folder files when expanding
        getFolderFiles(folderId);
      }
      return {
        ...prev,
        [folderId]: !isCurrentlyExpanded
      };
    });
  };
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#AAAAAA'];
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle>Folder Monitoring</CardTitle>
        <CardDescription>Track and analyze your Google Drive folders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {folders.map((folder) => (
            <div key={folder.id} className="border border-gray-100 rounded-lg overflow-hidden shadow-sm">
              <div 
                className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => toggleFolder(folder.id)}
              >
                <div className="flex items-center">
                  <Folder className="text-blue-500 mr-3" />
                  <span className="font-medium">{folder.name}</span>
                  <div className="ml-3 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {folder.stats.totalFiles} files
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-3">
                    {formatBytes(folder.stats.totalSize)}
                  </span>
                  {expandedFolders[folder.id] ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              {expandedFolders[folder.id] && (
                <div className="p-4 animate-slide-in">
                  <Tabs defaultValue="files" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="files">Files</TabsTrigger>
                      <TabsTrigger value="statistics">Statistics</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="files" className="focus:outline-none">
                      <div className="space-y-2">
                        {folder.files.length > 0 ? (
                          folder.files.map((file) => (
                            <FileRow key={file.id} file={file} />
                          ))
                        ) : (
                          <div className="text-center py-6">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500">Loading files...</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="statistics" className="focus:outline-none">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">File Types</h4>
                          <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={Object.entries(folder.stats.fileTypes).map(([name, value]) => ({ name, value }))}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={40}
                                  outerRadius={70}
                                  paddingAngle={2}
                                  dataKey="value"
                                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                  labelLine={false}
                                >
                                  {Object.keys(folder.stats.fileTypes).map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Recent Activity</h4>
                          <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart 
                                data={[
                                  { name: '7 Days', value: folder.stats.modifiedLast7Days },
                                  { name: '30 Days', value: folder.stats.modifiedLast30Days }
                                ]}
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                              >
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
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper component for file rows
function FileRow({ file }: { file: GoogleDriveFile }) {
  return (
    <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200">
      <div className="flex items-center">
        <File className="text-gray-400 mr-3 w-5 h-5" />
        <div>
          <p className="font-medium text-sm">{file.name}</p>
          <p className="text-xs text-gray-500">
            {format(new Date(file.modifiedTime), 'MMM d, yyyy')} • {file.size}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="sm" asChild>
        <a href={file.webViewLink} target="_blank" rel="noopener noreferrer" className="flex items-center">
          <ExternalLink className="w-4 h-4 mr-1" />
          <span>Open</span>
        </a>
      </Button>
    </div>
  );
}

export default FolderMonitor;
