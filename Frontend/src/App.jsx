import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import { Toaster } from "react-hot-toast";
import Dashboard from './components/Dashboard';
import Protected from './components/Protected';

const router = createBrowserRouter(
  [
    {
      path: "/",
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
      <Toaster />
      <RouterProvider router={router} />
    </>
  )
}

export default App
