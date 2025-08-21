import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { utils, writeFile } from "xlsx";
import { useConfigPage } from "../../hooks/useConfigPage";
import { dateActConfig } from "../../helpers/dateActConfig";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  meter: any;
  onSaved: () => void;
}

export default function GasReadingModal({
  isOpen,
  onClose,
  meter,
  onSaved,
}: Props) {
  const [readings, setReadings] = useState(meter.readings || []);
  const { register, handleSubmit, reset, watch, setValue, formState: { isSubmitting } } = useForm();
  const { gasPrice, billingDay, gasPriceCubicMeter, preferredUnit } =
    useConfigPage();
  const [unit, setUnit] = useState<string | null>(preferredUnit ?? null);
  const value_m3 = watch("value_m3");
  const gas_value = watch("gas_value");

  // Calcula el total cuando cambian los valores
  useEffect(() => {
    if (value_m3 && gas_value) {
      const consumo =
        Math.round(
          (parseFloat(value_m3) - parseFloat(meter.consumption)) * 100
        ) / 100;
      const valor = parseFloat(gas_value);
      const total = consumo * valor;
      setValue("total", total.toFixed(2));
    }
  }, [value_m3, gas_value, setValue, meter.consumption]);

  // Configura el NumberInput correctamente
  const handleNumberChange = (valueString: string) => {
    setValue("value_m3", valueString);
  };
  const onSubmit = async (data: any) => {
    try {
      const res = await api.post("/buildings/gas-readings/", {
        meter: meter.id,
        date: data.date,
        value_m3:
          Math.round(
            (parseFloat(data.value_m3) - parseFloat(meter.consumption)) * 100
          ) / 100,
        gas_value: parseFloat(data.gas_value),
        total: parseFloat(data.total),
      });
      if (res && res.status === 201) {
        onSaved();
        reset();
        onClose();
      }
    } catch (error) {
      toast.error('Ya existe una lectura este mes')
      console.log(error);
    }
  };

  useEffect(() => {
    setReadings(meter.readings || []);
  }, [meter]);
  useEffect(() => {
    if (!unit) {
      setValue("gas_value", 0);
    } else if (unit === "gallon") {
      setValue("gas_value", gasPrice ?? 0);
    } else if (unit === "m3") {
      setValue("gas_value", gasPriceCubicMeter ?? 0);
    }
  }, [unit, gasPrice, gasPriceCubicMeter, setValue]);
  const chartData = [...readings].reverse().map((r: any) => ({
    date: r.date,
    value: parseFloat(r.value_m3),
  }));

  const exportToExcel = () => {
    const worksheet = utils.json_to_sheet(readings);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Lecturas");
    writeFile(workbook, `Lecturas_Medidor_${meter.serial_number}.xlsx`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Lecturas del Medidor {meter.serial_number}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Fecha</FormLabel>
              <Input
                value={dateActConfig(billingDay)}
                type="date"
                {...register("date")}
                required
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>
                Consumo final(m³) Consumo hasta la ultima lectura fue de{" "}
                {meter.consumption}
              </FormLabel>
              <NumberInput
                precision={2}
                step={0.01}
                defaultValue={meter.consumption}
                min={meter.consumption}
                onChange={handleNumberChange}
              >
                <NumberInputField
                  {...register("value_m3", {
                    valueAsNumber: true,
                    min: meter.consumption,
                  })}
                />
              </NumberInput>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Unidad de medida</FormLabel>
              <Select
                placeholder="Seleccionar unidad"
                value={unit ?? ""}
                onChange={(e) => setUnit(e.target.value || null)}
              >
                <option value="gallon">Galón</option>
                <option value="m3">Metro cúbico</option>
              </Select>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Precio del gas</FormLabel>
              <Input
                type="number"
                step="0.01"
                defaultValue={gasPrice ?? undefined}
                {...register("gas_value")}
                required
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Total</FormLabel>
              <Input
                type="number"
                step="0.01"
                readOnly
                {...register("total")}
                required
              />
            </FormControl>
            {chartData.length > 0 && (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3182ce"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}

            <Button
              mt={4}
              onClick={exportToExcel}
              colorScheme="green"
              size="sm"
            >
              Exportar a Excel
            </Button>
            <Table mt={6}>
              <Thead>
                <Tr>
                  <Th>Fecha</Th>
                  <Th>Lectura</Th>
                  <Th>Precio Gas</Th>
                  <Th>Total</Th>
                </Tr>
              </Thead>
              <Tbody>
                {readings.map((r: any) => (
                  <Tr key={r.id}>
                    <Td>{r.date}</Td>
                    <Td>{r.value_m3} m³</Td>
                    <Td>{r.gas_value} $</Td>
                    <Td>{r.total} $</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
              Guardar lectura
            </Button>
            <Button onClick={onClose} ml={3}>
              Cerrar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
