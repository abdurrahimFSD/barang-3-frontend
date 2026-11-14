import { create } from "zustand"

interface ModalState {
    isOpen: boolean
    modalType: string | null
    data: unknown
    openModal: (type: string, data?: unknown) => void
    closeModal: () => void
}

export const useModalStore = create<ModalState>((set) => ({
    isOpen: false,
    modalType: null,
    data: null,
    openModal: (type, data = null) =>
        set({
            isOpen: true,
            modalType: type,
            data,
        }),
    closeModal: () =>
        set({
            isOpen: false,
            modalType: null,
            data: null,
        }),
}))
