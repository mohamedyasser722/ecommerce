import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './components/Home/Home.jsx'
import Layout from './components/Layout/Layout.jsx'
import Login from './components/Login/Login.jsx'
import Register from './components/Register/Register.jsx'
import Categories from './components/Categories/Categories.jsx'
import Products from './components/Products/Products.jsx'
import ProductDetails from './components/ProductDetails/ProductDetails.jsx'
import Cart from './components/Cart/Cart.jsx'
import Brands from './components/Brands/Brands.jsx'
import NotFound from './components/NotFound/NotFound.jsx'
import UserContextProvider from './components/Context/UserContext.js'
import CartContextProvider from './components/Context/CartContext.js'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, 
    children: [
      {
        index: true,
        element: <ProtectedRoute><Home /></ProtectedRoute>
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "products",
        element: <ProtectedRoute><Products /></ProtectedRoute>
      },
      {
        path: "product/:id",
        element: <ProtectedRoute><ProductDetails /></ProtectedRoute>
      },
      {
        path: "categories",
        element: <ProtectedRoute><Categories /></ProtectedRoute>
      },
      {
        path: "cart",
        element: <ProtectedRoute><Cart /></ProtectedRoute>
      },
      {
        path: "brands",
        element: <ProtectedRoute><Brands /></ProtectedRoute>
      },
      {
        path:"*",
        element: <NotFound />
      }
    ]
  }
])

function App() {
  return (
    <UserContextProvider>
      <CartContextProvider>
        <RouterProvider router={router} />
        <ToastContainer position="bottom-right" />
      </CartContextProvider>
    </UserContextProvider>
  )
}

export default App;
