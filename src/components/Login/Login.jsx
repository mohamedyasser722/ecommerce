import React from 'react';
import styles from './Login.module.css';

function Login() {
  return (
    <div className={styles.login}>
      <h1>Login</h1>
      <form className={styles.loginForm}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login; 