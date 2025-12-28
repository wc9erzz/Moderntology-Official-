export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: number
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          user_id: string
          unique_id: number
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_type: Database["public"]["Enums"]["subscription_type"]
          business_position: Database["public"]["Enums"]["business_position"] | null
          business_id: number | null
          reports_to_unique_id: number | null
          is_account_holder: boolean
          is_active: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          user_id: string
          unique_id?: number
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_type?: Database["public"]["Enums"]["subscription_type"]
          business_position?: Database["public"]["Enums"]["business_position"] | null
          business_id?: number | null
          reports_to_unique_id?: number | null
          is_account_holder?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          user_id?: string
          unique_id?: number
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_type?: Database["public"]["Enums"]["subscription_type"]
          business_position?: Database["public"]["Enums"]["business_position"] | null
          business_id?: number | null
          reports_to_unique_id?: number | null
          is_account_holder?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_reports_to_unique_id_fkey"
            columns: ["reports_to_unique_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["unique_id"]
          },
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      business_hierarchy: {
        Row: {
          id: number
          business_id: number
          manager_unique_id: number
          subordinate_unique_id: number
          position_type: Database["public"]["Enums"]["business_position"]
          created_at: string
        }
        Insert: {
          id?: number
          business_id: number
          manager_unique_id: number
          subordinate_unique_id: number
          position_type: Database["public"]["Enums"]["business_position"]
          created_at?: string
        }
        Update: {
          id?: number
          business_id?: number
          manager_unique_id?: number
          subordinate_unique_id?: number
          position_type?: Database["public"]["Enums"]["business_position"]
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_hierarchy_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_hierarchy_manager_unique_id_fkey"
            columns: ["manager_unique_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["unique_id"]
          },
          {
            foreignKeyName: "business_hierarchy_subordinate_unique_id_fkey"
            columns: ["subordinate_unique_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["unique_id"]
          }
        ]
      }
      numerology_readings: {
        Row: {
          id: number
          unique_id: number
          user_id: string
          status: Database["public"]["Enums"]["reading_status"]
          first_name_entered: string | null
          middle_name_entered: string | null
          last_name_entered: string | null
          full_name_entered: string | null
          date_of_birth_encrypted: string | null
          is_primary_reading: boolean | null
          can_edit: boolean | null
          life_path_number: number | null
          expression_number: number | null
          soul_urge_number: number | null
          personality_number: number | null
          birthday_number: number | null
          maturity_number: number | null
          calculations: Json
          chart_data: Json
          first_started_at: string | null
          completed_at: string | null
          last_updated_at: string | null
          created_at: string
          metadata: Json
        }
        Insert: {
          id?: number
          unique_id: number
          user_id: string
          status?: Database["public"]["Enums"]["reading_status"]
          first_name_entered?: string | null
          middle_name_entered?: string | null
          last_name_entered?: string | null
          full_name_entered?: string | null
          date_of_birth_encrypted?: string | null
          is_primary_reading?: boolean | null
          can_edit?: boolean | null
          life_path_number?: number | null
          expression_number?: number | null
          soul_urge_number?: number | null
          personality_number?: number | null
          birthday_number?: number | null
          maturity_number?: number | null
          calculations?: Json
          chart_data?: Json
          first_started_at?: string | null
          completed_at?: string | null
          last_updated_at?: string | null
          created_at?: string
          metadata?: Json
        }
        Update: {
          id?: number
          unique_id?: number
          user_id?: string
          status?: Database["public"]["Enums"]["reading_status"]
          first_name_entered?: string | null
          middle_name_entered?: string | null
          last_name_entered?: string | null
          full_name_entered?: string | null
          date_of_birth_encrypted?: string | null
          is_primary_reading?: boolean | null
          can_edit?: boolean | null
          life_path_number?: number | null
          expression_number?: number | null
          soul_urge_number?: number | null
          personality_number?: number | null
          birthday_number?: number | null
          maturity_number?: number | null
          calculations?: Json
          chart_data?: Json
          first_started_at?: string | null
          completed_at?: string | null
          last_updated_at?: string | null
          created_at?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "numerology_readings_unique_id_fkey"
            columns: ["unique_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["unique_id"]
          },
          {
            foreignKeyName: "numerology_readings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      reading_history: {
        Row: {
          id: number
          user_id: string
          reading_id: number
          action: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          reading_id: number
          action: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          reading_id?: number
          action?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_history_reading_id_fkey"
            columns: ["reading_id"]
            isOneToOne: false
            referencedRelation: "numerology_readings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      subscription_type: "x" | "standard" | "incomplete" | "business"
      business_position: "ceo" | "manager" | "employee" | "director" | "supervisor" | "consultant" | "contractor"
      reading_status: "not_started" | "in_progress" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
    Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
    Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof Database["public"]["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof Database["public"]["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof Database["public"]["Enums"]
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
