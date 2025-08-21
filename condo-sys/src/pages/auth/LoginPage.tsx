// src/pages/auth/LoginPage.tsx (actualizado y profesional)
import { Box, Button, Input, Heading, VStack, Image, FormControl, FormLabel } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
//import api from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginForm>();
  const navigate = useNavigate();
  const { login } = useAuth();
  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.username, data.password);
      toast.success("Bienvenido 👋");
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast.error("Credenciales inválidas");
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={20} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Image src="/logo.svg" alt="Logo" mb={6} />
      <Heading mb={6} textAlign="center">
        Iniciar sesión
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Usuario</FormLabel>
            <Input placeholder="username" {...register("username", { required: true })} />
          </FormControl>
          <FormControl>
            <FormLabel>Contraseña</FormLabel>
            <Input type="password" placeholder="******" {...register("password", { required: true })} />
          </FormControl>
          <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
            Entrar
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
