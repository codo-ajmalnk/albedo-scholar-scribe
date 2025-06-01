
import { useState } from 'react';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Clock, Users, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/useAdmin';

interface DeepResearchToolProps {
  onResearch: (query: string) => void;
  isLoading?: boolean;
}

const DeepResearchTool = ({ onResearch, isLoading = false }: DeepResearchToolProps) => {
  const [query, setQuery] = useState('');
  const { checkLimit, incrementUsage, getRemainingUsage } = useUsageTracking();
  const { isAdmin } = useAdmin();
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

    // Check if user has credits (not admin unlimited access)
    if (remainingResearches <= 0 && !isAdmin) {
      toast({
        title: "No research credits",
        description: "Please purchase credits to use deep research feature.",
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

  const hasCredits = remainingResearches > 0 || isAdmin;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5" />
          <span>Deep Research Tool</span>
          <Badge variant={hasCredits ? "default" : "destructive"}>
            {isAdmin ? 'Admin Access' : hasCredits ? `${remainingResearches} credits` : 'No credits'}
          </Badge>
        </CardTitle>
        <CardDescription>
          Get comprehensive research and analysis on any topic. AI will search multiple sources and provide detailed insights.
          {!hasCredits && !isAdmin && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm">
              <CreditCard className="h-4 w-4 inline mr-1" />
              Purchase credits to unlock deep research functionality.
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Enter your research query (e.g., 'Latest AI developments in healthcare')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && hasCredits && handleResearch()}
            disabled={isLoading || !hasCredits}
          />
          <Button 
            onClick={handleResearch} 
            disabled={isLoading || !query.trim() || !hasCredits}
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

        {hasCredits && (
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
        )}

        {!hasCredits && !isAdmin && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <h3 className="font-medium text-blue-900 mb-2">Unlock Deep Research</h3>
            <p className="text-sm text-blue-700 mb-3">
              Get access to comprehensive AI-powered research with scholarly sources and expert analysis.
            </p>
            <Button variant="default" size="sm">
              Purchase Research Credits
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeepResearchTool;
