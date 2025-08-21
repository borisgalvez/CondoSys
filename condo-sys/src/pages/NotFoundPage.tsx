// src/pages/NotFoundPage.tsx
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading as="h2" size="xl" mb={4}>
        404 - Página no encontrada
      </Heading>
      <Text color="gray.500" mb={6}>
        La página que buscas no existe o ha sido movida.
      </Text>
      <Button colorScheme="blue" onClick={() => navigate("/")}>
        Ir al Inicio
      </Button>
    </Box>
  );
}
