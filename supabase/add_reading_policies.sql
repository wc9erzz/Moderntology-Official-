-- Add missing RLS policies for numerology_readings table
-- This allows users to INSERT and UPDATE their own readings

-- Allow users to insert their own readings
CREATE POLICY IF NOT EXISTS "Users can insert own readings" ON public.numerology_readings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own readings
CREATE POLICY IF NOT EXISTS "Users can update own readings" ON public.numerology_readings
  FOR UPDATE USING (auth.uid() = user_id);





