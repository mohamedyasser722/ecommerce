import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';
import { useContext } from 'react';
import { UserContext } from '../Context/UserContext';

function Login() {
  const {setUserToken} = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(8, 'Password must be at least 8 characters').required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setApiError('');
        const { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signin', values);
        if (data.message === 'success') {
          localStorage.setItem('token', data.token);
          setUserToken(data.token);
          navigate('/'); // Redirect to a dashboard or home page
        }
      } catch (error) {
        setApiError('Login failed. Please check your credentials.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.formTitle}>Login</h2>
      {apiError && (
        <div className="alert alert-danger">{apiError}</div>
      )}
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className={`${styles.formControl} ${formik.touched.email && formik.errors.email ? styles.inputError : ''}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className={styles.error}>{formik.errors.email}</div>
          ) : null}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.formLabel}>Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className={`${styles.formControl} ${formik.touched.password && formik.errors.password ? styles.inputError : ''}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className={styles.error}>{formik.errors.password}</div>
          ) : null}
        </div>

        <button type="submit" className={styles.submitButton} disabled={isLoading || formik.isSubmitting || !(formik.isValid && formik.dirty)}>
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin me-2"></i>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>

      <Link to="/register" className={styles.loginLink}>
        Don't have an account? Register here
      </Link>
    </div>
  );
}

export default Login; 