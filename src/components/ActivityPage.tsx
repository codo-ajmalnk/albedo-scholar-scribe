
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Activity, MessageSquare, Clock, Calendar, Zap } from 'lucide-react';

const ActivityPage = () => {
  const activityData = [
    { date: '2024-06-03', messages: 45, researches: 12 },
    { date: '2024-06-02', messages: 32, researches: 8 },
    { date: '2024-06-01', messages: 28, researches: 5 },
    { date: '2024-05-31', messages: 51, researches: 15 },
    { date: '2024-05-30', messages: 22, researches: 3 },
  ];

  const totalMessages = activityData.reduce((sum, day) => sum + day.messages, 0);
  const totalResearches = activityData.reduce((sum, day) => sum + day.researches, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-3 mb-8">
          <Activity className="h-8 w-8 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">Activity Dashboard</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-400" />
                <span>Total Messages</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalMessages}</div>
              <p className="text-gray-400 text-sm">Last 5 days</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center space-x-2">
                <Zap className="h-5 w-5 text-green-400" />
                <span>Research Queries</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalResearches}</div>
              <p className="text-gray-400 text-sm">Deep research sessions</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-400" />
                <span>Daily Average</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{Math.round(totalMessages / 5)}</div>
              <p className="text-gray-400 text-sm">Messages per day</p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Activity */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-400" />
              <span>Daily Activity</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Your conversation activity over the past 5 days
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activityData.map((day, index) => (
              <div key={day.date} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-white font-medium">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <Badge variant="secondary" className="bg-blue-900 text-blue-200">
                      {day.messages} messages
                    </Badge>
                    <Badge variant="secondary" className="bg-green-900 text-green-200">
                      {day.researches} research
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-400">
                    {((day.messages / Math.max(...activityData.map(d => d.messages))) * 100).toFixed(0)}%
                  </div>
                </div>
                <Progress 
                  value={(day.messages / Math.max(...activityData.map(d => d.messages))) * 100} 
                  className="h-2 bg-gray-700"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Usage Stats */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Usage Statistics</CardTitle>
            <CardDescription className="text-gray-400">
              Detailed breakdown of your Albedo interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-2xl font-bold text-white">89%</div>
                <div className="text-sm text-gray-400">Message Success Rate</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-2xl font-bold text-white">2.3s</div>
                <div className="text-sm text-gray-400">Average Response Time</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-2xl font-bold text-white">12</div>
                <div className="text-sm text-gray-400">Chat Sessions</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-2xl font-bold text-white">94%</div>
                <div className="text-sm text-gray-400">User Satisfaction</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivityPage;
