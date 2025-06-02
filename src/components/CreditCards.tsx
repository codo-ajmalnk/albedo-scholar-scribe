
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Diamond } from 'lucide-react';
import { useUsageTracking } from '@/hooks/useUsageTracking';

interface PlanFeature {
  name: string;
  free: string;
  gold: string;
  diamond: string;
}

const CreditCards = () => {
  const { userPlan, planLimits } = useUsageTracking();

  const features: PlanFeature[] = [
    {
      name: 'Chat with Albedo',
      free: '25 messages',
      gold: '100 messages',
      diamond: 'Unlimited',
    },
    {
      name: 'Deep Research',
      free: '2 searches',
      gold: '15 searches',
      diamond: '30 searches',
    },
    {
      name: 'Photo/Screenshot Upload',
      free: '4 uploads',
      gold: '15 uploads',
      diamond: '40 uploads',
    },
    {
      name: 'Image Generation',
      free: '2 images',
      gold: '15 images',
      diamond: '40 images',
    },
    {
      name: 'Reset Period',
      free: 'Daily',
      gold: 'Daily',
      diamond: 'Daily',
    },
    {
      name: 'Duration',
      free: 'Forever',
      gold: '3 months',
      diamond: '12 months',
    },
  ];

  const plans = [
    {
      name: 'Free',
      price: 0,
      badge: 'Current Plan',
      icon: null,
      description: 'Perfect for getting started',
      buttonText: 'Current Plan',
      buttonVariant: 'outline' as const,
      popular: false,
      discount: 0,
    },
    {
      name: 'Gold',
      price: 30,
      badge: 'Most Popular',
      icon: Crown,
      description: 'Great for regular users',
      buttonText: 'Upgrade to Gold',
      buttonVariant: 'default' as const,
      popular: true,
      discount: 0,
    },
    {
      name: 'Diamond',
      price: 101,
      badge: '20% OFF',
      icon: Diamond,
      description: 'For power users',
      buttonText: 'Upgrade to Diamond',
      buttonVariant: 'default' as const,
      popular: false,
      discount: 20,
      originalPrice: 126.25,
    },
  ];

  const handleUpgrade = (planName: string) => {
    // This would typically integrate with a payment system like Stripe
    console.log(`Upgrading to ${planName} plan`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-gray-600 mt-2">Unlock more features with our premium plans</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = userPlan === plan.name.toLowerCase();
          
          return (
            <Card key={plan.name} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  {Icon && <Icon className="h-6 w-6" />}
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                </div>
                <CardDescription>{plan.description}</CardDescription>
                
                <div className="space-y-2">
                  <div className="text-4xl font-bold">
                    ${plan.price}
                    {plan.originalPrice && (
                      <span className="text-lg text-gray-400 line-through ml-2">
                        ${plan.originalPrice}
                      </span>
                    )}
                  </div>
                  {plan.discount > 0 && (
                    <Badge variant="destructive">{plan.discount}% OFF</Badge>
                  )}
                  {isCurrentPlan && (
                    <Badge variant="secondary">Current Plan</Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {features.map((feature) => (
                    <div key={feature.name} className="flex items-center justify-between">
                      <span className="text-sm">{feature.name}</span>
                      <div className="flex items-center space-x-1">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">
                          {plan.name === 'Free' ? feature.free : 
                           plan.name === 'Gold' ? feature.gold : feature.diamond}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full" 
                  variant={isCurrentPlan ? 'outline' : plan.buttonVariant}
                  disabled={isCurrentPlan}
                  onClick={() => handleUpgrade(plan.name)}
                >
                  {isCurrentPlan ? 'Current Plan' : plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CreditCards;
