
'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup, User as FirebaseUserType } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { AppUser, Roles } from '@/types';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchUserRoles = useCallback(async (firebaseUser: FirebaseUserType): Promise<Roles> => {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      // Determine admin status (expected to be nested under 'roles')
      const isAdminRole = (userData.roles && typeof userData.roles === 'object' && userData.roles.admin !== undefined) 
                          ? !!userData.roles.admin 
                          : false;

      // Determine clean status:
      // 1. Check if 'clean' is explicitly defined under 'userData.roles' object.
      // 2. If not, check if 'clean' is a top-level field in 'userData'.
      let isCleanRole = false;
      if (userData.roles && typeof userData.roles === 'object' && userData.roles.clean !== undefined) {
        isCleanRole = !!userData.roles.clean; // Prefer nested 'clean' if explicitly present
      } else if (userData.clean !== undefined) { // Fallback to top-level 'clean'
        isCleanRole = !!userData.clean;
      }
      
      return {
        admin: isAdminRole,
        clean: isCleanRole,
      };
    } else {
      // Create user document if it doesn't exist
      // For new users, 'clean' will be initialized as nested under 'roles' for consistency with 'admin'.
      const newUserRoles: Roles = { admin: false, clean: false }; 
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        roles: newUserRoles, // 'clean' is nested here
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return newUserRoles;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const roles = await fetchUserRoles(firebaseUser);
        const appUser: AppUser = {
          uid: firebaseUser.uid, 
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          isAnonymous: firebaseUser.isAnonymous,
          metadata: firebaseUser.metadata,
          providerData: firebaseUser.providerData,
          refreshToken: firebaseUser.refreshToken,
          tenantId: firebaseUser.tenantId,
          delete: firebaseUser.delete,
          getIdToken: firebaseUser.getIdToken,
          getIdTokenResult: firebaseUser.getIdTokenResult,
          reload: firebaseUser.reload,
          toJSON: firebaseUser.toJSON,
          providerId: firebaseUser.providerId,
          roles,
        };
        setUser(appUser);
        setIsAdmin(!!roles?.admin || !!roles?.clean);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserRoles]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
