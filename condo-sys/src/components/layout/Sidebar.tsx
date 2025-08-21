import {
  Box,
  VStack,
  Link,
  Text,
  Icon,
  Divider,
  Heading,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiGrid,
  FiTool,
  FiDollarSign,
  FiFileText,
  FiActivity,
} from "react-icons/fi";
import { IoMdSettings } from "react-icons/io";
import { useAuth } from "../../hooks/useAuth";
import { UserRole } from "../../types/roles";

const SidebarItem = ({ icon, to, label }: any) => (
  <Link
    as={NavLink}
    to={to}
    style={{ width: "100%" }}
    _hover={{ textDecoration: "none" }}
  >
    <Box
      display="flex"
      alignItems="center"
      gap={3}
      px={4}
      py={2}
      _hover={{ bg: "gray.100" }}
      borderRadius="md"
      fontWeight="medium"
    >
      <Icon as={icon} boxSize={5} />
      <Text>{label}</Text>
    </Box>
  </Link>
);

export default function Sidebar() {
  const { user } = useAuth();
  const viewAllowedRoles = (allowedRoles: string[]) => {
    return allowedRoles.includes(
      user ? user : localStorage.getItem("role") + ""
    );
  };
  return (
    <Box
      w="260px"
      h="100vh"
      bg="gray.50"
      p={4}
      borderRight="1px solid #eee"
      overflowY="auto"
    >
      <Heading fontSize="lg" mb={4}>
        CondoSys
      </Heading>

      <VStack align="stretch" spacing={1}>
        {viewAllowedRoles([
          UserRole.SUPERADMIN,
          UserRole.ADMIN,
          UserRole.SECRETARIA,
          UserRole.RECEPCIONISTA,
          UserRole.PROPIETARIO,
          UserRole.INQUILINO,
        ]) && <SidebarItem icon={FiHome} to="/dashboard" label="Inicio" />}
        {viewAllowedRoles([UserRole.SUPERADMIN, UserRole.ADMIN]) && (
          <SidebarItem icon={FiUsers} to="/usuarios" label="Usuarios" />
        )}
        {viewAllowedRoles([UserRole.SUPERADMIN, UserRole.ADMIN]) && (
          <SidebarItem
            icon={IoMdSettings}
            to="/settings"
            label="Configuración"
          />
        )}
        {viewAllowedRoles([UserRole.SUPERADMIN, UserRole.ADMIN]) && (
          <SidebarItem
            icon={IoMdSettings}
            to="/admin/notifications"
            label="Notificaciones"
          />
        )}
        {viewAllowedRoles([
          UserRole.SUPERADMIN,
          UserRole.ADMIN,
          UserRole.RECEPCIONISTA,
          UserRole.PROPIETARIO,
          UserRole.INQUILINO,
        ]) && (
          <SidebarItem
            icon={IoMdSettings}
            to="/transactions/history"
            label="Historial"
          />
        )}
      </VStack>
      {viewAllowedRoles([
        UserRole.SUPERADMIN,
        UserRole.ADMIN,
        UserRole.RECEPCIONISTA,
        UserRole.PROPIETARIO,
        UserRole.INQUILINO,
      ]) && (
        <>
          <Divider my={4} />
          <Text fontSize="sm" px={2} mb={1} color="gray.500">
            Edificio
          </Text>
        </>
      )}
      <VStack align="stretch" spacing={1}>
        {viewAllowedRoles([UserRole.SUPERADMIN, UserRole.ADMIN]) && (
          <SidebarItem icon={FiGrid} to="/condominios" label="Condominios" />
        )}
        {viewAllowedRoles([
          UserRole.SUPERADMIN,
          UserRole.ADMIN,
          UserRole.RECEPCIONISTA,
          UserRole.PROPIETARIO,
          UserRole.INQUILINO,
        ]) && <SidebarItem icon={FiGrid} to="/bloques" label="Bloques" />}
        {viewAllowedRoles([
          UserRole.SUPERADMIN,
          UserRole.ADMIN,
          UserRole.RECEPCIONISTA,
          UserRole.PROPIETARIO,
          UserRole.INQUILINO,
        ]) && (
          <SidebarItem icon={FiGrid} to="/apartamentos" label="Apartamentos" />
        )}
        {viewAllowedRoles([
          UserRole.SUPERADMIN,
          UserRole.ADMIN,
          UserRole.RECEPCIONISTA,
          UserRole.PROPIETARIO,
          UserRole.INQUILINO,
        ]) && (
          <SidebarItem icon={FiTool} to="/medidores" label="Medidores de Gas" />
        )}
        {viewAllowedRoles([
          UserRole.SUPERADMIN,
          UserRole.ADMIN,
          UserRole.SECRETARIA,
          UserRole.PROPIETARIO,
          UserRole.INQUILINO,
        ]) && (
          <SidebarItem
            icon={FiTool}
            to="/consumo/electricidad"
            label="Consumo Electricidad"
          />
        )}
      </VStack>

      {viewAllowedRoles([
        UserRole.SUPERADMIN,
        UserRole.ADMIN,
        UserRole.SECRETARIA,
      ]) && (
        <>
          <Divider my={4} />
          <Text fontSize="sm" px={2} mb={1} color="gray.500">
            Finanzas
          </Text>
        </>
      )}
      <VStack align="stretch" spacing={1}>
        {viewAllowedRoles([
          UserRole.SUPERADMIN,
          UserRole.ADMIN,
          UserRole.SECRETARIA,
        ]) && (
          <SidebarItem
            icon={FiDollarSign}
            to="/finanzas/dashboard"
            label="Resumen"
          />
        )}
        {viewAllowedRoles([
          UserRole.SUPERADMIN,
          UserRole.ADMIN,
          UserRole.SECRETARIA,
        ]) && (
          <SidebarItem icon={FiFileText} to="/finanzas/cuotas" label="Cuotas" />
        )}
        {viewAllowedRoles([
          UserRole.SUPERADMIN,
          UserRole.ADMIN,
          UserRole.SECRETARIA,
        ]) && (
          <SidebarItem
            icon={FiActivity}
            to="/finanzas/pagos-egresos"
            label="Pagos y egresos"
          />
        )}
        {viewAllowedRoles([
          UserRole.SUPERADMIN,
          UserRole.ADMIN,
          UserRole.SECRETARIA,
        ]) && (
          <SidebarItem
            icon={FiActivity}
            to="/finanzas/pagos-gas/historicos"
            label="Pagos de gas"
          />
        )}
        {viewAllowedRoles([
          UserRole.SUPERADMIN,
          UserRole.ADMIN,
          UserRole.SECRETARIA,
        ]) && (
          <SidebarItem
            icon={FiActivity}
            to="/finanzas/pagos-electricidad/historicos"
            label="Pagos de electricidad"
          />
        )}
        {viewAllowedRoles([
          UserRole.SUPERADMIN,
          UserRole.ADMIN,
          UserRole.SECRETARIA,
        ]) && (
          <SidebarItem
            icon={FiTool}
            to="/mantenimiento"
            label="Mantenimiento"
          />
        )}
        {viewAllowedRoles([
          UserRole.SUPERADMIN,
          UserRole.ADMIN,
          UserRole.SECRETARIA,
        ]) && (
          <SidebarItem
            icon={FiTool}
            to="/pago-empleados"
            label="Nómina de pagos"
          />
        )}
        {viewAllowedRoles([
          UserRole.SUPERADMIN,
          UserRole.ADMIN,
          UserRole.SECRETARIA,
        ]) && (
          <SidebarItem
            icon={FiTool}
            to="/finanzas/egresos/pago-extraordinario"
            label="Pago Extraordinario"
          />
        )}
      </VStack>
    </Box>
  );
}
