import Layout from "../../components/layout/Layout";
import {
  Table, Thead, Tbody, Tr, Th, Td,
  Button, Box, Text, useToast,
  Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalFooter,
  ModalCloseButton, useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { ElectricityDetail } from "../../types/electricity";
import { useEffect, useState } from "react";
import { fetchElectricityPaymentsDetail, payElectricityDetail } from "../../services/electricityService";

const ElectricityDetailPayment = () => {
  const [payments, setPayments] = useState<ElectricityDetail[]>([]);
  const [selectedPayment, setSelectedPayment] =
    useState<ElectricityDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    loadPayments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const data = await fetchElectricityPaymentsDetail();
      setPayments(data);
    } catch {
      toast({
        title: "Error al cargar pagos",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const openPayModal = (payment: ElectricityDetail) => {
    setSelectedPayment(payment);
    onOpen();
  };

  const handleConfirmPay = async () => {
    if (!selectedPayment) return;
    setPaying(true);
    try {
      await payElectricityDetail(selectedPayment.id);
      toast({
        title: "Pago registrado",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      setSelectedPayment(null);
      loadPayments();
    } catch (error: any) {
			console.log(error);
			
      toast({
        title: "Error al pagar",
        description: error.response?.data?.error || "Error inesperado",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setPaying(false);
    }
  };

  return (
    <Layout>
      <Box p={4}>
        <Text fontSize="2xl" mb={4}>
          Pagos de Electricidad
        </Text>
        {loading ? (
          <Spinner />
        ) : (
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Monto</Th>
                <Th>Registrado por</Th>
                <Th>Pagado por</Th>
                <Th>Fecha</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {payments.map((p) => (
                <Tr key={p.id}>
                  <Td>{p.id}</Td>
                  <Td>{p.amount}</Td>
                  <Td>
                    {p.payment_record}
                  </Td>
                  <Td>
                    {p.paid_person}
                  </Td>
                  <Td>{new Date(p.created_at).toLocaleDateString()}</Td>
                  <Td>
                    {!p.paid_person ? (
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => openPayModal(p)}
                      >
                        Pagar
                      </Button>
                    ) : (
                      <Text color="green.500" fontWeight="bold">
                        Pagado
                      </Text>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirmar Pago</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              ¿Quieres marcar como pagado el detalle ID {selectedPayment?.id}?
            </ModalBody>

            <ModalFooter>
              <Button onClick={onClose} mr={3} isDisabled={paying}>
                Cancelar
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleConfirmPay}
                isLoading={paying}
              >
                Confirmar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Layout>
  );
};

export default ElectricityDetailPayment;
