import { create } from 'zustand';

interface AuthModalState {
  isOpen: boolean;
  mode: 'login' | 'register';
  defaultMode: 'login' | 'register';
  openModal: (mode?: 'login' | 'register') => void;
  closeModal: () => void;
}

export const useAuthModal = create<AuthModalState>((set, get) => ({
  isOpen: false,
  mode: 'login',
  defaultMode: 'login',
  openModal: (mode = 'login') => set({ isOpen: true, mode, defaultMode: mode }),
  closeModal: () => set({ isOpen: false }),
}));