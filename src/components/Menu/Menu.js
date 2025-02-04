import { NavLink } from 'react-router-dom'
import './Menu.css'
import Button from '@mui/material/Button';
import EastIcon from '@mui/icons-material/East';
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from 'react';
// import image from './image.png';
import { RiMenu3Line } from "react-icons/ri";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';

function Menu(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isConnected } = useAppKitAccount();
    const { connect, connectors, isConnecting } = useConnect();
    const { disconnect } = useDisconnect();
    const { address } = useAccount();
    const { chainId,caipNetwork } = useAppKitNetwork();
    const { open } = useAppKit();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

    useEffect(()=>{
        console.log(isConnecting);
        console.log(address)
        console.log(chainId);
        console.log(caipNetwork.name);
    },[address]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const handleConnect = () => {
        open({ view: 'Connect' });
    };

    const handleDisconnect = () => {
        open({ view: 'Account' });
    };


    return(
        <>
        <nav className='pc-menu-container' style={{position: isMenuOpen ? "fixed" : "sticky"}}>
            <NavLink to={"/"}>Agentify</NavLink>
            <div className='pc-menu-items'>
                <NavLink to={'/'}>Dashboard</NavLink>
                <NavLink to={'/marketplace'}>Marketplace</NavLink>
                <NavLink to={'/create'}>Create Agent</NavLink>
                <NavLink to={'/playground'}>Playground</NavLink>
            </div>
            <div className='menu-right'>
            {!address ? (
                    <Button className='pc-menu-connect-btn' endIcon={<EastIcon />} onClick={handleConnect}>
                        Connect Wallet
                    </Button>
                ) : (
                    <Button className='pc-menu-connect-btn' endIcon={<EastIcon />} onClick={handleDisconnect}>
                        {!isMobile && "View"} ({address?.slice(0, 6)}...{address?.slice(-4)})
                    </Button>
                )}
                <div className='mobile-only'>
                    <RiMenu3Line className='hamburger-btn' onClick={toggleMenu} />
                </div>
            </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        <div className={`mobile-menu ${isMenuOpen ? 'show' : ''}`}>
            <div className='mobile-menu-links'>
                <NavLink to={'/'} onClick={toggleMenu}>DASHBOARD</NavLink>
                <NavLink to={'/marketplace'} onClick={toggleMenu}>MARKETPLACE</NavLink>
                <NavLink to={'/create'} onClick={toggleMenu}>CREATE AN AGENT</NavLink>
                <NavLink to={'/playground'} onClick={toggleMenu}>PLAYGROUND</NavLink>
            </div>
        </div>
        </>
    )
}

export default Menu
