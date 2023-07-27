import { create } from "zustand";

interface useProModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

/**
 * Global state for the Pro modal component.
 * This allows multiple components to access the state of the modal.
 * Components can also update the state of the modal to open it or close it.
 * @returns (useProModalStore): The state of the Pro modal
 */
export const useProModal = create<useProModalStore>((set) => ({
  isOpen: false, // closed by default
  onOpen: () => set({ isOpen: true }), // open the modal
  onClose: () => set({ isOpen: false }), // close the modal
}));
