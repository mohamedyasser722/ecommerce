import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../../Assets/images/freshcart-logo.svg';

export default function Navbar()
{
    return <>

<nav className="navbar navbar-expand bg-body-tertiary">
  <div className="container-fluid">
    <div className="d-flex flex-row align-items-center">
      <Link className={`navbar-brand me-3 ${styles.brandLogo}`} href="">
      <img src={logo} alt="FreshCart" className={styles.logo} />
      </Link>
      <ul className="navbar-nav d-flex flex-row mb-0">
        <li className="nav-item mx-2">
          <Link className="nav-link" to="">Home</Link>
        </li>
        <li className="nav-item mx-2">
          <Link className="nav-link" to="/cart">Cart</Link>
        </li>
        <li className="nav-item mx-2">
          <Link className="nav-link" to="/Products">Products</Link>
        </li>
        <li className="nav-item mx-2">
          <Link className="nav-link" to="/Categories">Categories</Link>
        </li>
        <li className="nav-item mx-2">
          <Link className="nav-link" to="/brands">Brands</Link>
        </li>
      </ul>
    </div>

    <div className="d-flex align-items-center">
      <div className={`social-icons ${styles.socialIconsContainer}`}>
        <a href="https://www.facebook.com/share/16JwFM398a/?mibextid=wwXIfr" className="text-decoration-none">
          <i className={`fab fa-facebook ${styles.socialIcon} ${styles.facebookIcon}`}></i>
        </a>
        <a href="https://www.instagram.com/talabat_egypt?igsh=emE0enlkdHRyMXRh" className="text-decoration-none">
          <i className={`fab fa-instagram ${styles.socialIcon} ${styles.instagramIcon}`}></i>
        </a>
        <a href="https://www.tiktok.com/@talabategypt?_t=ZS-8vPqga0AgZr&_r=1" className="text-decoration-none">
          <i className={`fab fa-tiktok ${styles.socialIcon} ${styles.tiktokIcon}`}></i>
        </a>
      </div>

      <ul className="navbar-nav d-flex flex-row mb-0">
        <li className="nav-item mx-2">
          <Link className="nav-link" to="/login">Login</Link>
        </li>
        <li className="nav-item mx-2">
          <Link className="nav-link" to="/register">Register</Link>
        </li>
        <li className="nav-item mx-2">
          <Link className="nav-link">Logout</Link>
        </li>
      </ul>
    </div>
  </div>
</nav>
    </>
}