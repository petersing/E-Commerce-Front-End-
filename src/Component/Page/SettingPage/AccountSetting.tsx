import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Paper, TextField, Typography, CircularProgress, Alert } from '@mui/material'
import { useEffect, useReducer, useState } from 'react'
import { useCookies } from 'react-cookie'
import { Account_API } from '../../../API/Request'
import ResetPasswordDialog from '../../Dialog/Setting/ResetPasswordDialog'
import { User_Object } from '../../Public_Data/Interfaces'
import { useTranslation } from 'react-i18next'

const AccountSetting = (props: {UserData: User_Object|undefined, RefetchUserFunction: Function}) => {
    const [cookies, setCookie] = useCookies(['Edit_Access', 'access'])
    const [password, setpassword] = useState<string>('')
    const [Loading, setLoading] = useState<boolean>(false)
    const [Error, setError] = useState<string>('')
    const [OpenContent, setOpenContent] = useState<string|null>(null)
    const {t} = useTranslation()


    function LoginFunction(Email: string, Password: string): void{
        setLoading(true)
        Account_API.Edit_Token(Email, Password).then((res)=>{        
            setLoading(false)
            window.location.reload()
        }).catch((err)=>{
            setError(err.response.data.detail)
            setLoading(false)
        })   
        
    }

    return (
        <>
            {cookies['Edit_Access'] &&
            <Box sx={{mt: '120px', width: '50%', ml: 'auto', mr: 'auto'}}>
                <Typography variant='h6'>{t("AccountInformation.LoginAndSecurity")}</Typography>
                <List sx={{border: '1px solid rgb(220,220,220)', borderRadius: '8px', mt: '10px'}}>
                    <ListItem>
                        <ListItemText primary={t("AccountInformation.UserID")} secondary={props.UserData?.id}/>
                    </ListItem>
                    <ListItem secondaryAction={<Button variant='contained'>{t("AccountInformation.Edit")}</Button>}>
                        <ListItemText primary={t("AccountInformation.UserName")} secondary={props.UserData?.username}/>
                    </ListItem>
                    <ListItem secondaryAction={<Button variant='contained'>{t("AccountInformation.Edit")}</Button>}>
                        <ListItemText primary={t("AccountInformation.Email")} secondary={props.UserData?.email}/>
                    </ListItem>
                    <ListItem secondaryAction={<Button variant='contained'>{t("AccountInformation.Edit")}</Button>} onClick={() => setOpenContent('ResetPassword')}>
                        <ListItemText primary={t("AccountInformation.Password")} secondary='**********'/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={t("AccountInformation.DateJoin")} secondary={props.UserData?.dateJoined}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={t("AccountInformation.Subscriber")} secondary={
                            <Typography sx={{fontSize: '12px'}}>
                                {props.UserData?.isSubscriber ? `${t("AccountInformation.SubScribeStatement")} ${t(`AccountInformation.${props.UserData.Subscribe?.SubscribePlan}`)}`: t("AccountInformation.NotSubScribeStatement") }
                            </Typography>}/>
                    </ListItem>
                </List>
            </Box>}
            {!cookies['Edit_Access'] && 
            <Dialog open={!cookies['Edit_Access']} fullWidth maxWidth={'sm'}>
                <DialogTitle>{t("AccountInformation.ConfirmIdentity")}</DialogTitle>
                {Error ? <Alert severity="error">{Error}</Alert>: null}
                <DialogContent>
                    <TextField sx={{marginBottom: '10px'}} margin="dense" id="LoginEmail" label={t("AccountInformation.Email")} type="email" fullWidth 
                            variant="outlined" value={props.UserData?.email} InputProps={{readOnly: true}} disabled/>
                    <TextField sx={{marginBottom: '10px'}} margin="dense" id="LoginPassword" label={t("AccountInformation.Password")} type="password" fullWidth 
                               variant="outlined" value={password} onChange={(res) => setpassword(res.target.value)} />
                </DialogContent>
                <DialogActions disableSpacing sx={{justifyContent:"center"}}>
                    {Loading ? 
                        <CircularProgress/>
                    : 
                    <Button sx={{maxWidth: '70%', backgroundColor: password? 'rgb(100, 100, 255)': 'rgb(210, 210, 210)', color: 'white'}} 
                                 onClick={() => {if(props.UserData) {LoginFunction(props.UserData.email, password)}}} fullWidth disabled={!password}>
                        {t("AccountInformation.Login")}
                    </Button>}
                </DialogActions>
            </Dialog>}
            {OpenContent === 'ResetPassword' && <ResetPasswordDialog Open={Boolean(OpenContent)} Onclose={setOpenContent}/>}      
        </>
    )
}

export default AccountSetting