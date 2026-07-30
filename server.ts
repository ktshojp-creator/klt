import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import admin from 'firebase-admin';
import Stripe from 'stripe';
import { createServer as createViteServer } from 'vite';

dotenv.config();

// Helper to safely get initialized Firebase Admin
function getAdminApp() {
  if (admin.apps.length) {
    return admin.apps[0];
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return null;
  try {
    const serviceAccount = JSON.parse(raw);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (err) {
    console.error('Failed to initialize Firebase Admin SDK:', err);
    return null;
  }
}

// Helper to safely get initialized Stripe client
function getStripeClient(): Stripe | null {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) return null;
  try {
    return new Stripe(stripeSecretKey);
  } catch (err) {
    console.error('Failed to initialize Stripe SDK:', err);
    return null;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Stripe Webhook (Raw body requirement)
  app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const stripe = getStripeClient();

    let event: Stripe.Event;

    try {
      if (!stripe) {
        throw new Error('Stripe is not configured');
      }
      if (webhookSecret && sig) {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } else {
        event = JSON.parse(req.body.toString()) as Stripe.Event;
      }
    } catch (err: any) {
      console.error(`Webhook Signature Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const uid = session.metadata?.uid;
      const adminApp = getAdminApp();

      if (uid && adminApp) {
        console.log(`Setting is_premium=true for user UID: ${uid}`);
        await admin.firestore().collection('users').doc(uid).set({
          is_premium: true,
          purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
          stripeSessionId: session.id,
        }, { merge: true });
      }
    }

    res.json({ received: true });
  });

  // Middleware for JSON body parsing for standard APIs
  app.use(express.json());

  // 2. Stripe Create Checkout Session API
  app.post('/create-checkout-session', async (req, res) => {
    try {
      const { uid } = req.body;
      if (!uid) {
        return res.status(400).json({ error: 'ユーザーID (uid) が必要です。ログイン状態を確認してください。' });
      }
      const stripe = getStripeClient();
      if (!stripe) {
        return res.status(500).json({ error: 'Stripe API キー (STRIPE_SECRET_KEY) が設定されていません。' });
      }

      const host = req.get('host') || 'localhost:3000';
      const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
      const origin = `${protocol}://${host}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'jpy',
              product_data: {
                name: '韓国旅行会話集 - 広告非表示版（買い切り）',
                description: 'すべての広告（インフィード・全画面広告）を永久に非表示にします。',
              },
              unit_amount: 480,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        metadata: {
          uid,
        },
        success_url: `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/?payment=cancel`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error('Checkout session creation error:', error);
      res.status(500).json({ error: error.message || '決済セッションの作成に失敗しました。' });
    }
  });

  // 3. Verify Payment Success Helper Endpoint
  app.get('/api/verify-checkout-session', async (req, res) => {
    try {
      const sessionId = req.query.session_id as string;
      const stripe = getStripeClient();
      if (!sessionId || !stripe) {
        return res.status(400).json({ error: '無効なセッションIDまたはStripe未設定です。' });
      }
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const adminApp = getAdminApp();
      if (session.payment_status === 'paid' && session.metadata?.uid && adminApp) {
        const uid = session.metadata.uid;
        await admin.firestore().collection('users').doc(uid).set({
          is_premium: true,
          purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
          stripeSessionId: session.id
        }, { merge: true });
        return res.json({ success: true, is_premium: true, uid });
      }
      res.json({ success: false });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Health check API
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      firebaseAdmin: !!getAdminApp(), 
      stripeConfigured: !!getStripeClient() 
    });
  });

  // Vite Middleware for development mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
