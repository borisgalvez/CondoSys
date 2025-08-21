import { ElectricityDetail } from "../../types/electricity";
import { Expense } from "../../types/expense";
import { ExtraordinaryPayment } from "../../types/extraordinary";
import { GasReading } from "../../types/gas";
import { Payment } from "../../types/payment";
import { PayrollPayment } from "../../types/payroll";
import { RepairPayment } from "../../types/RepairPayment";

export const mapTransaction = {
  electricity: (item: ElectricityDetail) => ({
    id: item.id,
    amount: item.amount,
    created_by: item.payment_record,
    paid_by: item.paid_person,
    date: item.updated_at,
  }),
  maintenance: (item: RepairPayment) => ({
    id: item.id,
    amount: item.cost,
    created_by: item.registered_by,
    paid_by: item.paid_by_user,
    date: item.payment_date,
  }),
  payroll: (item: PayrollPayment) => ({
    id: item.id,
    amount: item.amount,
    created_by: item.created_by,
    paid_by: "-",
    date: item.payment_date,
  }),
  extraordinary: (item: ExtraordinaryPayment) => ({
    id: item.id,
    amount: item.amount,
    created_by: "-", 
    paid_by: "-",    
    date: item.date,
  }),
  expense: (item: Expense) => ({
    id: item.id,
    amount: item.amount,
    created_by: "-", 
    paid_by: "-",    
    date: item.date,
  }),
  payment_data: (item: Payment) => ({
    id: item.id,
    amount: item.amount,
    created_by: item.created_by, 
    paid_by: "-",    
    date: item.date,
  }),
  reading_data: (item: GasReading) => ({
    id: item.id,
    amount: item.total,
    created_by: item.created_by,
    paid_by: item.paid_by_user,
    date: item.date,
  }),
};
