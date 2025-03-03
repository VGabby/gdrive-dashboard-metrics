import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGoogleDrive, ProcessingLogEntry } from '@/hooks/useGoogleDrive';
import { cn } from '@/lib/utils';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, 
  ReferenceLine, ComposedChart, Area
} from 'recharts';
import { FileText, DollarSign, Calendar, Filter } from 'lucide-react';
import { format, subDays, parseISO, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProcessingLogsProps {
  className?: string;
}

export function ProcessingLogs({ className }: ProcessingLogsProps) {
  const { processingLogs } = useGoogleDrive();
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  
  const filteredLogs = useMemo(() => {
    if (!processingLogs?.length) return [];
    
    const today = new Date();
    
    if (timeRange === 'week') {
      const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
      const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });
      
      return processingLogs.filter(log => {
        const logDate = parseISO(log.date);
        return isWithinInterval(logDate, { 
          start: startOfCurrentWeek, 
          end: endOfCurrentWeek 
        });
      });
    } else {
      const [year, month] = selectedMonth.split('-').map(Number);
      
      return processingLogs.filter(log => {
        const logDate = parseISO(log.date);
        return logDate.getFullYear() === year && logDate.getMonth() === month - 1;
      });
    }
  }, [processingLogs, timeRange, selectedMonth]);
  
  const totalFilesProcessed = useMemo(() => 
    filteredLogs.reduce((sum, log) => sum + log.filesProcessed, 0),
  [filteredLogs]);
  
  const totalCreditCost = useMemo(() => 
    filteredLogs.reduce((sum, log) => sum + log.creditCost, 0).toFixed(2),
  [filteredLogs]);
  
  const dailyAverage = useMemo(() => 
    filteredLogs.length ? (totalFilesProcessed / filteredLogs.length).toFixed(0) : '0',
  [filteredLogs, totalFilesProcessed]);
  
  const monthOptions = useMemo(() => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const value = format(date, 'yyyy-MM');
      const label = format(date, 'MMMM yyyy');
      options.push({ value, label });
    }
    
    return options;
  }, []);
  
  const chartData = useMemo(() => 
    filteredLogs.map(log => ({
      date: format(parseISO(log.date), 'MMM dd'),
      files: log.filesProcessed,
      credits: log.creditCost
    })),
  [filteredLogs]);
  
  if (!processingLogs?.length) {
    return null;
  }
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Processing Logs</CardTitle>
            <CardDescription>Daily file processing activity and credit usage</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select 
              value={timeRange} 
              onValueChange={(value) => setTimeRange(value as 'week' | 'month')}
            >
              <SelectTrigger className="w-[120px] h-8">
                <Calendar className="mr-2 h-3.5 w-3.5" />
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
              </SelectContent>
            </Select>
            
            {timeRange === 'month' && (
              <Select 
                value={selectedMonth} 
                onValueChange={setSelectedMonth}
              >
                <SelectTrigger className="w-[180px] h-8">
                  <Filter className="mr-2 h-3.5 w-3.5" />
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <StatCard 
            icon={<FileText className="text-blue-500" />} 
            title="Files Processed" 
            value={totalFilesProcessed} 
            subtitle={`${dailyAverage} per day`}
          />
          <StatCard 
            icon={<DollarSign className="text-green-500" />} 
            title="Credit Cost" 
            value={totalCreditCost} 
            formatter={(val) => `$${val}`}
            subtitle="Total for period"
          />
          <StatCard 
            icon={<Calendar className="text-purple-500" />} 
            title="Time Period" 
            value={timeRange === 'week' ? 'Current Week' : format(parseISO(`${selectedMonth}-01`), 'MMMM yyyy')} 
            isText={true}
            subtitle={`${filteredLogs.length} days of data`}
          />
        </div>
        
        <Tabs defaultValue="combined" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="combined">Combined View</TabsTrigger>
            <TabsTrigger value="files">Files Processed</TabsTrigger>
            <TabsTrigger value="credits">Credit Usage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="combined" className="focus:outline-none">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="files" fill="#3b82f6" name="Files Processed" radius={[4, 4, 0, 0]} />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="credits" 
                    stroke="#10b981" 
                    name="Credits Used" 
                    strokeWidth={2} 
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="files" className="focus:outline-none">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => [`${value} files`, 'Processed']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                  />
                  <ReferenceLine y={parseInt(dailyAverage)} stroke="#9CA3AF" strokeDasharray="3 3" />
                  <Bar dataKey="files" fill="#3b82f6" name="Files Processed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="credits" className="focus:outline-none">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Credits Used']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="credits" 
                    fill="#10b98180" 
                    stroke="#10b981" 
                    name="Credits Used" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function StatCard({ 
  icon, 
  title, 
  value, 
  subtitle, 
  formatter = (val) => val.toString(),
  isText = false 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: number | string; 
  subtitle?: string;
  formatter?: (value: any) => string;
  isText?: boolean;
}) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {isText ? (
            <h4 className="text-lg font-semibold">{value}</h4>
          ) : (
            <h4 className="text-2xl font-semibold">
              {formatter(value)}
            </h4>
          )}
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

export default ProcessingLogs;
