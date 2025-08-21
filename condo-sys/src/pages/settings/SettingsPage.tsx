import {
  AbsoluteCenter,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import Layout from "../../components/layout/Layout";
import { useForm } from "react-hook-form";
import UpdateAmountGas from "./UpdateAmountGas";
import { updateConfigService } from "../../services/configServices";
import { useConfigPage } from "../../hooks/useConfigPage";
import { dateActConfig } from "../../helpers/dateActConfig";

const SettingsPage = () => {
  const { register, handleSubmit, reset } = useForm();
  const { gasPrice, billingDay, gasPriceCubicMeter, preferredUnit } =
    useConfigPage();
  const handleChangeConfigDateEnd = async (formdata: any) => {
    try {
      const day = String(formdata.billing_day_of_month).split("-").pop();
      const response = await updateConfigService({
        billing_day_of_month: Number(day),
      });
      console.log(response);
      reset();
    } catch (e) {
      console.error(e);
    }
  };
  //console.log(gasPrice);
  console.log(billingDay);

  return (
    <Layout>
      <Box mb={4}>
        <Heading>Configuraciones</Heading>
      </Box>
      <UpdateAmountGas
        amountGasGallon={gasPrice}
        amountGasCubicMeter={gasPriceCubicMeter}
        preferredUnit={preferredUnit}
      />

      <Box position="relative" padding="10">
        <Divider />
        <AbsoluteCenter bg="white" px="4">
          Intervalo de cobros
        </AbsoluteCenter>
      </Box>
      <Text>
        Esta es la fecha de cobro para todos los medidores para calcular el
        cobro de cada ciclo
      </Text>
      <form onSubmit={handleSubmit(handleChangeConfigDateEnd)}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"flex-end"}
        >
          <FormControl maxWidth={600}>
            <FormLabel>Fecha fin de ciclo</FormLabel>
            <Input
              value={dateActConfig(billingDay)}
              type="date"
              {...register("billing_day_of_month")}
            />
          </FormControl>
          <Button
            minW={200}
            backgroundColor={"blue.500"}
            color={"white"}
            type="submit"
          >
            Guardar fecha fin de ciclo
          </Button>
        </Box>
      </form>
    </Layout>
  );
};

export default SettingsPage;
