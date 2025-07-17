import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const register = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const newRole = email.endsWith('@admin.com') ? 'superuser' : 'user';
    await setDoc(doc(db, 'users', result.user.uid), { role: newRole });
    return result;
  };

  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const snap = await getDoc(doc(db, 'users', u.uid));
        setRole(snap.exists() ? snap.data().role : 'user');
        setUser(u);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = { user, role, login, register, logout };
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}