import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia'
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: any) {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('✅ Webhook received:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSuccess(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancelled(subscription);
        break;
      }
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { supabase } = await import('../../src/lib/supabase');
  
  const clientRef = session.client_reference_id;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;
  
  if (!clientRef || !subscriptionId) {
    console.error('Missing client_reference_id or subscriptionId in session');
    return;
  }
  
  // Parsear client_reference_id: formato "userId_plan"
  const [userId, planType] = clientRef.split('_') as [string, 'vip' | 'pro'];
  
  if (!userId || !planType) {
    console.error('Invalid client_reference_id format:', clientRef);
    return;
  }
  
  // Obtener detalles de la suscripción para el billing cycle
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const billingCycle = subscription.items.data[0].price.recurring?.interval === 'year' ? 'annual' : 'monthly';

  // Calcular fechas (Stripe devuelve timestamps en segundos)
  const currentPeriodStart = new Date((subscription as any).current_period_start * 1000);
  const currentPeriodEnd = new Date((subscription as any).current_period_end * 1000);

  // Guardar en Supabase
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }
  
  const { error } = await supabase.from('user_subscriptions').upsert({
    user_id: userId,
    plan_type: planType,
    billing_cycle: billingCycle,
    status: 'active',
    current_period_start: currentPeriodStart.toISOString(),
    current_period_end: currentPeriodEnd.toISOString(),
    updated_at: new Date().toISOString(),
  }, {
    onConflict: 'user_id'
  });

  if (error) {
    console.error('Error saving subscription:', error);
    throw error;
  }

  console.log('✅ Subscription activated for user:', userId, 'Plan:', planType);
}

async function handlePaymentSuccess(invoice: Stripe.Invoice) {
  console.log('💰 Payment succeeded:', invoice.id, 'Amount:', invoice.amount_paid);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const { supabase } = await import('../../src/lib/supabase');
  
  const subscriptionId = (invoice as any).subscription as string;
  
  if (subscriptionId && supabase) {
    // Actualizar status a past_due
    await supabase.from('user_subscriptions')
      .update({ status: 'past_due', updated_at: new Date().toISOString() })
      .eq('stripe_subscription_id', subscriptionId);
  }

  console.log('⚠️ Payment failed for subscription:', subscriptionId);
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  const { supabase } = await import('../../src/lib/supabase');
  
  if (supabase) {
    await supabase.from('user_subscriptions')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString() 
      })
      .eq('stripe_subscription_id', subscription.id);
  }

  console.log('❌ Subscription cancelled:', subscription.id);
}
