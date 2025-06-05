
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, CreditCard, History } from 'lucide-react';
import CreditsHistory from './CreditsHistory';
import UsageIndicator from './UsageIndicator';

const ActivityPage = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-6 w-6" />
            <span>Activity & Usage</span>
          </CardTitle>
          <CardDescription>
            Monitor your daily usage, credits history, and account activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="usage" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="usage" className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Current Usage</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center space-x-2">
                <History className="h-4 w-4" />
                <span>Credits History</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="usage">
              <UsageIndicator />
            </TabsContent>

            <TabsContent value="history">
              <CreditsHistory />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityPage;
