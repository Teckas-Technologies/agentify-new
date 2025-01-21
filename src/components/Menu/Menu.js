import { NavLink } from 'react-router-dom'
import './Menu.css'
import Button from '@mui/material/Button';
import EastIcon from '@mui/icons-material/East';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
// import image from './image.png';
import { RiMenu3Line } from "react-icons/ri";

function Menu(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return(
        <>
        <nav className='pc-menu-container'>
            <NavLink to={"/"}>Agentify</NavLink>
            <div className='pc-menu-items'>
                <NavLink to={'/features'}>Features</NavLink>
                <NavLink to={'/marketplace'}>Marketplace</NavLink>
                <NavLink to={'/create'}>Create Agent</NavLink>
                <NavLink to={'/playground'}>Playground</NavLink>
            </div>
            <div className='menu-right'>
                <Button className='pc-menu-connect-btn' endIcon={<EastIcon />}>
                    Connect Wallet
                </Button>
                <div className='mobile-only'>
                    <RiMenu3Line className='hamburger-btn' onClick={toggleMenu} />
                </div>
            </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        <div className={`mobile-menu ${isMenuOpen ? 'show' : ''}`}>
            <div className='mobile-menu-links'>
                <NavLink to={'/features'} onClick={toggleMenu}>FEATURES</NavLink>
                <NavLink to={'/marketplace'} onClick={toggleMenu}>MARKETPLACE</NavLink>
                <NavLink to={'/create'} onClick={toggleMenu}>CREATE AN AGENT</NavLink>
                <NavLink to={'/playground'} onClick={toggleMenu}>PLAYGROUND</NavLink>
            </div>
        </div>
        </>
    )
}

export default Menu
