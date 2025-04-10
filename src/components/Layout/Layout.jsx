import { Outlet } from 'react-router-dom';
import styles from './Layout.module.css';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';


export default function Layout() {
    return <>
       <Navbar/>

       <Outlet></Outlet>
       
        <Footer/>
    </>
}