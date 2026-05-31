import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import { Toaster } from "react-hot-toast";
import Dashboard from './components/Dashboard';

const router= createBrowserRouter(
  [
    {
      path:"/",
      element: <div>
        <Login />
      </div>
    },
    {
      path:"/register",
      element: <div>
        <Register />
      </div>
    },
    {
      path:"/dashboard",
      element: <div>
        <Dashboard />
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
