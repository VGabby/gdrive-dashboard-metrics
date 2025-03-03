
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Database, FileText, BarChart, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-blue-500" />
            <span className="ml-2 text-xl font-medium text-gray-900">GDrive Monitor</span>
          </div>
          <Link to="/dashboard">
            <Button variant="outline" className="transition-all duration-300 hover:bg-blue-50">
              Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="space-y-2">
            <div className="inline-block">
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-50 text-blue-700 animate-fade-in">
                File monitoring and analytics
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight animate-fade-in animate-delay-100">
              Monitor your Google Drive <br className="hidden sm:inline" />
              <span className="text-blue-500">files and statistics</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in animate-delay-200">
              Connect your Google Drive account to get detailed insights about your files,
              monitor folder statistics, and track changes over time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in animate-delay-300">
            <Link to="/dashboard">
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>

          {/* Preview Image would go here */}
          <div className="mt-10 glass rounded-xl overflow-hidden shadow-xl max-w-4xl mx-auto animate-scale-in animate-delay-400">
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-gray-50 p-8 flex items-center justify-center relative overflow-hidden">
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
                <FeatureCard 
                  icon={<FileText className="h-8 w-8 text-blue-500" />}
                  title="File Statistics"
                  description="Track file types, sizes, and activity across your drive"
                  delay={100}
                />
                <FeatureCard 
                  icon={<FolderOpen className="h-8 w-8 text-blue-500" />}
                  title="Folder Monitoring"
                  description="Monitor changes and activities in specific folders"
                  delay={200}
                />
                <FeatureCard 
                  icon={<BarChart className="h-8 w-8 text-blue-500" />}
                  title="Visual Analytics"
                  description="View beautiful charts and visualizations of your data"
                  delay={300}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-6 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center">
            <Database className="h-5 w-5 text-blue-500" />
            <span className="ml-2 text-sm text-gray-600">GDrive Monitor</span>
          </div>
          <div className="mt-4 md:mt-0 text-sm text-gray-500">
            A beautiful Google Drive statistics dashboard
          </div>
        </div>
      </footer>
    </div>
  );
};

function FeatureCard({ 
  icon, 
  title, 
  description, 
  delay = 0 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  delay?: number;
}) {
  return (
    <div 
      className={cn(
        "bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-slide-in",
        delay === 100 ? "animate-delay-100" : "",
        delay === 200 ? "animate-delay-200" : "",
        delay === 300 ? "animate-delay-300" : ""
      )}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-3 bg-blue-50 rounded-full">{icon}</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}

export default Index;
