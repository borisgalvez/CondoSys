import {
  Box,
  Button,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ElectricityModal from "./ElectricityModal";
import { fetchApartments } from "../../services/apartmentService";
import { Apartment } from "../../types/apartmentTypes";
import Layout from "../../components/layout/Layout";
import { Block } from "../../types/Block";
import { fetchBlocks } from "../../services/blockService";

export default function ElectricityPage() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [blockId, setBlockId] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const getBlocks = async () => {
    try {
      const data = await fetchBlocks();
      setBlocks(data);
    } catch (error) {
      console.error("Error fetching apartments", error);
    }
  };
  const loadApartments = async () => {
    try {
      const data = await fetchApartments();
      setApartments(data);
    } catch (error) {
      console.error("Error fetching apartments", error);
    }
  };
  useEffect(() => {
    getBlocks();
    loadApartments();
  }, []);

  const filteredApartments = blockId
    ? apartments.filter((apt) => apt.block_id === blockId)
    : [];

  const handleSelectBlock = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = parseInt(e.target.value);
    setBlockId(selected);
  };

  return (
    <Layout>
      <Box p={4}>
        <Select
          placeholder="Selecciona un bloque"
          onChange={handleSelectBlock}
          mb={4}
        >
          {blocks.map((block) => (
            <option key={block.id} value={block.id}>
              Bloque {block.name}
            </option>
          ))}
        </Select>

        <Table>
          <Thead>
            <Tr>
              <Th>Apartamento</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredApartments.map((apt) => (
              <Tr key={apt.id}>
                <Td>{apt.number}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {filteredApartments.length > 0 && (
          <Button onClick={onOpen} mt={4} colorScheme="blue">
            Registrar Electricidad
          </Button>
        )}

        <ElectricityModal
          isOpen={isOpen}
          onClose={onClose}
          apartments={filteredApartments}
        />
      </Box>
    </Layout>
  );
}
