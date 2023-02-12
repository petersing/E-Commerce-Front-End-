import {IconButton, Typography, Box, Badge, Menu, MenuItem, Checkbox, FormControlLabel} from '@mui/material'
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useEffect, useState} from 'react';
import RegisterDialog from '../../Dialog/User/RegisterDialog';
import LoginDialog from '../../Dialog/User/LoginDialog';
import LanguageIcon from '@mui/icons-material/Language';
import { Language } from '../../Public_Data/GlobalLanguage';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';

const ClientRegisterMenu = () =>{
    const [openRegister, setOpenRegister] = useState<boolean>(false)
    const [anchorElLang, setanchorElLang] = useState<null | HTMLElement>(null)
    const [openLogin, setOpenLogin] = useState<boolean>(false)
    const [Lang, setLang] = useCookies(['Language'])
    const {t} = useTranslation()

    function ChangeLanguage(code: string){
      if (code !== Lang['Language']){
        setLang('Language', code, { path: '/' , expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365)})
      }
    }
  
    return (
      <>
        <IconButton size='small' aria-label="Register Icon" sx={{color: 'white'}} onClick={() => setOpenLogin(true)}>
          <LockOpenIcon sx={{transform: 'scale(1.1)'}}/>
          <Typography sx={{ml: '10px', fontSize: '10px'}}>
              {t("NavBar.RegisterOrLogin")}
          </Typography>
        </IconButton>
        <Box sx={{mt: '8px'}}>
          <Badge color="primary" onClick={(event: React.MouseEvent<HTMLButtonElement>) => {setanchorElLang(event.currentTarget)}}>
            <LanguageIcon sx={{ml: '20px', color: 'rgb(245, 250, 249)', ':hover': {opacity: '0.7', cursor: 'pointer'}, transform: 'scale(1.0)'}} />
          </Badge>
        </Box>
        <RegisterDialog open={openRegister} onCloseRegister={setOpenRegister} onOpenLogin={setOpenLogin}/>
        <LoginDialog open={openLogin} onCloseLogin={setOpenLogin} onOpenRegister={setOpenRegister}/>
        <Menu id='Language Menu' open={Boolean(anchorElLang)} onClose={() => {setanchorElLang(null)}} keepMounted anchorEl={anchorElLang} disableScrollLock={true} PaperProps={{style: {maxHeight: '20%', maxWidth: '150px'}}}>
          {Language.map((lang, index) => (
            <MenuItem key={index} sx={{paddingTop: '0px', paddingBottom: '0px'}} onClick={() => {ChangeLanguage(lang.code)}}>
              <FormControlLabel control={<Checkbox size='small' checked={lang.code === Lang['Language']}/>} label={<Typography variant='body2'>{lang.lang}</Typography>}/>
            </MenuItem>
          ))}
        </Menu>
      </>
    )
  }

export default ClientRegisterMenu