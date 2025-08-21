// src/pages/finances/FinancialReportPage.tsx
import { Box, Heading, Stat, StatLabel, StatNumber, SimpleGrid, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function FinancialReportPage() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState({ ingresos: 0, egresos: 0 });

  useEffect(() => {
    api.get("/finances/reports/").then((res) => {
      setReport(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner size="xl" />;

  return (
    <Box p={8}>
      <Heading mb={4}>Reporte Financiero</Heading>
      <SimpleGrid columns={[1, 2]} spacing={6}>
        <Stat>
          <StatLabel>Total Ingresos</StatLabel>
          <StatNumber>${report.ingresos.toFixed(2)}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Total Egresos</StatLabel>
          <StatNumber>${report.egresos.toFixed(2)}</StatNumber>
        </Stat>
      </SimpleGrid>
    </Box>
  );
}
