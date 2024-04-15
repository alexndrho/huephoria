import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import PalettePost from './pages/PalettePost';
import PaletteSubmit from './pages/PaletteSubmit';
import Settings from './pages/Settings';
import CreateUsername from './pages/CreateUsername';
import NotFound from './pages/NotFound';
import { auth, usersCollectionRef } from './config/firebase';
import { uidExistsWithUsername } from './services/user';
import { limit, onSnapshot, query, where } from 'firebase/firestore';
import IUser from './types/IUser';

function App() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<IUser | null>(null);

  useEffect(() => {
    const unSubscribeAuth = onAuthStateChanged(auth, async (user) => {
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

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/palette">
        <Route path="submit" element={<PaletteSubmit />} />
        <Route path=":id" element={<PalettePost />} />
      </Route>

      <Route path="/" element={<Home />} />
      <Route path="/settings" element={<Settings userData={userData} />} />
      <Route path="/create-username" element={<CreateUsername />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
