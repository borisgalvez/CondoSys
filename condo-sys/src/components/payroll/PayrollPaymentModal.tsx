import {
	Box,
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useToggle } from "../../hooks/useToogle";
import PayrollForm from "./PayrollPaymentForm";
import { createPayrollPayment } from "../../services/payrollService";
import { toast } from "react-toastify";
import { errorMessageFormat } from "../../utils/errorMessages";

interface PayrollPaymentModalProps {
  fetchPayment: () => void;
}
const PayrollPaymentModal: React.FC<PayrollPaymentModalProps> = ({
  fetchPayment,
}) => {
  const { state: isOpen, open, close } = useToggle(false);
  const handleSubmit = async (data: any) => {
    try {
      await createPayrollPayment(data);
      fetchPayment();
      toast.success("Pago de empleado registrado con éxito");
    } catch (err: any) {
      toast.error(`No se pudo registrar el pago ${errorMessageFormat(err)}`);
    }
  };
  return (
    <Box mb={6} display="flex" gap={4} flexWrap="wrap">
      <Button onClick={open} colorScheme="red">
        Registrar nuevo pago
      </Button>
      <Modal isOpen={isOpen} onClose={close}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Registrar nuevo pago</ModalHeader>
          <ModalCloseButton />
          <PayrollForm onSubmit={handleSubmit} onClose={close} />
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PayrollPaymentModal;
