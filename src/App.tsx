import Login from './pages/Login';
import Signup from './pages/Signup';
import AppContainer from './components/AppContainer';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/" element={<AppContainer />} />
    </Routes>
  );
}

export default App;
