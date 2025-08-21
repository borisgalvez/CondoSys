// src/pages/users/BlocksPage.tsx
import { Heading, Table, Thead, Tbody, Tr, Th, Td, Button, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../../services/api";
import Layout from "../../components/layout/Layout";
import { Block } from "../../types/Block";
import CreateApartmentModal from "./CreateApartmentModal";

export default function BlocksPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const toast = useToast();

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

  useEffect(() => {
    fetchBlocks();
  }, []);

  const handleDelete = async (id: number) => {
    const confirm = window.confirm("¿Eliminar este bloque?");
    if (!confirm) return;
    try {
      await api.delete(`/buildings/blocks/${id}/`);
      fetchBlocks();
      toast({ title: "Bloque eliminado", status: "info", duration: 3000 });
    } catch {
      toast({ title: "No se pudo eliminar el bloque", status: "error", duration: 3000 });
    }
  };

  return (
    <Layout>
      <Heading mb={4}>Gestión de Bloques</Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Nombre</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {blocks.map((b) => (
            <Tr key={b.id}>
              <Td>{b.id}</Td>
              <Td>{b.name}</Td>
              <Td>
                <CreateApartmentModal block={b} />
                <Button colorScheme="red" size="sm" marginLeft={4} onClick={() => handleDelete(b.id)}>
                  Eliminar
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Layout>
  );
}
