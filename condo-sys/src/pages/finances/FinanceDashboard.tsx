// src/pages/finances/FinanceDashboard.tsx
import {
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Spinner,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Box,
  Input,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../../services/api";
import Layout from "../../components/layout/Layout";
import { generatePDFReport } from "../../utils/generateInvoicesExpensesPDF";
import { Invoice } from "../../types/invoice";
import { Block } from "../../types/Block";
import { Expense } from "../../types/expense";
import { Payment } from "../../types/payment";

export default function FinanceDashboard() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState({
    ingresos: 0,
    egresos: 0,
    balance: 0,
    detalle_egresos: [],
    detalle_payments: [],
  });
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [month, setMonth] = useState("");
  const [apartments, setApartments] = useState([]);
  const [selectedApartment, setSelectedApartment] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [blockFilter, setBlockFilter] = useState("");
  const fetchApartments = () => {
    api
      .get("/buildings/apartments/")
      .then((res) => setApartments(res.data.results || res.data));
  };
  const fetchBlocks = async () => {
    try {
      const res = await api.get("/buildings/blocks/");
      if (res && res.status === 200) {
        setBlocks(res.data);
      }
    } catch (error: any) {
      console.error("Error fetching blocks:", error);
    }
  };
  const handleGeneratePDF = () => {
    const merged = [
      ...report.detalle_payments.map((inv: Payment) => ({
        date: new Date(inv.date),
        concept:
          Number(inv.amount) === Number(inv.invoice.amount)
            ? `Pago del apartamento ${inv.invoice.apartment_data.block}-${inv.invoice.apartment_data.number}`
            : `Pago parcial del apartamento ${inv.invoice.apartment_data.block}-${inv.invoice.apartment_data.number}`,
        amount: Number(inv.amount),
      })),
      ...report.detalle_egresos.map((exp: Expense) => ({
        date: new Date(exp.date),
        concept: `Egreso: ${exp.description}`,
        amount: Number(exp.amount),
      })),
    ];
    merged.sort((a: any, b: any) => a.date - b.date);
    const data = {
      incomes: report.ingresos,
      expenses: report.egresos,
      utility: report.balance,
      table: merged,
    };
    generatePDFReport(data);
  };
  useEffect(() => {
    fetchApartments();
  }, []);
  useEffect(() => {
    fetchBlocks();
  }, []);
  useEffect(() => {
    const params = new URLSearchParams();
    if (month) params.append("month", month);
    if (selectedApartment) params.append("apartment_id", selectedApartment);
    if (blockFilter) params.append("block", blockFilter);
    api
      .get(`/finances/reports/summary/?${params}`)
      .then((res) => {
        setReport(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [month, selectedApartment, blockFilter]);
  useEffect(() => {
    api.get("/finances/invoices/").then((res) => {
      setInvoices(res.data.results || res.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const filtered = invoices.filter((invoice) => {
      const matchesApartment =
        selectedApartment === "" ||
        String(invoice.apartment_data.id) === selectedApartment;
      const matchesMonth =
        month === "" || invoice.month.substring(0, 7) === month.substring(0, 7);
      const matchesBlock =
        blockFilter === "" ||
        Number(blockFilter) === invoice.apartment_data.block_id;
      return matchesApartment && matchesMonth && matchesBlock;
    });
    setFilteredInvoices(filtered);
  }, [selectedApartment, month, invoices, blockFilter]);
  if (loading)
    return (
      <Layout>
        <Spinner size="xl" />
      </Layout>
    );

  return (
    <Layout>
      <Heading mb={6}>Resumen Financiero</Heading>
      <Box mb={6} display="flex" gap={4} flexWrap="wrap">
        <Select
          bg={"white"}
          placeholder="Apartamento"
          value={selectedApartment}
          onChange={(e) => setSelectedApartment(e.target.value)}
          maxW="200px"
        >
          {apartments.map((a: any) => (
            <option
              key={a.id}
              value={a.id}
            >{`${a.block} - ${a.number}`}</option>
          ))}
        </Select>
        <Select
          placeholder="Filtrar por bloque"
          onChange={(e) => setBlockFilter(e.target.value)}
          maxW="200px"
        >
          {blocks.map((block) => (
            <option key={block.id} value={block.id}>
              {block.name}
            </option>
          ))}
        </Select>
        <Input
          bg={"white"}
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          maxW="150px"
        />
        <Button colorScheme="blue" onClick={handleGeneratePDF}>
          Generar reporte
        </Button>
      </Box>
      <SimpleGrid columns={[1, 3]} spacing={6} mb={6}>
        <Stat>
          <StatLabel>Total Ingresos</StatLabel>
          <StatNumber color="green.500">
            ${report.ingresos.toFixed(2)}
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Total Egresos</StatLabel>
          <StatNumber color="red.500">${report.egresos.toFixed(2)}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Balance Neto</StatLabel>
          <StatNumber color={report.balance >= 0 ? "green.600" : "red.600"}>
            ${report.balance.toFixed(2)}
          </StatNumber>
        </Stat>
      </SimpleGrid>

      <Heading size="md" mb={4}>
        Últimas Cuotas Generadas
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Apartamento</Th>
            <Th>Mes</Th>
            <Th>Monto</Th>
            <Th>Estado</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredInvoices.slice(0, 10).map((inv) => (
            <Tr key={inv.id}>
              <Td>
                {inv.apartment_data.block} - Apt. {inv.apartment_data.number}
              </Td>
              <Td>{inv.month}</Td>
              <Td>${inv.amount}</Td>
              <Td>{inv.is_paid ? "Pagado" : "Pendiente"}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Button
        mt={6}
        colorScheme="blue"
        onClick={() => (window.location.href = "/finanzas/cuotas")}
      >
        Ver y generar cuotas
      </Button>
    </Layout>
  );
}
