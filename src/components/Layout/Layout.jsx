import { Outlet } from 'react-router-dom';
import styles from './Layout.module.css';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import { useContext, useEffect } from 'react';
import { UserContext } from '../Context/UserContext';
export default function Layout() {
    return (
        <>
            <Navbar />
                <Outlet />
            <Footer />
        </>
    );
}