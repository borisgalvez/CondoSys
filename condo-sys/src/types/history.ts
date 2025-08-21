export interface MappedTransaction {
  id: number;
  amount: number | string;
  created_by: number | string | null;
  paid_by: number | string | null;
  date: string;
}

export interface TransactionFilters {
  type?: string;
  startDate?: string;
  endDate?: string;
  userId?: string;
}