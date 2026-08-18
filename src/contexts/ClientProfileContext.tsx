import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ensureClient, subscribeClient } from '@/lib/clients';
import { isAdminEmail } from '@/lib/admin';
import { isFirebaseConfigured } from '@/lib/firebase';
import type { Client } from '@/types/client';

export interface ClientProfileContextValue {
  profile: Client | null;
  loading: boolean;
  isAdmin: boolean;
  isSignedIn: boolean;
  isVerified: boolean; // status === 'activo'
  isPending: boolean; // status === 'por-verificar' AND profile has name filled
  needsOnboarding: boolean; // profile empty (name === '') — first time
  refresh: () => Promise<void>;
}

const Ctx = createContext<ClientProfileContextValue | null>(null);

export function ClientProfileProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const email = user?.email ?? null;
  const uid = user?.uid ?? null;
  const isAdmin = isAdminEmail(email);

  const refresh = useCallback(async () => {
    if (!uid || !email || !isFirebaseConfigured) return;
    setLoading(true);
    try {
      const c = await ensureClient(uid, email);
      setProfile(c);
    } finally {
      setLoading(false);
    }
  }, [uid, email]);

  useEffect(() => {
    if (!user || !isFirebaseConfigured) {
      setProfile(null);
      return;
    }
    // Admins do not need a client profile.
    if (isAdminEmail(user.email)) {
      setProfile(null);
      return;
    }
    setLoading(true);
    let unsub = () => {};
    (async () => {
      try {
        await ensureClient(user.uid, user.email ?? '');
        unsub = subscribeClient(user.uid, (c) => {
          setProfile(c);
          setLoading(false);
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[ClientProfile] ensureClient failed:', err);
        setLoading(false);
      }
    })();
    return () => unsub();
  }, [user]);

  const value = useMemo<ClientProfileContextValue>(() => {
    const signedIn = Boolean(user);
    const hasName = Boolean(profile?.name?.trim() && profile?.company?.trim());
    return {
      profile,
      loading: authLoading || loading,
      isAdmin,
      isSignedIn: signedIn,
      isVerified: profile?.status === 'activo',
      isPending: profile?.status === 'por-verificar' && hasName,
      needsOnboarding: signedIn && !isAdmin && Boolean(profile) && !hasName,
      refresh,
    };
  }, [profile, loading, authLoading, isAdmin, user, refresh]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useClientProfile(): ClientProfileContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useClientProfile must be used inside <ClientProfileProvider>');
  return ctx;
}
