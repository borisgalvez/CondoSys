import api from "./api";

export const fetchTransactionHistory = async () => {
  const res = await api.get("/finances/finance-history/");
  return res.data;
};
