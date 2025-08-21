// pages/NotificationsPage.tsx
import React, { useEffect, useState } from "react";
import { User } from "../../types/user";
import NotificationList from "../../components/notifications/NotificationList";
import SendNotificationForm from "../../components/notifications/SendNotificationForm";
import { getUsers } from "../../services/userService";
import Layout from "../../components/layout/Layout";
import {
  Box,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useColorModeValue,
} from "@chakra-ui/react";

const NotificationsPage: React.FC = () => {
  const borderColor = useColorModeValue("blue.500", "blue.200");
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<"received" | "sent" | "send">(
    "received"
  );
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);
  return (
    <Layout>
      <Box maxW="container.lg" mx="auto" p={4}>
        <Heading as="h1" size="xl" mb={6}>
          Sistema de Notificaciones
        </Heading>
        <Tabs
          variant="enclosed"
          index={["received", "sent", "send"].indexOf(activeTab)}
          onChange={(index) =>
            setActiveTab(["received", "sent", "send"][index] as any)
          }
        >
          <TabList borderBottom="1px" borderColor="gray.200">
            <Tab
              _selected={{ borderColor: borderColor, color: borderColor }}
              _hover={{ bg: hoverBg }}
              onClick={() => setActiveTab("received")}
            >
              Recibidas
            </Tab>
            <Tab
              _selected={{ borderColor: borderColor, color: borderColor }}
              _hover={{ bg: hoverBg }}
              onClick={() => setActiveTab("sent")}
            >
              Enviadas
            </Tab>
            <Tab
              _selected={{ borderColor: borderColor, color: borderColor }}
              _hover={{ bg: hoverBg }}
              onClick={() => setActiveTab("send")}
            >
              Nueva Notificación
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel p={4}>
              <NotificationList />
            </TabPanel>
            <TabPanel p={4}>
              <NotificationList showSent />
            </TabPanel>
            <TabPanel p={4}>
              {users.length > 0 && <SendNotificationForm users={users} />}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Layout>
  );
};

export default NotificationsPage;
