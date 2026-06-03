import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import { Toaster } from "react-hot-toast";
import Dashboard from './components/Dashboard';
import Protected from './components/Protected';
import Home from './components/Home';
import { AuthProvider } from "./context/AuthContext";

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
    }
  ]
)

function App() {
  return (
    <>
      <AuthProvider>
        <Toaster />
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  )
}

export default App
