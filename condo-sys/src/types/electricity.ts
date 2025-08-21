export interface ElectricityPaymentRequest {
  amount: number;
  distribution_type: string;
  description?: string;
  payment_date_registered: string;
  paid_person?: number;
  details?: {
    apartment_id: number;
    amount: number;
  }[];
}

export interface ElectricityPayment {
  id: number;
  amount: number;
  distribution_type: string;
  description: string;
  payment_date_registered: string;
  payment_date_paid: string | null;
  created_by: number;
  expense: number | null;
  created_at: string;
}

export interface ElectricityDetail {
  id: number;
  amount: number;
  apartment: number;
  created_by: number;
  payment_record: string
  paid_person?: string;
  created_at: Date;
  updated_at: Date
}

export interface Reading {
  apartmentId: number;
  reading: number;
}

export interface PaymentCalculated {
  apartmentId: number;
  amount: number;
}

export type DistributionType = 'proportional' | 'equal';