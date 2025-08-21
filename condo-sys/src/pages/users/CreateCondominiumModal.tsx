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
  useDisclosure,
} from "@chakra-ui/react";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
interface Props {
  onCreated: () => void;
}
const CreateCondominiumModal: React.FC<Props> = ({ onCreated }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onSubmit = async (data: any) => {
    try {
      const res = await api.post("/buildings/condominiums/", data);
      if (res && res.status === 201) {
        onCreated();
        reset();
        onClose();
      }
    } catch (error: any) {
      toast.error(`Error creando el condominio`);
      console.error("Error creating condominium:", error);
    }
  };
  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Agregar condominio
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nuevo Condominio</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <FormControl mb={3} isInvalid={!!errors.name}>
                <FormLabel>Nombre del condominio</FormLabel>
                <Input
                  {...register("name", {
                    required: "Este campo es obligatorio",
                  })}
                />
                <FormErrorMessage>{errors.name?.message as string}</FormErrorMessage>
              </FormControl>
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

export default CreateCondominiumModal;
