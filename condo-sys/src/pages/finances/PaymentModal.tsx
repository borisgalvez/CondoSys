import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import { toast } from "react-toastify";
import { Invoice } from "../../types/invoice";

interface EditUserModalProps {
  invoiceSelected: Invoice
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export default function PaymentModal({
  invoiceSelected,
  isOpen,
  onClose,
  onUpdated,
}: EditUserModalProps) {
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = async (formdata: any) => {
    if (parseFloat(formdata.amount) > parseFloat(invoiceSelected.balance)) {
      toast.error("El monto es mayor al que se debe pagar");
      return;
    }
    const data = {
      invoice_id: invoiceSelected.id,
      amount: parseFloat(formdata.amount),
      date: new Date().toISOString().split("T")[0],
      reference: formdata.reference,
      confirmed: true,
    };
    try {
      await api.post("/finances/payments/", data);
      onUpdated();
      reset();
      onClose();
      toast.success('La cuota fue pagada con éxito')
    } catch (err: any) {
      toast.error(err.response.data[0])
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Pago de cuota de {invoiceSelected.amount}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Heading size="md">
              Monto a pagar {invoiceSelected.balance} pesos
            </Heading>
            <FormControl mb={3}>
              <FormLabel>Monto de pago</FormLabel>
              <NumberInput precision={2} step={1.0}>
                <NumberInputField {...register("amount")} />
              </NumberInput>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Referencia</FormLabel>
              <Input {...register("reference")} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="blue" mr={3}>
              Confirmar pago
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
