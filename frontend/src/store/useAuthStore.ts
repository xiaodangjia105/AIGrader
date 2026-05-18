import { create } from 'zustand';
import type { User, UserRole } from '../types';

const STORAGE_KEY = 'aigrader_auth';

interface StoredAuth {
  user: User | null;
  token: string | null;
}

function loadAuth(): StoredAuth {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { user: null, token: null };
}

function saveAuth(user: User | null, token: string | null) {
  if (user && token) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

interface AuthState {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

const initial = loadAuth();

export const useAuthStore = create<AuthState>((set) => ({
  user: initial.user,
  role: initial.user?.role ?? null,
  token: initial.token,
  setAuth: (user, token) => {
    saveAuth(user, token);
    set({ user, role: user.role, token });
  },
  logout: () => {
    saveAuth(null, null);
    set({ user: null, role: null, token: null });
  },
}));