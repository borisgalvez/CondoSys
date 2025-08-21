import {
  Box,
  Button,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import Layout from "../../components/layout/Layout";
import ExtraordinaryPaymentModal from "./ExtraordinaryPaymentModal";
import api from "../../services/api";
import { useEffect, useState } from "react";

const ExtraordinaryPayment = () => {
  const [extraordinaryPayments, setExtraordinaryPayments] = useState<any[]>([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const fetchExtraordinaryPayment = () => {
    api.get("/finances/extraordinary-payment/").then((res) => {
      setExtraordinaryPayments(res.data.results || res.data);
    });
  };
  useEffect(()=>{
    fetchExtraordinaryPayment()
  },[])
  return (
    <Layout>
      <Heading mb={6}>Registro de pagos extraordinarios</Heading>
      <Box mb={6} display="flex" gap={4} flexWrap="wrap">
        <Button onClick={onOpen} colorScheme="red">
          Registrar pago extraordinario
        </Button>
      </Box>
      <Table>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Descripción</Th>
            <Th>Monto</Th>
            <Th>Fecha</Th>
            <Th>Categoría</Th>
            <Th>Documento</Th>
          </Tr>
        </Thead>
        <Tbody>
          {extraordinaryPayments.map((e) => (
            <Tr key={e.id}>
              <Td>{e.id}</Td>
              <Td>{e.description}</Td>
              <Td>${e.amount}</Td>
              <Td>{e.date}</Td>
              <Td>{e.category}</Td>
              <Td>
                {e.document_url ? (
                  <a
                    href={e.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver
                  </a>
                ) : (
                  "—"
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <ExtraordinaryPaymentModal
        isOpen={isOpen}
        onClose={onClose}
        onUpdated={fetchExtraordinaryPayment}
      />
    </Layout>
  );
};

export default ExtraordinaryPayment;
