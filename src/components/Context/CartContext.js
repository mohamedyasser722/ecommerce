import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export default function CartContextProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get cart data on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/cart', {
        headers: { token: token }
      });
      setCart(data);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err.response?.data?.message || 'Failed to fetch cart');
    }
  };

  const addToCart = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login to add items to cart');

      const { data } = await axios.post(
        'https://ecommerce.routemisr.com/api/v1/cart',
        { productId },
        { headers: { token: token } }
      );
      await fetchCart();
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, count) => {  
    let previousCart = null;
    try {
      // Store current state for potential rollback
      previousCart = cart;
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login to update cart');
      
      // Optimistically update the UI immediately
      setCart(prevCart => {
        if (!prevCart?.data?.products) return prevCart;
        
        const updatedProducts = prevCart.data.products.map(item => {
          if (item.product._id === productId) {
            return {
              ...item,
              count: count
            };
          }
          return item;
        });

        // Calculate new total
        const newTotalCartPrice = updatedProducts.reduce((total, item) => 
          total + (item.price * item.count), 0);

        return {
          ...prevCart,
          numOfCartItems: updatedProducts.reduce((total, item) => total + item.count, 0),
          data: {
            ...prevCart.data,
            products: updatedProducts,
            totalCartPrice: newTotalCartPrice
          }
        };
      });

      // Make API request in background
      const response = await axios.put(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        { count },
        { headers: { token } }
      );
      
      setError(null);
      // Return response with silent flag to prevent notification
      return {
        ...response.data,
        silent: true // Add this flag to indicate no notification needed
      };
    } catch (err) {
      // Revert to previous state on error
      setCart(previousCart);
      setError(err.response?.data?.message || 'Failed to update quantity');
      throw err;
    }
  };

  const removeItem = async (productId) => {
    let previousCart = null;
    try {
      previousCart = cart;
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login to remove items');

      // Update UI optimistically
      setCart(prevCart => {
        if (!prevCart?.data?.products) return prevCart;
        
        const updatedProducts = prevCart.data.products.filter(
          item => item.product._id !== productId
        );

        return {
          ...prevCart,
          numOfCartItems: updatedProducts.length,
          data: {
            ...prevCart.data,
            products: updatedProducts,
            totalCartPrice: updatedProducts.reduce((total, item) => 
              total + (item.price * item.count), 0)
          }
        };
      });

      // Make API request in background
      await axios.delete(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        { headers: { token } }
      );
      
      setError(null);
    } catch (err) {
      // Revert to previous state on error
      setCart(previousCart);
      setError(err.response?.data?.message || 'Failed to remove item');
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login to clear cart');

      const { data } = await axios.delete(
        'https://ecommerce.routemisr.com/api/v1/cart',
        { headers: { token: token } }
      );
      await fetchCart();
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      error,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}