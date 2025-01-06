import { z } from 'zod';

export type LicenseVendor = 'Microsoft' | 'Adobe' | 'Atlassian' | 'Other';

export interface License {
  id: string;
  name: string;
  vendor: LicenseVendor;
  type: string;
  key: string;
  totalQuantity: number;
  availableQuantity: number;
  purchaseDate: string;
  expirationDate?: string;
  cost: number;
  status: 'active' | 'expired' | 'pending';
  notes?: string;
}

export interface LicenseAssignment {
  id: string;
  licenseId: string;
  userId: string;
  assignedBy: string;
  assignedAt: string;
  expiresAt?: string;
  status: 'active' | 'revoked' | 'expired';
}

export const licenseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  vendor: z.enum(['Microsoft', 'Adobe', 'Atlassian', 'Other']),
  type: z.string().min(1, 'License type is required'),
  key: z.string().min(1, 'License key is required'),
  totalQuantity: z.number().positive('Quantity must be positive'),
  purchaseDate: z.string(),
  expirationDate: z.string().optional(),
  cost: z.number().nonnegative(),
  notes: z.string().optional()
});