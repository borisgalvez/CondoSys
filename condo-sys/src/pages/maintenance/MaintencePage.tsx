import {
  Box,
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import Layout from "../../components/layout/Layout";
import { RepairPaymentForm } from "./MaintenceModal";
import { useEffect, useState } from "react";
import { RepairPayment, RepairPaymentFormData } from "../../types/RepairPayment";
import { createRepairPayment, fetchRepairPayments } from "../../services/repairPaymentService";
import { format, parseISO } from "date-fns";

const MaintencePage = () => {
  const [payments, setPayments] = useState<RepairPayment[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const loadPayments = async () => {
    try {
      const data = await fetchRepairPayments();
      console.log(data);
      setPayments(data);
    } catch (error) {
      console.error("Error al cargar pagos", error);
    }
  };
  const handleCreate = async (formData: RepairPaymentFormData) => {
    const newPayment = await createRepairPayment(formData);
    setPayments(prev => [newPayment, ...prev]);
  };
  useEffect(() => {
    loadPayments();
  }, []);
  return (
    <Layout>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Heading mb={4}>Mantenimientos y reparaciones realizadas</Heading>
        <Button colorScheme="blue" onClick={onOpen}>
          Nuevo Mantenimiento
        </Button>
      </Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Tipo de mantenimiento</Th>
            <Th>Bloque</Th>
            <Th>Descripcion</Th>
            <Th>Duracion</Th>
            <Th>Gasto mantención</Th>
          </Tr>
        </Thead>
        <Tbody>
          {payments.map((paymentRepair) => (
            <Tr key={paymentRepair.id}>
              <Td>{paymentRepair.repair_type}</Td>
              <Td>{paymentRepair.cost}</Td>
              <Td>
                {paymentRepair.paid_by_user?.username || 'Desconocido'}
              </Td>
              <Td>
                {paymentRepair.apartment}
              </Td>
              <Td>
                {format(parseISO(paymentRepair.payment_date), 'dd/MM/yyyy')}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Registrar Pago</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RepairPaymentForm onSubmit={handleCreate} onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Layout>
  );
};

export default MaintencePage;
