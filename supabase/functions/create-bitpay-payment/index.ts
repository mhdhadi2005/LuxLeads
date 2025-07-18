import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { planId } = await req.json();
    
    if (!planId) {
      throw new Error('Plan ID is required');
    }

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { 
        persistSession: false 
      },
      global: {
        headers: {
          Authorization: authHeader,
        }
      }
    });

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Get subscription plan
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .eq('active', true)
      .single();

    if (planError || !plan) {
      throw new Error('Plan not found');
    }

    // Check if user already has an active subscription for this plan
    const { data: existingSubscription } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('plan_id', planId)
      .eq('status', 'active')
      .maybeSingle();

    if (existingSubscription) {
      throw new Error('You already have an active subscription for this plan');
    }

    // Create BitPay payment
    const bitpayApiKey = Deno.env.get('BITPAY_API_KEY');
    if (!bitpayApiKey) {
      throw new Error('BitPay API key not configured');
    }

    // For this demo, we'll create a simplified payment URL
    // In production, you'd integrate with BitPay's actual API
    const paymentData = {
      price: plan.price_usd,
      currency: 'USD',
      orderId: `luxleads-${plan.id}-${user.id}-${Date.now()}`,
      itemDesc: `LuxLeads ${plan.name} Subscription`,
      notificationEmail: user.email,
      redirectURL: `${Deno.env.get('SUPABASE_URL')}/functions/v1/payment-callback`,
      posData: JSON.stringify({
        userId: user.id,
        planId: plan.id,
        planName: plan.name
      })
    };

    // For demo purposes, we'll create a mock payment URL
    // In production, replace this with actual BitPay API call
    const mockPaymentUrl = `https://bitpay.com/invoice?id=mock-${paymentData.orderId}`;

    // Create payment record in database
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        amount_usd: plan.price_usd,
        currency: 'BTC',
        payment_provider: 'bitpay',
        provider_payment_id: paymentData.orderId,
        status: 'pending',
        payment_url: mockPaymentUrl,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Payment creation error:', paymentError);
      throw new Error('Failed to create payment record');
    }

    // Create pending subscription
    const { error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: user.id,
        plan_id: planId,
        status: 'pending',
        payment_id: payment.id
      });

    if (subscriptionError) {
      console.error('Subscription creation error:', subscriptionError);
      throw new Error('Failed to create subscription record');
    }

    console.log('Payment created successfully:', {
      paymentId: payment.id,
      userId: user.id,
      planId: planId,
      amount: plan.price_usd
    });

    return new Response(
      JSON.stringify({
        success: true,
        payment_url: mockPaymentUrl,
        payment_id: payment.id,
        amount: plan.price_usd,
        currency: 'USD'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in create-bitpay-payment:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});