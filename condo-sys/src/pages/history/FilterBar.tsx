import { Select, Box, Input } from "@chakra-ui/react";
import { TransactionFilters } from "../../types/history";

interface FilterBarProps {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
  users: { id: number; username: string }[];
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange, users }) => {
  return (
    <Box display="flex" gap={4} mb={4}>
      <Select
        placeholder="Filtrar por tipo"
        value={filters.type || ''}
        onChange={(e) => onChange({ ...filters, type: e.target.value || undefined })}
      >
        <option value="electricity">Electricidad</option>
        <option value="maintenance">Mantenimiento</option>
        <option value="payroll">Nómina</option>
        <option value="extraordinary">Extraordinario</option>
        <option value="expense">Gasto</option>
        <option value="payment_data">Pagos</option>
        <option value="reading_data">Gas</option>
      </Select>

      <Select
        placeholder="Filtrar por usuario"
        value={filters.userId || ''}
        onChange={(e) => onChange({ ...filters, userId: e.target.value || undefined })}
      >
        {users.map((user) => (
          <option key={user.id} value={user.username}>
            {user.username}
          </option>
        ))}
      </Select>

      <Input
        type="date"
        value={filters.startDate || ''}
        onChange={(e) => onChange({ ...filters, startDate: e.target.value || undefined })}
      />
      <Input
        type="date"
        value={filters.endDate || ''}
        onChange={(e) => onChange({ ...filters, endDate: e.target.value || undefined })}
      />
    </Box>
  );
};
