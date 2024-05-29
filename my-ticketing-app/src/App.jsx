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
import TicketForm from './components/Tickets/TicketForm';
import TicketDetail from './components/Tickets/TicketDetail';
import ProjectTickets from './components/Projects/ProjectTickets';
import Statistics from './components/Statistics/Statistics';

function App() {

  const ProtectedRoute = ({ role, children }) => {
    const { role: userRole } = useAuth();

    if (role && role !== userRole) {
      return <Navigate to="/projects" />;
    }

    return children;
  };

  const LayoutProtectedWithHeader = () => {
    const { isLoggedIn, loading, role } = useAuth();

    if (loading) {
      return <div>Loading...</div>; // ou un spinner de chargement
    }

    if (!isLoggedIn) {
      return <Navigate to="/login" />;
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
          path: '/',
          element: <Navigate to="/projects" />
        },
        {
          path: 'utilisateurs',
          element: <ProtectedRoute role="Développeur"><GestionUsers /></ProtectedRoute>
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
          path: 'projects/:id/tickets',
          element: <ProjectTickets /> 
        },
        {
          path: 'tickets/new',
          element: <TicketForm />
        },
        {
          path: 'tickets/:id',
          element: <TicketDetail />
        },
        {
          path: 'tickets/:id/edit',
          element: <TicketForm />
        },
        {
          path: 'statistics',
          element: <Statistics />
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
