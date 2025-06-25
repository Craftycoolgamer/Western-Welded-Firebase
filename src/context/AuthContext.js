import { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      // Check if user is admin (you might want to store this in Firestore)
      const isAdmin = user.email === 'admin@example.com';
      setCurrentUser({ ...user, isAdmin });
    } else {
      setCurrentUser(null);
      setLoading(false);
    }
  });

    return unsubscribe;
  }, [auth]);

  if (loading) {
    return <div className="auth-loading">Loading user session...</div>;
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}