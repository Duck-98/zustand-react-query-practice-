import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Restore, Block } from '@/types';

interface LoginState {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  removeAccessToken: () => void;
}

interface RestoreState {
  restore?: Restore[];
  setRestore: (restore: Restore[] | undefined) => void;
}

interface BlockState {
  block?: Block[];
  setBlock: (block: Block[] | undefined) => void;
}

export const LoginStore = (set: (fn: (state: LoginState) => LoginState) => void) => ({
  accessToken: (typeof window !== 'undefined' && localStorage.getItem('accessToken')) || null,
  setAccessToken: (token: string) => {
    localStorage.setItem('accessToken', token);
    set((state) => ({ ...state, accessToken: token }));
  },
  removeAccessToken: () => {
    localStorage.removeItem('accessToken');
    set((state) => ({ ...state, accessToken: null }));
  },
});

export const useStore = create(devtools(LoginStore));

export const RestoreStore = (set: (fn: (state: RestoreState) => RestoreState) => void) => ({
  restore: null,
  setRestore: (restore: Restore[] | undefined) => {
    set((state) => ({ ...state, restore }));
  },
});

export const useRestoreStore = create(devtools(RestoreStore));

export const BlockStore = (set: (fn: (state: BlockState) => BlockState) => void) => ({
  block: null,
  setBlock: (block: Block[] | undefined) => {
    set((state) => ({ ...state, block }));
  },
});

export const useBlockStore = create(devtools(BlockStore));
