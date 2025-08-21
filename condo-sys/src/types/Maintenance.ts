export interface Maintenance {
  id: number;
  type_maintenance: string;
  id_block: string;
  maintenance_manager: string;
  description?: string;
  observation?: string;
  start_date: string;
  end_date?: string;
  maintenance_expense?: number;
}