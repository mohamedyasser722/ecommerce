import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import styles from './Register.module.css';

function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [googleUser, setGoogleUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const navigate = useNavigate();

  // Function to generate a strong random password
  const generateStrongPassword = () => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '@$!%*?&';
    const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
    
    // Ensure at least one of each character type
    let password = 
      uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)] +
      lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)] +
      numberChars[Math.floor(Math.random() * numberChars.length)] +
      specialChars[Math.floor(Math.random() * specialChars.length)];
    
    // Add more random characters to meet minimum length of 8
    while (password.length < 12) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password characters
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  };

  // Handle Google login success
  const handleGoogleLoginSuccess = (credentialResponse) => {
    try {
      // Decode the credential to get user information
      const decodedInfo = jwtDecode(credentialResponse.credential);
      console.log("Google user info:", decodedInfo);
      
      // Store Google user info in state
      setGoogleUser({
        name: decodedInfo.name,
        email: decodedInfo.email,
        // Generate a random password for the user
        password: generateStrongPassword()
      });
      
      // Clear any previous errors
      setApiError('');
      setPhoneError('');
      
    } catch (error) {
      console.error("Error processing Google login:", error);
      setApiError("Failed to process Google Sign-In. Please try again or use the regular registration form.");
    }
  };

  // Handle Google login error
  const handleGoogleLoginError = () => {
    setApiError("Google Sign-In failed. Please try again or use the regular registration form.");
  };

  // Handle phone submission after Google login
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone number
    if (!phoneNumber.match(/^[0-9]{11}$/)) {
      setPhoneError("Phone number must be 11 digits");
      return;
    }
    
    try {
      setIsLoading(true);
      setPhoneError('');
      setApiError('');
      
      // Call the signup API with Google data + phone
      const response = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signup', {
        name: googleUser.name,
        email: googleUser.email,
        password: googleUser.password,
        rePassword: googleUser.password,
        phone: phoneNumber
      });
      
      // Handle successful response
      if (response.data.message === 'success') {
        // Store token in localStorage
        localStorage.setItem('userToken', response.data.token);
        
        console.log('User registered successfully with Google:', response.data.user);
        
        // Redirect to login page after successful registration
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response && error.response.data) {
        setApiError(error.response.data.message || 'Registration failed. Please try again.');
      } else {
        setApiError('An error occurred during registration. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cancel Google registration and go back to normal form
  const handleCancelGoogleRegistration = () => {
    setGoogleUser(null);
    setPhoneNumber('');
    setPhoneError('');
  };

  // Define validation schema with Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Name must be at least 3 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]{11}$/, 'Phone number must be 11 digits')
      .required('Phone number is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
      .required('Password is required'),
    rePassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      rePassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setApiError('');
        
        // Call the signup API
        const response = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signup', {
          name: values.name,
          email: values.email,
          password: values.password,
          rePassword: values.rePassword,
          phone: values.phone
        });
        
        // Handle successful response
        if (response.data.message === 'success') {
          // Store token in localStorage
          localStorage.setItem('userToken', response.data.token);
          
          // You might want to store user data or do other operations
          console.log('User registered successfully:', response.data.user);
          
          // Redirect to login page after successful registration
          navigate('/login');
        }
      } catch (error) {
        // Handle error
        console.error('Registration error:', error);
        if (error.response && error.response.data) {
          // Use the message field from the error response
          setApiError(error.response.data.message || 'Registration failed. Please try again.');
        } else {
          setApiError('An error occurred during registration. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className={styles.registerContainer}>
      <h2 className={styles.formTitle}>Create Account</h2>
      
      {apiError && (
        <div className="alert alert-danger">{apiError}</div>
      )}
      
      {/* Google user phone input form */}
      {googleUser ? (
        <div className={styles.googlePhoneForm}>
          <div className="alert alert-success">
            <i className="fas fa-check-circle me-2"></i>
            Successfully signed in with Google as {googleUser.email}
          </div>
          
          <p className="mb-3">Please provide your phone number to complete registration:</p>
          
          <form onSubmit={handlePhoneSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="googlePhone" className={styles.formLabel}>Phone Number</label>
              <input
                id="googlePhone"
                type="tel"
                placeholder="Enter your phone number"
                className={`${styles.formControl} ${phoneError ? styles.inputError : ''}`}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <i className={`fas fa-phone ${styles.formIcon}`}></i>
              {phoneError && (
                <span className={styles.error}>{phoneError}</span>
              )}
            </div>
            
            <div className="d-flex gap-2">
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Creating Account...
                  </>
                ) : (
                  'Complete Registration'
                )}
              </button>
              
              <button 
                type="button" 
                className={`btn btn-outline-secondary ${styles.cancelButton}`}
                onClick={handleCancelGoogleRegistration}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* Regular registration form */}
          <form onSubmit={formik.handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                className={`${styles.formControl} ${formik.touched.name && formik.errors.name ? styles.inputError : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              <i className={`fas fa-user ${styles.formIcon}`}></i>
              {formik.touched.name && formik.errors.name && (
                <span className={styles.error}>{formik.errors.name}</span>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className={`${styles.formControl} ${formik.touched.email && formik.errors.email ? styles.inputError : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              <i className={`fas fa-envelope ${styles.formIcon}`}></i>
              {formik.touched.email && formik.errors.email && (
                <span className={styles.error}>{formik.errors.email}</span>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.formLabel}>Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                className={`${styles.formControl} ${formik.touched.phone && formik.errors.phone ? styles.inputError : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
              />
              <i className={`fas fa-phone ${styles.formIcon}`}></i>
              {formik.touched.phone && formik.errors.phone && (
                <span className={styles.error}>{formik.errors.phone}</span>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                className={`${styles.formControl} ${formik.touched.password && formik.errors.password ? styles.inputError : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              <i className={`fas fa-lock ${styles.formIcon}`}></i>
              {formik.touched.password && formik.errors.password && (
                <span className={styles.error}>{formik.errors.password}</span>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="rePassword" className={styles.formLabel}>Confirm Password</label>
              <input
                id="rePassword"
                name="rePassword"
                type="password"
                placeholder="Confirm your password"
                className={`${styles.formControl} ${formik.touched.rePassword && formik.errors.rePassword ? styles.inputError : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.rePassword}
              />
              <i className={`fas fa-lock ${styles.formIcon}`}></i>
              {formik.touched.rePassword && formik.errors.rePassword && (
                <span className={styles.error}>{formik.errors.rePassword}</span>
              )}
            </div>
            
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading || formik.isSubmitting || !(formik.isValid && formik.dirty)}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          
          <div className={styles.orDivider}>
            <span>OR</span>
          </div>
          
          <div className={styles.googleLoginContainer}>
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              useOneTap
              text="signup_with"
              shape="rectangular"
              logo_alignment="center"
            />
          </div>
        </>
      )}
      
      <Link to="/login" className={styles.loginLink}>
        Already have an account? Login here
      </Link>
    </div>
  );
}

export default Register; 