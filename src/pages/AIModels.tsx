import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { 
  Brain, 
  Sparkles, 
  Zap, 
  Check, 
  Plus, 
  Star, 
  Clock, 
  CreditCard,
  Trash2,
  AlertCircle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface AIModel {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  price: number;
  priceUnit: 'month' | 'year' | 'credits';
  isSubscribed: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  usageStats?: {
    creditsUsed?: number;
    totalCredits?: number;
    documentsProcessed?: number;
    lastUsed?: string;
  };
}

// Mock data
const mockAIModels: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Advanced language model with superior comprehension and reasoning',
    capabilities: ['Text analysis', 'Content generation', 'Complex reasoning', 'Code understanding'],
    price: 20,
    priceUnit: 'month',
    isSubscribed: true,
    isPopular: true,
    usageStats: {
      creditsUsed: 450,
      totalCredits: 1000,
      documentsProcessed: 128,
      lastUsed: '2 hours ago'
    }
  },
  {
    id: 'gpt-3.5',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and efficient language processing for everyday tasks',
    capabilities: ['Text analysis', 'Content generation', 'Basic reasoning'],
    price: 10,
    priceUnit: 'month',
    isSubscribed: true,
    usageStats: {
      creditsUsed: 320,
      totalCredits: 800,
      documentsProcessed: 95,
      lastUsed: '1 day ago'
    }
  },
  {
    id: 'basic-ocr',
    name: 'Basic OCR',
    description: 'Simple text extraction from images and documents',
    capabilities: ['Text extraction', 'Basic formatting recognition'],
    price: 5,
    priceUnit: 'month',
    isSubscribed: true,
    usageStats: {
      creditsUsed: 150,
      totalCredits: 500,
      documentsProcessed: 42,
      lastUsed: '3 days ago'
    }
  },
  {
    id: 'vision-pro',
    name: 'Vision Pro',
    description: 'Advanced image recognition and visual content analysis',
    capabilities: ['Image recognition', 'Object detection', 'Scene understanding', 'Visual content analysis'],
    price: 25,
    priceUnit: 'month',
    isSubscribed: false,
    isNew: true
  },
  {
    id: 'data-analyzer',
    name: 'Data Analyzer',
    description: 'Specialized model for extracting and analyzing structured data',
    capabilities: ['Table extraction', 'Data pattern recognition', 'Structured data analysis', 'Chart interpretation'],
    price: 15,
    priceUnit: 'month',
    isSubscribed: false
  },
  {
    id: 'multilingual',
    name: 'Multilingual Expert',
    description: 'Enhanced language processing across 50+ languages',
    capabilities: ['Multi-language support', 'Translation assistance', 'Cross-language analysis'],
    price: 18,
    priceUnit: 'month',
    isSubscribed: false
  }
];

const AIModels = () => {
  const [models, setModels] = useState<AIModel[]>(mockAIModels);
  const [isSubscribeDialogOpen, setIsSubscribeDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  
  const subscribedModels = models.filter(model => model.isSubscribed);
  const availableModels = models.filter(model => !model.isSubscribed);
  
  const handleSubscribe = (model: AIModel) => {
    setSelectedModel(model);
    setIsSubscribeDialogOpen(true);
  };
  
  const confirmSubscription = () => {
    if (!selectedModel) return;
    
    setModels(prev => 
      prev.map(model => 
        model.id === selectedModel.id 
          ? { ...model, isSubscribed: true, usageStats: { creditsUsed: 0, totalCredits: 500, documentsProcessed: 0, lastUsed: 'Never' } } 
          : model
      )
    );
    
    setIsSubscribeDialogOpen(false);
    toast.success(`Successfully subscribed to ${selectedModel.name}`);
  };
  
  const handleUnsubscribe = (modelId: string, modelName: string) => {
    if (confirm(`Are you sure you want to unsubscribe from ${modelName}? This will remove it from your available models.`)) {
      setModels(prev => 
        prev.map(model => 
          model.id === modelId 
            ? { ...model, isSubscribed: false, usageStats: undefined } 
            : model
        )
      );
      
      toast.info(`Unsubscribed from ${modelName}`);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">AI Models</h1>
          <p className="text-gray-600">Manage your AI models and subscriptions</p>
        </div>
        
        {/* Subscribed Models */}
        <Card className="animate-scale-in">
          <CardHeader className="pb-2">
            <CardTitle>Your AI Models</CardTitle>
            <CardDescription>AI models you're currently subscribed to</CardDescription>
          </CardHeader>
          <CardContent>
            {subscribedModels.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg">
                <Brain className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No AI models subscribed</h3>
                <p className="mt-1 text-sm text-gray-500">Subscribe to AI models to enhance your document processing.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {subscribedModels.map((model) => (
                  <div key={model.id} className="border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                    <div className="p-4 bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-blue-50 rounded-full">
                            <Brain className="h-5 w-5 text-blue-500" />
                          </div>
                          <h3 className="font-medium text-gray-900">{model.name}</h3>
                        </div>
                        {model.isPopular && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            Popular
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-3">{model.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {model.capabilities.map((capability, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-50">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                      
                      {model.usageStats && (
                        <div className="space-y-2 mb-4">
                          <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-blue-500 h-full rounded-full"
                              style={{ width: `${(model.usageStats.creditsUsed / model.usageStats.totalCredits) * 100}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{model.usageStats.creditsUsed} credits used</span>
                            <span>{model.usageStats.totalCredits} total</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>Last used: {model.usageStats.lastUsed}</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">
                          ${model.price}/{model.priceUnit}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleUnsubscribe(model.id, model.name)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Unsubscribe
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Available Models */}
        <Card className="animate-scale-in animate-delay-200">
          <CardHeader className="pb-2">
            <CardTitle>Available AI Models</CardTitle>
            <CardDescription>Additional AI models you can subscribe to</CardDescription>
          </CardHeader>
          <CardContent>
            {availableModels.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg">
                <Check className="mx-auto h-12 w-12 text-green-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">You've subscribed to all available models</h3>
                <p className="mt-1 text-sm text-gray-500">Check back later for new AI models.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {availableModels.map((model) => (
                  <div key={model.id} className="border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                    <div className="p-4 bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-gray-50 rounded-full">
                            <Brain className="h-5 w-5 text-gray-500" />
                          </div>
                          <h3 className="font-medium text-gray-900">{model.name}</h3>
                        </div>
                        {model.isNew && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            New
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-3">{model.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {model.capabilities.map((capability, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-50">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">
                          ${model.price}/{model.priceUnit}
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleSubscribe(model)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Subscribe
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Subscription Dialog */}
      <Dialog open={isSubscribeDialogOpen} onOpenChange={setIsSubscribeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subscribe to {selectedModel?.name}</DialogTitle>
            <DialogDescription>
              You're about to subscribe to this AI model. This will add it to your available models.
            </DialogDescription>
          </DialogHeader>
          
          {selectedModel && (
            <div className="py-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-full">
                  <Brain className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{selectedModel.name}</h3>
                  <p className="text-sm text-gray-500">{selectedModel.description}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between p-3 bg-gray-50 rounded-md">
                  <span className="text-gray-600">Subscription price</span>
                  <span className="font-medium">${selectedModel.price}/{selectedModel.priceUnit}</span>
                </div>
                
                <div className="flex justify-between p-3 bg-gray-50 rounded-md">
                  <span className="text-gray-600">Included credits</span>
                  <span className="font-medium">500 credits</span>
                </div>
                
                <div className="flex items-start gap-2 text-sm text-gray-500">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Subscribing to this model will give you immediate access to use it for processing your documents.
                    You can cancel your subscription at any time.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubscribeDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmSubscription}>
              <CreditCard className="h-4 w-4 mr-2" />
              Subscribe Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AIModels;