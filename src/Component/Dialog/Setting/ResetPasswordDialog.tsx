import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { Account_API } from '../../../API/Request'
import { useTranslation } from 'react-i18next'

const ResetPasswordDialog = (props: {Open: boolean, Onclose: Function}) => {
    const [cookies] = useCookies(['Edit_Access'])
    const [PreviousPassword, setPreviousPassword] = React.useState<string>('')
    const [NewPassword, setNewPassword] = React.useState<string>('')
    const [ConfirmPassword, setConfirmPassword] = React.useState<string>('')
    const [Loading, setLoading] = React.useState<boolean>(false)
    const [Error, setError] = React.useState<string>('')
    const {t} = useTranslation()

    function ResetPassword(){
        if (NewPassword === ConfirmPassword){
            setLoading(true)
            Account_API.Reset_Password({Edit_Token: cookies['Edit_Access'], prev_password: PreviousPassword, new_password: NewPassword}).then((res)=>{
                props.Onclose(null)
            }).catch((err)=>{
                setError(`${t("AccountInformation.ResetPasswordFailure")}`)
            })
            setLoading(false)
        }
        else{
            setError(`${t("AccountInformation.ResetPasswordSame")}`)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
          setError('')
        }, 3000);
        return () => clearTimeout(timer);
      }, [Error]);

    return (
        <>
            <Dialog open={props.Open} onClose={() => props.Onclose(null)} fullWidth PaperProps={{style: {backgroundColor: (Loading? 'rgb(220,220,220)': '')}}}>
                <DialogTitle>{t("AccountInformation.ResetPassword")}</DialogTitle>
                {Error && <Alert severity="error">{Error}</Alert>}
                <DialogContent>
                    {Loading && <CircularProgress sx={{position: 'fixed', left: '50%', top: '50%'}} color='success'/>}
                    <TextField type='password' sx={{mt: '15px'}} label={t("AccountInformation.PreviousPassword")} fullWidth focused value={PreviousPassword} onChange={(e) => setPreviousPassword(e.target.value)}/>
                    <TextField type='password' sx={{mt: '15px'}} label={t("AccountInformation.NewsPassword")} fullWidth focused value={NewPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                    <TextField type='password' sx={{mt: '15px'}} label={t("AccountInformation.ConfirmPassword")} fullWidth focused value={ConfirmPassword} helperText={(NewPassword === ConfirmPassword) ? '' : 'Password not match'}
                            onChange={(e) => setConfirmPassword(e.target.value)} color={(NewPassword === ConfirmPassword|| NewPassword === '') ? 'primary' : 'error'}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => props.Onclose(null)} variant='contained'>{t("AccountInformation.Cancel")}</Button>
                    <Button onClick={() => {ResetPassword()}} disabled={ConfirmPassword !== NewPassword || NewPassword === ''} variant='contained'>{t("AccountInformation.Apply")}</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ResetPasswordDialog