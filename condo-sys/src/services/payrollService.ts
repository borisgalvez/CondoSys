import { PayrollPayment } from "../types/payroll";
import api from "./api";

export const getPayrollPayments = async (queryParams = ''): Promise<PayrollPayment[]> => {
  const response = await api.get(`/finances/payroll/${queryParams ? `?${queryParams}` : ''}`);
  return response.data;
};

export const createPayrollPayment = async (
  data: Omit<PayrollPayment, 'id' | 'created_at' | 'expense' | 'employee_type_display' | 'payment_method_display'>
): Promise<PayrollPayment> => {
  const response = await api.post('/finances/payroll/', data);
  return response.data;
};