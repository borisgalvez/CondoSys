import { 
  IconButton, 
  Badge, 
  Popover, 
  PopoverTrigger, 
  PopoverContent, 
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  VStack,
  Box,
  Text,
  Spinner,
  useDisclosure
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { getUnreadNotifications, markAsRead } from "../../services/notificationService";
import { Notification } from "../../types/notification";

const NotificationBell = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const unread = await getUnreadNotifications();
      setNotifications(unread);
      setUnreadCount(unread.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Carga inicial
    fetchNotifications();
    
    // Opcional: Polling cada 60 segundos
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async (id: number) => {
    try {
      await markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  return (
    <Popover isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        <IconButton
          icon={<BellIcon />}
          aria-label="Notificaciones"
          variant="ghost"
          onClick={onToggle}
          position="relative"
        >
          {unreadCount > 0 && (
            <Badge 
              colorScheme="red" 
              borderRadius="full" 
              position="absolute"
              top="1"
              right="1"
              fontSize="xs"
            >
              {unreadCount}
            </Badge>
          )}
        </IconButton>
      </PopoverTrigger>
      <PopoverContent width="sm" maxHeight="80vh" overflowY="auto">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader fontWeight="bold">Notificaciones</PopoverHeader>
        <PopoverBody>
          {loading ? (
            <Spinner />
          ) : notifications.length === 0 ? (
            <Text py={2} textAlign="center">No hay notificaciones nuevas</Text>
          ) : (
            <VStack spacing={3} align="stretch">
              {notifications.map(notification => (
                <Box
                  key={notification.id}
                  p={3}
                  borderRadius="md"
                  bg={!notification.is_read ? "blue.50" : "transparent"}
                  borderWidth="1px"
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <Text fontWeight={notification.is_read ? "normal" : "semibold"}>
                    {notification.message}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {formatDistanceToNow(new Date(notification.created_at), {
                      addSuffix: true,
                      locale: es
                    })}
                  </Text>
                </Box>
              ))}
            </VStack>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;