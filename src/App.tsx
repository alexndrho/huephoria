import { RouterProvider } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import PaletteSubmit from './pages/PaletteSubmit';
import PalettePost from './pages/PalettePost';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Settings';
import ForgotPassword from './pages/ForgotPassword';
import CreateUsername from './pages/CreateUsername';
import UserManagement from './pages/UserManagement';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/palette',
    children: [
      {
        path: 'submit',
        element: <PaletteSubmit />,
      },
      {
        path: ':id',
        element: <PalettePost />,
      },
    ],
  },

  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/create-username',
    element: <CreateUsername />,
  },
  {
    path: '/usermgmt',
    element: <UserManagement />,
  },

  {
    path: '*',
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
