export interface Invoice {
  id: number;
  month: string;
  amount: string;
  is_paid: boolean;
  apartment_data: {
    id: number;
    number: string;
    block: string;
    block_id: number;
    owner?: string;
    tenant?: string;
  };
  balance: string;
  status: string;
}