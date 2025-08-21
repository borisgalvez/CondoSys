// src/services/electricityService.ts
import api from "./api";
import { ElectricityPaymentRequest, ElectricityPayment, ElectricityDetail } from "../types/electricity";

// POST - Crear un pago
export const createElectricityPayment = async (
  paymentData: ElectricityPaymentRequest
): Promise<ElectricityPayment> => {
  const res = await api.post("/finances/electricity-payments/", paymentData);
  return res.data;
};

// GET - Listar pagos registrados
export const fetchElectricityPayments = async (): Promise<ElectricityPayment[]> => {
  const res = await api.get("/finances/electricity-payments/");
  return res.data;
};

export const fetchElectricityPaymentsDetail = async (): Promise<ElectricityDetail[]> => {
  const response = await api.get('/finances/electricity-payment-details/');
  return response.data;
};

export const payElectricityDetail = async (id: number): Promise<void> => {
  const res = await api.patch(`/finances/electricity-payment-details/${id}/`);
  console.log(res);
  
};
