"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type ModalType = "none" | "logout" | "theme" | "support" | "customer" | "ai_setup" | "profile" | "notifications";

interface ModalContextType {
  activeModal: ModalType;
  openModal: (modalName: ModalType) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType>("none");

  const openModal = (modalName: ModalType) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal("none");
  };

  return (
    <ModalContext.Provider value={{ activeModal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    // Safe fallback to prevent crashes if used outside of provider temporarily
    console.warn("useModal must be used within a ModalProvider. Providing fallback.");
    return {
      activeModal: "none" as ModalType,
      openModal: (modalName: ModalType) => console.warn(`Fallback: Attempted to open modal: ${modalName}`),
      closeModal: () => console.warn("Fallback: Attempted to close modal"),
    };
  }
  return context;
}
