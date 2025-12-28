// utils/supabase/copy-tracking.ts
import { SupabaseClient } from '@supabase/supabase-js';

export interface UserCopyData {
  user_id: string;
  last_copy_time: string;
  copies_today: number;
  created_at: string;
  updated_at: string;
}

/**
 * Get user's copy tracking data
 */
export const getUserCopyData = async (supabase: SupabaseClient): Promise<UserCopyData | null> => {
  try {
    const { data, error } = await supabase
      .from('user_copy_tracking')
      .select('*')
      .single();

    if (error) {
      // If no record exists, that's fine - return null
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching user copy data:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in getUserCopyData:', err);
    return null;
  }
};

/**
 * Check if user can copy (10 second cooldown + daily limit of 100)
 */
export const canUserCopy = async (supabase: SupabaseClient): Promise<{ canCopy: boolean; timeRemaining: number; reason?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { canCopy: false, timeRemaining: 0, reason: 'Not authenticated' };
    }

    const copyData = await getUserCopyData(supabase);
    const now = new Date();
    
    if (!copyData) {
      // No previous copy data, user can copy
      return { canCopy: true, timeRemaining: 0 };
    }

    const lastCopyTime = new Date(copyData.last_copy_time);
    const timeDiff = Math.floor((now.getTime() - lastCopyTime.getTime()) / 1000);
    
    // Check 10 second cooldown
    if (timeDiff < 10) {
      return { canCopy: false, timeRemaining: 10 - timeDiff };
    }
    
    // Check daily limit (reset at midnight)
    const today = now.toDateString();
    const lastCopyDate = lastCopyTime.toDateString();
    
    if (today === lastCopyDate && copyData.copies_today >= 100) {
      return { canCopy: false, timeRemaining: 0, reason: 'Daily limit reached (100 copies)' };
    }

    return { canCopy: true, timeRemaining: 0 };
  } catch (err) {
    console.error('Error in canUserCopy:', err);
    return { canCopy: false, timeRemaining: 0, reason: 'Error checking permissions' };
  }
};

/**
 * Record a copy action
 */
export const recordCopyAction = async (supabase: SupabaseClient, parcelId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const now = new Date();
    const copyData = await getUserCopyData(supabase);
    
    let newCopiesCount = 1;
    
    if (copyData) {
      const lastCopyDate = new Date(copyData.last_copy_time).toDateString();
      const today = now.toDateString();
      
      // Reset daily count if it's a new day
      if (today === lastCopyDate) {
        newCopiesCount = copyData.copies_today + 1;
      }
    }

    const { error } = await supabase
      .from('user_copy_tracking')
      .upsert({
        user_id: user.id,
        last_copy_time: now.toISOString(),
        copies_today: newCopiesCount,
        updated_at: now.toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Error recording copy action:', error);
      return false;
    }

    // Also log the specific copy for audit purposes
    const { error: logError } = await supabase
      .from('copy_audit_log')
      .insert({
        user_id: user.id,
        parcel_id: parcelId,
        copied_at: now.toISOString()
      });

    if (logError) {
      console.error('Error logging copy action:', logError);
      // Don't fail the operation for logging errors
    }

    return true;
  } catch (err) {
    console.error('Error in recordCopyAction:', err);
    return false;
  }
};
