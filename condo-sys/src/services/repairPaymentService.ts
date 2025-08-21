import { RepairPayment, RepairPaymentFormData } from "../types/RepairPayment";
import api from "./api";


// Obtener todos los pagos
export const fetchRepairPayments = async (): Promise<RepairPayment[]> => {
  const response = await api.get('/finances/repair-payments/');
  return response.data;
};

// Crear un nuevo pago
export const createRepairPayment = async (data: RepairPaymentFormData): Promise<RepairPayment> => {
  const response = await api.post('/finances/repair-payments/', data);
  return response.data;
};

// Opcional: filtrar por vivienda, fechas, etc.
export const fetchRepairPaymentsByHousing = async (housingUnitId: number): Promise<RepairPayment[]> => {
  const response = await api.get('/finances/repair-payments/', { params: { housing_unit: housingUnitId } });
  return response.data;
};
