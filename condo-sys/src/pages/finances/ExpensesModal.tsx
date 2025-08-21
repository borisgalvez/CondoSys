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
  NumberInput,
  NumberInputField,
  useToast,
  Select,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import { Block } from "../../types/Block";
import { useEffect, useState } from "react";

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export default function ExpenseModal({
  isOpen,
  onClose,
  onUpdated,
}: ExpenseModalProps) {
  const { register, handleSubmit, reset } = useForm();
  const toast = useToast();
  const [blocks, setBlocks] = useState<Block[]>([]);
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
  const onSubmit = async (formdata: any) => {
    const data = {
      description: formdata.description,
      block: parseInt(formdata.block_id),
      amount: parseFloat(formdata.amount),
      date: formdata.date,
      category: formdata.category,
      document_url: formdata.document_url,
    };
    try {
      console.log(data);
      
      await api.post("/finances/expenses/", data);
      onUpdated();
      reset();
      onClose();
      toast({
        title: "Egreso registrado",
        status: "success",
        duration: 3000,
      });
    } catch (err: any) {
      toast({
        title: "Error al registrar egreso",
        description: err,
        status: "error",
        duration: 3000,
      });
    }
  };
  useEffect(()=>{
    fetchBlocks()
  },[])
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Registrar egreso</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Descripción</FormLabel>
              <Input {...register("description")} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Monto del egreso</FormLabel>
              <NumberInput precision={2} step={1.0}>
                <NumberInputField {...register("amount")} />
              </NumberInput>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Fecha del egreso</FormLabel>
              <Input type="date" {...register("date")} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Categoría</FormLabel>
              <Select placeholder="Categoría" {...register("category")}>
                <option value="agua">Agua</option>
                <option value="electricidad">Electricidad</option>
                <option value="seguridad">Seguridad</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="reparaciones">Reparaciones</option>
                <option value="extraordinary_payment">Pago extraordinario</option>
                <option value="otros">Otros</option>
              </Select>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Bloque</FormLabel>
              <Select placeholder="Seleccionar bloque" {...register("block_id")}>
                {blocks.map((block) => (
                  <option key={block.id} value={block.id}>
                    {block.name}
                  </option>
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
              Registrar egreso
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
