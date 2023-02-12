import {Box, Badge} from '@mui/material'
import Logo from '../../../assets/commerce.png'
import ClientStatusMenu from './ClientStatusMenu';
import ClientRegistryMenu from './ClientRegistryMenu';
import { User_Object } from '../../Public_Data/Interfaces';

const TopNavBar = (props: {UserData: User_Object|undefined}) => {
    return (
        <>
            <Box position='fixed' sx={{width: '100%',backgroundColor: 'rgb(50,50,50)', height: '40px', left: '0', top: '0', zIndex: 5, minWidth: '1200px'}}>
                <div style={{position: 'relative' , display: 'flex', flexDirection: 'row', marginLeft: 'auto', width: '70%', marginRight: 'auto'}}>
                    <Box sx={{':hover': {opacity: 0.8, cursor: 'pointer'}, marginTop: '5px'}} onClick={() => window.location.assign('/')}>
                        <img src={Logo} alt='logo' style={{maxHeight: '30px' , objectFit: 'contain'}}/>
                    </Box>    
                    <Box flexGrow={1}/>
                    {props.UserData ? <ClientStatusMenu user={props.UserData}/>: <ClientRegistryMenu/>}                 
                </div>  
            </Box>
        </>
    )
}

export default TopNavBar