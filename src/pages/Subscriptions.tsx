import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Check, Star, Shield, Users, BarChart } from 'lucide-react';
import { Session, User } from '@supabase/supabase-js';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_usd: number;
  billing_period: string;
  features: any;
}

interface UserSubscription {
  id: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  subscription_plans: SubscriptionPlan;
}

const Subscriptions = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscriptions, setUserSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      loadPlans();
      loadUserSubscriptions();
    }
  }, [user]);

  const loadPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('active', true)
        .order('price_usd', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load subscription plans",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserSubscriptions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) throw error;
      setUserSubscriptions(data || []);
    } catch (error: any) {
      console.error('Error loading subscriptions:', error);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!user) return;

    setPaymentLoading(planId);
    try {
      const { data, error } = await supabase.functions.invoke('create-bitpay-payment', {
        body: { planId }
      });

      if (error) throw error;

      if (data?.payment_url) {
        window.open(data.payment_url, '_blank');
      }

      toast({
        title: "Payment Created",
        description: "Complete your crypto payment to activate your subscription",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create payment",
        variant: "destructive"
      });
    } finally {
      setPaymentLoading(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'leads': return <Users className="h-4 w-4 text-primary" />;
      case 'analytics': return <BarChart className="h-4 w-4 text-primary" />;
      case 'export': return <Shield className="h-4 w-4 text-primary" />;
      case 'support': return <Star className="h-4 w-4 text-primary" />;
      default: return <Check className="h-4 w-4 text-primary" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">LuxLeads Subscriptions</h1>
            <p className="text-muted-foreground mt-2">Choose your plan and pay with crypto</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Welcome back</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Active Subscriptions */}
        {userSubscriptions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Active Subscriptions</h2>
            <div className="grid gap-4">
              {userSubscriptions.map((subscription) => (
                <Card key={subscription.id} className="p-6 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">{subscription.subscription_plans.name}</h3>
                      <p className="text-muted-foreground">{subscription.subscription_plans.description}</p>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Active
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Dashboard Access */}
        <div className="mb-8">
          <Card className="p-6 bg-gradient-primary text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold mb-2">Access Your Dashboard</h3>
                <p className="opacity-90">Manage your luxury contacts and analytics</p>
              </div>
              <Button
                onClick={() => navigate('/dashboard')}
                variant="secondary"
                size="lg"
              >
                Open Dashboard
              </Button>
            </div>
          </Card>
        </div>

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => {
            const isSubscribed = userSubscriptions.some(
              sub => sub.subscription_plans.id === plan.id
            );
            
            return (
              <Card key={plan.id} className="p-8 relative overflow-hidden shadow-colorful hover:shadow-accent transition-all duration-300">
                {plan.billing_period === 'yearly' && (
                  <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                    Best Value
                  </Badge>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-primary mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-primary">${plan.price_usd}</span>
                    <span className="text-muted-foreground">/{plan.billing_period}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features && Object.entries(plan.features).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3">
                      {getFeatureIcon(key)}
                      <span className="capitalize">
                        {key === 'leads' ? `${String(value)} Leads` : 
                         key === 'analytics' ? 'Advanced Analytics' :
                         key === 'export' ? 'Data Export' :
                         key === 'support' ? `${String(value)} Support` :
                         key === 'discount' ? String(value) :
                         `${key}: ${String(value)}`}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isSubscribed || paymentLoading === plan.id}
                  className="w-full bg-gradient-primary hover:opacity-90 disabled:opacity-50"
                  size="lg"
                >
                  {isSubscribed ? 'Already Subscribed' :
                   paymentLoading === plan.id ? 'Creating Payment...' :
                   'Pay with Crypto'}
                </Button>

                {plan.billing_period === 'yearly' && (
                  <p className="text-center text-sm text-muted-foreground mt-3">
                    Save $189 compared to monthly billing
                  </p>
                )}
              </Card>
            );
          })}
        </div>

        {/* Payment Information */}
        <Card className="mt-8 p-6 bg-muted/50">
          <h3 className="font-semibold mb-3">💰 Crypto Payment Information</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p>• Payments processed securely via BitPay</p>
              <p>• Support for Bitcoin, Ethereum, and other major cryptocurrencies</p>
              <p>• <span className="text-green-600 font-semibold">Access code 777777 provided after payment</span></p>
            </div>
            <div>
              <p>• Instant activation upon payment confirmation</p>
              <p>• UAE-friendly payment solution</p>
              <p>• Use access code to unlock dashboard features</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Subscriptions;