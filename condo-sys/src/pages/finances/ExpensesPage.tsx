// src/pages/finances/PaymentsPage.tsx
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../../services/api";
import ExpenseModal from "./ExpensesModal";
import { generateExpensePDF } from "../../utils/generateExpensePDF";
import { Expense } from "../../types/expense";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchExpenses = () => {
    api.get("/finances/expenses/").then((res) => {
      setExpenses(res.data.results || res.data);
      console.log(res.data);
      
    });
  };

  useEffect(() => {
    fetchExpenses();
  }, []);
  const handleGeneratePDF = (expense:Expense) => {
    generateExpensePDF({
      expenseNumber: expense.id,
      description: expense.description,
      amount: Number(expense.amount),
      date: expense.date,
      category: expense.category,
      block: expense.block_data.name??'Sin bloque en específico',
    });
  }
  return (
    <>
      <Heading mb={6}>Registro de Egresos</Heading>

      <Box mb={6} display="flex" gap={4} flexWrap="wrap">
        <Button onClick={onOpen} colorScheme="red">
          Registrar egreso
        </Button>
      </Box>

      <Table>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Descripción</Th>
            <Th>Monto</Th>
            <Th>Fecha</Th>
            <Th>Categoría</Th>
            <Th>Documento</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {expenses.map((e) => (
            <Tr key={e.id}>
              <Td>{e.id}</Td>
              <Td>{e.description}</Td>
              <Td>${e.amount}</Td>
              <Td>{e.date}</Td>
              <Td>{e.category}</Td>
              <Td>
                {e.document_url ? (
                  <a
                    href={e.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver
                  </a>
                ) : (
                  "—"
                )}
              </Td>
              <Td><Button onClick={()=>handleGeneratePDF(e)}>Generar PDF</Button></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <ExpenseModal
        isOpen={isOpen}
        onClose={onClose}
        onUpdated={fetchExpenses}
      />
    </>
  );
}
