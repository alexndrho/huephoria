import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './pages/Login';
import AppContainer from './components/AppContainer';
import { auth } from './config/firebase';

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsUserLoggedIn(true);
      } else {
        setIsUserLoggedIn(false);
      }
    });
  }, []);

  if (!isUserLoggedIn) {
    return <Login />;
  }

  return <AppContainer />;
}

export default App;
