const transactionLabels: Record<string, string> = {
  electricity: "Electricidad",
  maintenance: "Mantenimiento",
  payroll: "Nómina de pagos",
  extraordinary: "Pago Extraordinario",
  expense: "Gastos",
  payment_data: "Pagos",
  reading_data: "Pagos de lecturas de gas",
};

export const getTransactionLabel = (key: string): string => {
  return transactionLabels[key.toLowerCase()] || key;
};
