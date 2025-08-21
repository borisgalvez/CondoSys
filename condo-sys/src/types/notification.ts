import { User } from "./user";

export interface Notification {
  id: number;
  sender: User;
  recipients: User[];
  message: string;
  notification_type: 'email' | 'app' | 'both';
  created_at: string;
  is_read: boolean;
}

export interface NotificationFormData {
  recipient_ids: number[];
  message: string;
  notification_type: 'email' | 'app' | 'both';
}