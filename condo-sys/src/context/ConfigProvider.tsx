import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Config } from "../types/config";
import { ConfigContext } from "./ConfigContext";
import { useAuth } from "../hooks/useAuth";

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<Config>({
    gas_price_per_gallon: null,
    billing_day_of_month: null,
  });
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth()
  const fetchConfig = async () => {
    if (!["/", "/login"].includes(location.pathname)) {
      try {
        const response = await api.get<Config>("/settings/config/1/");
        setConfig(response.data);
      } catch (error) {
        console.error("Error fetching config:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const updateConfig = async (data: Partial<Config>) => {
    try {
      setLoading(true);
      const response = await api.patch<Config>("/settings/config/1/", data);
      setConfig((prev) => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error("Error updating config:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(isAuthenticated){
      fetchConfig();
    } else {
      setLoading(false)
    }
  }, [isAuthenticated]);

  return (
    <ConfigContext.Provider value={{ config, loading, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};
