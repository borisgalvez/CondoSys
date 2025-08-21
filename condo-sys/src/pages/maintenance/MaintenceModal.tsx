import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Select as SelectChakra,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { RepairPaymentFormData } from "../../types/RepairPayment";
import { errorMessageFormat } from "../../utils/errorMessages";
import { Apartment } from "../../types/apartmentTypes";
import { useEffect, useState } from "react";
import { User } from "../../types/user";
import api from "../../services/api";
import Select from "react-select";

interface Props {
  onSubmit: (data: RepairPaymentFormData) => Promise<void>;
  onClose: () => void;
}
type OptionType = {
  value: number;
  label: string;
  role?: string;
};
type HousingOption = {
  value: number;
  label: string;
};
type OptionRole = "tenant" | "owner" | "admin";

const employeeTypes = [
  { value:'plumbing', label: "Plomería" },
  { value:'electrical',label: "Eléctrica" },
  { value:'painting',label: "Pintura" },
  { value:'other',label: "Otra" },
];

export const RepairPaymentForm = ({ onSubmit, onClose }: Props) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { isSubmitting },
  } = useForm<RepairPaymentFormData>();
  const fetchApartments = async () => {
    try {
      const res = await api.get("/buildings/apartments/");
      if (res && res.status === 200) {
        setApartments(res.data);
      }
    } catch (error: any) {
      console.error("Error fetching apartments:", error);
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await api.get("/users/");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchApartments();
    fetchUsers();
  }, []);
  const userOptions = users.map((user) => ({
    value: user.id,
    label: `${user.username} (${user.email})`,
    role: user.role, // suponiendo que el backend devuelve esto
  }));

  const housingOptions = apartments.map((h) => ({
    value: h.id,
    label: h.number,
  }));
  const onSubmitForm = async (data: RepairPaymentFormData) => {
    try {
      await onSubmit(data);
      toast({ title: "Pago registrado", status: "success" });
      reset();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `Error al registrar el pago: ${errorMessageFormat(error)}`,
        status: "error",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Apartamento</FormLabel>
          <Controller
            name="apartment"
            control={control}
            render={({ field }) => (
              <Select<HousingOption, false>
                options={housingOptions}
                placeholder="Selecciona una vivienda"
                value={
                  housingOptions.find((opt) => opt.value === field.value) ||
                  null
                }
                onChange={(option) => field.onChange(option?.value)}
                getOptionLabel={(e) => e.label}
                getOptionValue={(e) => String(e.value)}
              />
            )}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Tipo reparación</FormLabel>
          <SelectChakra {...register("repair_type", { required: true })}>
            {employeeTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </SelectChakra>
        </FormControl>
        <FormControl>
          <FormLabel>Descripción</FormLabel>
          <Input {...register("description")} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Costo</FormLabel>
          <Input
            {...register("cost", { required: true })}
            type="number"
            step="0.01"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Fecha</FormLabel>
          <Input
            {...register("payment_date", { required: true })}
            type="date"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Usuario que pagó</FormLabel>
          <Controller
            name="paid_by_user_id"
            control={control}
            render={({ field }) => (
              <Select<OptionType, false>
                value={
                  userOptions.find((option) => option.value === field.value) ||
                  null
                }
                onChange={(option) => {
                  field.onChange(option?.value ?? null);
                  const selectedUser = userOptions.find(
                    (u) => u.value === option?.value
                  );
                  setValue("paid_by_role", selectedUser?.role as OptionRole);
                }}
                options={userOptions}
                placeholder="Selecciona un usuario"
                getOptionLabel={(e) => e.label}
                getOptionValue={(e) => String(e.value)}
              />
            )}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Rol del que pagó</FormLabel>
          <Input {...register("paid_by_role")} readOnly />
        </FormControl>

        <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
          Registrar Pago
        </Button>
      </VStack>
    </form>
  );
};
