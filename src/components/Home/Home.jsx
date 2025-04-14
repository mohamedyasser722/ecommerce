import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Home.module.css';
import { ClipLoader } from 'react-spinners';
import { useCart } from '../Context/CartContext';
import { toast } from 'react-toastify';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/categories');
      setCategories(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = 'https://ecommerce.routemisr.com/api/v1/products';
      if (selectedCategory) {
        url = `https://ecommerce.routemisr.com/api/v1/products?category[in]=${selectedCategory}`;
      }
      const { data } = await axios.get(url);
      setFeaturedProducts(data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleAddToCart = async (productId) => {
    try {
      // Find the product being added
      const product = featuredProducts.find(p => p._id === productId);
      if (!product) return;

      // Show immediate visual feedback
      const button = document.querySelector(`[data-product-id="${productId}"]`);
      if (button) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-check"></i> Added';
        button.classList.add(styles.added);
      }

      // Make API request in background
      await addToCart(productId);
      
      // Keep the visual feedback for a moment
      setTimeout(() => {
        if (button) {
          button.disabled = false;
          button.innerHTML = 'Add to Cart';
          button.classList.remove(styles.added);
        }
      }, 2000);
    } catch (error) {
      // Revert the button state on error
      const button = document.querySelector(`[data-product-id="${productId}"]`);
      if (button) {
        button.disabled = false;
        button.innerHTML = 'Add to Cart';
        button.classList.remove(styles.added);
      }
      toast.error(error.message || 'Failed to add product to cart');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <ClipLoader color="#3498db" size={50} />
        <p>Loading amazing products for you...</p>
      </div>
    );
  }

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Welcome to Our Store</h1>
          <p>Discover amazing products at great prices</p>
          <Link to="/products" className={styles.shopNowButton}>
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categories}>
        <h2>Shop by Category</h2>
        <div className={styles.categoryGrid}>
          <div 
            className={`${styles.categoryCard} ${!selectedCategory ? styles.selected : ''}`}
            onClick={() => handleCategoryClick(null)}
          >
            <div className={styles.categoryContent}>
              <h3>All Products</h3>
            </div>
          </div>
          {categories.map(category => (
            <div 
              key={category._id} 
              className={`${styles.categoryCard} ${selectedCategory === category._id ? styles.selected : ''}`}
              onClick={() => handleCategoryClick(category._id)}
            >
              <img src={category.image} alt={category.name} />
              <div className={styles.categoryContent}>
                <h3>{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className={styles.featuredProducts}>
        <h2>{selectedCategory ? categories.find(c => c._id === selectedCategory)?.name || 'Category Products' : 'All Products'}</h2>
        <div className={styles.productGrid}>
          {featuredProducts.map(product => (
            <div key={product._id} className={styles.productCard}>
              <img src={product.imageCover} alt={product.title} />
              <div className={styles.productInfo}>
                <h3>{product.title}</h3>
                <div className={styles.priceRating}>
                  <span className={styles.price}>
                    ${product.priceAfterDiscount || product.price}
                    {product.priceAfterDiscount && (
                      <span className={styles.originalPrice}>${product.price}</span>
                    )}
                  </span>
                  <span className={styles.rating}>
                    <i className="fas fa-star"></i> {product.ratingsAverage}
                  </span>
                </div>
                <p className={styles.brand}>{product.brand?.name}</p>
                <button 
                  onClick={() => handleAddToCart(product._id)}
                  className={styles.addToCartButton}
                  data-product-id={product._id}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promotional Section */}
      <section className={styles.promoSection}>
        <div className={styles.promoCard}>
          <i className="fas fa-truck"></i>
          <h3>Free Shipping</h3>
          <p>On orders over $50</p>
        </div>
        <div className={styles.promoCard}>
          <i className="fas fa-undo"></i>
          <h3>Easy Returns</h3>
          <p>30-day return policy</p>
        </div>
        <div className={styles.promoCard}>
          <i className="fas fa-lock"></i>
          <h3>Secure Payment</h3>
          <p>100% secure checkout</p>
        </div>
        <div className={styles.promoCard}>
          <i className="fas fa-headset"></i>
          <h3>24/7 Support</h3>
          <p>We're here to help</p>
        </div>
      </section>
    </div>
  );
}

export default Home; 