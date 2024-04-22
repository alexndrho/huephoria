import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { onUser } from '../services/user';
import IUser from '../types/IUser';

function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<IUser | null>(null);

  useEffect(() => {
    const unSubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (!user) return;

      const unsubscribe = onUser(user.uid, (userData) => {
        if (!userData) {
          navigate('/create-username');
          return;
        }

        setUserData(userData);
      });

      return () => unsubscribe();
    });

    return () => unSubscribeAuth();
  }, [navigate]);

  return { user, userData };
}

export default useAuth;
