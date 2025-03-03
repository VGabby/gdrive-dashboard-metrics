import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  FolderPlus, 
  Folder, 
  Trash2, 
  PauseCircle, 
  PlayCircle, 
  Brain, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

// Types
interface MonitoredFolder {
  id: string;
  name: string;
  path: string;
  status: 'active' | 'paused' | 'error';
  aiModel: string;
  lastScan: string;
  fileCount: number;
  isNew?: boolean;
}

// Mock data
const mockAiModels = [
  { id: 'gpt-4', name: 'GPT-4 (Recommended)', description: 'Best accuracy, higher cost' },
  { id: 'gpt-3.5', name: 'GPT-3.5 Turbo', description: 'Good balance of speed and accuracy' },
  { id: 'basic-ocr', name: 'Basic OCR', description: 'Fast processing, text extraction only' },
  { id: 'vision-pro', name: 'Vision Pro', description: 'Enhanced image recognition' },
];

const initialFolders: MonitoredFolder[] = [
  {
    id: 'folder1',
    name: 'Work Documents',
    path: '/Users/johndoe/Documents/Work',
    status: 'active',
    aiModel: 'gpt-3.5',
    lastScan: '10 minutes ago',
    fileCount: 128
  },
  {
    id: 'folder2',
    name: 'Project Research',
    path: '/Users/johndoe/Documents/Research',
    status: 'paused',
    aiModel: 'gpt-4',
    lastScan: '2 hours ago',
    fileCount: 56
  },
  {
    id: 'folder3',
    name: 'Client Contracts',
    path: '/Users/johndoe/Documents/Contracts',
    status: 'error',
    aiModel: 'basic-ocr',
    lastScan: '1 day ago',
    fileCount: 32
  }
];

export function FolderManagement({ className }: { className?: string }) {
  const [monitoredFolders, setMonitoredFolders] = useState<MonitoredFolder[]>(initialFolders);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newFolder, setNewFolder] = useState({
    name: '',
    path: '',
    aiModel: 'gpt-3.5'
  });
  
  const handleAddFolder = () => {
    if (!newFolder.name || !newFolder.path) {
      toast.error("Please provide both folder name and path");
      return;
    }
    
    const folder: MonitoredFolder = {
      id: `folder-${Date.now()}`,
      name: newFolder.name,
      path: newFolder.path,
      status: 'active',
      aiModel: newFolder.aiModel,
      lastScan: 'Just now',
      fileCount: 0,
      isNew: true
    };
    
    setMonitoredFolders([...monitoredFolders, folder]);
    setNewFolder({ name: '', path: '', aiModel: 'gpt-3.5' });
    setIsAddDialogOpen(false);
    
    toast.success("Folder added successfully");
    
    // Remove the "isNew" flag after animation
    setTimeout(() => {
      setMonitoredFolders(prev => 
        prev.map(f => f.id === folder.id ? { ...f, isNew: undefined } : f)
      );
    }, 3000);
  };
  
  const toggleFolderStatus = (folderId: string) => {
    setMonitoredFolders(prev => 
      prev.map(folder => {
        if (folder.id === folderId) {
          const newStatus = folder.status === 'active' ? 'paused' : 'active';
          toast.info(`Folder "${folder.name}" is now ${newStatus}`);
          return { ...folder, status: newStatus };
        }
        return folder;
      })
    );
  };
  
  const removeFolder = (folderId: string, folderName: string) => {
    if (confirm(`Are you sure you want to remove "${folderName}" from monitoring?`)) {
      setMonitoredFolders(prev => prev.filter(folder => folder.id !== folderId));
      toast.info(`Folder "${folderName}" removed from monitoring`);
    }
  };
  
  const updateAiModel = (folderId: string, model: string) => {
    setMonitoredFolders(prev => 
      prev.map(folder => {
        if (folder.id === folderId) {
          const modelName = mockAiModels.find(m => m.id === model)?.name || model;
          toast.success(`AI model for "${folder.name}" updated to ${modelName}`);
          return { ...folder, aiModel: model };
        }
        return folder;
      })
    );
  };
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Folder Management</CardTitle>
            <CardDescription>Monitor and manage your folders</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <FolderPlus className="h-4 w-4" />
                <span>Add Folder</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Folder to Monitor</DialogTitle>
                <DialogDescription>
                  Add a folder to be monitored and processed by AI
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Folder Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., Work Documents" 
                    value={newFolder.name}
                    onChange={(e) => setNewFolder({...newFolder, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="path">Folder Path</Label>
                  <Input 
                    id="path" 
                    placeholder="e.g., /Users/name/Documents/Work" 
                    value={newFolder.path}
                    onChange={(e) => setNewFolder({...newFolder, path: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="aiModel">AI Processing Model</Label>
                  <Select 
                    value={newFolder.aiModel}
                    onValueChange={(value) => setNewFolder({...newFolder, aiModel: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAiModels.map(model => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex flex-col">
                            <span>{model.name}</span>
                            <span className="text-xs text-gray-500">{model.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddFolder}>Add Folder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {monitoredFolders.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg">
              <Folder className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No folders monitored</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a folder to monitor.</p>
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(true)}
                  className="flex items-center gap-1"
                >
                  <FolderPlus className="h-4 w-4" />
                  <span>Add Folder</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {monitoredFolders.map((folder) => (
                <div 
                  key={folder.id} 
                  className={cn(
                    "border border-gray-100 rounded-lg p-4 transition-all duration-300",
                    folder.isNew ? "animate-pulse-subtle bg-blue-50 border-blue-100" : "bg-white",
                    folder.status === 'error' ? "border-red-100 bg-red-50/30" : ""
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-full",
                        folder.status === 'active' ? "bg-green-100" : 
                        folder.status === 'paused' ? "bg-amber-100" : "bg-red-100"
                      )}>
                        <Folder className={cn(
                          "h-5 w-5",
                          folder.status === 'active' ? "text-green-600" : 
                          folder.status === 'paused' ? "text-amber-600" : "text-red-600"
                        )} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{folder.name}</h3>
                          <StatusBadge status={folder.status} />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{folder.path}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Last scan: {folder.lastScan}</span>
                          </div>
                          <div>
                            <span>{folder.fileCount} files</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <Select 
                        value={folder.aiModel} 
                        onValueChange={(value) => updateAiModel(folder.id, value)}
                      >
                        <SelectTrigger className="w-[180px] h-8">
                          <div className="flex items-center gap-1.5">
                            <Brain className="h-3.5 w-3.5 text-purple-500" />
                            <SelectValue placeholder="Select AI model" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {mockAiModels.map(model => (
                            <SelectItem key={model.id} value={model.id}>
                              <div className="flex flex-col">
                                <span>{model.name}</span>
                                <span className="text-xs text-gray-500">{model.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={cn(
                            "h-8 px-2",
                            folder.status === 'active' ? "text-amber-600" : "text-green-600"
                          )}
                          onClick={() => toggleFolderStatus(folder.id)}
                        >
                          {folder.status === 'active' ? (
                            <PauseCircle className="h-4 w-4" />
                          ) : (
                            <PlayCircle className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 px-2 text-red-600"
                          onClick={() => removeFolder(folder.id, folder.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {folder.status === 'error' && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-100 rounded text-sm text-red-600 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Error accessing folder. Please check the path and permissions.</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: 'active' | 'paused' | 'error' }) {
  if (status === 'active') {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1 h-5 text-xs">
        <CheckCircle className="h-3 w-3" />
        <span>Active</span>
      </Badge>
    );
  }
  
  if (status === 'paused') {
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1 h-5 text-xs">
        <PauseCircle className="h-3 w-3" />
        <span>Paused</span>
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1 h-5 text-xs">
      <AlertCircle className="h-3 w-3" />
      <span>Error</span>
    </Badge>
  );
}

export default FolderManagement;