import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthUser, PaymentMethod, PublicUser, UserRole } from '@/types/auth';

const USERS_KEY = 'techgear_auth_users_v1';
const SESSION_KEY = 'techgear_auth_session_v1';

type AuthResult = { ok: true; user: PublicUser } | { ok: false; error: string };

interface AuthContextValue {
  currentUser: PublicUser | null;
  signUp: (input: { fullName: string; email: string; password: string; role: UserRole }) => AuthResult;
  logIn: (email: string, password: string, role: UserRole) => AuthResult;
  logOut: () => void;
  updateProfile: (updates: { fullName: string; email: string }) => AuthResult;
  addPaymentMethod: (pm: Omit<PaymentMethod, 'id'>) => void;
  removePaymentMethod: (id: string) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadUsers(): AuthUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore corrupted cache
  }
  return [];
}

function loadSessionId(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function toPublic(user: AuthUser): PublicUser {
  const { password: _password, ...rest } = user;
  return rest;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AuthUser[]>(loadUsers);
  const [sessionId, setSessionId] = useState<string | null>(loadSessionId);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (sessionId) localStorage.setItem(SESSION_KEY, sessionId);
    else localStorage.removeItem(SESSION_KEY);
  }, [sessionId]);

  const currentUser = useMemo<PublicUser | null>(() => {
    const user = users.find((u) => u.id === sessionId);
    return user ? toPublic(user) : null;
  }, [users, sessionId]);

  const signUp: AuthContextValue['signUp'] = ({ fullName, email, password, role }) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === normalizedEmail && u.role === role)) {
      return { ok: false, error: `An account with this email already exists for ${role}s. Try signing in instead.` };
    }
    const user: AuthUser = {
      id: `u-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      fullName: fullName.trim(),
      email: normalizedEmail,
      password,
      role,
      paymentMethods: [],
    };
    setUsers((prev) => [...prev, user]);
    setSessionId(user.id);
    return { ok: true, user: toPublic(user) };
  };

  const logIn: AuthContextValue['logIn'] = (email, password, role) => {
    const normalizedEmail = email.trim().toLowerCase();
    const matchByEmail = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!matchByEmail) {
      return { ok: false, error: 'No account found with that email. Try signing up instead.' };
    }
    const matchByRole = users.find((u) => u.email.toLowerCase() === normalizedEmail && u.role === role);
    if (!matchByRole) {
      return {
        ok: false,
        error: `This email is registered as ${matchByEmail.role === 'admin' ? 'an admin' : 'a customer'}, not ${role === 'admin' ? 'an admin' : 'a customer'}.`,
      };
    }
    if (matchByRole.password !== password) {
      return { ok: false, error: 'Incorrect password.' };
    }
    setSessionId(matchByRole.id);
    return { ok: true, user: toPublic(matchByRole) };
  };

  const logOut = () => setSessionId(null);

  const updateProfile: AuthContextValue['updateProfile'] = ({ fullName, email }) => {
    if (!sessionId) return { ok: false, error: 'Not signed in.' };
    const normalizedEmail = email.trim().toLowerCase();
    const emailTaken = users.some(
      (u) => u.id !== sessionId && u.email.toLowerCase() === normalizedEmail && u.role === currentUser?.role
    );
    if (emailTaken) {
      return { ok: false, error: 'Another account already uses this email.' };
    }
    let updated: AuthUser | undefined;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== sessionId) return u;
        updated = { ...u, fullName: fullName.trim(), email: normalizedEmail };
        return updated;
      })
    );
    return updated ? { ok: true, user: toPublic(updated) } : { ok: false, error: 'Not signed in.' };
  };

  const addPaymentMethod = (pm: Omit<PaymentMethod, 'id'>) => {
    if (!sessionId) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === sessionId
          ? { ...u, paymentMethods: [...u.paymentMethods, { ...pm, id: `pm-${Date.now().toString(36)}` }] }
          : u
      )
    );
  };

  const removePaymentMethod = (id: string) => {
    if (!sessionId) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === sessionId ? { ...u, paymentMethods: u.paymentMethods.filter((pm) => pm.id !== id) } : u
      )
    );
  };

  const value: AuthContextValue = {
    currentUser,
    signUp,
    logIn,
    logOut,
    updateProfile,
    addPaymentMethod,
    removePaymentMethod,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
