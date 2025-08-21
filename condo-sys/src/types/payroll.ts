import { Expense } from "./expense";

export type PaymentMethod = "TRANSFER" | "CASH" | "QR";
export interface PayrollPayment {
  id: number;
  employee_name: string;
  employee_type: string;
  employee_type_display: string;
  amount: number;
  payment_date: string;
  payment_method: PaymentMethod;
  payment_method_display: string;
  notes?: string;
  created_at: string;
  created_by?: number;
  expense: Expense
}