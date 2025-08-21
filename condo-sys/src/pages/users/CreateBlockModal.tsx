import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
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
import api from "../../services/api";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Block } from "../../types/Block";
import { errorMessageFormat } from "../../utils/errorMessages";
import { Condominium } from "../../types/condominium";
interface Props {
  condominium: Condominium;
}
interface FormData {
  name: string;
}
const CreateBlockModal: React.FC<Props> = ({
  condominium,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const [condominiumSelected, setCondominiumSelected]= useState<null|Condominium>(null)
  const [blocks, setBlocks] = useState<Block[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const openModal = () => {
    setCondominiumSelected(condominium);
    onOpen();
  };
  const closeModal = () => {
    onClose();
    setCondominiumSelected(null);
  };
  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post("/buildings/blocks/", {
        condominium: condominiumSelected,
        name: data.name,
      });
      if (res && res.status === 201) {
        toast.success("Bloque creado correctamente");
        fetchBlocks()
        reset();
        onClose();
      }
    } catch (error: any) {
      toast.error(`Error creando el condominio: ${errorMessageFormat(error)}`);
    }
  };
  const fetchBlocks = async () => {
    try {
      const res = await api.get("/buildings/blocks/");
      if (res && res.status === 200) {
        setBlocks(res.data);
      }
    } catch (error: any) {
      toast.error(`Error fetching blocks:, ${errorMessageFormat(error)}`);
    }
  };
  const blocksFiltered = blocks.filter(
    (b) => b.condominium === condominiumSelected?.id
  );
  useEffect(() => {
    fetchBlocks();
  }, []);
  return (
    <>
      <Button size="sm" onClick={openModal}>
        Agregar bloques
      </Button>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nuevo Bloque para el condominio {condominiumSelected?.name}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <FormControl mb={3} isInvalid={!!errors.name}>
                <FormLabel>Nombre del bloque</FormLabel>
                <Input
                  {...register("name", {
                    required: "Este campo es obligatorio",
                  })}
                />
                <FormErrorMessage>
                  {errors.name?.message as string}
                </FormErrorMessage>
              </FormControl>
              <Table>
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Nombre</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {blocksFiltered.map((b) => (
                    <Tr key={b.id}>
                      <Td>{b.id}</Td>
                      <Td>Bloque: {b.name}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" type="submit">
                Crear
              </Button>
              <Button onClick={onClose} ml={3}>
                Cancelar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateBlockModal;
