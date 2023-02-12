import {Box, Typography, InputBase, Button} from '@mui/material'
import Logo from '../../../assets/commerce.png'
import InputIcon from '@mui/icons-material/Input';
import {useState} from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';

const SearchNavBar = () => {
    const [SearchInput, setSearchInput] = useState<string>('')
    const {t} = useTranslation()
        return (
            <Box position='fixed' sx={{width: '100%', backgroundColor: 'rgb(245,245,245)', mt: '40px', zIndex: 5, height: '60px', minWidth: '1200px', left: '0', top: '0', borderBottom: 'solid 1px rgb(240,240,240)'}}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '70%', marginLeft: 'auto', marginRight: 'auto', marginTop: '7.5px'}}>
                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '80%'}}>
                        <Typography variant='body2' sx={{color: 'rgb(50,50,50)', display: 'flex', flexDirection: 'row', alignItems: 'center', 
                                                        ':hover': {opacity: 0.8, cursor: 'pointer'}}} onClick={() => window.location.replace('/')}>
                            <img src={Logo} alt='logo' style={{maxHeight: '35px' , objectFit: 'contain', marginRight: '10px'}}/>
                            E-Commerce
                        </Typography>
                        <Box sx={{position: 'relative', width: '80%', backgroundColor: 'rgb(220,220,220)', 'opacity': 0.9, borderRadius: '5px', ml: '10px', ":hover": {opacity: '0.7'}, display: 'flex', alignItems: 'center'}}>
                            <SearchIcon sx={{position: 'absolute', display: 'flex', alignItems: 'center',justifyContent: 'center', height: '100%', 
                                                paddingTop: 'auto', paddingBottom: 'auto', paddingLeft: '8px'}}/>
                            <InputBase sx={{'& .MuiInputBase-input': {width: '100ch', paddingLeft: '30px', height: '25px'}, padding: '5px'}} placeholder={`${t('NavBar.Search')}`}
                                       value={SearchInput} onChange={(e) => setSearchInput(e.target.value)} 
                                       onKeyDown={(e) => {
                                        if (e.key === "Enter"){
                                            const CurrentURL = window.location.pathname.split('/')[1];
                                            if (CurrentURL === "Categories"){
                                                window.location.assign(window.location.pathname+'?s='+SearchInput)
                                            }else{
                                                window.location.assign(`/Search?s=${SearchInput}`)
                                            }   
                                        }}}/>
                            <InputIcon sx={{position: 'absolute', display: 'flex', alignItems: 'center',justifyContent: 'center', height: '100%', 
                                            paddingTop: 'auto', paddingBottom: 'auto', paddingRight: '8px', right: 0, ':hover': {color: 'orange', 
                                            cursor: 'pointer'}}} onClick={() => {
                                                const CurrentURL = window.location.pathname.split('/')[1];
                                                if (CurrentURL === "Categories"){
                                                    window.location.assign(window.location.pathname+'?s='+SearchInput)
                                                }else{
                                                    window.location.assign(`/Search?s=${SearchInput}`)
                                                } 
                                            }}/>
                                       
                        </Box>
                    </Box>
                </div>
            </Box>
        )
}

export default SearchNavBar