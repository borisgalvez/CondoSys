import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../../services/api";
import Layout from "../../components/layout/Layout";
import { Block } from "../../types/Block";
import { Apartment } from "../../types/apartmentTypes";

export default function ApartmentsPage() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [blockFilter, setBlockFilter] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
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
  const fetchApartments = async () => {
    try {
      const res = await api.get("/buildings/apartments/");
      if (res && res.status === 200) {
        setApartments(res.data);
      }
    } catch (error: any) {
      console.error("Error fetching apartments:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchApartments();
    fetchBlocks();
  }, []);
  const filtered = blockFilter ? apartments.filter((a) => a.block == blockFilter) : apartments;
  if (loading)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  return (
    <Layout>
      <Heading mb={4}>Apartamentos</Heading>
      <Box mb={4} display="flex" gap={4}>
        <Select placeholder="Filtrar por bloque" onChange={(e) => setBlockFilter(e.target.value)} maxW="300px">
          {blocks.map((block) => (
            <option key={block.id} value={block.name}>
              {block.name}
            </option>
          ))}
        </Select>
      </Box>
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
          {filtered.map((a) => (
            <Tr key={a.id}>
              <Td>{a.block}</Td>
              <Td>{a.number}</Td>
              <Td>{a.owner || "N/A"}</Td>
              <Td>{a.tenant || "N/A"}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Layout>
  );
}
