import {Dialog, DialogTitle, TextField, DialogContent, DialogActions, Button, Checkbox, FormControlLabel, styled, CircularProgress, Link, Typography, Alert, SvgIcon, Divider} from '@mui/material'
import { useState } from 'react';
import { Account_API } from '../../../API/Request';
import { useCookies } from 'react-cookie';
import { Check_Email_Valide } from '../../Public_Data/Public_Application'
import {FaceBookLogin, GoogleLogin} from '../../Public_Data/Oauth2_Login_Component'
import RegisterWithOAuth from './RegisterWithOAuth';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface LoginDialogProp{
    open: boolean;
    onCloseLogin: Function; 
    onOpenRegister: Function;
}


const LoginDialog = (props: LoginDialogProp) => {
    const {open, onCloseLogin, onOpenRegister} = props
    const [Loading, setLoading] = useState<boolean>(false)
    const [Error, setError] = useState<string>('')
    const [Cookie, setCookie] = useCookies();
    const [OAuthRegisterDate, setOAuthRegisterData] = useState<{Platform: string, Email: string, credential: string}|null>(null)
    const {t} = useTranslation()

    function Onclose(props: {reload: boolean}){
        onCloseLogin(false)
        props.reload && window.location.reload()
    }

    function LoginFunction(Email: string, Password: string, Remember: boolean): void{
        setLoading(true)
        Account_API.Login(Email, Password, Remember).then((res)=>{
            setLoading(false)
            Onclose({reload: true})
        }).catch((err)=>{
            setError(err.response.data.detail)
            setLoading(false)
        })
        
        
    }


    const OAuthLogin = React.memo(() =>{
        return(
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <GoogleLogin Client_id={`${process.env.REACT_APP_GOOGLE_APP_URL}`} Redirect_URL='http://localhost:8000/api/Account/auth' Type='signin' 
                            onComplete={(id: string, Token: string) => {GoogleLoginFunction({Token: Token})}}/>
                {false && <FaceBookLogin Client_id={`${process.env.REACT_APP_FACEBOOK_APP_ID}`} Redirect_URL='http://localhost:8000/api/Account/FacebookOAuth2'/>}
            </div>
        )
    })

    const LoginForm = () =>{
        const [email, setemail] = useState<string>('')
        const [password, setpassword]= useState<string>('')
        const [remember, setremember] = useState<boolean>(false)

        const CheckedButton = styled(Button)({
            maxWidth: '70%', 
            backgroundColor: (email && password)? 'rgb(100, 100, 255)': 'rgb(210, 210, 210)', 
            color: 'white',
        })
        
        return(
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div>
                    <TextField sx={{marginBottom: '10px'}} margin="dense" id="LoginEmail" label={t("LoginAndRegister.Email")} type="email" fullWidth 
                                variant="outlined" value={email} onChange={(res) => setemail(res.target.value)} 
                                helperText={Check_Email_Valide(email) ? '' : t("LoginAndRegister.InvalidEmail")} 
                                error={!Check_Email_Valide(email)}/>
                    <TextField sx={{marginBottom: '10px'}} margin="dense" id="LoginPassword" label={t("LoginAndRegister.Password")} type="password" fullWidth 
                                variant="outlined" value={password} onChange={(res) => setpassword(res.target.value)} />
                    <FormControlLabel control={<Checkbox value={remember} onChange={(res) => setremember(res.target.checked)}/>} label={t("LoginAndRegister.RememberMe")}/>
                </div>
                {Loading ? <CircularProgress/>: <CheckedButton onClick={() => {LoginFunction(email, password, remember)}} fullWidth disabled={!(email && password)}>{t("LoginAndRegister.Login")}</CheckedButton>}         
            </div>
        )
    }

    function GoogleLoginFunction(Data: {Token: string}){
        Account_API.GoogleLogin({credential: Data.Token}).then((res)=>{
            if(res.data.Status){
                const {access, refresh} = res.data
                setCookie('access', access['key'], { path: '/' , expires: new Date(access['expired'])})
                setCookie('refresh', refresh['key'], { path: '/' , expires: new Date(refresh['expired'])})
                Onclose({reload: true})
            }else{
                const {Platform, Email} = res.data
                Onclose({reload: false})
                setOAuthRegisterData({Platform: Platform, Email: Email, credential: Data.Token})
            }
        })
    }

    return (
        <>
            {open &&
            <Dialog open={open} onClose={() => Onclose({reload: false})} fullWidth maxWidth={'sm'}>
                <DialogTitle>{t("LoginAndRegister.Login")}</DialogTitle>
                {Error ? <Alert severity="error">{Error}</Alert>: null}
                <DialogContent >
                    <OAuthLogin/>
                    <Divider sx={{mt: '15px', mb: '15px'}}>{t("LoginAndRegister.OR")}</Divider>
                    <LoginForm/>
                </DialogContent>
                <DialogContent sx={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                    <Typography align='center'>
                        {`${t("LoginAndRegister.NoAccountYet")} `}  
                        <Link sx={{color: 'green'}} onClick={() => {onOpenRegister(true); onCloseLogin(false)}}>{t("LoginAndRegister.RegisterNow")}</Link>
                    </Typography>
                </DialogContent>
            </Dialog>}
            
            {Boolean(RegisterWithOAuth) && RegisterWithOAuth({OAuthData: OAuthRegisterDate, setAuthPlatform: setOAuthRegisterData})}
        </>
    )
}

export default LoginDialog