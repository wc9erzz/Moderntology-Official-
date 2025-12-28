import { SupabaseClient } from '@supabase/supabase-js';
import { AstrologyReading } from '@/types_astrology';

export async function saveAstrologyReading(
    supabase: SupabaseClient,
    reading: Omit<AstrologyReading, 'id' | 'created_at' | 'user_id'>
): Promise<boolean> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.error('No authenticated user');
            return false;
        }

        // Optional: Get profile_id if you want to link it exactly like numerology
        // But user_id is sufficient for RLS.
        // We'll insert what we have.

        const row = {
            user_id: user.id,
            profile_id: reading.unique_id, // Map unique_id to profile_id column
            date_of_birth: reading.date_of_birth,
            time_of_birth: reading.time_of_birth,
            birth_city: reading.birth_city,
            birth_country: reading.birth_country,
            latitude: reading.latitude,
            longitude: reading.longitude,
            system: reading.system,
            house_system: reading.chart_data.meta.house_system,
            chart_data: reading.chart_data
        };

        // Check for existing reading of this system AND this profile to update "slot"
        let query = supabase
            .from('astrology_readings')
            .select('id')
            .eq('user_id', user.id)
            .eq('system', reading.system);

        if (reading.unique_id) {
            query = query.eq('profile_id', reading.unique_id);
        } else {
            query = query.is('profile_id', null);
        }

        const { data: existing } = await query.maybeSingle();

        let error;
        if (existing) {
            const { error: updError } = await supabase
                .from('astrology_readings')
                .update({ ...row, updated_at: new Date().toISOString() })
                .eq('id', existing.id);
            error = updError;
        } else {
            const { error: insError } = await supabase
                .from('astrology_readings')
                .insert(row);
            error = insError;
        }

        if (error) {
            console.error('Error saving astrology reading:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Unexpected error saveAstrologyReading:', err);
        return false;
    }
}

export async function getAstrologyReadings(supabase: SupabaseClient): Promise<AstrologyReading[]> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('astrology_readings')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching astrology readings:', error);
            return [];
        }

        // Map back to TypeScript interface if needed, or cast
        // DB columns -> TS properties mapping
        return data.map((d: any) => ({
            id: d.id,
            user_id: d.user_id,
            unique_id: d.profile_id,
            date_of_birth: d.date_of_birth,
            time_of_birth: d.time_of_birth,
            birth_city: d.birth_city,
            birth_country: d.birth_country,
            latitude: d.latitude,
            longitude: d.longitude,
            system: d.system,
            chart_data: d.chart_data,
            profile_name: d.chart_data?.user_metadata?.profile_name,
            settings: d.chart_data?.user_metadata?.settings,
            created_at: d.created_at
        }));

    } catch (err) {
        console.error('Unexpected error getAstrologyReadings:', err);
        return [];
    }
}

export async function deleteAstrologyReading(supabase: SupabaseClient, id: number): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('astrology_readings')
            .delete()
            .eq('id', id);

        return !error;
    } catch (err) {
        console.error(err);
        return false;
    }
}
