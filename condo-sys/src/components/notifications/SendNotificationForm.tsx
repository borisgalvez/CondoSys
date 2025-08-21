import {
  Box,
  FormControl,
  FormLabel,
  Textarea,
  RadioGroup,
  Stack,
  Radio,
  Button,
  VStack,
  Heading,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Select from "react-select";
import { User } from "../../types/user";
import { NotificationFormData } from "../../types/notification";
import { createNotification } from "../../services/notificationService";

interface SendNotificationFormProps {
  users: User[];
}

const SendNotificationForm: React.FC<SendNotificationFormProps> = ({ users }) => {
  const [formData, setFormData] = useState<NotificationFormData>({
    recipient_ids: [],
    message: "",
    notification_type: "app",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userOptions = users.map((user) => ({
    value: user.id,
    label: `${user.username} (${user.email})`,
  }));

  const handleRecipientChange = (selectedOptions: any) => {
    const ids = selectedOptions.map((option: { value: number }) => option.value);
    setFormData((prev) => ({ ...prev, recipient_ids: ids }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createNotification(formData);
      setFormData({
        recipient_ids: [],
        message: "",
        notification_type: "app",
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box bg="white" p={6} borderRadius="md" boxShadow="md">
      <Heading size="md" mb={4}>Enviar Notificación</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Destinatarios:</FormLabel>
            <Select
              isMulti
              options={userOptions}
              onChange={handleRecipientChange}
              value={userOptions.filter((opt) => formData.recipient_ids.includes(opt.value))}
              placeholder="Selecciona destinatarios"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Mensaje:</FormLabel>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Tipo de notificación:</FormLabel>
            <RadioGroup
              value={formData.notification_type}
              onChange={(value) => setFormData({ ...formData, notification_type: value as any })}
            >
              <Stack direction="column">
                <Radio value="app">Solo en la aplicación</Radio>
                <Radio value="email">Solo por email</Radio>
                <Radio value="both">Aplicación y email</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting}
            loadingText="Enviando..."
          >
            Enviar Notificación
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default SendNotificationForm;
