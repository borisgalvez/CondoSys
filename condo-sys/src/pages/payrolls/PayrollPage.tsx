// pages/PayrollPage.tsx
import {
  VStack,
  Heading,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Spinner,
  HStack,
  Input,
  Button,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { PayrollPayment } from "../../types/payroll";
import { getPayrollPayments } from "../../services/payrollService";
import Layout from "../../components/layout/Layout";
import PayrollPaymentModal from "../../components/payroll/PayrollPaymentModal";

const PayrollPage = () => {
  const [payments, setPayments] = useState<PayrollPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append("date_from", dateFrom);
      if (dateTo) params.append("date_to", dateTo);

      const data = await getPayrollPayments(params.toString());
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payroll payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = () => {
    fetchPayments();
  };

  return (
    <Layout>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl">
          Registro de Pagos de Nómina
        </Heading>
        <PayrollPaymentModal fetchPayment={fetchPayments} />
        {/* <Box bg="white" p={4} borderRadius="md" boxShadow="md">
          <Heading as="h2" size="md" mb={4}>
            Nuevo Pago
          </Heading>
          <PayrollForm onSubmit={handleSubmit} />
        </Box> */}

        <Box bg="white" p={4} borderRadius="md" boxShadow="md">
          <HStack mb={4} spacing={4}>
            <FormControl>
              <FormLabel>Desde</FormLabel>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Hasta</FormLabel>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </FormControl>
            <Button mt={8} onClick={handleFilter}>
              Filtrar
            </Button>
          </HStack>

          <Heading as="h2" size="md" mb={4}>
            Historial de Pagos
          </Heading>
          {loading ? (
            <Spinner size="xl" />
          ) : payments.length === 0 ? (
            <Text>No hay pagos registrados</Text>
          ) : (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Empleado</Th>
                  <Th>Tipo</Th>
                  <Th isNumeric>Monto</Th>
                  <Th>Fecha</Th>
                  <Th>Método</Th>
                </Tr>
              </Thead>
              <Tbody>
                {payments.map((payment) => (
                  <Tr key={payment.id}>
                    <Td>{payment.employee_name}</Td>
                    <Td>{payment.employee_type_display}</Td>
                    <Td isNumeric>${payment.amount}</Td>
                    <Td>
                      {format(new Date(payment.payment_date), "dd/MM/yyyy", {
                        locale: es,
                      })}
                    </Td>
                    <Td>{payment.payment_method_display}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>
      </VStack>
    </Layout>
  );
};

export default PayrollPage;
