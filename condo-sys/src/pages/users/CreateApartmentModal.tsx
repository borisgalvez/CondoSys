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
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { Block } from "../../types/Block";
import { useEffect, useState } from "react";
import { Apartment } from "../../types/apartmentTypes";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import { toast } from "react-toastify";
import { errorMessageFormat } from "../../utils/errorMessages";
interface Props {
  block: Block;
}
const CreateApartmentModal: React.FC<Props> = ({
  block,
}) => {
	const [blockSelected,setBlockSelected] = useState<null|Block>(null)
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [users, setUsers] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const openModal = () => {
    setBlockSelected(block);
    onOpen();
  };
  const fetchUsers = async () => {
    try {
      const response = await api.get("/users/");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
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
  const closeModal = () => {
    onClose();
    setBlockSelected(null);
  };
  const onSubmit = async (data: any) => {
    try {
      const res = await api.post("/buildings/apartments/", {
        ...data,
        block: blockSelected?.id,
      });
      if (res && res.status === 201) {
        fetchApartments();
        reset();
        onClose();
      }
    } catch (error: any) {
      toast.error(`Error al crear apartamento: ${errorMessageFormat(error)}`);
    }
  };
	const filteredApartments = [...apartments].filter((a)=>a.block_id===blockSelected?.id)
  useEffect(() => {
    fetchApartments();
    fetchUsers();
  }, []);
  return (
    <>
      <Button size="sm" onClick={openModal}>
        Agregar apartamentos
      </Button>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nuevo Apartamento para el bloque: {blockSelected?.name}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <FormControl mb={3}>
                <FormLabel>Número</FormLabel>
                <Input {...register("number")} required />
              </FormControl>
              <FormControl mb={3}>
                <FormLabel>Propietario</FormLabel>
                <Select {...register("owner")}>
                  <option value="">Ninguno</option>
                  {users.map((u: any) => (
                    <option key={u.id} value={u.username}>
                      {u.username}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl mb={3}>
                <FormLabel>Inquilino</FormLabel>
                <Select {...register("tenant")}>
                  <option value="">Ninguno</option>
                  {users.map((u: any) => (
                    <option key={u.id} value={u.username}>
                      {u.username}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Bloque</Th>
                    <Th>Número</Th>
                    <Th>Propietario</Th>
                    <Th>Inquilino</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredApartments.map((a) => (
                    <Tr key={a.id}>
                      <Td>{a.block}</Td>
                      <Td>{a.number}</Td>
                      <Td>{a.owner || "N/A"}</Td>
                      <Td>{a.tenant || "N/A"}</Td>
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

export default CreateApartmentModal;
