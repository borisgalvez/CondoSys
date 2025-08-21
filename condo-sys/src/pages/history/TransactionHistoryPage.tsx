import { useEffect, useState, useMemo } from "react";
import { Box, Heading, Divider } from "@chakra-ui/react";
import { MappedTransaction, TransactionFilters } from "../../types/history";
import { fetchTransactionHistory } from "../../services/historyService";
import { FilterBar } from "./FilterBar";
import { TransactionTable } from "./TransactionTable";
import Layout from "../../components/layout/Layout";
import { mapTransaction } from "./DataAdapters";
import { getUsers } from "../../services/userService";

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<
    Record<string, MappedTransaction[]>
  >({});
  const [filters, setFilters] = useState<TransactionFilters>({
    type: "",
    startDate: "",
    endDate: "",
    userId: "",
  });
  const [users, setUsers] = useState<{ id: number; username: string }[]>([]);
  const loadUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    loadUsers();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchTransactionHistory();
        const mapped: Record<string, any[]> = {};
        Object.entries(response).forEach(([key, values]) => {
          // Solo sigue si la key existe en el mapTransaction
          const mapper = mapTransaction[key as keyof typeof mapTransaction];
          if (!mapper) return;

          if (!Array.isArray(values)) return; // Verifica que sea array por seguridad

          mapped[key] = values.map((item) => mapper(item));
        });

        setTransactions(mapped);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
      }
    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    const result: Record<string, MappedTransaction[]> = {};

    Object.entries(transactions).forEach(([key, values]) => {
      let filtered = values;

      if (filters.type && key !== filters.type) return;
      if (filters.userId) {
        filtered = filtered.filter(
          (item) =>
            String(item.paid_by)?.includes(filters.userId!) ||
            String(item.created_by)?.includes(filters.userId!)
        );
      }

      if (filters.startDate) {
        filtered = filtered.filter(
          (item) => new Date(item.date) >= new Date(filters.startDate!)
        );
      }

      if (filters.endDate) {
        filtered = filtered.filter(
          (item) => new Date(item.date) <= new Date(filters.endDate!)
        );
      }

      if (!filters.type) result[key] = filtered;
      else if (filtered.length) result[key] = filtered;
    });

    return result;
  }, [transactions, filters]);

  return (
    <Layout>
      <Box p={4}>
        <Heading size="lg" mb={4}>
          Historial de Transacciones
        </Heading>

        <FilterBar filters={filters} onChange={setFilters} users={users} />

        <Divider my={6} />

        {Object.entries(filteredData).map(([key, values]) => (
          <Box key={key} mb={8}>
            <Heading size="md" mb={4}>
              {getReadableType(key)}{" "}
              {/* Puedes crear un helper para traducir */}
            </Heading>
            <TransactionTable data={values} />
          </Box>
        ))}
      </Box>
    </Layout>
  );
}

function getReadableType(key: string) {
  const translations: Record<string, string> = {
    electricity: "Electricidad",
    maintenance: "Mantenimiento",
    payroll: "Nómina",
    extraordinary: "Pago Extraordinario",
    expense: "Gastos",
    payment_data: "Pagos",
    reading_data: "Lecturas de Gas",
  };
  return translations[key] || key;
}
