import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import styles from './ProductDetails.module.css';
import { ClipLoader } from 'react-spinners';

function ProductDetails() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchProductDetails = async () => {
    try {
      const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
      return data;
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch product details');
    }
  };

  const { data: productData, isLoading, isError, error } = useQuery({
    queryKey: ['product', id],
    queryFn: fetchProductDetails,
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <ClipLoader color="#3498db" size={50} />
        <p className={styles.loadingText}>Loading Product Details...</p>
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

  const product = productData?.data;
  const displayedImage = selectedImage || product.imageCover;

  return (
    <div className={styles.productDetails}>
      <div className={styles.productGallery}>
        <div className={styles.mainImageContainer}>
          <img 
            src={displayedImage} 
            alt={product.title} 
            className={styles.mainImage} 
          />
        </div>
        <div className={styles.thumbnails}>
          <div 
            className={`${styles.thumbnailContainer} ${product.imageCover === displayedImage ? styles.active : ''}`}
            onClick={() => setSelectedImage(product.imageCover)}
          >
            <img 
              src={product.imageCover} 
              alt={`${product.title} - Cover`}
              className={styles.thumbnail}
            />
          </div>
          {product.images.map((image, index) => (
            <div 
              key={index}
              className={`${styles.thumbnailContainer} ${image === displayedImage ? styles.active : ''}`}
              onClick={() => setSelectedImage(image)}
            >
              <img 
                src={image} 
                alt={`${product.title} - View ${index + 1}`}
                className={styles.thumbnail}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.productInfo}>
        <div className={styles.header}>
          <h1 className={styles.title}>{product.title}</h1>
          <div className={styles.brand}>
            <img src={product.brand.image} alt={product.brand.name} className={styles.brandImage} />
            <span>{product.brand.name}</span>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.rating}>
            <i className="fas fa-star"></i>
            <span>{product.ratingsAverage} ({product.ratingsQuantity} reviews)</span>
          </div>
          <div className={styles.sold}>
            <i className="fas fa-shopping-cart"></i>
            <span>{product.sold} sold</span>
          </div>
        </div>

        <div className={styles.price}>
          <span className={styles.amount}>${product.price}</span>
          {product.quantity > 0 ? (
            <span className={styles.stock}>In Stock ({product.quantity} available)</span>
          ) : (
            <span className={styles.outOfStock}>Out of Stock</span>
          )}
        </div>

        <div className={styles.category}>
          <span>Category: </span>
          <span className={styles.categoryName}>{product.category.name}</span>
          {product.subcategory?.map(sub => (
            <span key={sub._id} className={styles.subcategoryName}> &gt; {sub.name}</span>
          ))}
        </div>

        <div className={styles.description}>
          <h2>Description</h2>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails; 