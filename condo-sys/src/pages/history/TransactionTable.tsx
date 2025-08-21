import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { MappedTransaction } from "../../types/history";

interface Props {
  data: MappedTransaction[];
}

export function TransactionTable({ data }: Props) {
  return (
    <Table size="sm">
      <Thead>
        <Tr>
          <Th>ID</Th>
          <Th>Monto</Th>
          <Th>Registrado por</Th>
          <Th>Pagado por</Th>
          <Th>Fecha</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((item) => (
          <Tr key={item.id}>
            <Td>{item.id}</Td>
            <Td>{item.amount}</Td>
            <Td>{item.created_by || "-"}</Td>
            <Td>{item.paid_by|| "-"}</Td>
            <Td>{item.date}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
