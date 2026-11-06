import { createContext, useContext, useState } from "react";

const ModalContext = createContext({
    openModal: () => { },
    closeModal: () => { },
    closeAllModals: () => { },
    openModals: 0,
});

export function ModalProvider({ children }) {
    const [openModals, setOpenModals] = useState(0);

    const openModal = () => setOpenModals(n => n + 1);
    const closeModal = () => setOpenModals(n => Math.max(0, n - 1));

    const closeAllModals = () => {
        setOpenModals(0);

        // cleanup bootstrap modal
        document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
        document.body.classList.remove("modal-open");
    };

    return (
        <ModalContext.Provider
            value={{ openModal, closeModal, closeAllModals, openModals }}
        >
            {children}
        </ModalContext.Provider>
    );
}

export function useModalManager() {
    return useContext(ModalContext);
}
