import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../types_db';
import { User } from '@/types';

export const getUserProfile = async (supabase: SupabaseClient<Database>, userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  return { data, error };
};

export const getCompanyUsers = async (supabase: SupabaseClient<Database>, businessId: number) => {
  // Fetch profiles and hierarchy info
  // This is a simplified join. In a real app, you might want to join business_hierarchy too.
  // For now, we'll fetch profiles that have this business_id
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('business_id', businessId);

  return { data, error };
};

export const updateUserHierarchy = async (
  supabase: SupabaseClient<Database>,
  employeeId: string, // UUID
  managerId: string | null // UUID
) => {
  // First get the unique_ids for these UUIDs
  const { data: employeeProfile } = await supabase.from('user_profiles').select('unique_id').eq('user_id', employeeId).single();

  let managerUniqueId = null;
  if (managerId) {
    const { data: managerProfile } = await supabase.from('user_profiles').select('unique_id').eq('user_id', managerId).single();
    managerUniqueId = managerProfile?.unique_id;
  }

  if (!employeeProfile) throw new Error('Employee not found');

  // Update user_profiles reports_to_unique_id
  const { error: profileError } = await supabase
    .from('user_profiles')
    .update({ reports_to_unique_id: managerUniqueId })
    .eq('user_id', employeeId);

  if (profileError) return { error: profileError };

  // Also update business_hierarchy if it exists
  // This part is tricky without a direct link, but let's assume we update the profile first.
  // If you have a separate hierarchy table, you'd update that too.

  return { error: null };
};
