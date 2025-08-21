export interface Apartment {
  id: number;
  number: string;
  block: string;
  block_id: number
  owner?: string;
  tenant?: string;
}
