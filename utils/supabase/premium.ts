import { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

export interface UserPremiumData {
  user_id: string;
  parcel_ids: number[];
  date_last_pressed: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get user's premium data (cached parcel IDs and last refresh info)
 */
export const getUserPremiumData = cache(async (supabase: SupabaseClient): Promise<UserPremiumData | null> => {
  try {
    const { data, error } = await supabase
      .from('user_premium_data')
      .select('*')
      .single();

    if (error) {
      // If no record exists, that's fine - return null
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching user premium data:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in getUserPremiumData:', err);
    return null;
  }
});

/**
 * Save user's premium data (parcel IDs and refresh timestamp)
 */
export const saveUserPremiumData = async (
  supabase: SupabaseClient, 
  parcelIds: number[]
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return false;
    }

    const now = new Date().toISOString();

    const { error } = await supabase
      .from('user_premium_data')
      .upsert({
        user_id: user.id,
        parcel_ids: parcelIds,
        date_last_pressed: now,
        updated_at: now
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Error saving user premium data:', error);
      return false;
    }

    console.log('Successfully saved premium data for user:', user.id);
    return true;
  } catch (err) {
    console.error('Error in saveUserPremiumData:', err);
    return false;
  }
};

/**
 * Subscribe to real-time changes in user's premium data
 */
export const subscribeToUserPremiumData = (
  supabase: SupabaseClient,
  userId: string,
  onUpdate: (data: UserPremiumData) => void
) => {
  const subscription = supabase
    .channel('user_premium_data_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_premium_data',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Real-time update received:', payload);
        if (payload.new && typeof payload.new === 'object') {
          onUpdate(payload.new as UserPremiumData);
        }
      }
    )
    .subscribe();

  return subscription;
};
