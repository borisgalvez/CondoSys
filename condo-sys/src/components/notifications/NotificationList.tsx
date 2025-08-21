// components/NotificationList.tsx
import React, { useEffect, useState } from "react";
import {
  getNotifications,
  getSentNotifications,
  markAsRead,
} from "../../services/notificationService";
import { Notification } from "../../types/notification";
import {
  VStack,
  Heading,
  Text,
  Box,
  Button,
  useColorModeValue,
  Divider,
  HStack,
} from "@chakra-ui/react";
interface NotificationListProps {
  showSent?: boolean;
}

const NotificationList: React.FC<NotificationListProps> = ({
  showSent = false,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const bgUnread = useColorModeValue("blue.50", "blue.900");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = showSent
          ? await getSentNotifications()
          : await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [showSent]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
      setNotifications(
        notifications.map((notif) =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  if (loading) return <div>Cargando notificaciones...</div>;

  return (
    <VStack spacing={4} align="stretch">
      <Heading size="lg">
        {showSent ? "Notificaciones Enviadas" : "Tus Notificaciones"}
      </Heading>

      {loading ? (
        <Text>Cargando notificaciones...</Text>
      ) : notifications.length === 0 ? (
        <Text>No tienes notificaciones</Text>
      ) : (
        <VStack divider={<Divider />} spacing={3} align="stretch">
          {notifications.map((notification) => (
            <Box
              key={notification.id}
              p={4}
              borderRadius="md"
              bg={!notification.is_read ? bgUnread : "transparent"}
            >
              <HStack justify="space-between" align="flex-start">
                <Box>
                  <Text fontWeight="medium" color={textColor}>
                    {notification.message}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    De: {notification.sender.username}{" "}
                    {notification.sender.email}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(notification.created_at).toLocaleString()}
                  </Text>
                </Box>
                {!notification.is_read && (
                  <Button
                    size="sm"
                    colorScheme="blue"
                    variant="ghost"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    Marcar como leída
                  </Button>
                )}
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
    </VStack>
  );
};

export default NotificationList;
