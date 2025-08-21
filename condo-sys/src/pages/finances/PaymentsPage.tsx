import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { generateInvoicePDF } from "../../utils/generateInvoicePDF";
import { Payment } from "../../types/payment";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const getPayments = async () => {
    try {
      const res = await api.get("/finances/payments/");
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getPayments();
  }, []);
  const generatePdfPayment = (payment: Payment) => {
    generateInvoicePDF({
      invoiceNumber: payment.id,
      date: payment.date,
      owner: payment.invoice.apartment_data.owner ?? "",
      tenant: payment.invoice.apartment_data.tenant ?? "",
      apartment: `${payment.invoice.apartment_data.block} - ${payment.invoice.apartment_data.number}`,
      reference:
        payment.reference.length === 0 ? "Sin referencia" : payment.reference,
      confirmed: true,
      items: [
        {
          description: `Pago del apartamento ${payment.invoice.apartment_data.number}`,
          amount: Number(payment.amount),
        },
      ],
    });
  };
  if (loading) return <Spinner size="xl" />;

  return (
    <>
      <Box p={8}>
        <Heading mb={4}>Pagos realizados</Heading>
        <Table>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Apartamento</Th>
              <Th>Monto</Th>
              <Th>Fecha</Th>
              <Th>Referencia</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {payments.map((p) => (
              <Tr key={p.id}>
                <Td>{p.id}</Td>
                <Td>
                  {p.invoice.apartment_data.block} -{" "}
                  {p.invoice.apartment_data.number}
                </Td>
                <Td>{p.amount}</Td>
                <Td>{p.date}</Td>
                <Td>
                  {p.reference.length === 0 ? "Sin referencia" : p.reference}
                </Td>
                <Td>
                  <Button onClick={() => generatePdfPayment(p)}>
                    Generar factura
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
}
