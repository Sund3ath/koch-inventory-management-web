import type { Database } from '../lib/supabase/types';

export type Device = Database['public']['Tables']['devices']['Row'] & {
  assignments?: Array<{
    employee: {
      id: string;
      first_name: string;
      last_name: string;
      department: {
        name: string;
      };
    };
  }>;
};

export type Employee = Database['public']['Tables']['employees']['Row'] & {
  department: {
    name: string;
  };
  devices: Array<{
    device: Device;
  }>;
};

export interface Vendor {
  id: string;
  name: string;
  category: string;
  contact_name: string;
  email: string;
  phone?: string;
  website?: string;
  status: 'active' | 'inactive';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type License = Database['public']['Tables']['licenses']['Row'] & {
  assignments: Array<{
    id: string;
    status: 'active' | 'revoked' | 'expired';
    employee: {
      id: string;
      first_name: string;
      last_name: string;
      department: {
        name: string;
      };
    };
  }>;
};