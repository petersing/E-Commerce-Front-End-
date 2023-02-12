import { Avatar, Button, Dialog, DialogContent, DialogTitle, Grid, Typography } from '@mui/material'
import { access } from 'fs'
import { useRef, useState } from 'react'
import { useCookies } from 'react-cookie'
import { Account_API } from '../../../API/Request'
import { useTranslation } from 'react-i18next'



function ChangeIconFunction(data: {Icon: File, access: string, RefetchFunction: Function}) {
    Account_API.SetProfileIcon({access: data.access, Icon: data.Icon}).then((res) =>{
        if (res.status === 200){
            data.RefetchFunction()
        }
    })
}



const EditProfileDialog = (props: {Open: boolean, OnClose: Function, UserIcon: any, RefetchFunction: Function}) => {
    const inputFileRef = useRef<HTMLInputElement>(null)
    const [Cookies] = useCookies(['access'])
    const {t} = useTranslation()
    
    return (
        <Dialog open={props.Open} onClose={() => props.OnClose(false)} fullWidth>
            <DialogTitle fontWeight='bold'>{t("Profile.EditProfile")}</DialogTitle>
            <DialogContent>
                <Typography variant="h6">{t("Profile.PersonalIcon")}</Typography>
                <Grid container sx={{display: 'flex', alignItems: 'center'}}>
                    <Grid item xs={4}>
                        <Avatar sx={{width : '150px', height: '150px', mb: '25px', border: 'solid 1px rgb(220,220,220)'}} src={props.UserIcon}/>
                    </Grid>
                    <Grid item xs={8}>
                        <input type="file" ref={inputFileRef} style={{display: 'none'}} 
                               onChange={(e) => {if (e.target.files) {ChangeIconFunction({Icon: e.target.files[0], access: Cookies['access'], RefetchFunction: props.RefetchFunction})}}}/>
                        <Typography>{t("Profile.PersonalIconStatement")}</Typography>
                        <br/>
                        <Button variant='outlined' onClick={() => inputFileRef.current?.click()}>{t("Profile.ChangeIconButton")}</Button>
                    </Grid>
                </Grid>
                
            </DialogContent>

        </Dialog>
    )
}

export default EditProfileDialog