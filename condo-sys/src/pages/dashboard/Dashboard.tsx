// src/pages/dashboard/Dashboard.tsx (actualizado con Layout)
import { Heading, Text } from "@chakra-ui/react";
import Layout from "../../components/layout/Layout";

export default function Dashboard() {
  return (
    <Layout>
      <Heading>Bienvenido al sistema de gestión de condominio</Heading>
      <Text mt={4}>Usa la barra lateral para navegar entre secciones.</Text>
    </Layout>
  );
}
