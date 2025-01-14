import { Link } from 'react-router-dom'
import './Menu.css'
import Button from '@mui/material/Button';
import EastIcon from '@mui/icons-material/East';


function Menu(){
return(
    <>
    <nav className='pc-menu-container'>
        <Link to={"/"}>Agentify</Link>
        <div className='pc-menu-items'>
            <Link className='active' to={'/features'}>Features</Link>
            <Link to={'/marketplace'}>Marketplace</Link>
            <Link to={'/create'}>Create Agent</Link>
            <Link to={'/playground'}>Playground</Link>
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