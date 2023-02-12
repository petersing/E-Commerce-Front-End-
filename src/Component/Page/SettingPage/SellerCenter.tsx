import { gql } from '@apollo/client'
import { Box, Button, List, ListItem, ListItemText, Typography } from '@mui/material'
import React, { useState } from 'react'
import SubscribeDialog from '../../Dialog/Setting/SubscribeDialog'
import { User_Object } from '../../Public_Data/Interfaces'
import { useTranslation } from 'react-i18next'


const SellerCenter = (props: {UserData: User_Object|undefined, RefetchUserFunction: Function}) => {
    const [OpenSubscribe, setOpenSubscribe] = useState<number|null>(null)
    const {t} = useTranslation()

    return (
        <>
            <Box sx={{mt: '120px', width: '50%', ml: 'auto', mr: 'auto'}}>
                <Typography variant='h6'>{t("AccountInformation.SellerCenter")}</Typography>
                <List sx={{border: '1px solid rgb(220,220,220)', borderRadius: '8px', mt: '10px'}}>
                    <ListItem>
                        <ListItemText primary={t("AccountInformation.UserID")} secondary={props.UserData?.id}/>
                    </ListItem>
                    <ListItem secondaryAction={<Button variant='contained' onClick={() => setOpenSubscribe(0)}>{props.UserData?.isSubscriber ? t("AccountInformation.RenewSubscribe"): t("AccountInformation.SubscribeNow")}</Button>}>
                        <ListItemText primary={t("AccountInformation.SubscribeStatus")} secondary={props.UserData?.isSubscriber ? t("AccountInformation.Seller"): t("AccountInformation.NormalUser")}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={t("AccountInformation.SubscribeDate")} secondary={props.UserData?.Subscribe?.SubscribeDate}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={t("AccountInformation.SubscribeEndDate")} secondary={props.UserData?.Subscribe?.SubscribeEnd}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={t("AccountInformation.AccountType")} secondary={`${t(`AccountInformation.${props.UserData?.Subscribe?.SubscribePlan}`)}`}/>
                    </ListItem>
                </List>
            </Box>
            {OpenSubscribe !== null && <SubscribeDialog Open={OpenSubscribe} Onclose={setOpenSubscribe} SubscribeData={props.UserData?.Subscribe} RefetchUserFunction={props.RefetchUserFunction}/>}
        </>
    )
}

export default SellerCenter