// hooks/useConfigPage.ts
import { useConfig } from './useConfig';

export const useConfigPage = () => {
  const { config, loading, updateConfig } = useConfig();
  console.log(config);
  
  const handleUpdateGasPrice = async (value: number) => {
    await updateConfig({ gas_price_per_gallon: value });
  };

  const handleUpdateBillingDay = async (day: number) => {
    await updateConfig({ billing_day_of_month: day });
  };

  return {
    gasPrice: config.gas_price_per_gallon,
    gasPriceCubicMeter: config.gas_price_per_cubic_meter,
    preferredUnit: config.preferred_unit,
    billingDay: config.billing_day_of_month,
    loading,
    handleUpdateGasPrice,
    handleUpdateBillingDay
  };
};