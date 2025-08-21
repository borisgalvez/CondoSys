// src/pages/finances/InvoicesPage.tsx
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Input,
  Button,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import api from "../../services/api";
import PaymentModal from "./PaymentModal";
import { Invoice } from "../../types/invoice";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [apartments, setApartments] = useState([]);
  const [selectedApartment, setSelectedApartment] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchInvoices = async () => {
    try {
      const res = await api.get("/finances/invoices/");
      setInvoices(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApartments = () => {
    api
      .get("/buildings/apartments/")
      .then((res) => setApartments(res.data.results || res.data));
  };

  useEffect(() => {
    fetchInvoices();
    fetchApartments();
  }, []);

  const handleCreate = async () => {
    if (!selectedApartment || !month || !amount) return;
    try {
      await api.post("/finances/invoices/", {
        apartment: Number(selectedApartment),
        month: `${month}-01`,
        amount,
      });
      toast({ title: "Cuota registrada", status: "success", duration: 3000 });
      fetchInvoices();
      setSelectedApartment("");
      setMonth("");
      setAmount("");
    } catch (err: any) {
      console.error(err);
      toast({
        title: `Error al registrar cuota: ${err.response.data.non_field_errors.join(', ')}`,
        status: "error",
        duration: 3000,
      });
    }
  };
  const makePayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    onOpen();
  };
  const onCloseModalPayment = () => {
    setSelectedInvoice(null);
    onClose();
  };
  return (
    <Layout>
      <Heading mb={6}>Cuotas por Apartamento</Heading>

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
            >{`Bloque ${a.block} - ${a.number}`}</option>
          ))}
        </Select>
        <Input
          bg={"white"}
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          maxW="150px"
        />
        <Input
          bg={"white"}
          type="number"
          placeholder="Monto"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          maxW="150px"
        />
        <Button onClick={handleCreate} colorScheme="blue">
          Registrar cuota
        </Button>
      </Box>

      <Table>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Apartamento</Th>
            <Th>Mes</Th>
            <Th>Monto</Th>
            <Th>Monto Pagado</Th>
            <Th>Estado</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {invoices.map((inv) => (
            <Tr key={inv.id}>
              <Td>{inv.id}</Td>
              <Td>
                {inv.apartment_data.block} - {inv.apartment_data.number}
              </Td>
              <Td>{inv.month}</Td>
              <Td>${inv.amount}</Td>
              <Td>${(parseFloat(inv.amount)-parseFloat(inv.balance)).toFixed(2)}</Td>
              <Td>{inv.status==='partially_paid'?'Parcialmente pagado':inv.is_paid ? "Pagado" : "Pendiente"}</Td>
              <Td>
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="solid"
                  onClick={() => makePayment(inv)}
                >
                  Realizar pago
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {selectedInvoice && (
        <PaymentModal
          invoiceSelected={selectedInvoice}
          isOpen={isOpen}
          onClose={onCloseModalPayment}
          onUpdated={fetchInvoices}
        />
      )}
    </Layout>
  );
}
