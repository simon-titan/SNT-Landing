"use client";
import { createContext, useContext, useState } from "react";
const RegistrationModalContext = createContext(undefined);
export function RegistrationModalProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    return (<RegistrationModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </RegistrationModalContext.Provider>);
}
export function useRegistrationModal() {
    const context = useContext(RegistrationModalContext);
    if (context === undefined) {
        throw new Error("useRegistrationModal must be used within a RegistrationModalProvider");
    }
    return context;
}
