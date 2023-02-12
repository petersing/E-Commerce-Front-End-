import {IconButton, Typography, Menu, MenuItem, Box, Badge, FormControlLabel, Checkbox} from '@mui/material'
import React, { useState, useEffect} from 'react';
import { User_Object } from '../../Public_Data/Interfaces';
import SellDialog from '../../Dialog/SellProduct/SellDialog';
import Avataaars from '../../../assets/avataaars.png'
import { gql, useLazyQuery } from '@apollo/client';
import { useCookies } from 'react-cookie';
import ChatIcon from '@mui/icons-material/Chat';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LanguageIcon from '@mui/icons-material/Language';
import { Language } from '../../Public_Data/GlobalLanguage';
import { useTranslation } from 'react-i18next';

const GetCount = gql`
query DataCount {
    DataCount
}
`

const ClientStatusMenu = (props: {user: User_Object}) => {
    const [anchorElUser, setanchorElUser] = useState<null | HTMLElement>(null)
    const [anchorElLang, setanchorElLang] = useState<null | HTMLElement>(null)
    const [OpenSellDialog, setOpenSellDialog] = useState<boolean>(false)
    const [Lang, setLang] = useCookies(['Language'])
    const [DataCount ,setDataCount] = useState<{Order: number, Cart: number, Chat: number}>({Order: 0, Cart: 0, Chat: 0})
    const [GetDataCountFunction] = useLazyQuery<{DataCount: any}>(GetCount);
    const {t} = useTranslation();

    function Logout(){
        document.cookie = "access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "refresh=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.reload();
    }

    useEffect(() =>{
        GetDataCountFunction().then((res)=>{
          if (res.data?.DataCount){
              setDataCount(JSON.parse(res.data.DataCount))
          }
        })
    },[GetDataCountFunction])

    function ChangeLanguage(code: string){
      if (code !== Lang['Language']){
        setLang('Language', code, { path: '/' , expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365)})
      }
    }

    return (
        <>
            <IconButton size="small" aria-label="User Account" color="inherit" sx={{color: 'white'}} onClick={(event: React.MouseEvent<HTMLButtonElement>) => {setanchorElUser(event.currentTarget)}}>
                <img src={props.user.ProfileIcon ? props.user.ProfileIcon + '?Width=30': Avataaars} alt='avatar' style={{width: '30px', height: '30px'}}/>
                <Typography sx={{ml: '10px', fontSize: '12px'}}>
                    {props.user ? `${t('NavBar.Hello')} `+ props.user.username: ''}
                </Typography>
            </IconButton>
            <Box sx={{mt: '10px'}}>
                <Badge badgeContent={DataCount.Cart} color="primary">
                  <ShoppingCartIcon sx={{ml: '20px', color: 'rgb(245, 250, 249)', ':hover': {opacity: '0.7', cursor: 'pointer'}, transform: 'scale(1.0)'}} onClick={() => window.location.assign('/Cart')}/>
                </Badge>
                <Badge badgeContent={DataCount.Order} color="primary">
                  <AssignmentIcon sx={{ml: '20px', color: 'rgb(245, 250, 249)', ':hover': {opacity: '0.7', cursor: 'pointer'}, transform: 'scale(1.0)'}} onClick={() => window.location.assign('/Order')}/>
                </Badge>
                <Badge badgeContent={DataCount.Chat} color="primary">
                  <ChatIcon sx={{ml: '20px', color: 'rgb(245, 250, 249)', ':hover': {opacity: '0.7', cursor: 'pointer'}, transform: 'scale(1.0)'}} onClick={() => window.location.assign('/ChatBox')}/>
                </Badge>  
                <Badge color="primary" onClick={(event: React.MouseEvent<HTMLButtonElement>) => {setanchorElLang(event.currentTarget)}}>
                  <LanguageIcon sx={{ml: '20px', color: 'rgb(245, 250, 249)', ':hover': {opacity: '0.7', cursor: 'pointer'}, transform: 'scale(1.0)'}} />
                </Badge>
            </Box> 
            <Menu id="Client Menu"  open={Boolean(anchorElUser)} onClose={() => {setanchorElUser(null)}} keepMounted anchorEl={anchorElUser} disableScrollLock={true} >
                <MenuItem onClick={()=> window.location.assign(`/Profile/${props.user.username}`)}>
                  <Typography textAlign="center">{t("NavBar.PersonalProfile")}</Typography>
                </MenuItem>
                
                {!props.user?.isSubscriber ? 
                <MenuItem onClick={() => window.location.assign('/AccountInformation')}>
                  <Typography textAlign="center">{t("NavBar.UpgradeAccount")}</Typography>
                </MenuItem>
                :
                  <MenuItem onClick={() => setOpenSellDialog(true)}>
                    <Typography textAlign="center">{t("NavBar.SellProduct")}</Typography>
                  </MenuItem>         
                }

                {props.user.isSubscriber? 
                  <MenuItem onClick={() => window.location.assign('/Business')}>
                    <Typography textAlign="center">{t("NavBar.ManageBusiness")}</Typography>
                  </MenuItem>
                : null}

                <MenuItem onClick={() => window.location.assign('/AccountInformation')}>
                  <Typography textAlign="center">{t("NavBar.AccountInformation")}</Typography>
                </MenuItem>

                <MenuItem onClick={() => Logout()}>
                  <Typography textAlign="center">{t("NavBar.Logout")}</Typography>
                </MenuItem>
            </Menu>
            <Menu id='Language Menu' open={Boolean(anchorElLang)} onClose={() => {setanchorElLang(null)}} keepMounted anchorEl={anchorElLang} disableScrollLock={true} PaperProps={{style: {maxHeight: '20%', maxWidth: '150px'}}}>
                {Language.map((lang, index) => (
                  <MenuItem key={index} sx={{paddingTop: '0px', paddingBottom: '0px'}} onClick={() => {ChangeLanguage(lang.code)}}>
                    <FormControlLabel control={<Checkbox size='small' checked={lang.code === Lang['Language']}/>} label={<Typography variant='body2'>{lang.lang}</Typography>}/>
                  </MenuItem>
                ))}
            </Menu>
            {OpenSellDialog ? <SellDialog Open={OpenSellDialog} setOpenFunction={setOpenSellDialog} UserData={props.user}/>: null}
        </>
        
  )
}

export default ClientStatusMenu