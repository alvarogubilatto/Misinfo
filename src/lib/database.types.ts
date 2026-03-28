// =============================================================================
// MisInfo — Tipos generados del schema de Supabase
// Cuando el proyecto esté en Supabase, estos tipos se pueden regenerar con:
//   npx supabase gen types typescript --project-id <id> > src/lib/database.types.ts
// =============================================================================

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          avatar_url: string | null
          role: 'propietario' | 'inquilino'
          shares_expenses: boolean
          currency: 'ARS' | 'USD'
          plan: 'free' | 'premium'
          dark_mode: boolean
          balance_hidden: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string
          avatar_url?: string | null
          role?: 'propietario' | 'inquilino'
          shares_expenses?: boolean
          currency?: 'ARS' | 'USD'
          plan?: 'free' | 'premium'
          dark_mode?: boolean
          balance_hidden?: boolean
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      accounts: {
        Row: {
          id: string
          user_id: string
          name: string
          num: string | null
          balance: number
          icon: string
          color: string | null
          domain: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          num?: string | null
          balance?: number
          icon?: string
          color?: string | null
          domain?: string | null
        }
        Update: Partial<Database['public']['Tables']['accounts']['Insert']>
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          name: string
          icon: string | null
          color: string | null
          domain: string | null
          price: number
          billing_day: number
          paused: boolean
          warning_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          icon?: string | null
          color?: string | null
          domain?: string | null
          price: number
          billing_day: number
          paused?: boolean
          warning_text?: string | null
        }
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>
      }
      properties: {
        Row: {
          id: string
          user_id: string
          name: string
          address: string | null
          value: number | null
          type: 'Propietario' | 'Inquilino' | 'Inversión'
          icon: string
          gradient: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          address?: string | null
          value?: number | null
          type?: 'Propietario' | 'Inquilino' | 'Inversión'
          icon?: string
          gradient?: string | null
        }
        Update: Partial<Database['public']['Tables']['properties']['Insert']>
      }
      property_services: {
        Row: {
          id: string
          property_id: string
          name: string
          company: string | null
          amount: number | null
          period_type: 'fijo' | 'variable'
          status: 'pendiente' | 'pagado' | 'vencido'
          due_date: string | null
          paid_at: string | null
          payment_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          name: string
          company?: string | null
          amount?: number | null
          period_type?: 'fijo' | 'variable'
          status?: 'pendiente' | 'pagado' | 'vencido'
          due_date?: string | null
          paid_at?: string | null
          payment_url?: string | null
        }
        Update: Partial<Database['public']['Tables']['property_services']['Insert']>
      }
      activities: {
        Row: {
          id: string
          user_id: string
          account_id: string | null
          name: string
          amount: number
          category: 'ingreso' | 'gasto' | 'servicios' | 'compras'
          icon: string | null
          domain: string | null
          source_type: 'manual' | 'subscription' | 'property_service' | 'email_parsed' | null
          source_id: string | null
          occurred_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id?: string | null
          name: string
          amount: number
          category: 'ingreso' | 'gasto' | 'servicios' | 'compras'
          icon?: string | null
          domain?: string | null
          source_type?: 'manual' | 'subscription' | 'property_service' | 'email_parsed' | null
          source_id?: string | null
          occurred_at?: string
        }
        Update: Partial<Database['public']['Tables']['activities']['Insert']>
      }
      credentials: {
        Row: {
          id: string
          user_id: string
          service_name: string
          portal_url: string | null
          username_enc: string
          password_enc: string
          notes_enc: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_name: string
          portal_url?: string | null
          username_enc: string
          password_enc: string
          notes_enc?: string | null
        }
        Update: Partial<Database['public']['Tables']['credentials']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'vencimiento' | 'alerta_precio' | 'confirmacion_pago' | 'sync_completada' | 'email_parsed'
          title: string
          body: string | null
          severity: 'info' | 'warning' | 'error'
          read: boolean
          source_type: string | null
          source_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'vencimiento' | 'alerta_precio' | 'confirmacion_pago' | 'sync_completada' | 'email_parsed'
          title: string
          body?: string | null
          severity?: 'info' | 'warning' | 'error'
          read?: boolean
          source_type?: string | null
          source_id?: string | null
        }
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      email_parses: {
        Row: {
          id: string
          user_id: string
          gmail_message_id: string
          raw_subject: string | null
          raw_sender: string | null
          parsed_service: string | null
          parsed_amount: number | null
          parsed_currency: string | null
          parsed_date: string | null
          parsed_category: string | null
          status: 'pending_review' | 'confirmed' | 'rejected' | 'failed'
          confirmed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          gmail_message_id: string
          raw_subject?: string | null
          raw_sender?: string | null
          parsed_service?: string | null
          parsed_amount?: number | null
          parsed_currency?: string | null
          parsed_date?: string | null
          parsed_category?: string | null
          status?: 'pending_review' | 'confirmed' | 'rejected' | 'failed'
          confirmed_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['email_parses']['Insert']>
      }
    }
    Views: {
      user_balance: {
        Row: {
          user_id: string
          total: number
        }
      }
      upcoming_subscriptions: {
        Row: Database['public']['Tables']['subscriptions']['Row'] & {
          days_until_billing: number
        }
      }
    }
  }
}
