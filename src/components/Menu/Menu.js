import { Link } from 'react-router-dom'
import './Menu.css'
import Button from '@mui/material/Button';
import EastIcon from '@mui/icons-material/East';
function Menu(){
return(
    <>
    <div className='pc-menu-container'>
        <p>Agentify</p>
        <div className='pc-menu-items'>
            <Link to={'/'}><button className='pc-menu-items-btn'>Features</button></Link>
            <Link to={'/'}><button className='pc-menu-items-btn'>Marketplace</button></Link>
            <Link to={'/'}><button className='pc-menu-items-btn'>Create Agent</button></Link>
            <Link to={'/'}><button className='pc-menu-items-btn'>Playground</button></Link>
        </div>
        <div>
            
            <Button className='pc-menu-connect-bnt' variant="outlined" endIcon={<EastIcon />}>
            Connect Wallet
           </Button>
        </div>
    </div>
    </>
)
}


export default Menu