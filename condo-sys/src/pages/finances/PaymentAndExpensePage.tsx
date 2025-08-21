import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import Layout from "../../components/layout/Layout";
import PaymentsPage from "./PaymentsPage";
import ExpensesPage from "./ExpensesPage";

const PaymentAndExpensePage = () => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <Layout>
      <Box p={4}>
        <Tabs
          variant="enclosed"
          index={activeTab}
          onChange={(index) => setActiveTab(index)}
        >
          <TabList mb={4}>
            <Tab _selected={{ color: "white", bg: "green.500" }}>Pagos</Tab>
            <Tab _selected={{ color: "white", bg: "red.500" }}>Egresos</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0}>
              <PaymentsPage />
            </TabPanel>

            {/* Pestaña de Egresos */}
            <TabPanel p={0}>
              <ExpensesPage />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Layout>
  );
};

export default PaymentAndExpensePage;
