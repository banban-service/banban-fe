"use client";

import styled from "styled-components";
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CloseThickIcon } from "@/components/svg";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  isCloseButton?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  isCloseButton = true,
}: ModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setModalRoot(document.getElementById("modal-root"));
    setMounted(true);
  }, []);

  // ESC 키를 눌렀을 때 모달이 닫히는 UX
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (mounted) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [onClose, mounted]);

  if (!isOpen || !modalRoot) return null;

  return createPortal(
    <Dimmed className="modal-backdrop" onClick={onClose}>
      {/* 내부에서 발생한 클릭 이벤트가 Dimmed로 전파되는 걸 차단 */}
      <ModalBox
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-content"
      >
        {isCloseButton && (
          <CloseButton onClick={onClose} aria-label="모달 닫기">
            <CloseThickIcon color="#414651" width={12} height={12} />
          </CloseButton>
        )}
        {children}
      </ModalBox>
    </Dimmed>,
    modalRoot,
  );
};

const Dimmed = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  position: relative;
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  width: 400px;
  text-align: center;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  border-radius: 100%;
  background-color: #fafafa;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ModalHeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ModalFooterWrapper = styled.div`
  display: flex;
  justify-content: end;
`;

const Header = ({ children }: { children: ReactNode }) => (
  <ModalHeaderWrapper>{children}</ModalHeaderWrapper>
);
Header.displayName = "Modal.Header";
Modal.Header = Header;

const Body = ({ children }: { children: ReactNode }) => <div>{children}</div>;
Body.displayName = "Modal.Body";
Modal.Body = Body;

const Footer = ({ children }: { children: ReactNode }) => (
  <ModalFooterWrapper>{children}</ModalFooterWrapper>
);
Footer.displayName = "Modal.Footer";
Modal.Footer = Footer;
