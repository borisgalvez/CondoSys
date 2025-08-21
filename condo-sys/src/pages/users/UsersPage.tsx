// src/pages/users/UsersPage.tsx (actualizado para gestión de perfiles)
import {
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Badge,
  Button,
  useDisclosure,
  Box,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@chakra-ui/react";
import api from "../../services/api";
import Layout from "../../components/layout/Layout";
import EditUserModal from "./EditUserModal";
import CreateUserModal from "./CreateUserModal";
import { User } from "../../types/user";
import { showUserActions } from "../../utils/handleErrorDeleteUser";

export default function UsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const {
    isOpen: isOpenCreateUser,
    onOpen: onOpenCreateUser,
    onClose: onCloseCreateUser,
  } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenAlert,
    onOpen: onOpenAlert,
    onClose: onCloseAlert,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users/");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este usuario?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/users/${id}/`);
      toast({
        title: "Usuario eliminado",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Refrescar la lista
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      if (error.status === 423) {
        console.log(error.response.data.details.relations);

        setErrorMessage(showUserActions(error.response.data.details.relations));
        onOpenAlert();
      } else {
        toast({
          title: "Error al eliminar",
          description: "No se pudo eliminar el usuario.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  if (loading) return <Spinner size="xl" />;

  const roleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge colorScheme="purple">Admin</Badge>;
      case "secretary":
        return <Badge colorScheme="blue">Secretaria</Badge>;
      case "receptionist":
        return <Badge colorScheme="gray">Recepcionista</Badge>;
      case "owner":
        return <Badge colorScheme="blue">Propietario</Badge>;
      case "tenant":
        return <Badge colorScheme="gray">Inquilino</Badge>;
      default:
        return role;
    }
  };

  return (
    <Layout>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Heading mb={4}>Gestión de Usuarios</Heading>
        <Button colorScheme="blue" onClick={onOpenCreateUser}>
          Nuevo Usuario
        </Button>
      </Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Usuario</Th>
            <Th>Email</Th>
            <Th>Rol</Th>
            <Th>Teléfono</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((u) => (
            <Tr key={u.id}>
              <Td>{u.username}</Td>
              <Td>{u.email}</Td>
              <Td>{roleLabel(u.role)}</Td>
              <Td>{u.phone || "N/A"}</Td>
              <Td>
                <Button
                  size="sm"
                  colorScheme="blue"
                  mr={2}
                  onClick={() => handleEdit(u)}
                >
                  Editar
                </Button>

                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  onClick={() => handleDelete(u.id)}
                >
                  Eliminar
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <CreateUserModal
        isOpen={isOpenCreateUser}
        onClose={onCloseCreateUser}
        onUpdated={fetchUsers}
      />
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          isOpen={isOpen}
          onClose={onClose}
          onUpdated={fetchUsers}
        />
      )}
      <AlertDialog
        isOpen={isOpenAlert}
        leastDestructiveRef={cancelRef}
        onClose={onCloseAlert}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Este usuario realizo acciones
            </AlertDialogHeader>
            <AlertDialogBody>{errorMessage}</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseAlert}>
                Cerrar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Layout>
  );
}
