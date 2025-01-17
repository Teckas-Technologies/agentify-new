import { NavLink } from 'react-router-dom'
import './Menu.css'
import Button from '@mui/material/Button';
import EastIcon from '@mui/icons-material/East';


function Menu(){
return(
    <>
    <nav className='pc-menu-container'>
        <NavLink to={"/"}>Agentify</NavLink>
        <div className='pc-menu-items'>
            <NavLink to={'/features'}>Features</NavLink>
            {/* <NavLink to={'/dashboard'}>Dashboard</NavLink> */}
            <NavLink to={'/marketplace'}>Marketplace</NavLink>
            <NavLink to={'/create'}>Create Agent</NavLink>
            {/* <NavLink to={'/edit-agent'}>Edit Agent</NavLink> */}
            <NavLink to={'/playground'}>Playground</NavLink>
        </div>
        <div>
            
            <Button className='pc-menu-connect-btn' endIcon={<EastIcon />}>
                Connect Wallet
           </Button>
        </div>
    </nav>
    </>
)
}


export default Menu