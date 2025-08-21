import { Apartment } from "../types/apartmentTypes";
import api from "./api";

// GET - Listar apartamentos
export const fetchApartments = async (): Promise<Apartment[]> => {
  const res = await api.get("/buildings/apartments/");
  return res.data;
};