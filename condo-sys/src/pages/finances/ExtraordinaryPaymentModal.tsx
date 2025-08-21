import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Block } from "../../types/Block";
import api from "../../services/api";
import { Apartment } from "../../types/apartmentTypes";
interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}
const ExtraordinaryPaymentModal = ({
  isOpen,
  onClose,
  onUpdated,
}: ExpenseModalProps) => {
  const { register, handleSubmit, reset } = useForm();
  const toast = useToast();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [blockFilter, setBlockFilter] = useState("");
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [apartmentsFiltered, setApartmentsFiltered] = useState<Apartment[]>([]);
  const fetchBlocks = async () => {
    try {
      const res = await api.get("/buildings/blocks/");
      if (res && res.status === 200) {
        setBlocks(res.data);
      }
    } catch (error: any) {
      console.error("Error fetching blocks:", error);
    }
  };
  useEffect(() => {
    fetchBlocks();
  }, []);
  const fetchApartments = async () => {
    try {
      const res = await api.get("/buildings/apartments/");
      if (res && res.status === 200) {
        setApartments(res.data);
      }
    } catch (error: any) {
      console.error("Error fetching apartments:", error);
    }
  };
  useEffect(() => {
    fetchApartments();
  }, []);
  const onSubmit = async (formdata: any) => {
    const data = {
      description: formdata.description,
      block: Number(blockFilter),
      apartment: Number(formdata.apartment),
      amount: parseFloat(formdata.amount),
      date: formdata.date,
      category: formdata.category,
      document_url: formdata.document_url,
    };
    console.log(data);

    try {
      await api.post("/finances/extraordinary-payment/", data);
      onUpdated();
      reset();
      onClose();
      toast({
        title: "Pago extraordinario registrado",
        status: "success",
        duration: 3000,
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error al registrar el pago extraordinario",
        status: "error",
        duration: 3000,
      });
    }
  };
  useEffect(() => {
    const filtered = apartments.filter(
      (apt) => blockFilter === "" || Number(blockFilter) === apt.block_id
    );
    setApartmentsFiltered(filtered);
  }, [apartments, blockFilter]);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Registrar pago extraordinario</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Categoría</FormLabel>
              <Select
                placeholder="Categoría"
                {...register("category")}
                disabled
              >
                <option value="extraordinary_payment" selected>
                  Pago extraordinario
                </option>
              </Select>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Descripción</FormLabel>
              <Input {...register("description")} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Monto del pago extraordinario</FormLabel>
              <NumberInput precision={2} step={1.0}>
                <NumberInputField {...register("amount")} />
              </NumberInput>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Fecha del pago extraordinario</FormLabel>
              <Input type="date" {...register("date")} />
            </FormControl>
            <FormLabel>Bloque</FormLabel>
            <Select
              placeholder="Seleccionar bloque"
              onChange={(e) => setBlockFilter(e.target.value)}
              mb={3}
            >
              {blocks.map((block) => (
                <option key={block.id} value={block.id}>
                  {block.name}
                </option>
              ))}
            </Select>
            <FormControl mb={3}>
              <FormLabel>Apartamento</FormLabel>
              <Select
                {...register("apartment")}
                required
                placeholder="Seleccionar apartamento"
              >
                {apartmentsFiltered.map((a) => (
                  <option key={a.id} value={a.id}>{`Apt. ${a.number}`}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Documento</FormLabel>
              <Input
                {...register("document_url")}
                placeholder="URL documento (opcional)"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="blue" mr={3}>
              Registrar pago extraordinario
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ExtraordinaryPaymentModal;
