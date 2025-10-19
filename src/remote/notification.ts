import { apiFetch } from "@/lib/apiFetch";
import type { Notification } from "@/types/notification";

export interface NotificationRequest {
  lastId?: number | null;
  size?: number;
}

export interface NotificationResponse {
  code: number;
  status: "SUCCESS" | "FAILURE";
  data: {
    notifications: Notification[];
    hasNext: boolean;
    unreadCount: number;
  };
}

export const getNotifications = async ({
  lastId,
  size = 20,
}: NotificationRequest): Promise<NotificationResponse> => {
  const lastIdParam = lastId ? `last_id=${lastId}&` : "";
  const sizeParam = `size=${size}`;

  const res = await apiFetch(`/notifications/?${lastIdParam}${sizeParam}`);

  return res as NotificationResponse;
};
