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
    // This would be called by BitPay when payment status changes
    const body = await req.json();
    console.log('Payment callback received:', body);

    // Create Supabase client with service role key for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract payment information from BitPay callback
    // This is a simplified version - in production you'd verify the webhook signature
    const { id: paymentId, status, data } = body;

    // Find the payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select(`
        *,
        user_subscriptions (
          id,
          plan_id,
          user_id,
          subscription_plans (*)
        )
      `)
      .eq('provider_payment_id', paymentId)
      .single();

    if (paymentError || !payment) {
      console.error('Payment not found:', paymentId);
      throw new Error('Payment not found');
    }

    // Update payment status
    if (status === 'confirmed' || status === 'complete') {
      // Payment successful
      const { error: updatePaymentError } = await supabase
        .from('payments')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('id', payment.id);

      if (updatePaymentError) {
        console.error('Failed to update payment:', updatePaymentError);
        throw new Error('Failed to update payment status');
      }

      // Activate subscription
      const plan = payment.user_subscriptions[0]?.subscription_plans;
      if (plan) {
        const startDate = new Date();
        const endDate = new Date();
        
        if (plan.billing_period === 'monthly') {
          endDate.setMonth(endDate.getMonth() + 1);
        } else if (plan.billing_period === 'yearly') {
          endDate.setFullYear(endDate.getFullYear() + 1);
        }

        const { error: updateSubscriptionError } = await supabase
          .from('user_subscriptions')
          .update({
            status: 'active',
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString()
          })
          .eq('payment_id', payment.id);

        if (updateSubscriptionError) {
          console.error('Failed to activate subscription:', updateSubscriptionError);
          throw new Error('Failed to activate subscription');
        }

        console.log('Subscription activated successfully:', {
          userId: payment.user_id,
          planId: plan.id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        });
      }
    } else if (status === 'expired' || status === 'invalid') {
      // Payment failed or expired
      const { error: updatePaymentError } = await supabase
        .from('payments')
        .update({
          status: status === 'expired' ? 'expired' : 'cancelled'
        })
        .eq('id', payment.id);

      if (updatePaymentError) {
        console.error('Failed to update payment status:', updatePaymentError);
      }

      // Update subscription status
      const { error: updateSubscriptionError } = await supabase
        .from('user_subscriptions')
        .update({
          status: 'cancelled'
        })
        .eq('payment_id', payment.id);

      if (updateSubscriptionError) {
        console.error('Failed to update subscription status:', updateSubscriptionError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Payment processed successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in payment callback:', error);
    
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