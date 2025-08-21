import { Block } from "../types/Block";
import api from "./api";

export const fetchBlocks = async (): Promise<Block[]> => {
  const res = await api.get("/buildings/blocks/");
  return res.data;
};