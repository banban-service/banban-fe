"use client";

import { useState } from "react";
import styled from "styled-components";
import useAuth from "@/hooks/useAuth";
import { Avatar } from "@/components/common/Avatar";
import { ProfileEditModal } from "@/components/profile/ProfileEditModal";
import { CommunityInfoCard } from "@/components/communityInfo/CommunityInfoCard";
import { LogoutIcon, UserProfileIcon, UsersIcon, SettingsIcon } from "@/components/svg";
import { isAdmin as checkIsAdmin } from "@/utils/jwt";
import STORAGE_KEYS from "@/constants/storageKeys";
import { useEffect } from "react";
import { logger } from "@/utils/logger";
import { AdminSettingsModal } from "@/components/admin/AdminSettingsModal";

export default function ProfilePage() {
  const { user, logout, isLoggedIn } = useAuth();
  const [isProfileEditOpen, setProfileEditOpen] = useState(false);
  const [isCommunityInfoOpen, setCommunityInfoOpen] = useState(false);
  const [isAdminSettingsOpen, setAdminSettingsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsAdmin(false);
      return;
    }

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
          : null;

      setIsAdmin(checkIsAdmin(token));
    } catch (error) {
      logger.warn("Failed to check admin status:", error);
      setIsAdmin(false);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn || !user) {
    return (
      <Container>
        <EmptyState>
          <EmptyText>로그인이 필요합니다</EmptyText>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>프로필</Title>
      </Header>

      <ProfileSection>
        <Avatar
          src={user.profileImageUrl || "/user.png"}
          alt={user.username}
          size={80}
        />
        <UserInfo>
          <Nickname>{user.username}</Nickname>
          <Email>{user.email}</Email>
        </UserInfo>
      </ProfileSection>

      <MenuSection>
        <MenuItem onClick={() => setProfileEditOpen(true)}>
          <MenuIcon>
            <UserProfileIcon width={20} height={20} color="#535862" />
          </MenuIcon>
          <MenuText>프로필 편집</MenuText>
        </MenuItem>

        <MenuItem onClick={() => setCommunityInfoOpen(true)}>
          <MenuIcon>
            <UsersIcon width={20} height={20} color="#535862" />
          </MenuIcon>
          <MenuText>커뮤니티 정보</MenuText>
        </MenuItem>

        {isAdmin && (
          <MenuItem onClick={() => setAdminSettingsOpen(true)}>
            <MenuIcon>
              <SettingsIcon width={20} height={20} color="#535862" />
            </MenuIcon>
            <MenuText>관리자 설정</MenuText>
          </MenuItem>
        )}

        <MenuItem onClick={logout}>
          <MenuIcon>
            <LogoutIcon width={20} height={20} color="#535862" />
          </MenuIcon>
          <MenuText>로그아웃</MenuText>
        </MenuItem>
      </MenuSection>

      <ProfileEditModal
        isOpen={isProfileEditOpen}
        onClose={() => setProfileEditOpen(false)}
      />

      {isCommunityInfoOpen && (
        <CommunityInfoCard onClose={() => setCommunityInfoOpen(false)} />
      )}

      <AdminSettingsModal
        isOpen={isAdminSettingsOpen}
        onClose={() => setAdminSettingsOpen(false)}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #f4f6f8;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #fff;
  border-bottom: 1px solid #e9eaeb;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #181d27;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 16px;
  background-color: #fff;
  border-bottom: 1px solid #e9eaeb;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const Nickname = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #181d27;
  margin: 0 0 4px 0;
`;

const Email = styled.p`
  font-size: 14px;
  color: #858d9d;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MenuSection = styled.div`
  margin-top: 12px;
  background-color: #fff;
  border-top: 1px solid #e9eaeb;
  border-bottom: 1px solid #e9eaeb;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border: none;
  border-bottom: 1px solid #e9eaeb;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f4f6f8;
  }

  &:active {
    background-color: #e9eaeb;
  }
`;

const MenuIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f4f6f8;
`;

const MenuText = styled.span`
  font-size: 16px;
  color: #181d27;
  font-weight: 500;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 60px 20px;
`;

const EmptyText = styled.p`
  font-size: 16px;
  color: #858d9d;
  margin: 0;
`;
