// TODO: Rewrite this file to support the new database schema.
// The previous schema has been removed.

/*
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types_db';

export const getSubscription = async (supabase: SupabaseClient<Database>) => {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  if (error) {
    console.error('Error:', error);
  }

  return subscription;
};

export const getActiveProductsWithPrices = async (
  supabase: SupabaseClient<Database>
) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error.message);
  }

  return data ?? [];
};
*/
export const getSubscription = async () => null;
export const getActiveProductsWithPrices = async () => [];
