// src/App.jsx
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoadingProvider } from './contexts/LoadingContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import GestionUsers from './components/Users/UserList';
import GestionProjects from './components/Projects/ProjectList';
import GestionClients from './components/Clients/ClientList';
import GestionTickets from './components/Tickets/TicketList';
import TicketForm from './components/Tickets/TicketForm';
import TicketDetail from './components/Tickets/TicketDetail';

function App() {

  const LayoutProtectedWithHeader = () => {
    const { isLoggedIn } = useAuth();
    console.log(isLoggedIn);
    if (!isLoggedIn) {
      return <Navigate to={'/login'} />
    }

    return (
      <>
        <Outlet />
      </>
    );
  };

  const routerLogin = [
    {
      children: [
        {
          path: 'login',
          element: <Login />
        },
        {
          path: 'register',
          element: <Register />
        },
      ]
    }
  ];

  const routerPrivate = [
    {
      element: <LayoutProtectedWithHeader />,
      children: [
        {
          path: 'utilisateurs',
          element: <GestionUsers />
        },
        {
          path: 'projects',
          element: <GestionProjects />
        },
        {
          path: 'clients',
          element: <GestionClients />
        },
        {
          path: 'tickets',
          element: <GestionTickets />
        },
        {
          path: 'tickets/new',
          element: <TicketForm />
        },
        {
          path: 'tickets/:id',
          element: <TicketDetail />
        }
      ]
    }
  ];

  const router = createBrowserRouter([
    ...routerLogin,
    ...routerPrivate
  ]);

  return (
      <AuthProvider>
        <LoadingProvider>
          <div>
            <ToastContainer />
          </div>
          <RouterProvider router={router} />
        </LoadingProvider>
      </AuthProvider>
  );
}

export default App;
