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
      devices: {
        Row: {
          id: string
          type: 'laptop' | 'phone' | 'tablet' | 'monitor' | 'workstation' | 'other'
          brand: string
          model: string
          serial_number: string
          purchase_date: string
          status: 'available' | 'assigned' | 'maintenance' | 'retired'
          device_domain_id: string | null
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: Omit<Database['public']['Tables']['devices']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['devices']['Insert']>
      }
      employees: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          department_id: string
          position: string
          hire_date: string
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['employees']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['employees']['Insert']>
      }
      departments: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['departments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['departments']['Insert']>
      }
      device_assignments: {
        Row: {
          id: string
          device_id: string
          employee_id: string
          assigned_by: string
          assigned_at: string
          return_date: string | null
          status: 'active' | 'returned' | 'lost'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['device_assignments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['device_assignments']['Insert']>
      }
    }
  }
}