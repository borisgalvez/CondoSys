export interface Config {
  gas_price_per_gallon: number | null;
  billing_day_of_month: number | null;
  gas_price_per_cubic_meter: number | null;
  preferred_unit: "galon" | "m3";
}
