import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { priceId, userId, userEmail } = req.body;

  if (!priceId || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      success_url: `${process.env.VITE_APP_URL}/settings?payment=success`,
      cancel_url: `${process.env.VITE_APP_URL}/pricing?payment=canceled`,
      client_reference_id: userId,
      metadata: {
        userId,
        plan: priceId.includes('vip') ? 'vip' : 'pro',
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return res.status(500).json({ error: error.message });
  }
}
