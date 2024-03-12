import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import CreateUsername from './pages/CreateUsername';
import { auth } from './config/firebase';
import { uidExistsWithUsername } from './helpers/user';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (await uidExistsWithUsername(user.uid)) {
          navigate('/');
        } else {
          navigate('/create-username');
        }
      }
    });

    return () => unSubscribe();
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/" element={<Home />} />
      <Route path="/create-username" element={<CreateUsername />} />
    </Routes>
  );
}

export default App;
