import { createContext } from "react";
import { Config } from "../types/config";

interface ConfigContextType {
  config: Config;
  loading: boolean;
  updateConfig: (data: Partial<Config>) => Promise<void>;
}

export const ConfigContext = createContext<ConfigContextType | undefined>(undefined);