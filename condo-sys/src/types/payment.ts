export interface Payment {
  id: number;
  apartment: string;
  amount: string;
  date: string;
  reference: string;
  created_by: string
  invoice: {
    amount: string;
    created_at: Date;
    id: number;
    is_paid: boolean;
    month: Date;
    apartment_data: {
      id: number;
      number: string;
      block: string;
      owner?: string;
      tenant?: string;
    };
  };
}