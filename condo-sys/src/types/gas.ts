import { Apartment } from "./apartmentTypes";

export interface GasReading {
  id: number;
  date: string;
  value_m3: string;
  gas_value: number;
  total: number
  is_paid: boolean;
  created_by: number | null;
  paid_by_user: number | null;
}

export interface GasMeter {
  id: number;
  serial_number: string;
  apartment: number;
  installed_at: string;
  readings: GasReading[];
  is_paid: boolean;
}

export interface ApartmentGasInfoWithMeter {
  apartment: Apartment;
  gas_meter: GasMeter;
}
export interface ApartmentGasInfoWithoutMeter {
  apartment: Apartment;
}

export interface ApartmentsGasStatus {
  with_meter: ApartmentGasInfoWithMeter[];
  without_meter: ApartmentGasInfoWithoutMeter[];
}