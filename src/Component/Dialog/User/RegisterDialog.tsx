import {Dialog, DialogTitle, TextField, DialogContent, DialogActions, Button, Checkbox, FormControlLabel, styled, Alert, Collapse, Link, Typography, CircularProgress} from '@mui/material'
import { useState, useEffect } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Account_API } from '../../../API/Request';
import React from 'react';
import { GoogleLogin } from '../../Public_Data/Oauth2_Login_Component';
import { useTranslation } from 'react-i18next';

export interface LoginRegisterDialogProps {
    open: boolean;
    onCloseRegister: Function; 
    onOpenLogin: Function;
}

const RegisterDialog= (props: LoginRegisterDialogProps) =>{
    const {open, onCloseRegister, onOpenLogin} = props
    const [error ,seterror] = useState<string>()
    const [OpenSuccess, setOpenSuccess] = useState<boolean>(false)
    const [Loading, setLoading] = useState<boolean>(false)
    const {t} = useTranslation()
  
    function onClose() : void{
      onCloseRegister(false)
    }

    function Register(Email: string, Password: string, Username: string): void{
      Account_API.Register(Email, Password, Username).then(res => {
        AfterRegister(true, 'Success')
      }).catch(err => {
        AfterRegister(false, t(`LoginAndRegister.${err.response.data.detail}`))
      })
    }

    function AfterRegister(success: boolean, res: string): void{
        if (success){
          onClose()
          setOpenSuccess(true)
          setLoading(false)
        }else{
            seterror(res)
            setLoading(false)
        }
    }
  
    const RegisterForm = () =>{
      const [password, setpassword] = useState<string>('')
      const [username, setusername] = useState<string>('')
      const [confirm_password, setconfirm_password] = useState<string>('')
      const [email, setemail] = useState<string>('')
      const [Statement, setStatement] = useState<boolean>(false)
      const [Checked_Data, setChecked] = useState<boolean>(false)
      
      useEffect(() =>{
      
        function DataChecking(): void{
          if (username && email && (confirm_password === password) && Statement){
            setChecked(true)
          }else{
            setChecked(false)
          }
        }
  
        DataChecking()
      }, [email, username, password, confirm_password, Statement])

      const CheckedButton = styled(Button)({
        maxWidth: '70%', 
        backgroundColor: Checked_Data? 'rgb(100, 100, 255)': 'rgb(210, 210, 210)', 
        color: 'white',
      })

      function Check_Email_Valide(email: string): Boolean{
        return (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/).test(email)
      }

      return(
        <>
          <DialogContent >
            <TextField sx={{marginBottom: '10px'}} margin="dense" id="name" label={t("LoginAndRegister.EmailAddress")} type="email" fullWidth variant="outlined" 
                       value={email} helperText={Check_Email_Valide(email) ? '' : t("LoginAndRegister.InvalidEmail")} 
                       error={!Check_Email_Valide(email) }
                       onChange={(res) => {setemail(res.target.value)}}/>
  
            <TextField sx={{marginBottom: '10px'}} margin="dense" id="name" label={t("LoginAndRegister.Username")} type="username" fullWidth variant="outlined" 
                       value={username} onChange={(res) => {setusername(res.target.value)}}/>
  
            <TextField sx={{marginBottom: '10px'}} margin="dense" id="name" label={t("LoginAndRegister.Password")} type="password" fullWidth variant="outlined" 
                       value={password} onChange={(res) => {setpassword(res.target.value)}}/>
  
            <TextField sx={{marginBottom: '10px'}} margin="dense" id="name" label={t("LoginAndRegister.ConfirmPassword")} type="password" fullWidth variant="outlined" 
                       value={confirm_password} helperText={(password===confirm_password) ? "" : t("LoginAndRegister.PasswordNotMatch")} 
                       error={(password !== confirm_password)} onChange={(res) => {setconfirm_password(res.target.value)}}/>
  
            <FormControlLabel control={<Checkbox value={Statement} onChange={(res) => setStatement(res.target.checked)}/>} 
                              label={t("LoginAndRegister.InformationCollectiveStatement")} />
          </DialogContent>

          <DialogActions disableSpacing sx={{justifyContent:"center"}}>
            {Loading ? <CircularProgress /> :<CheckedButton onClick={() => {Register(email, password, username); setLoading(true);}} fullWidth disabled={!Checked_Data}>{t("LoginAndRegister.Submit")}</CheckedButton>}
          </DialogActions>
        </>
      )
    }

    return (
      <>
        <Dialog open={open} onClose={onClose} fullWidth maxWidth={'sm'}>
          <Collapse in={Boolean(error)}>
            <Alert severity="error" aria-disabled>{error}</Alert>
          </Collapse>   
          <DialogTitle>{t("LoginAndRegister.RegisterAccount")}</DialogTitle>
          <RegisterForm/>
          <DialogContent >
            <Typography align='center'>{t("LoginAndRegister.AlreadyHaveAccount")} {<Link sx={{color: 'green'}} onClick={() => {onOpenLogin(true); onCloseRegister(false)}}>{t("LoginAndRegister.LoggingIn")}</Link>}
            </Typography>
          </DialogContent>
        </Dialog>
        <Dialog open={OpenSuccess} onClose={() => setOpenSuccess(false)} fullWidth maxWidth={'sm'}>
          <DialogContent sx={{textAlign: 'center', height: '200px'}}>
            <CheckCircleOutlineIcon sx={{transform: 'scale(8.0)', position: 'absolute', top: '25%', color: 'green'}}/>
          </DialogContent>
          <DialogTitle align='center'>
            <Typography fontSize='40px' color='green'>{t("LoginAndRegister.RegisterSuccess")}</Typography>
          </DialogTitle>
          <DialogContent sx={{textAlign: 'center'}}> 
            <Typography>{t("LoginAndRegister.SuccessRegisterStatement")}</Typography>
          </DialogContent>
          <DialogActions sx={{justifyContent: 'center'}}>
            <Button sx={{maxWidth: '70%', backgroundColor: 'rgb(120, 210, 105)'}} fullWidth onClick={() => {onClose(); onOpenLogin(true)}}>{t("LoginAndRegister.LoggingInNow")}</Button>
          </DialogActions>
        </Dialog>
      </>
    )
}

export default RegisterDialog