import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from "react-hot-toast";
import PostDetails from './components/PostDetails';
import Dashboard from './components/Dashboard';
import Protected from './components/Protected';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './components/AdminDashboard';
import Register from './components/Register';
import AddPost from './components/AddPost';
import Login from './components/Login';
import Home from './components/Home';

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <div>
        <Home />
      </div>
    },
    {
      path: "/login",
      element: <div>
        <Login />
      </div>
    },
    {
      path: "/register",
      element: <div>
        <Register />
      </div>
    },
    {
      path: "/dashboard",
      element: <div>
        <Protected>
          <Dashboard />
        </Protected>
      </div>
    },
    {
      path: "/AddPost",
      element: <div>
        <Protected>
          <AddPost />
        </Protected>
      </div>
    },
    {
      path: "/post/:id",
      element: <div>
        <Protected>
          <PostDetails />
        </Protected>
      </div>
    },
    {
      path: "/admin",
      element: <AdminRoute />,
      children: [
        {
          path: "",
          element: <AdminDashboard /> // The content that replaces <Outlet />
        }
      ]
    }
  ]
)

function App() {
  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          <Toaster />
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </>
  )
}

export default App
