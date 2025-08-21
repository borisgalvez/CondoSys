// src/pages/chat/ChatPage.tsx
import { Box, Button, VStack, Text, Textarea, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../../services/api";

interface Message {
  id: number;
  user: string;
  content: string;
  timestamp: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMessages = () => {
    api.get("/communication/chats/").then((res) => {
      setMessages(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    api.post("/communication/chats/", { content: newMessage }).then(() => {
      setNewMessage("");
      fetchMessages();
    });
  };

  if (loading) return <Spinner size="xl" />;

  return (
    <Box p={8}>
      <VStack align="stretch" spacing={4}>
        {messages.map((m) => (
          <Box key={m.id} bg="gray.100" p={3} borderRadius="md">
            <Text fontWeight="bold">{m.user}</Text>
            <Text>{m.content}</Text>
            <Text fontSize="xs" color="gray.500">
              {new Date(m.timestamp).toLocaleString()}
            </Text>
          </Box>
        ))}
        <Textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Escribe un mensaje..." />
        <Button colorScheme="blue" onClick={sendMessage}>
          Enviar
        </Button>
      </VStack>
    </Box>
  );
}
