
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  FileText, 
  Image as ImageIcon, 
  MessageSquare, 
  Sparkles,
  Mic,
  Calculator,
  BookOpen
} from 'lucide-react';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

interface QuickActionsToolboxProps {
  onActionSelect: (action: string, prompt: string) => void;
  isLoading?: boolean;
}

const QuickActionsToolbox = ({ onActionSelect, isLoading = false }: QuickActionsToolboxProps) => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const { checkLimit, incrementUsage, getRemainingUsage } = useUsageTracking();
  const { isAdmin } = useAdmin();
  const { toast } = useToast();

  const actions = [
    {
      id: 'create-image',
      number: 1,
      icon: ImageIcon,
      label: 'Create image',
      color: 'bg-green-500 hover:bg-green-600',
      prompt: 'Please create an image of:',
      usageType: 'image_generation' as const,
      credits: getRemainingUsage('image_generation')
    },
    {
      id: 'get-advice',
      number: 2,
      icon: MessageSquare,
      label: 'Get advice',
      color: 'bg-blue-500 hover:bg-blue-600',
      prompt: 'I need advice about:',
      usageType: 'chat' as const,
      credits: getRemainingUsage('chat')
    },
    {
      id: 'summarize-text',
      number: 3,
      icon: FileText,
      label: 'Summarize text',
      color: 'bg-orange-500 hover:bg-orange-600',
      prompt: 'Please summarize the following text:',
      usageType: 'chat' as const,
      credits: getRemainingUsage('chat')
    },
    {
      id: 'analyze-photo',
      number: 4,
      icon: Camera,
      label: 'Analyze photo',
      color: 'bg-purple-500 hover:bg-purple-600',
      prompt: 'Please analyze this image:',
      usageType: 'image_upload' as const,
      credits: getRemainingUsage('image_upload')
    },
    {
      id: 'solve-math',
      number: 5,
      icon: Calculator,
      label: 'Solve math',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      prompt: 'Please solve this math problem:',
      usageType: 'chat' as const,
      credits: getRemainingUsage('chat')
    },
    {
      id: 'explain-concept',
      number: 6,
      icon: BookOpen,
      label: 'Explain concept',
      color: 'bg-teal-500 hover:bg-teal-600',
      prompt: 'Please explain this concept:',
      usageType: 'chat' as const,
      credits: getRemainingUsage('chat')
    }
  ];

  const handleActionClick = async (action: typeof actions[0]) => {
    if (isLoading) return;

    // Check if user has credits (not admin unlimited access)
    if (action.credits <= 0 && !isAdmin) {
      toast({
        title: "No credits remaining",
        description: `You've used all your ${action.label.toLowerCase()} credits for today.`,
        variant: "destructive",
      });
      return;
    }

    const canProceed = await checkLimit(action.usageType);
    if (!canProceed) return;

    // Add special effect
    setSelectedAction(action.id);
    setTimeout(() => setSelectedAction(null), 300);

    // Increment usage for this action
    await incrementUsage(action.usageType);

    // Trigger the action
    onActionSelect(action.id, action.prompt);

    toast({
      title: `${action.label} selected! ✨`,
      description: "I'm ready to help you with this task.",
      duration: 2000,
    });
  };

  return (
    <Card className="p-4 bg-white/90 border-2 border-blue-200 shadow-lg">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">What can I help with?</h3>
        <p className="text-sm text-gray-600">Choose a quick action to get started</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const hasCredits = action.credits > 0 || isAdmin;
          const isSelected = selectedAction === action.id;
          
          return (
            <Button
              key={action.id}
              onClick={() => handleActionClick(action)}
              disabled={isLoading || !hasCredits}
              className={`
                ${action.color} text-white p-4 h-auto flex flex-col items-center space-y-2 
                transition-all duration-300 transform hover:scale-105 border-2 border-transparent
                ${isSelected ? 'scale-110 border-yellow-400 shadow-xl animate-pulse' : ''}
                ${!hasCredits ? 'opacity-50 cursor-not-allowed' : ''}
                hover:shadow-lg active:scale-95 relative
              `}
            >
              {/* Number badge in top-left corner */}
              <div className="absolute -top-2 -left-2 bg-white text-gray-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md">
                {action.number}
              </div>
              
              <action.icon className={`h-6 w-6 ${isSelected ? 'animate-bounce' : ''}`} />
              <span className="text-sm font-medium">{action.label}</span>
              {!isAdmin && (
                <Badge variant="secondary" className="text-xs bg-white/20 text-white">
                  {hasCredits ? `${action.credits} left` : 'No credits'}
                </Badge>
              )}
              {isSelected && (
                <Sparkles className="h-4 w-4 animate-spin text-yellow-300" />
              )}
            </Button>
          );
        })}
      </div>

      {!isAdmin && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-700 font-medium">Daily Credits</span>
            <div className="flex space-x-4 text-xs text-blue-600">
              <span>Chat: {getRemainingUsage('chat')}</span>
              <span>Images: {getRemainingUsage('image_generation')}</span>
              <span>Uploads: {getRemainingUsage('image_upload')}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default QuickActionsToolbox;
