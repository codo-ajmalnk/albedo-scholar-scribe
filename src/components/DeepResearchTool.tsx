
import { useState } from 'react';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DeepResearchToolProps {
  onResearch: (query: string) => void;
  isLoading?: boolean;
}

const DeepResearchTool = ({ onResearch, isLoading = false }: DeepResearchToolProps) => {
  const [query, setQuery] = useState('');
  const { checkLimit, incrementUsage, getRemainingUsage } = useUsageTracking();
  const { toast } = useToast();

  const remainingResearches = getRemainingUsage('deep_research');

  const handleResearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Query required",
        description: "Please enter a research query.",
        variant: "destructive",
      });
      return;
    }

    const canProceed = await checkLimit('deep_research');
    if (!canProceed) return;

    await incrementUsage('deep_research');
    onResearch(query);
    setQuery('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5" />
          <span>Deep Research Tool</span>
          <Badge variant="secondary">
            {remainingResearches === 999 ? 'Unlimited' : `${remainingResearches} left today`}
          </Badge>
        </CardTitle>
        <CardDescription>
          Get comprehensive research and analysis on any topic. AI will search multiple sources and provide detailed insights.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Enter your research query (e.g., 'Latest AI developments in healthcare')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleResearch()}
            disabled={isLoading}
          />
          <Button 
            onClick={handleResearch} 
            disabled={isLoading || !query.trim()}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <Clock className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {isLoading ? 'Researching...' : 'Research'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <BookOpen className="h-4 w-4" />
            <span>Scholarly articles</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>Expert opinions</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Search className="h-4 w-4" />
            <span>Latest findings</span>
          </div>
        </div>

        {remainingResearches < 999 && remainingResearches <= 1 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              You're running low on research credits. Upgrade to get unlimited access!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeepResearchTool;
