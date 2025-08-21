import {
  Box,
  Button,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import Layout from "../../components/layout/Layout";
import { useEffect, useState } from "react";
import api from "../../services/api";
import CreateCondominiumModal from "./CreateCondominiumModal";
import CreateBlockModal from "./CreateBlockModal";
import { Condominium } from "../../types/condominium";
const CondominiumsPage = () => {
  const [condominiums, setCondominiums] = useState<Condominium[]>([]);
  const toast = useToast();
  const fetchCondominiums = async () => {
    try {
      const res = await api.get("/buildings/condominiums/");
      if (res && res.status === 200) {
        setCondominiums(res.data);
      }
    } catch (error: any) {
      console.error("Error fetching blocks:", error);
    }
  };
  const handleDelete = async (id: number) => {
    const confirm = window.confirm("¿Eliminar este bloque?");
    if (!confirm) return;
    try {
      await api.delete(`/buildings/condominiums/${id}/`);
      fetchCondominiums();
      toast({ title: "Condominio eliminado", status: "info", duration: 3000 });
    } catch {
      toast({
        title: "No se pudo eliminar el condominio",
        status: "error",
        duration: 3000,
      });
    }
  };
  useEffect(() => {
    fetchCondominiums();
  }, []);
  return (
    <Layout>
      <Heading mb={4}>Gestión de Condominios</Heading>
      <Box mb={4} display="flex" gap={4}>
        <CreateCondominiumModal onCreated={fetchCondominiums} />
      </Box>
      <Table>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Nombre</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {condominiums.map((c) => (
            <Tr key={c.id}>
              <Td>{c.id}</Td>
              <Td>Condominio-{c.name}</Td>
              <Td>
                <CreateBlockModal
                  condominium={c}
                />
                <Button
                  colorScheme="red"
                  size="sm"
                  marginLeft={4}
                  onClick={() => handleDelete(c.id)}
                >
                  Eliminar
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Layout>
  );
};

export default CondominiumsPage;
