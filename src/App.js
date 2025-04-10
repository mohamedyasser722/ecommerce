import './App.css';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Home from './components/Home/Home.jsx'
import Layout from './components/Layout/Layout.jsx'
import Login from './components/Login/Login.jsx'
import Register from './components/Register/Register.jsx'
import Categories from './components/Categories/Categories.jsx'
import Products from './components/Products/Products.jsx'
import Cart from './components/Cart/Cart.jsx'
import Brands from './components/Brands/Brands.jsx'
import NotFound from './components/NotFound/NotFound.jsx'



let router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, 
    children: [
      {
        index: true,
        element: <Home />
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
        element: <Products />
      },
      {
        path: "categories",
        element: <Categories />
      },
      {
        path: "cart",
        element: <Cart />
      },
      {
        path: "brands",
        element: <Brands />
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
      <RouterProvider router={router} />
    )
}

export default App;
