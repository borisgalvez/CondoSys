export interface Expense {
  id: number;
  description: string;
  amount: string;
  date: string;
  category: string;
  block_data: {name:string};
  document_url?: string;
}