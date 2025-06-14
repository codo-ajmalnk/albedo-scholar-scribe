
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Diamond, Shield } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { cn } from '@/lib/utils';

const CreditCards = () => {
  const { subscription } = useUserProfile();

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      duration: 'Forever',
      icon: Shield,
      gradient: 'from-gray-400 via-gray-500 to-gray-600',
      borderColor: 'border-gray-300',
      bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100',
      features: [
        '25 Chat messages per day',
        '2 Image generations per day',
        '4 Image uploads per day',
        '2 Deep research queries per day',
        'Basic support'
      ]
    },
    {
      id: 'gold',
      name: 'Gold',
      price: 30,
      duration: '3 months',
      icon: Crown,
      gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
      borderColor: 'border-yellow-400',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-amber-100',
      shimmer: true,
      glow: true,
      features: [
        '100 Chat messages per day',
        '15 Image generations per day',
        '15 Image uploads per day',
        '15 Deep research queries per day',
        'Priority support',
        'Advanced AI features'
      ]
    },
    {
      id: 'diamond',
      name: 'Diamond',
      price: 101,
      duration: '12 months',
      icon: Diamond,
      gradient: 'from-purple-500 via-pink-500 to-purple-600',
      borderColor: 'border-purple-400',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-100',
      shimmer: true,
      glow: true,
      shine: true,
      features: [
        'Unlimited Chat messages',
        '40 Image generations per day',
        '40 Image uploads per day',
        '30 Deep research queries per day',
        '24/7 Premium support',
        'All AI features',
        'Early access to new features'
      ]
    }
  ];

  const handlePurchase = (planId: string) => {
    // TODO: Implement Stripe integration
    console.log(`Purchasing plan: ${planId}`);
  };

  const isCurrentPlan = (planId: string) => {
    return subscription?.subscription_plan === planId;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>💳 Subscription Plans</CardTitle>
          <CardDescription>
            Choose the perfect plan for your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isActive = isCurrentPlan(plan.id);
              
              return (
                <div
                  key={plan.id}
                  className={cn(
                    "relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:scale-105 cursor-pointer",
                    plan.borderColor,
                    plan.bgColor,
                    plan.glow && "shadow-2xl shadow-yellow-500/50 hover:shadow-3xl hover:shadow-yellow-500/70",
                    plan.shine && "shadow-2xl shadow-purple-500/50 hover:shadow-3xl hover:shadow-purple-500/70",
                    isActive && "ring-4 ring-blue-500 ring-offset-4 animate-pulse"
                  )}
                  style={{
                    boxShadow: plan.glow 
                      ? '0 0 30px rgba(251, 191, 36, 0.4), 0 0 60px rgba(251, 191, 36, 0.2)'
                      : plan.shine
                      ? '0 0 30px rgba(168, 85, 247, 0.4), 0 0 60px rgba(168, 85, 247, 0.2)'
                      : undefined
                  }}
                >
                  {/* Enhanced Shimmer effect for premium plans */}
                  {plan.shimmer && (
                    <>
                      <div className="absolute inset-0 -top-px bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse opacity-70" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/20 to-transparent animate-ping" />
                    </>
                  )}
                  
                  {/* Enhanced Glow effect */}
                  {plan.glow && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-yellow-400/20 animate-pulse" />
                      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/30 via-orange-500/30 to-yellow-500/30 rounded-xl blur-lg animate-pulse" />
                    </>
                  )}

                  {/* Super shine effect for diamond */}
                  {plan.shine && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20 animate-pulse" />
                      <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-purple-500/40 rounded-xl blur-xl animate-pulse" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-bounce" />
                    </>
                  )}

                  <div className="relative p-6 z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn(
                        "p-3 rounded-full bg-gradient-to-r relative",
                        plan.gradient
                      )}>
                        <Icon className="h-6 w-6 text-white" />
                        {(plan.glow || plan.shine) && (
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent animate-spin"></div>
                        )}
                      </div>
                      {isActive && (
                        <Badge className="bg-blue-500 text-white animate-bounce">
                          Current Plan
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    
                    <div className="mb-4">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-gray-600 ml-2">/ {plan.duration}</span>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={cn(
                        "w-full relative overflow-hidden transition-all duration-300",
                        plan.id === 'free' 
                          ? "bg-gray-600 hover:bg-gray-700"
                          : plan.id === 'gold'
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50"
                          : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                      )}
                      disabled={isActive || plan.id === 'free'}
                      onClick={() => handlePurchase(plan.id)}
                    >
                      {plan.glow && (
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 animate-pulse"></div>
                      )}
                      {plan.shine && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-pulse"></div>
                      )}
                      <span className="relative z-10">
                        {isActive 
                          ? "Current Plan" 
                          : plan.id === 'free' 
                          ? "Free Forever" 
                          : "Upgrade Now"
                        }
                      </span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Current Subscription Status */}
      {subscription && (
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 animate-pulse"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center space-x-2">
              <span>📊 Current Subscription</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 shadow-lg shadow-blue-500/20">
                <h4 className="font-semibold text-blue-900">Plan</h4>
                <p className="text-2xl font-bold text-blue-600 capitalize animate-pulse">
                  {subscription.subscription_plan}
                </p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-200 shadow-lg shadow-green-500/20">
                <h4 className="font-semibold text-green-900">Credits</h4>
                <p className="text-2xl font-bold text-green-600 animate-bounce">
                  {subscription.credits}
                </p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200 shadow-lg shadow-purple-500/20">
                <h4 className="font-semibold text-purple-900">Status</h4>
                <p className={cn(
                  "text-2xl font-bold",
                  subscription.is_active ? "text-green-600 animate-pulse" : "text-red-600"
                )}>
                  {subscription.is_active ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
            
            {subscription.expires_at && (
              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200 shadow-lg shadow-yellow-500/20">
                <h4 className="font-semibold text-yellow-900 mb-2">Expiration</h4>
                <p className="text-yellow-700">
                  Your subscription expires on {new Date(subscription.expires_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <style>{`
        @keyframes shadow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
          50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.6); }
        }
      `}</style>
    </div>
  );
};

export default CreditCards;
