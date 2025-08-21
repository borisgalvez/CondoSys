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
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import api from "../../services/api";

interface EditUserModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditUserModal({
  user,
  isOpen,
  onClose,
  onUpdated,
}: EditUserModalProps) {
  const { register, handleSubmit, reset, formState: {isSubmitting} } = useForm();

  useEffect(() => {
    if (user) reset(user);
  }, [user, reset]);

  const onSubmit = async (formdata: any) => {
    try {
      let data = {};
      for (const key in formdata) {
        if (
          formdata[key] != "" &&
          formdata[key] != undefined &&
          formdata[key] != null
        ) {
          data = { [key]: formdata[key], ...data };
        }
      }
      const userUpdated = await api.put(`/users/${user.id}/`, data);
      console.log(userUpdated);
      onUpdated();
      onClose();
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Usuario</ModalHeader>
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
