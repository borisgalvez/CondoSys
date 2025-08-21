import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  VStack,
  useToast,
  RadioGroup,
  Stack,
  Radio,
  FormErrorMessage,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { errorMessageFormat } from "../../utils/errorMessages";
import { PaymentMethod, PayrollPayment } from "../../types/payroll";

interface PayrollFormProps {
  onSubmit: (
    data: Omit<
      PayrollPayment,
      | "id"
      | "created_at"
      | "expense"
      | "employee_type_display"
      | "payment_method_display"
    >
  ) => Promise<void>;
  onClose: () => void;
}

const employeeTypes = [
  { value: "CLEANING", label: "Limpieza" },
  { value: "ADMIN", label: "Administración" },
  { value: "SECURITY", label: "Seguridad" },
  { value: "OTHER", label: "Otro" },
];

type FormData = {
  employee_name: string;
  employee_type: string;
  amount: number;
  payment_date: string;
  payment_method: PaymentMethod;
  notes: string;
};

const PayrollForm = ({ onSubmit, onClose }: PayrollFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      employee_name: "",
      employee_type: "CLEANING",
      amount: 0,
      payment_date: format(new Date(), "yyyy-MM-dd"),
      payment_method: "TRANSFER",
      notes: "",
    },
  });
  const toast = useToast();
  const onSubmitForm = async (data: FormData) => {
    try {
      await onSubmit({
        ...data,
        amount: Number(data.amount),
      });
      toast({
        title: "Pago registrado",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      reset();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error al registrar pago",
        description: `Ocurrió un error al guardar el pago de nómina ${errorMessageFormat(
          error
        )}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <ModalBody p={4} borderWidth="1px" borderRadius="md">
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.employee_name} isRequired>
            <FormLabel>Nombre del Empleado</FormLabel>
            <Input
              placeholder="Ej. Juan Pérez"
              {...register("employee_name", {
                required: "Este campo es obligatorio",
              })}
            />
            <FormErrorMessage>{errors.employee_name?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Tipo de Empleado</FormLabel>
            <Select {...register("employee_type", { required: true })}>
              {employeeTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl isInvalid={!!errors.amount} isRequired>
            <FormLabel>Monto</FormLabel>
            <Input
              type="number"
              step="0.01"
              placeholder="Ej. 1500.00"
              {...register("amount", {
                required: "Indica el monto",
                min: 0.01,
              })}
            />
            <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Fecha de Pago</FormLabel>
            <Input
              type="date"
              {...register("payment_date", { required: true })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Método de Pago</FormLabel>
            <Controller
              name="payment_method"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <RadioGroup {...field}>
                  <Stack direction="row">
                    <Radio value="CASH">Efectivo</Radio>
                    <Radio value="TRANSFER">Transferencia</Radio>
                    <Radio value="QR">QR</Radio>
                  </Stack>
                </RadioGroup>
              )}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Notas</FormLabel>
            <Textarea
              placeholder="Observaciones adicionales"
              {...register("notes")}
            />
          </FormControl>
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isSubmitting}
          loadingText="Registrando..."
        >
          Registrar Pago
        </Button>
        <Button onClick={onClose}>Cancelar</Button>
      </ModalFooter>
    </form>
  );
};

export default PayrollForm;
