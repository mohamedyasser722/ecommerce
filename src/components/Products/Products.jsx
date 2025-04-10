import React from 'react';
import styles from './Products.module.css';

function Products() {
  return (
    <div className={styles.products}>
      <h1>Products</h1>
      <div className={styles.productGrid}>
        {/* Product items will be mapped here */}
      </div>
    </div>
  );
}

export default Products; 