import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Alert } from '@mui/material'
import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import { Account_API } from '../../../API/Request'

const RegistryWithOAuth = (props: {OAuthData: {Platform: string, Email: string, credential: string}|null, setAuthPlatform: Function}) => {
    const [username, setusername] = useState<string>('')
    const [password, setpassword] = useState<string>('')
    const [Message, setMessage] = useState<string>('')
    const [Cookie, setCookie] = useCookies();

    function Registry(){
        if(props.OAuthData){
            Account_API.GoogleRegistry({credential: props.OAuthData.credential, username: username, password: password}).then((res)=>{
                const {access, refresh} = res.data
                setCookie('access', access['key'], { path: '/' , expires: new Date(access['expired'])})
                setCookie('refresh', refresh['key'], { path: '/' , expires: new Date(refresh['expired'])})
                window.location.reload()
            }).catch((err) =>{
                setMessage(err.response.data.detail)
            })
        }
    }
    return (
        <Dialog open={Boolean(props.OAuthData)} onClose={() => {props.setAuthPlatform(null)}} fullWidth maxWidth={'sm'}>
            <DialogTitle>{`Registry by ${props.OAuthData?.Platform}`}</DialogTitle>
            {Message && <Alert severity="info">{Message}</Alert>}
            <DialogContent>
                <TextField label={'Email'} value={props.OAuthData?.Email} fullWidth InputProps={{readOnly: true}} sx={{mt: '10px'}} disabled/>
                <TextField label={'Username'} value={username} onChange={(e) => setusername(e.target.value)} sx={{mt: '10px'}} focused fullWidth />
                <TextField label={'password'} value={password} onChange={(e) => setpassword(e.target.value)} sx={{mt: '10px'}} focused fullWidth />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {Registry()}} color="primary">Apply</Button>
            </DialogActions>
        </Dialog>
    )
}

export default RegistryWithOAuth