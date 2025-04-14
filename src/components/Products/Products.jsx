import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Products.module.css';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { useCart } from '../Context/CartContext';
import { toast } from 'react-toastify';

function Products() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  const ITEMS_PER_PAGE = 8;

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/products');
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  };

  const { data: allProducts, isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  // Filter and paginate products based on search term
  const filteredProducts = useMemo(() => {
    if (!allProducts?.data) return [];
    
    return allProducts.data.filter(product => 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allProducts?.data, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, page]);

  // Reset to first page when search term changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();
    try {
      const button = e.currentTarget;
      if (!button) return;

      button.disabled = true;
      button.innerHTML = '<i class="fas fa-check"></i> Added';
      button.classList.add(styles.added);

      await addToCart(productId);
      
      setTimeout(() => {
        if (button) {
          button.disabled = false;
          button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
          button.classList.remove(styles.added);
        }
      }, 2000);
    } catch (err) {
      const button = e.currentTarget;
      if (button) {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        button.classList.remove(styles.added);
      }
      toast.error(err.message || 'Failed to add product to cart');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <ClipLoader color="#3498db" size={50} />
        <p className={styles.loadingText}>Loading Products...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.errorContainer}>
        <i className="fas fa-exclamation-circle"></i>
        <p className={styles.errorText}>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className={styles.productsContainer}>
      <div className={styles.filters}>
        <input 
          type="text" 
          value={searchTerm}
          placeholder="Search products..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <span className={styles.resultsCount}>
          Found {filteredProducts.length} products
        </span>
      </div>

      {filteredProducts.length === 0 ? (
        <div className={styles.noResults}>
          <p>No products found. Try a different search term.</p>
        </div>
      ) : (
        <div className={styles.productsGrid}>
          {paginatedProducts.map(product => (
            <div 
              key={product._id} 
              className={styles.productCard}
              onClick={() => handleProductClick(product._id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleProductClick(product._id);
                }
              }}
            >
              <div className={styles.productImageContainer}>
                <img src={product.imageCover} alt={product.title} className={styles.productImage} />
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productTitle}>{product.title}</h3>
                <p className={styles.productPrice}>
                  ${product.priceAfterDiscount || product.price}
                  {product.priceAfterDiscount && (
                    <span className={styles.originalPrice}>${product.price}</span>
                  )}
                </p>
                <p className={styles.productRating}>
                  <i className="fas fa-star" style={{ color: '#f1c40f' }}></i>
                  {product.ratingsAverage} ({product.ratingsQuantity} reviews)
                </p>
                <button
                  className={styles.addToCartButton}
                  onClick={(e) => handleAddToCart(e, product._id)}
                  data-product-id={product._id}
                >
                  <i className="fas fa-shopping-cart"></i>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredProducts.length > 0 && (
        <div className={styles.pagination}>
          <button 
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1}
            className={styles.pageButton}
          >
            <i className="fas fa-chevron-left"></i> Previous
          </button>
          <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
          <button 
            onClick={() => setPage(prev => prev + 1)}
            disabled={page === totalPages}
            className={styles.pageButton}
          >
            Next <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
}

export default Products; 