// utils/supabase/numera-queries.ts
// Fixed version that matches your actual database schema

import { SupabaseClient } from '@supabase/supabase-js';

export interface UserProfile {
  unique_id: number;
  user_id: string;
  email: string;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  full_name: string | null;
  subscription_type: any;
  business_position: any | null;
  is_business_account: boolean;
  business_name: string | null;
  business_id: number | null;
  reports_to_unique_id: number | null;
  is_active: boolean;
  is_verified: boolean;
  phone: string | null;
  avatar_url: string | null;
  timezone: string | null;
  locale: string;
  preferences: any;
  metadata: any;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
  email_verified_at: string | null;
  deleted_at: string | null;
}

export interface ReadingData {
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  dateOfBirthEncrypted: string;
  lifePathNumber: number;
  lifePathRaw?: number;
  expressionNumber: number;
  expressionRaw?: number;
  soulUrgeNumber: number;
  soulUrgeRaw?: number;
  personalityNumber: number;
  personalityRaw?: number;
  birthdayNumber: number;
  birthdayRaw?: number;
  maturityNumber: number;
  maturityRaw?: number;
  calculations?: any;
}

// Get user profile
export async function getUserProfile(supabase: SupabaseClient): Promise<UserProfile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('No authenticated user');
      return null;
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error in getUserProfile:', error);
    return null;
  }
}

// Save reading to database
export async function saveReading(
  supabase: SupabaseClient,
  uniqueId: number,
  readingData: ReadingData
): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('No authenticated user');
      return false;
    }

    // Check for existing reading for this user and profile to decide between update or insert
    const { data: existing } = await supabase
      .from('numerology_readings')
      .select('id')
      .eq('user_id', user.id)
      .eq('unique_id', uniqueId)
      .maybeSingle();

    const isPrimary = true; // New saves from the main flow are always primary

    // Prepare the reading data matching your schema
    const readingToSave: any = {
      user_id: user.id,
      unique_id: uniqueId,
      status: 'completed', // reading_status enum
      first_name_entered: readingData.firstName,
      middle_name_entered: readingData.middleName || null,
      last_name_entered: readingData.lastName,
      full_name_entered: readingData.fullName,
      date_of_birth_encrypted: Buffer.from(readingData.dateOfBirthEncrypted), // Store as bytea
      is_primary_reading: isPrimary,
      can_edit: true,
      life_path_number: readingData.lifePathNumber,
      expression_number: readingData.expressionNumber,
      soul_urge_number: readingData.soulUrgeNumber,
      personality_number: readingData.personalityNumber,
      birthday_number: readingData.birthdayNumber,
      maturity_number: readingData.maturityNumber,
      calculations: {
        ...readingData.calculations,
        rawValues: {
          lifePathRaw: readingData.lifePathRaw,
          expressionRaw: readingData.expressionRaw,
          soulUrgeRaw: readingData.soulUrgeRaw,
          personalityRaw: readingData.personalityRaw,
          birthdayRaw: readingData.birthdayRaw,
          maturityRaw: readingData.maturityRaw,
        }
      },
      chart_data: {}, // Empty for now, can add more data later
      last_updated_at: new Date().toISOString(),
      metadata: {}
    };

    let error;
    if (existing) {
      // Update existing record
      const { error: updError } = await supabase
        .from('numerology_readings')
        .update(readingToSave)
        .eq('id', existing.id);
      error = updError;
    } else {
      // Insert new record
      readingToSave.first_started_at = new Date().toISOString();
      readingToSave.completed_at = new Date().toISOString();
      const { error: insError } = await supabase
        .from('numerology_readings')
        .insert(readingToSave);
      error = insError;
    }

    if (error) {
      console.error('Error saving reading:', error);
      console.error('Error details:', error.message, error.details, error.hint);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error in saveReading:', error);
    return false;
  }
}

// Get user's readings
export async function getUserReadings(supabase: SupabaseClient): Promise<any[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('No authenticated user');
      return [];
    }

    const { data, error } = await supabase
      .from('numerology_readings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching readings:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error in getUserReadings:', error);
    return [];
  }
}

// Get primary reading
export async function getPrimaryReading(supabase: SupabaseClient): Promise<any | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('No authenticated user');
      return null;
    }

    const { data, error } = await supabase
      .from('numerology_readings')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_primary_reading', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No primary reading found
        return null;
      }
      console.error('Error fetching primary reading:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error in getPrimaryReading:', error);
    return null;
  }
}

// Update reading
export async function updateReading(
  supabase: SupabaseClient,
  readingId: number,
  updates: Partial<ReadingData>
): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('No authenticated user');
      return false;
    }

    const updateData: any = {
      last_updated_at: new Date().toISOString()
    };

    if (updates.firstName) updateData.first_name_entered = updates.firstName;
    if (updates.middleName !== undefined) updateData.middle_name_entered = updates.middleName;
    if (updates.lastName) updateData.last_name_entered = updates.lastName;
    if (updates.fullName) updateData.full_name_entered = updates.fullName;
    if (updates.dateOfBirthEncrypted) updateData.date_of_birth_encrypted = Buffer.from(updates.dateOfBirthEncrypted);
    if (updates.lifePathNumber) updateData.life_path_number = updates.lifePathNumber;
    if (updates.expressionNumber) updateData.expression_number = updates.expressionNumber;
    if (updates.soulUrgeNumber) updateData.soul_urge_number = updates.soulUrgeNumber;
    if (updates.personalityNumber) updateData.personality_number = updates.personalityNumber;
    if (updates.birthdayNumber) updateData.birthday_number = updates.birthdayNumber;
    if (updates.maturityNumber) updateData.maturity_number = updates.maturityNumber;

    if (updates.calculations) {
      updateData.calculations = {
        ...updates.calculations,
        rawValues: {
          lifePathRaw: updates.lifePathRaw,
          expressionRaw: updates.expressionRaw,
          soulUrgeRaw: updates.soulUrgeRaw,
          personalityRaw: updates.personalityRaw,
          birthdayRaw: updates.birthdayRaw,
          maturityRaw: updates.maturityRaw,
        }
      };
    }

    const { error } = await supabase
      .from('numerology_readings')
      .update(updateData)
      .eq('id', readingId)
      .eq('user_id', user.id); // Ensure user can only update their own readings

    if (error) {
      console.error('Error updating reading:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error in updateReading:', error);
    return false;
  }
}

// Delete reading
export async function deleteReading(
  supabase: SupabaseClient,
  readingId: number
): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('No authenticated user');
      return false;
    }

    const { error } = await supabase
      .from('numerology_readings')
      .delete()
      .eq('id', readingId)
      .eq('user_id', user.id); // Ensure user can only delete their own readings

    if (error) {
      console.error('Error deleting reading:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error in deleteReading:', error);
    return false;
  }
}

// Get user profile with their primary reading
export async function getUserWithReading(supabase: SupabaseClient): Promise<{
  profile: UserProfile | null;
  reading: any | null;
}> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('No authenticated user');
      return { profile: null, reading: null };
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return { profile: null, reading: null };
    }

    // Get primary reading
    const { data: reading, error: readingError } = await supabase
      .from('numerology_readings')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_primary_reading', true)
      .maybeSingle(); // Use maybeSingle() to avoid error if no reading exists

    if (readingError) {
      console.error('Error fetching reading:', readingError);
    }

    return { profile, reading };
  } catch (error) {
    console.error('Unexpected error in getUserWithReading:', error);
    return { profile: null, reading: null };
  }
}

// Get user with all their readings
export async function getUserWithAllReadings(supabase: SupabaseClient): Promise<{
  profile: UserProfile | null;
  readings: any[];
}> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('No authenticated user');
      return { profile: null, readings: [] };
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return { profile: null, readings: [] };
    }

    // Get all readings
    const { data: readings, error: readingsError } = await supabase
      .from('numerology_readings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (readingsError) {
      console.error('Error fetching readings:', readingsError);
      return { profile, readings: [] };
    }

    return { profile, readings: readings || [] };
  } catch (error) {
    console.error('Unexpected error in getUserWithAllReadings:', error);
    return { profile: null, readings: [] };
  }
}

// Update user preferences
export async function updateUserPreferences(
  supabase: SupabaseClient,
  preferences: any
): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('No authenticated user');
      return false;
    }

    const { error } = await supabase
      .from('user_profiles')
      .update({
        preferences: preferences,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating preferences:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error in updateUserPreferences:', error);
    return false;
  }
}

// Update user profile
export async function updateUserProfile(
  supabase: SupabaseClient,
  updates: Partial<UserProfile>
): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('No authenticated user');
      return false;
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    // Only include fields that are provided
    if (updates.first_name !== undefined) updateData.first_name = updates.first_name;
    if (updates.middle_name !== undefined) updateData.middle_name = updates.middle_name;
    if (updates.last_name !== undefined) updateData.last_name = updates.last_name;
    if (updates.full_name !== undefined) updateData.full_name = updates.full_name;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.avatar_url !== undefined) updateData.avatar_url = updates.avatar_url;
    if (updates.timezone !== undefined) updateData.timezone = updates.timezone;
    if (updates.locale !== undefined) updateData.locale = updates.locale;
    if (updates.preferences !== undefined) updateData.preferences = updates.preferences;
    if (updates.metadata !== undefined) updateData.metadata = updates.metadata;

    const { error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error in updateUserProfile:', error);
    return false;
  }
}