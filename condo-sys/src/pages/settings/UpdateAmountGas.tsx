import {
  AbsoluteCenter,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { updateConfigService } from "../../services/configServices";
import { Config } from "../../types/config";
import { toast } from "react-toastify";
import { errorMessageFormat } from "../../utils/errorMessages";
interface props {
  amountGasGallon: number | null;
  amountGasCubicMeter: number | null;
  preferredUnit: "galon" | "m3";
}
const UpdateAmountGas: React.FC<props> = ({
  amountGasGallon,
  amountGasCubicMeter,
  preferredUnit,
}) => {
  const { register, handleSubmit } = useForm<Config>();
  const handleChangeConfigAmount = async (formdata: Config) => {
    const processedData = Object.entries(formdata).reduce((acc, [key, value]) => {
      if (value === "" || value == null) return acc;

      if (
        key === "gas_price_per_gallon" ||
        key === "gas_price_per_cubic_meter"
      ) {
        acc[key] = Number(value);
      } else {
        acc[key] = value;
      }

      return acc;
    }, {} as Record<string, unknown>);
    try {
      await updateConfigService(processedData);
      toast.success('Configuración de precios de gas actualizada');
    } catch (e: any) {
      toast.error(`Error al guardar la configuración: ${errorMessageFormat(e)}`);
    }
  };
  return (
    <>
      <Box position="relative" padding="10">
        <Divider />
        <AbsoluteCenter bg="white" px="4">
          Configuración precios del gas
        </AbsoluteCenter>
      </Box>
      <Text>
        Este será el precio determinado para el cobro de galones de gas
      </Text>
      <form onSubmit={handleSubmit(handleChangeConfigAmount)}>
        <Stack spacing={4}>
          <FormControl maxWidth={600}>
            <FormLabel>Precio por galon de gas</FormLabel>
            <NumberInput
              precision={2}
              defaultValue={amountGasGallon ? amountGasGallon : undefined}
            >
              <NumberInputField {...register("gas_price_per_gallon")} />
            </NumberInput>
          </FormControl>
          <FormControl maxWidth={600}>
            <FormLabel>Precio por metro cúbico</FormLabel>
            <NumberInput
              precision={2}
              defaultValue={
                amountGasCubicMeter ? amountGasCubicMeter : undefined
              }
            >
              <NumberInputField {...register("gas_price_per_cubic_meter")} />
            </NumberInput>
          </FormControl>
          <FormControl maxWidth={600}>
            <FormLabel>Unidad de medida preferida(galón o m³)</FormLabel>
            <Select
              {...register("preferred_unit")}
              defaultValue={preferredUnit}
            >
              <option value="">Selecciona una opción</option>
              <option value="gallon">Galón</option>
              <option value="m3">Metro cúbico</option>
            </Select>
          </FormControl>
          <Flex justify="flex-end">
            <Button
              minW={200}
              backgroundColor={"blue.500"}
              color={"white"}
              type="submit"
            >
              Guardar configuración precios del gas
            </Button>
          </Flex>
        </Stack>
      </form>
    </>
  );
};

export default UpdateAmountGas;
