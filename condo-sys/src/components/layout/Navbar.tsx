// src/components/layout/Navbar.tsx
import { Flex, Box, Spacer, Button, Text } from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";
import NotificationBell from "../notifications/NotificationBell";
import { UserRole } from "../../types/roles";

export default function Navbar() {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };
  const { user } = useAuth();
  const viewAllowedRoles = (allowedRoles: string[]) => {
    return allowedRoles.includes(
      user ? user : localStorage.getItem("role") + ""
    );
  };
  return (
    <Flex as="nav" bg="white" boxShadow="md" p={4} alignItems="center">
      <Box>
        <Text fontWeight="bold">Panel de Administración</Text>
      </Box>
      <Spacer />
      {viewAllowedRoles([UserRole.PROPIETARIO, UserRole.INQUILINO]) && (
        <NotificationBell />
      )}
      <Button colorScheme="red" onClick={handleLogout}>
        Cerrar Sesión
      </Button>
    </Flex>
  );
}
