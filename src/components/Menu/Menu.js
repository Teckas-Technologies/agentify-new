import { NavLink } from 'react-router-dom'
import './Menu.css'
import Button from '@mui/material/Button';
import EastIcon from '@mui/icons-material/East';
import { useState } from 'react';

import { FiMenu } from 'react-icons/fi';


function Menu() {

    const [showMenu, setShowMenu] = useState(false);

    return (
        <>
            <nav className='pc-menu-container'>
                <NavLink to={"/"}>Agentify</NavLink>
                <div className='pc-menu-items'>
                    <NavLink to={'/dashboard'}>Dashboard</NavLink>
                    <NavLink to={'/marketplace'}>Marketplace</NavLink>
                    <NavLink to={'/create'}>Create Agent</NavLink>
                    <NavLink to={'/playground'}>Playground</NavLink>
                </div>
                <div className='connectButtonContainer'>
                    <Button className='pc-menu-connect-btn' endIcon={<EastIcon />}>
                        Connect Wallet
                    </Button>
                </div>
            </nav>

            <div className="mobile-header">
                <NavLink className={"logo"} to={"/"}>Agentify</NavLink>
                <button className="hamburger-menu" onClick={() => setShowMenu(!showMenu)}>
                    <FiMenu size={24} />
                </button>
            </div>

            {
                (showMenu) && (
                    <div className="mobile-menu">
                        <div className="mobile-menu-links">
                            <NavLink to="/dashboard">Dashboard</NavLink>
                            <NavLink to="/marketplace">Marketplace</NavLink>
                            <NavLink to="/create">Create Agent</NavLink>
                            <NavLink to="/playground">Playground</NavLink>
                        </div>
                        <button className="connect-wallet">Connect Wallet →</button>
                    </div>
                )
            }
        </>
    )
}


export default Menu