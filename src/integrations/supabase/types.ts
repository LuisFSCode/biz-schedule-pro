export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          customer_id: string
          establishment_id: string
          id: string
          notes: string | null
          service_duration: number | null
          service_name: string
          service_price: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          customer_id: string
          establishment_id: string
          id?: string
          notes?: string | null
          service_duration?: number | null
          service_name: string
          service_price?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          customer_id?: string
          establishment_id?: string
          id?: string
          notes?: string | null
          service_duration?: number | null
          service_name?: string
          service_price?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          email: string
          establishment_id: string
          id: string
          name: string | null
          password_hash: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          establishment_id: string
          id?: string
          name?: string | null
          password_hash?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          establishment_id?: string
          id?: string
          name?: string | null
          password_hash?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      establishments: {
        Row: {
          address: string | null
          body_background_color: string | null
          body_background_type: string | null
          body_gradient_angle: number | null
          body_gradient_color1: string | null
          body_gradient_color2: string | null
          color_primary: string | null
          created_at: string
          email: string
          facebook_url: string | null
          favicon_url: string | null
          feedbacks: Json | null
          footer_background_color: string | null
          footer_font_family: string | null
          footer_font_size: string | null
          footer_text: string | null
          footer_text_align: string | null
          header_background_color: string | null
          header_background_type: string | null
          header_gradient_angle: number | null
          header_gradient_color1: string | null
          header_gradient_color2: string | null
          header_position: string | null
          hero_background_color: string | null
          hero_description: string | null
          hero_image_url: string | null
          hero_title: string | null
          hero_title_font_family: string | null
          hero_title_font_size: string | null
          id: string
          instagram_url: string | null
          logo_url: string | null
          name: string
          password_hash: string | null
          phone: string | null
          section2_content: string | null
          section2_enabled: boolean | null
          services: Json | null
          services_background_color: string | null
          services_background_image: string | null
          services_background_type: string | null
          services_title_font_family: string | null
          services_title_font_size: string | null
          slug: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          body_background_color?: string | null
          body_background_type?: string | null
          body_gradient_angle?: number | null
          body_gradient_color1?: string | null
          body_gradient_color2?: string | null
          color_primary?: string | null
          created_at?: string
          email: string
          facebook_url?: string | null
          favicon_url?: string | null
          feedbacks?: Json | null
          footer_background_color?: string | null
          footer_font_family?: string | null
          footer_font_size?: string | null
          footer_text?: string | null
          footer_text_align?: string | null
          header_background_color?: string | null
          header_background_type?: string | null
          header_gradient_angle?: number | null
          header_gradient_color1?: string | null
          header_gradient_color2?: string | null
          header_position?: string | null
          hero_background_color?: string | null
          hero_description?: string | null
          hero_image_url?: string | null
          hero_title?: string | null
          hero_title_font_family?: string | null
          hero_title_font_size?: string | null
          id?: string
          instagram_url?: string | null
          logo_url?: string | null
          name: string
          password_hash?: string | null
          phone?: string | null
          section2_content?: string | null
          section2_enabled?: boolean | null
          services?: Json | null
          services_background_color?: string | null
          services_background_image?: string | null
          services_background_type?: string | null
          services_title_font_family?: string | null
          services_title_font_size?: string | null
          slug: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          body_background_color?: string | null
          body_background_type?: string | null
          body_gradient_angle?: number | null
          body_gradient_color1?: string | null
          body_gradient_color2?: string | null
          color_primary?: string | null
          created_at?: string
          email?: string
          facebook_url?: string | null
          favicon_url?: string | null
          feedbacks?: Json | null
          footer_background_color?: string | null
          footer_font_family?: string | null
          footer_font_size?: string | null
          footer_text?: string | null
          footer_text_align?: string | null
          header_background_color?: string | null
          header_background_type?: string | null
          header_gradient_angle?: number | null
          header_gradient_color1?: string | null
          header_gradient_color2?: string | null
          header_position?: string | null
          hero_background_color?: string | null
          hero_description?: string | null
          hero_image_url?: string | null
          hero_title?: string | null
          hero_title_font_family?: string | null
          hero_title_font_size?: string | null
          id?: string
          instagram_url?: string | null
          logo_url?: string | null
          name?: string
          password_hash?: string | null
          phone?: string | null
          section2_content?: string | null
          section2_enabled?: boolean | null
          services?: Json | null
          services_background_color?: string | null
          services_background_image?: string | null
          services_background_type?: string | null
          services_title_font_family?: string | null
          services_title_font_size?: string | null
          slug?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
