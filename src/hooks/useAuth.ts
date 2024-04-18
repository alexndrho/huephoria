import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, onAuthStateChanged } from 'firebase/auth';
import { limit, onSnapshot, query, where } from 'firebase/firestore';
import { auth, usersCollectionRef } from '../config/firebase';
import { uidExistsWithUsername } from '../services/user';
import IUser from '../types/IUser';

function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<IUser | null>(null);

  useEffect(() => {
    const unSubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (!user) return;
      if (!(await uidExistsWithUsername(user.uid))) {
        navigate('/create-username');
      }

      const q = query(
        usersCollectionRef,
        where('uid', '==', user.uid),
        limit(1)
      );
      const unSubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setUserData(doc.data() as IUser);
        });
      });

      return () => unSubscribeSnapshot();
    });

    return () => unSubscribeAuth();
  }, [navigate]);

  return { user, userData };
}

export default useAuth;
