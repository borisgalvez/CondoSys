// src/components/buildings/GasMeterFormModal.tsx
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import { Apartment } from "../../types/apartmentTypes";
import { errorMessageFormat } from "../../utils/errorMessages";

interface Props {
  apartment_info: Apartment;
  onCreated: () => void;
}

export default function GasMeterFormModal({
  onCreated,
  apartment_info,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit, reset } = useForm();
  const toast = useToast();
  //const [apartmentSelected, setApartmentSelected] = useState<Apartment>(apartment_info)
  /* const [apartments, setApartments] = useState([]); */
  /* const fetchApartments = async () => {
    try {
      const res = await api.get("/buildings/apartments/");
      if (res && res.status === 200) {
        setApartments(res.data);
      }
    } catch (error: any) {
      console.error("Error fetching apartments:", error);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []); */

  const onSubmit = async (data: any) => {
    try {
      const res = await api.post("/buildings/gas-meters/", {...data, apartment: apartment_info.id});

      if (res && res.status === 201) {
        onCreated();
        reset();
        onClose();
      }
    } catch (error) {
      console.log(error);
      toast({
        title:
          "Error al registrar el medidor",
        description: errorMessageFormat(error),
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <>
      <Button size="sm" onClick={onOpen}>
        Crear medidor
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Nuevo Medidor de Gas para el apartamento {apartment_info.number} del
            bloque: {apartment_info.block}
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <FormControl mb={3}>
                <FormLabel>Serial del Medidor</FormLabel>
                <Input {...register("serial_number")} required />
              </FormControl>
              {/* <FormControl mb={3}>
                <FormLabel>Apartamento</FormLabel>
                <Select {...register("apartment")} required>
                  {apartments.map((a: any) => (
                    <option
                      key={a.id}
                      value={a.id}
                    >{`Bloque ${a.block} - ${a.number}`}</option>
                  ))}
                </Select>
              </FormControl> */}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" type="submit">
                Guardar
              </Button>
              <Button onClick={onClose} ml={3}>
                Cancelar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
