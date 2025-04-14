import React from 'react';
import { useCart } from '../Context/CartContext';
import styles from './Cart.module.css';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

function Cart() {
  const { cart, loading, error, updateQuantity, removeItem, clearCart } = useCart();

  const handleUpdateQuantity = async (productId, currentCount, change) => {
    const newCount = Math.max(1, currentCount + change); // Prevent going below 1
    try {
      await updateQuantity(productId, newCount);
    } catch (err) {
      toast.error(err.message || 'Failed to update cart');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      // Call the remove item function - CartContext now handles the optimistic update
      await removeItem(productId);
      toast.success('Item removed from cart!');
    } catch (err) {
      toast.error(err.message || 'Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success('Cart cleared successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to clear cart');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <ClipLoader color="#3498db" size={50} />
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
      </div>
    );
  }

  if (!cart || !cart.data || cart.data.products.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <i className="fas fa-shopping-cart"></i>
        <h2>Your cart is empty</h2>
        <p>Add some products to your cart to see them here!</p>
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartHeader}>
        <h2>Your Shopping Cart</h2>
        <button 
          className={styles.clearCartButton}
          onClick={handleClearCart}
          disabled={loading}
        >
          <i className="fas fa-trash"></i> Clear Cart
        </button>
      </div>

      <div className={styles.cartItems}>
        {cart.data.products.map((item) => (
          <div key={item._id} className={styles.cartItem}>
            <img 
              src={item.product.imageCover} 
              alt={item.product.title} 
              className={styles.productImage}
            />
            
            <div className={styles.productInfo}>
              <h3>{item.product.title}</h3>
              <p className={styles.price}>${item.price} per item</p>
              <p className={styles.brand}>Brand: {item.product.brand.name}</p>
            </div>

            <div className={styles.quantityControls}>
              <button 
                onClick={() => handleUpdateQuantity(item.product._id, item.count, -1)}
                disabled={loading || item.count <= 1}
              >
                <i className="fas fa-minus"></i>
              </button>
              <span>{item.count}</span>
              <button 
                onClick={() => handleUpdateQuantity(item.product._id, item.count, 1)}
                disabled={loading}
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>

            <div className={styles.itemTotal}>
              <p>Total: ${item.price * item.count}</p>
              <button 
                className={styles.removeButton}
                onClick={() => handleRemoveItem(item.product._id)}
                disabled={loading}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.cartSummary}>
        <div className={styles.summaryItem}>
          <span>Total Items:</span>
          <span>{cart.numOfCartItems}</span>
        </div>
        <div className={styles.summaryItem}>
          <span>Total Price:</span>
          <span>${cart.data.totalCartPrice}</span>
        </div>
        <button className={styles.checkoutButton}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart; 