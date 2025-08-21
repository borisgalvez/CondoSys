import { User } from "./user";

export interface RepairPayment {
  id: number;
  apartment: number;
  repair_type: 'plumbing' | 'electrical' | 'painting' | 'other';
  description?: string;
  cost: number;
  payment_date: string;
  paid_by_role: 'tenant' | 'owner' | 'admin';
  paid_by_user: User;
  registered_by: User;
  created_at: string;
}

export interface RepairPaymentFormData {
  apartment: number;
  repair_type: 'plumbing' | 'electrical' | 'painting' | 'other';
  description?: string;
  cost: number;
  payment_date: string;
  paid_by_role?: 'tenant' | 'owner' | 'admin';
  paid_by_user: number;
  paid_by_user_id: number
}