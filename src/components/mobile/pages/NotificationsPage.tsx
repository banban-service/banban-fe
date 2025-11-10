"use client";

import { useMemo, useCallback, useEffect } from "react";
import styled from "styled-components";
import type {
  Notification,
  NotificationConnectionStatus,
  NotificationType,
} from "@/types/notification";
import { useInView } from "react-intersection-observer";
import type { InfiniteData } from "@tanstack/react-query";
import type { NotificationResponse } from "@/remote/notification";
import { Avatar } from "@/components/common/Avatar";
import { useToast } from "@/components/common/Toast/useToast";
import { useNotifications } from "@/hooks/useNotifications";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useQueryClient } from "@tanstack/react-query";
import {
  deleteReadNotifications,
  markAllNotificationsAsRead,
  markNotificationsAsRead,
} from "@/remote/notification";
import { logger } from "@/utils/logger";
import { useRouter } from "next/navigation";

const STATUS_LABELS: Record<NotificationConnectionStatus, string> = {
  idle: "대기",
  connecting: "연결 중",
  connected: "연결됨",
  reconnecting: "재연결 중",
  disconnected: "연결 끊김",
  error: "오류",
};

export default function NotificationsPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const connectionStatus = useNotificationStore(
    (state) => state.connectionStatus,
  );
  const isTimeout = useNotificationStore((state) => state.isTimeout);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllRead = useNotificationStore((state) => state.markAllAsRead);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotifications({ enabled: true });

  const allNotifications =
    data?.pages?.flatMap((page) => page.data.notifications) ?? [];

  const { ref: loadMoreRef } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  // 페이지 진입 시 모든 알림을 읽음 처리
  useEffect(() => {
    const unreadIds = allNotifications
      .filter((notification) => !notification.isRead)
      .map((notification) => notification.id);
    if (unreadIds.length > 0) {
      markAsRead(unreadIds);
    }
  }, [allNotifications, markAsRead]);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      markAllRead();
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch (error) {
      logger.error("전체 알림 읽음 처리 실패", error);
    }
  };

  const handleDeleteRead = async () => {
    try {
      await deleteReadNotifications();
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      logger.info("읽은 알림 삭제 완료");
    } catch (error) {
      logger.error("읽은 알림 삭제 실패", error);
      showToast({
        type: "error",
        message: "알림 삭제에 실패했습니다.",
        duration: 3000,
      });
    }
  };

  const handleNotificationItemClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await markNotificationsAsRead([notification.id]);
        markAsRead([notification.id]);
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      } catch (error) {
        logger.error("알림 읽음 처리 실패", error);
      }
    }

    // 피드/댓글로 이동
    if (notification.targetType === "FEED" && notification.targetId) {
      router.push(`/feeds/${notification.targetId}`);
    } else if (
      notification.targetType === "COMMENT" &&
      notification.relatedId
    ) {
      router.push(`/feeds/${notification.relatedId}`);
    }
  };


  const formatTimeAgo = useCallback((createdAt: string): string => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return created.toLocaleDateString();
  }, []);

  return (
    <Container>
      <Header>
        <Title>알림</Title>
        <StatusBadge $status={connectionStatus}>
          {STATUS_LABELS[connectionStatus]}
        </StatusBadge>
      </Header>

      <ActionBar>
        <ActionButton onClick={handleMarkAllRead}>모두 읽음</ActionButton>
        <ActionButton onClick={handleDeleteRead}>읽은 알림 삭제</ActionButton>
      </ActionBar>

      <NotificationList>
        {allNotifications.length === 0 ? (
          <EmptyState>알림이 없습니다</EmptyState>
        ) : (
          <>
            {allNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                $isRead={notification.isRead}
                onClick={() => handleNotificationItemClick(notification)}
              >
                <AvatarWrapper>
                  <Avatar
                    src={notification.fromUser?.profileImage || "/user.png"}
                    alt={notification.fromUser?.username || "사용자"}
                    size={40}
                  />
                </AvatarWrapper>
                <Content>
                  <Text>{notification.message}</Text>
                  <Time>{formatTimeAgo(notification.createdAt)}</Time>
                </Content>
                {!notification.isRead && <UnreadDot />}
              </NotificationItem>
            ))}
            {hasNextPage && (
              <LoadMore ref={loadMoreRef}>
                {isFetchingNextPage ? "로딩 중..." : ""}
              </LoadMore>
            )}
          </>
        )}
      </NotificationList>

      {isTimeout && (
        <TimeoutWarning>
          알림 연결 시간이 초과되었습니다. 새로고침해주세요.
        </TimeoutWarning>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #fff;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e9eaeb;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #181d27;
`;

const StatusBadge = styled.span<{ $status: NotificationConnectionStatus }>`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  background-color: ${({ $status }) => {
    switch ($status) {
      case "connected":
        return "#d4edda";
      case "connecting":
      case "reconnecting":
        return "#fff3cd";
      case "disconnected":
      case "error":
        return "#f8d7da";
      default:
        return "#e9eaeb";
    }
  }};
  color: ${({ $status }) => {
    switch ($status) {
      case "connected":
        return "#155724";
      case "connecting":
      case "reconnecting":
        return "#856404";
      case "disconnected":
      case "error":
        return "#721c24";
      default:
        return "#535862";
    }
  }};
`;

const ActionBar = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #e9eaeb;
`;

const ActionButton = styled.button`
  font-size: 14px;
  padding: 6px 12px;
  border: 1px solid #d5d7da;
  border-radius: 6px;
  background-color: #fff;
  color: #535862;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f4f6f8;
  }

  &:active {
    background-color: #e9eaeb;
  }
`;

const NotificationList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const NotificationItem = styled.div<{ $isRead: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: ${({ $isRead }) => ($isRead ? "#fff" : "#f8f9ff")};
  border-bottom: 1px solid #e9eaeb;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f4f6f8;
  }

  &:active {
    background-color: #e9eaeb;
  }
`;

const AvatarWrapper = styled.div`
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const Text = styled.p`
  font-size: 14px;
  color: #181d27;
  margin: 0 0 4px 0;
  word-break: break-word;
`;

const Time = styled.span`
  font-size: 12px;
  color: #858d9d;
`;

const UnreadDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #3f13ff;
  flex-shrink: 0;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  font-size: 16px;
  color: #858d9d;
`;

const LoadMore = styled.div`
  padding: 16px;
  text-align: center;
  font-size: 14px;
  color: #858d9d;
`;

const TimeoutWarning = styled.div`
  padding: 12px 16px;
  background-color: #fff3cd;
  color: #856404;
  text-align: center;
  font-size: 14px;
  border-top: 1px solid #ffeaa7;
`;
