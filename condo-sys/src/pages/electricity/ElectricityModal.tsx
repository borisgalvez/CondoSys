import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Apartment } from "../../types/apartmentTypes";
import {
  DistributionType,
  ElectricityPaymentRequest,
} from "../../types/electricity";
import { createElectricityPayment } from "../../services/electricityService";
import { errorMessageFormat } from "../../utils/errorMessages";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  apartments: Apartment[];
}

export default function ElectricityModal({
  isOpen,
  onClose,
  apartments,
}: Props) {
  const toast = useToast();
  const [distributionType, setDistributionType] =
    useState<DistributionType>("proportional");
  const [amounts, setAmounts] = useState<Record<number, number>>({});
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calcular total sumando todos los amounts
  const totalAmount = Object.values(amounts).reduce((a, b) => a + b, 0);

  // Cuando cambia el tipo de distribución, si es equal, distribuimos igual el total
  useEffect(() => {
    if (distributionType === "equal") {
      const equalValue = totalAmount / apartments.length || 0;
      const newAmounts: Record<number, number> = {};
      apartments.forEach((apt) => {
        newAmounts[apt.id] = parseFloat(equalValue.toFixed(2));
      });
      setAmounts(newAmounts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distributionType, apartments.length]);

  const handleAmountChange = (apartmentId: number, value: string) => {
    const val = parseFloat(value);
    setAmounts((prev) => ({
      ...prev,
      [apartmentId]: isNaN(val) ? 0 : val,
    }));
  };

  const handleSave = async () => {
    const details = Object.entries(amounts)
      .filter(([, val]) => val > 0)
      .map(([aptId, val]) => ({
        apartment_id: Number(aptId),
        amount: val,
      }));

    if (details.length === 0) {
      toast({
        title: "Error",
        description: "Debe ingresar al menos un monto",
        status: "error",
      });
      return;
    }

    const paymentData: ElectricityPaymentRequest = {
      amount: totalAmount,
      distribution_type: distributionType,
      description,
      payment_date_registered: new Date().toISOString().slice(0, 10),
      //paid_person: 1, // TODO: reemplazar con id de usuario real (del contexto o auth)
      details,
    };
    setIsSubmitting(true)
    try {
      await createElectricityPayment(paymentData);
      toast({
        title: "Guardado",
        description: "Pago registrado correctamente",
        status: "success",
      });
      setAmounts({});
      setDescription("");
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: errorMessageFormat(error),
        status: "error",
      });
    } finally {
      setIsSubmitting(false)
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Registrar pago electricidad</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Tipo de distribución</FormLabel>
            <Select
              value={distributionType}
              onChange={(e) =>
                setDistributionType(e.target.value as DistributionType)
              }
            >
              <option value="proportional">Proporcional</option>
              <option value="equal">Equitativo</option>
            </Select>
          </FormControl>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Apartamento</Th>
                <Th>Monto</Th>
              </Tr>
            </Thead>
            <Tbody>
              {apartments.map((apt) => (
                <Tr key={apt.id}>
                  <Td>{apt.number}</Td>
                  <Td>
                    <Input
                      type="number"
                      step="0.01"
                      value={amounts[apt.id] ?? ""}
                      onChange={(e) =>
                        handleAmountChange(apt.id, e.target.value)
                      }
                      disabled={distributionType === "equal"}
                      min={0}
                    />
                  </Td>
                </Tr>
              ))}
              <Tr>
                <Td fontWeight="bold">Total</Td>
                <Td fontWeight="bold">{totalAmount.toFixed(2)}</Td>
              </Tr>
            </Tbody>
          </Table>
          <FormControl mb={4}>
            <FormLabel>Descripción (opcional)</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSave} mr={3} isLoading={isSubmitting}>
            Guardar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
