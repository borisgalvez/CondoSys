import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import { GasReading } from "../../types/gas";
import { errorMessageFormat } from "../../utils/errorMessages";
interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
	meter: GasReading;
}
const HistoricGasPaymentModal = ({
  isOpen,
  onClose,
  onUpdated,
	meter,
}: ExpenseModalProps) => {
  const { handleSubmit, reset } = useForm();
	const toast=useToast()
	const onSubmit = async () => {
    const data = {
      is_paid: true,
    };
    try {
      await api.patch(`/buildings/gas-readings/${meter.id}/`, data);
      onUpdated();
      reset();
      onClose();
      toast({
        title: "Pago del gas registrado",
        status: "success",
        duration: 3000,
      });
    } catch (err: any) {
      toast({
        title: "Error al registrar el pago del gas",
        description: errorMessageFormat(err),
        status: "error",
        duration: 3000,
      });
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirmar pago de la cuota de gas</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            ¿Deseas realizar el pago? Una vez confirmado indicas que se pago la cuota de {meter.total} $
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="blue" mr={3}>
              Registrar pago de la cuota de gas
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default HistoricGasPaymentModal;
