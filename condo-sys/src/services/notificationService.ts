// services/api.ts
import { Notification, NotificationFormData } from "../types/notification";
import api from "./api";

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await api.get(`/notifications/`);
  return response.data;
};

export const getSentNotifications = async (): Promise<Notification[]> => {
  const response = await api.get(`/notifications/sent/`);
  return response.data;
};

export const createNotification = async (
  data: NotificationFormData
): Promise<Notification> => {
  const response = await api.post(`/notifications/`, data);
  return response.data;
};

export const markAsRead = async (id: number): Promise<void> => {
  await api.post(`/notifications/${id}/mark_as_read/`);
};

export const getUnreadNotifications = async (): Promise<Notification[]> => {
  const response = await api.get("/notifications/unread/");
  return response.data;
};

export const getUnreadCount = async (): Promise<number> => {
  const response = await api.get("/notifications/unread/count/");
  return response.data.count;
};
