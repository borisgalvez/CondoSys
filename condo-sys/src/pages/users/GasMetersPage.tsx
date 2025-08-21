// src/pages/users/GasMetersPage.tsx
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../../services/api";
import Layout from "../../components/layout/Layout";
import GasMeterFormModal from "../../components/buildings/GasMeterFormModal";
import GasReadingModal from "../../components/buildings/GasReadingModal";
import { ApartmentsGasStatus, GasMeter } from "../../types/gas";

export default function GasMetersPage() {
  const [meters, setMeters] = useState<ApartmentsGasStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMeter, setSelectedMeter] = useState<GasMeter | null>(null);
  const {
    isOpen: isReadingOpen,
    onOpen: onReadingOpen,
    onClose: onReadingClose,
  } = useDisclosure();

  const fetchMeters = async () => {
    try {
      const res = await api.get("/buildings/gas-meters/apartments_status");
      setMeters(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeters();
  }, []);
  console.log(meters);

  if (loading) return <Spinner size="xl" />;

  return (
    <Layout>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Heading>Medidores de Gas</Heading>
        {/* <Button colorScheme="blue" onClick={onOpen}>
          Nuevo Medidor
        </Button> */}
      </Box>
      <Table>
        <Thead>
          <Tr>
            <Th>Apartamento</Th>
            <Th>Serial</Th>
            <Th>Instalado</Th>
            <Th>Última Lectura</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {meters?.with_meter.map((m) => (
            <Tr key={m.gas_meter.id}>
              <Td>
                Apartamento: {m.apartment.number} del Bloque:{" "}
                {m.apartment.block}
              </Td>
              <Td>{m.gas_meter.serial_number}</Td>
              <Td>{m.gas_meter.installed_at}</Td>
              <Td>
                {m.gas_meter.readings.length > 0
                  ? `${m.gas_meter.readings[0].value_m3} m³ el ${m.gas_meter.readings[0].date}`
                  : "Sin lecturas"}
              </Td>
              <Td>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedMeter(m.gas_meter);
                    onReadingOpen();
                  }}
                >
                  Ver Lecturas
                </Button>
              </Td>
            </Tr>
          ))}
          {meters?.without_meter.map((m) => (
            <Tr key={m.apartment.id}>
              <Td>
                Apartamento: {m.apartment.number} del Bloque:{" "}
                {m.apartment.block}
              </Td>
              <Td>Sin serial</Td>
              <Td>Sin medidor de gas instalado</Td>
              <Td>Sin lecturas</Td>
              <Td>
                <GasMeterFormModal apartment_info={m.apartment} onCreated={fetchMeters}/>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {selectedMeter && (
        <GasReadingModal
          isOpen={isReadingOpen}
          onClose={onReadingClose}
          meter={selectedMeter}
          onSaved={fetchMeters}
        />
      )}
    </Layout>
  );
}
