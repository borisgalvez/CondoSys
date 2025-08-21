// src/components/layout/Layout.tsx
import { Box } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <Box minH="100vh" display="flex" minW="100%" bg="gray.50">
      <Sidebar />
      <Box flex={1}>
        <Navbar />
        <Box p={8}>{children}</Box>
      </Box>
    </Box>
  );
}
