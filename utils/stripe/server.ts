// TODO: Rewrite this file to support the new database schema if Stripe integration is needed.
// The previous schema has been removed.

/*
'use server';

import Stripe from 'stripe';
import { stripe } from '@/utils/stripe/config';
import { createClient } from '@/utils/supabase/server';
import { createOrRetrieveCustomer } from '@/utils/supabase/admin';
import {
  getURL,
  getErrorRedirect,
  calculateTrialEndUnixTimestamp
} from '@/utils/helpers';
import { Tables } from '@/types_db';

type Price = Tables<'prices'>;

type CheckoutResponse = {
  errorRedirect?: string;
  sessionId?: string;
};

export async function checkoutWithStripe(
  price: Price,
  redirectPath: string = '/account'
): Promise<CheckoutResponse> {
  console.log('\n🔧 ===== SERVER: CHECKOUT WITH STRIPE =====');
  console.log('🔧 Received price:', JSON.stringify(price, null, 2));
  console.log('🔧 Redirect path:', redirectPath);
  
  try {
    // Step 1: Get user from Supabase
    console.log('👤 Step 1: Getting user from Supabase...');
    const supabase = createClient();
    const {
      error,
      data: { user }
    } = await supabase.auth.getUser();

    if (error) {
      console.error('❌ Supabase auth error:', error);
      throw new Error('Could not get user session.');
    }

    if (!user) {
      console.error('❌ No user found in session');
      throw new Error('Could not get user session.');
    }

    console.log('✅ User found:', user.id);
    console.log('✅ User email:', user.email);

    // Step 2: Create or retrieve Stripe customer
    console.log('💳 Step 2: Creating/retrieving Stripe customer...');
    let customer: string;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user?.id || '',
        email: user?.email || ''
      });
      console.log('✅ Stripe customer ID:', customer);
    } catch (err) {
      console.error('❌ Customer creation failed:', err);
      throw new Error('Unable to access customer record.');
    }

    // Step 3: Validate price data
    console.log('💰 Step 3: Validating price data...');
    if (!price.id) {
      console.error('❌ Price ID is missing');
      throw new Error('Invalid price: missing price ID');
    }
    if (!price.currency) {
      console.error('❌ Currency is missing');
      throw new Error('Invalid price: missing currency');
    }
    if (!price.product_id) {
      console.error('❌ Product ID is missing');
      throw new Error('Invalid price: missing product ID');
    }
    console.log('✅ Price data validated');

    // Step 4: Build checkout session parameters
    console.log('🔨 Step 4: Building checkout session parameters...');
    const cancelUrl = getURL();
    const successUrl = getURL(redirectPath);
    
    console.log('🔗 Cancel URL:', cancelUrl);
    console.log('🔗 Success URL:', successUrl);

    let params: Stripe.Checkout.SessionCreateParams = {
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer,
      customer_update: {
        address: 'auto'
      },
      line_items: [
        {
          price: price.id,
          quantity: 1
        }
      ],
      cancel_url: cancelUrl,
      success_url: successUrl
    };

    console.log('📋 Base params created');

    // Step 5: Add mode-specific parameters
    console.log('⚙️ Step 5: Adding mode-specific parameters...');
    console.log('⚙️ Price type:', price.type);
    console.log('⚙️ Price interval:', price.interval);
    console.log('⚙️ Trial period days:', price.trial_period_days);

    if (price.type === 'recurring') {
      const trialEnd = calculateTrialEndUnixTimestamp(price.trial_period_days);
      console.log('🔄 Setting up subscription mode');
      console.log('🔄 Trial end timestamp:', trialEnd);
      
      params = {
        ...params,
        mode: 'subscription',
        subscription_data: {
          trial_end: trialEnd
        }
      };
    } else if (price.type === 'one_time') {
      console.log('💵 Setting up one-time payment mode');
      params = {
        ...params,
        mode: 'payment'
      };
    } else {
      console.error('❌ Unknown price type:', price.type);
      throw new Error(`Unknown price type: ${price.type}`);
    }

    console.log('📋 Final params:', JSON.stringify(params, null, 2));

    // Step 6: Create Stripe checkout session
    console.log('🎫 Step 6: Creating Stripe checkout session...');
    let session;
    try {
      session = await stripe.checkout.sessions.create(params);
      console.log('✅ Stripe session created!');
      console.log('✅ Session ID:', session.id);
      console.log('✅ Session URL:', session.url);
    } catch (err) {
      console.error('❌ Stripe session creation failed:', err);
      if (err instanceof Error) {
        console.error('❌ Error message:', err.message);
        console.error('❌ Error stack:', err.stack);
      }
      // Check if it's a Stripe error with more details
      if (err && typeof err === 'object' && 'type' in err) {
        console.error('❌ Stripe error type:', (err as any).type);
        console.error('❌ Stripe error code:', (err as any).code);
        console.error('❌ Stripe error param:', (err as any).param);
      }
      throw new Error('Unable to create checkout session.');
    }

    // Step 7: Return session ID
    if (session && session.id) {
      console.log('🎉 Checkout session created successfully!');
      console.log('🔧 ===== END SERVER CHECKOUT =====\n');
      return { sessionId: session.id };
    } else {
      console.error('❌ Session created but no ID present');
      throw new Error('Unable to create checkout session.');
    }
  } catch (error) {
    console.error('❌ ===== SERVER CHECKOUT ERROR =====');
    console.error('❌ Error:', error);
    if (error instanceof Error) {
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          error.message,
          'Please try again later or contact support.'
        )
      };
    } else {
      console.error('❌ Unknown error type');
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          'An unknown error occurred.',
          'Please try again later or contact support.'
        )
      };
    }
  }
}

export async function createStripePortal(currentPath: string) {
  console.log('\n🎫 ===== SERVER: CREATE STRIPE PORTAL =====');
  try {
    const supabase = createClient();
    const {
      error,
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      if (error) {
        console.error('❌ Auth error:', error);
      }
      throw new Error('Could not get user session.');
    }

    console.log('✅ User:', user.id);

    let customer;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user.id || '',
        email: user.email || ''
      });
      console.log('✅ Customer:', customer);
    } catch (err) {
      console.error('❌ Customer error:', err);
      throw new Error('Unable to access customer record.');
    }

    if (!customer) {
      throw new Error('Could not get customer.');
    }

    try {
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: getURL('/account')
      });
      if (!url) {
        throw new Error('Could not create billing portal');
      }
      console.log('✅ Portal created:', url);
      return url;
    } catch (err) {
      console.error('❌ Portal creation error:', err);
      throw new Error('Could not create billing portal');
    }
  } catch (error) {
    console.error('❌ Portal error:', error);
    if (error instanceof Error) {
      return getErrorRedirect(
        currentPath,
        error.message,
        'Please try again later or contact a system administrator.'
      );
    } else {
      return getErrorRedirect(
        currentPath,
        'An unknown error occurred.',
        'Please try again later or contact a system administrator.'
      );
    }
  }
}
*/
export async function checkoutWithStripe() { }
export async function createStripePortal() { }
