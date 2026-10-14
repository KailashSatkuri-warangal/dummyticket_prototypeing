'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AppRole } from '@/types';
import type { SessionUser } from './types';
import {
  getSessionUserSync,
  signIn as storeSignIn,
  signOut as storeSignOut,
  switchRole as storeSwitchRole,
} from './store';

export function useDemoSession(): {
  user: SessionUser | null;
  ready: boolean;
  signInAs: (profileId?: string) => void;
  signOut: () => void;
  switchRole: (role: AppRole) => void;
} {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(getSessionUserSync());
    setReady(true);
  }, []);

  const signInAs = useCallback((profileId?: string) => {
    setUser(storeSignIn(profileId));
  }, []);

  const signOut = useCallback(() => {
    storeSignOut();
    setUser(null);
  }, []);

  const switchRole = useCallback((role: AppRole) => {
    setUser(storeSwitchRole(role));
  }, []);

  return { user, ready, signInAs, signOut, switchRole };
}
