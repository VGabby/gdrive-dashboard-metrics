
import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";

// Types
export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
  webViewLink: string;
  iconLink: string;
  owners: Array<{ displayName: string; photoLink?: string }>;
}

export interface GoogleDriveFolder {
  id: string;
  name: string;
  files: GoogleDriveFile[];
  stats: {
    totalFiles: number;
    totalSize: number;
    fileTypes: Record<string, number>;
    modifiedLast7Days: number;
    modifiedLast30Days: number;
  };
}

export interface GoogleDriveStats {
  totalFiles: number;
  totalFolders: number;
  totalSize: number;
  fileTypes: Record<string, number>;
  recentActivity: {
    last24Hours: number;
    last7Days: number;
    last30Days: number;
  };
}

// Mock data - in a real implementation this would be replaced with actual API calls
const mockStats: GoogleDriveStats = {
  totalFiles: 248,
  totalFolders: 42,
  totalSize: 1_073_741_824, // 1GB in bytes
  fileTypes: {
    'pdf': 78,
    'docx': 53,
    'jpg': 67,
    'png': 25,
    'mp4': 12,
    'others': 13
  },
  recentActivity: {
    last24Hours: 8,
    last7Days: 35,
    last30Days: 128
  }
};

const mockFolders: GoogleDriveFolder[] = [
  {
    id: 'folder1',
    name: 'Work Documents',
    files: [],
    stats: {
      totalFiles: 85,
      totalSize: 256_000_000,
      fileTypes: { 'pdf': 35, 'docx': 40, 'others': 10 },
      modifiedLast7Days: 12,
      modifiedLast30Days: 45
    }
  },
  {
    id: 'folder2',
    name: 'Personal Projects',
    files: [],
    stats: {
      totalFiles: 53,
      totalSize: 512_000_000,
      fileTypes: { 'jpg': 20, 'psd': 15, 'ai': 10, 'others': 8 },
      modifiedLast7Days: 8,
      modifiedLast30Days: 25
    }
  },
  {
    id: 'folder3',
    name: 'Media Collection',
    files: [],
    stats: {
      totalFiles: 110,
      totalSize: 1_048_576_000,
      fileTypes: { 'mp4': 35, 'mp3': 65, 'others': 10 },
      modifiedLast7Days: 15,
      modifiedLast30Days: 58
    }
  }
];

const mockRecentFiles: GoogleDriveFile[] = [
  {
    id: 'file1',
    name: 'Annual Report.pdf',
    mimeType: 'application/pdf',
    modifiedTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    size: '2.4 MB',
    webViewLink: '#',
    iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/pdf',
    owners: [{ displayName: 'John Doe' }]
  },
  {
    id: 'file2',
    name: 'Presentation.pptx',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    modifiedTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    size: '5.7 MB',
    webViewLink: '#',
    iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.openxmlformats-officedocument.presentationml.presentation',
    owners: [{ displayName: 'Jane Smith' }]
  },
  {
    id: 'file3',
    name: 'Project Plan.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    modifiedTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    size: '1.1 MB',
    webViewLink: '#',
    iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    owners: [{ displayName: 'Michael Johnson' }]
  },
  {
    id: 'file4',
    name: 'Budget.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    modifiedTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    size: '3.2 MB',
    webViewLink: '#',
    iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    owners: [{ displayName: 'Sarah Williams' }]
  }
];

// This hook would handle actual Google Drive API integration in a real implementation
export function useGoogleDrive() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<GoogleDriveStats | null>(null);
  const [folders, setFolders] = useState<GoogleDriveFolder[]>([]);
  const [recentFiles, setRecentFiles] = useState<GoogleDriveFile[]>([]);

  // Simulate authentication with Google Drive
  const authenticate = useCallback(() => {
    setIsLoading(true);
    // In a real implementation, this would redirect to Google OAuth
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsLoading(false);
      toast.success("Successfully connected to Google Drive");
      
      // Load mock data
      setStats(mockStats);
      setFolders(mockFolders);
      setRecentFiles(mockRecentFiles);
    }, 1500);
  }, []);

  // Simulate disconnecting from Google Drive
  const disconnect = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsAuthenticated(false);
      setIsLoading(false);
      setStats(null);
      setFolders([]);
      setRecentFiles([]);
      toast.info("Disconnected from Google Drive");
    }, 500);
  }, []);

  // Simulate fetching a folder's files
  const getFolderFiles = useCallback((folderId: string) => {
    setIsLoading(true);
    // In a real implementation, this would make an API call to Google Drive
    setTimeout(() => {
      const folder = mockFolders.find(f => f.id === folderId);
      if (folder) {
        // Generate some mock files based on the folder stats
        const files: GoogleDriveFile[] = Array.from({ length: 5 }).map((_, i) => ({
          id: `${folderId}-file-${i}`,
          name: `File ${i + 1}.${Object.keys(folder.stats.fileTypes)[i % Object.keys(folder.stats.fileTypes).length] || 'pdf'}`,
          mimeType: 'application/pdf',
          modifiedTime: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
          size: `${((Math.random() * 10) + 1).toFixed(1)} MB`,
          webViewLink: '#',
          iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/pdf',
          owners: [{ displayName: 'John Doe' }]
        }));
        
        // Update the folder with files
        setFolders(prev => 
          prev.map(f => 
            f.id === folderId ? { ...f, files } : f
          )
        );
      }
      setIsLoading(false);
    }, 800);
  }, []);

  // Format bytes to human readable format
  const formatBytes = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  }, []);

  return {
    isAuthenticated,
    isLoading,
    stats,
    folders,
    recentFiles,
    authenticate,
    disconnect,
    getFolderFiles,
    formatBytes
  };
}
