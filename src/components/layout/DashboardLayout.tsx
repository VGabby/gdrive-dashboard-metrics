
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useGoogleDrive } from '@/hooks/useGoogleDrive';
import { 
  LayoutDashboard, 
  FolderOpen, 
  BarChart, 
  LogOut, 
  Menu, 
  X,
  Database,
  GoogleDrive
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, disconnect } = useGoogleDrive();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Folders', href: '/dashboard/folders', icon: FolderOpen },
    { name: 'Statistics', href: '/dashboard/statistics', icon: BarChart },
  ];
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div
        className={cn(
          "fixed inset-y-0 z-50 flex flex-col w-64 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out transform",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:relative"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <GoogleDrive className="w-6 h-6 text-blue-500 mr-2" />
            <span className="text-lg font-semibold text-gray-900">GDrive Monitor</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1 py-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={closeSidebar}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                  location.pathname === item.href
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200",
                    location.pathname === item.href
                      ? "text-blue-500"
                      : "text-gray-400 group-hover:text-gray-500"
                  )}
                />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        {isAuthenticated && (
          <div className="p-3 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              onClick={disconnect}
              className="w-full justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect Drive
            </Button>
          </div>
        )}
      </div>
      
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center">
                <Database className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-600">Connected to Google Drive</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Database className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Not connected</span>
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            <Link to="/">
              <Button variant="ghost" size="sm">
                Home
              </Button>
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
