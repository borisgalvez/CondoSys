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
  Select,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import { handleErrorAxios } from "../../utils/handleErrors";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export default function CreateUserModal({
  isOpen,
  onClose,
  onUpdated,
}: EditUserModalProps) {
  const { register, handleSubmit, reset, formState: {isSubmitting} } = useForm();
  const toast = useToast();

  const onSubmit = async (data: any) => {
    try {
      await api.post("/users/", data);
      onUpdated();
      onClose();
      reset();
    } catch (err: any) {
      toast({
        title: "Error",
        description: handleErrorAxios(err),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Crear Usuario</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Nombre de usuario</FormLabel>
              <Input {...register("username")} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Contraseña del usuario</FormLabel>
              <Input type="password" {...register("password")} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Email</FormLabel>
              <Input type="email" {...register("email")} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Teléfono</FormLabel>
              <Input {...register("phone")} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Rol</FormLabel>
              <Select {...register("role")}>
                <option value="admin">Administrador</option>
                <option value="secretary">Secretaria</option>
                <option value="receptionist">Recepcionista</option>
                <option value="owner">Propietario</option>
                <option value="tenant">Inquilino</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="blue" mr={3} isLoading={isSubmitting}>
              Guardar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
