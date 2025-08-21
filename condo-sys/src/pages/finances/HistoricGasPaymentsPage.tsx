import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import api from "../../services/api";
import {
  Box,
  Button,
  Heading,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { GasReading } from "../../types/gas";
import { nextMonth } from "../../helpers/nextMonthHelper";
import HistoricGasPaymentModal from "./HistoricGasPaymentModal";
import { useConfigPage } from "../../hooks/useConfigPage";

const HistoricGasPaymentsPage = () => {
  const [gasReadings, setGasReadings] = useState<GasReading[]>([]);
  const [gasReadingsFiltered, setGasReadingsFiltered] = useState<GasReading[]>(
    []
  );
  const [monthSelected, setMonthSelected] = useState("");
  const [idGasReadingSelected, setIdGasReadingSelected] = useState<
    null | GasReading
  >(null);
  const { billingDay } = useConfigPage();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const getGasReadings = async () => {
    try {
      const response = await api.get("/buildings/gas-readings/");
      setGasReadings(response.data);
    } catch (err) {
      console.error(err);
    }
  };
  const openModalGasReading = (newMeter: GasReading) => {
    setIdGasReadingSelected(newMeter);
    onOpen();
  };
  const closeModalGasReading = () => {
    setIdGasReadingSelected(null);
    onClose();
  };
  useEffect(() => {
    getGasReadings();
  }, []);
  useEffect(() => {
    const filtered = gasReadings.filter((gasReading) => {
      const matchesMonth =
        monthSelected === "" ||
        gasReading.date.substring(0, 7) === monthSelected.substring(0, 7);
      return matchesMonth;
    });
    setGasReadingsFiltered(filtered);
  }, [monthSelected, gasReadings]);
  return (
    <Layout>
      <Heading mb={6}>Pagos de las lecturas de gas</Heading>
      <Box mb={6} display="flex" gap={4} flexWrap="wrap">
        <Input
          bg={"white"}
          type="month"
          value={monthSelected}
          onChange={(e) => setMonthSelected(e.target.value)}
          maxW="150px"
        />
      </Box>
      <Table>
        <Thead>
          <Tr>
            <Th>Fecha</Th>
            <Th>Lectura</Th>
            <Th>Precio Gas</Th>
            <Th>Total</Th>
            <Th>Estado</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {gasReadingsFiltered.map((gasReading) => (
            <Tr key={gasReading.id}>
              <Td>{gasReading.date}</Td>
              <Td>{gasReading.value_m3} m³</Td>
              <Td>{gasReading.gas_value} $</Td>
              <Td>{gasReading.total} $</Td>
              <Td>
                {gasReading.is_paid
                  ? "Cuota de gas pagada"
                  : `Por pagar hasta el ${billingDay} de ${nextMonth(
                      gasReading.date
                    )}`}
              </Td>
              <Td>
                {gasReading.is_paid ? (
                  "La cuota ya fue pagada"
                ) : (
                  <Button onClick={() => openModalGasReading(gasReading)}>
                    Pagar cuota
                  </Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
        {idGasReadingSelected && (
          <HistoricGasPaymentModal
            onClose={closeModalGasReading}
            isOpen={isOpen}
            onUpdated={getGasReadings}
            meter={idGasReadingSelected}
          />
        )}
      </Table>
    </Layout>
  );
};

export default HistoricGasPaymentsPage;
