import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import PostDetails from './components/PostDetails';
import Dashboard from './components/Dashboard';
import Protected from './components/Protected';
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
