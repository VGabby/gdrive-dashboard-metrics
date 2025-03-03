
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGoogleDrive } from '@/hooks/useGoogleDrive';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowRight, CheckCircle, GoogleDrive } from 'lucide-react';

interface GoogleDriveAuthProps {
  className?: string;
}

export function GoogleDriveAuth({ className }: GoogleDriveAuthProps) {
  const { isAuthenticated, isLoading, authenticate, disconnect } = useGoogleDrive();
  const [showAnimation, setShowAnimation] = useState(false);
  
  const handleAuthenticate = () => {
    if (!isAuthenticated) {
      setShowAnimation(true);
      authenticate();
      setTimeout(() => setShowAnimation(false), 2000);
    } else {
      disconnect();
    }
  };
  
  return (
    <Card className={cn("w-full max-w-md mx-auto overflow-hidden transition-all duration-500", className, 
      isAuthenticated ? "border-green-200 shadow-lg" : "border-gray-200",
      showAnimation ? "animate-pulse-subtle" : ""
    )}>
      <CardHeader className={cn("pb-6", 
        isAuthenticated ? "bg-green-50/50" : "bg-blue-50/50"
      )}>
        <div className="flex justify-center mb-4">
          <div className={cn("w-20 h-20 flex items-center justify-center rounded-full transition-all duration-500",
            isAuthenticated ? "bg-green-100" : "bg-blue-100"
          )}>
            <GoogleDrive className={cn("w-10 h-10 transition-colors duration-500",
              isAuthenticated ? "text-green-500" : "text-blue-500"
            )} />
          </div>
        </div>
        <CardTitle className="text-center text-2xl font-medium">
          {isAuthenticated ? "Connected to Google Drive" : "Connect to Google Drive"}
        </CardTitle>
        <CardDescription className="text-center mt-2">
          {isAuthenticated 
            ? "Your Google Drive is connected. You can now monitor your files and folders." 
            : "Connect your Google Drive account to monitor files and view statistics."}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {isAuthenticated ? (
          <div className="flex items-center justify-center space-x-2 animate-fade-in">
            <CheckCircle className="text-green-500 w-5 h-5" />
            <span className="text-sm text-gray-600">Authentication successful</span>
          </div>
        ) : (
          <div className="text-sm text-gray-600 space-y-3">
            <p className="flex items-start">
              <CheckCircle className="text-blue-500 w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>Access your Google Drive files and folders</span>
            </p>
            <p className="flex items-start">
              <CheckCircle className="text-blue-500 w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>Monitor storage usage and file statistics</span>
            </p>
            <p className="flex items-start">
              <CheckCircle className="text-blue-500 w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>Track folder activity and changes</span>
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pb-6">
        <Button 
          onClick={handleAuthenticate}
          className={cn(
            "w-full transition-all duration-300 group",
            isAuthenticated ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
          )}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Processing...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              {isAuthenticated ? "Disconnect" : "Connect"}
              {!isAuthenticated && (
                <ArrowRight className="ml-2 w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform duration-300" />
              )}
            </div>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default GoogleDriveAuth;
