// types_numera.ts - TypeScript types for NUMERA database

import { Database } from './types_db';

// Subscription Types
export type SubscriptionType = 'x' | 'standard' | 'incomplete' | 'business';

// Business Positions
export type BusinessPosition = 'ceo' | 'manager' | 'employee' | 'director' | 'supervisor' | 'consultant' | 'contractor';

// Reading Status
export type ReadingStatus = 'not_started' | 'in_progress' | 'completed';

// User Profile (from user_profiles table)
export interface UserProfile {
  unique_id: number;
  user_id: string;
  email: string;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  full_name: string | null;
  subscription_type: SubscriptionType;
  business_position: BusinessPosition | null;
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
  preferences: Record<string, any>;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
  email_verified_at: string | null;
  deleted_at: string | null;
}

// Numerology Reading (from numerology_readings table)
export interface NumerologyReading {
  id: number;
  unique_id: number;
  user_id: string;
  status: ReadingStatus;
  first_name_entered: string | null;
  middle_name_entered: string | null;
  last_name_entered: string | null;
  full_name_entered: string | null;
  date_of_birth_encrypted: any; // BYTEA
  is_primary_reading: boolean;
  can_edit: boolean;
  life_path_number: number | null;
  expression_number: number | null;
  soul_urge_number: number | null;
  personality_number: number | null;
  birthday_number: number | null;
  maturity_number: number | null;
  calculations: Record<string, any>;
  chart_data: Record<string, any>;
  first_started_at: string | null;
  completed_at: string | null;
  last_updated_at: string;
  created_at: string;
  metadata: Record<string, any>;
}

// Business (from businesses table)
export interface Business {
  id: number;
  business_name: string;
  ceo_unique_id: number | null;
  industry: string | null;
  size: string | null;
  website: string | null;
  primary_email: string | null;
  primary_phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string;
  metadata: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Business Hierarchy (from business_hierarchy table)
export interface BusinessHierarchy {
  id: number;
  business_id: number;
  employee_unique_id: number;
  manager_unique_id: number | null;
  position_type: BusinessPosition;
  department: string | null;
  title: string | null;
  hierarchy_level: number;
  metadata: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Combined types for common queries
export interface UserWithReading extends UserProfile {
  reading: NumerologyReading | null;
}

export interface TeamMemberWithReading {
  unique_id: number;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  full_name: string | null;
  email: string;
  position_type: BusinessPosition;
  hierarchy_level: number;
  reports_to: number | null;
  department: string | null;
  life_path_number: number | null;
  expression_number: number | null;
  soul_urge_number: number | null;
  personality_number: number | null;
  birthday_number: number | null;
  maturity_number: number | null;
  reading_status: ReadingStatus;
  reading_completed_at: string | null;
}

// Numerology calculation input
export interface NumerologyInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string; // MM/DD/YYYY format
}

// Numerology calculation result
export interface NumerologyCalculation {
  lifePathNumber: number;
  expressionNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  birthdayNumber: number;
  maturityNumber: number;
  personalYearNumber: number;
}

// Personal Year calculation input
export interface PersonalYearInput {
  birthMonth: number;
  birthDay: number;
  currentYear: number;
}
