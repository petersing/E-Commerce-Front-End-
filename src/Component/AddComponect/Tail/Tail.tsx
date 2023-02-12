import { Button, Paper, Box, Select, MenuItem, Typography, IconButton } from '@mui/material'
import Logo from '../../../assets/commerce.png'
import { useState } from 'react'
import GitHubIcon from '@mui/icons-material/GitHub';
import { useTranslation } from 'react-i18next';

const Tail = () => {
    const { t } = useTranslation();
    return (
    <>
        <Box sx={{backgroundColor: 'rgb(55,71,90)', position: 'absolute', left: 0, width: '100%', 
                    mt: '50px', height: '40px', textAlign: 'center', lineHeight: '40px', color: 'white', 
                    fontSize: '12px', ":hover": {opacity: '0.9', cursor: 'pointer'}}} onClick={() => window.scrollTo(0, 0)}>
            {t('Tail.BackToTop')}
        </Box>
        <Box sx={{backgroundColor: 'rgb(35,47,62)', position: 'absolute', left: 0, width: '100%', height: '250px', mt: '90px', display: 'flex', 
                 flexDirection: 'column', alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', marginTop:'15px'}}>
                <img src={Logo} alt="logo" style={{width: '50px', height: '50px'}}/>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <Typography variant="body2" style={{color: 'rgb(220,220,220)', marginLeft: '10px'}}>Develop and Maintenance By Peter Cheung</Typography>
                    <Typography variant="body2" style={{color: 'rgb(220,220,220)', marginLeft: '10px'}}>Design By Peter Cheung</Typography>
                </div>
                <IconButton sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '10px'}} onClick={() => window.open('https://github.com/petersing', '_blank')}>
                    <GitHubIcon style={{color: 'rgb(220,220,220)'}}/>
                    <Typography variant="body2" style={{color: 'rgb(220,220,220)', marginLeft: '10px'}}>Github</Typography>
                </IconButton>
            </div>
            <div style={{display: 'flex', alignItems: 'center', marginTop:'15px'}}>
                <Typography variant="body2" style={{color: 'rgb(220,220,220)'}}>Version: 1.0.1 Beta</Typography>
                <Typography variant="body2" style={{color: 'rgb(220,220,220)', marginLeft: '10px'}}>Copyright © 2023 E-commerce-Tech.com. All Rights Reserved.</Typography>
            </div>
            <div style={{marginTop:'15px', display: 'flex', flexDirection: 'row', justifyContent: 'center', color: 'rgb(220,220,220)'}}>
                <Typography variant="body2" sx={{color: 'rgb(220,220,220)', marginRight: '10px', ":hover": {opacity:'0.8', cursor:'pointer'}}} onClick={() => window.location.assign('/Help/Privacy')}>Privacy Policy</Typography> |
                <Typography variant="body2" sx={{color: 'rgb(220,220,220)', marginLeft: '10px', ":hover": {opacity:'0.8', cursor:'pointer'}}} onClick={() => window.location.assign('/Help/TermsAndUse')}>Terms of Use</Typography>
            </div>
            <div style={{display: 'flex', alignItems: 'center', marginTop:'15px'}}>
                <Typography variant="body2" style={{color: 'rgb(220,220,220)'}}>
                    Powered by React, TypeScript, Material-UI, GraphQL, Django, Django-REST-API, Postgresql, Redis, Celery, WebSocket, i18next
                </Typography>
            </div>
            <div style={{display: 'flex', alignItems: 'center', marginTop:'15px'}}>
                <Typography variant="body2" style={{color: 'rgb(220,220,220)'}}>
                    All Language Translation By Google Translate
                </Typography>
            </div>
        </Box>
    </>
    )
}

export default Tail