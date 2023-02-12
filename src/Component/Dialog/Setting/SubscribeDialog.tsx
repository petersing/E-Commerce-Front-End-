import { Alert, AlertTitle, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Paper, popoverClasses, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Account_API } from '../../../API/Request'
import { useCookies } from 'react-cookie'
import { useTranslation } from 'react-i18next'
import { SubscribeMethodLists, SubscribeMethodDurationLists } from '../../Public_Data/PaymentMethodList'

function CountTotalPrice(props: {Select: string|null, SubscribePlan: number|null}){
    const PlanLists: {[keys: string]: {Name: string, Photo: any, Price: number, Sub: any[]}} = SubscribeMethodLists() 
    const SubscribeMethod : {[keys: number]: {Name: string,Offer: number,Range: number,}} = SubscribeMethodDurationLists()

    if (props.Select !== null && props.SubscribePlan !== null){
        return(PlanLists[props.Select].Price * SubscribeMethod[props.SubscribePlan].Range* (100- SubscribeMethod[props.SubscribePlan].Offer)/100)
    }
}


const PlanItem = (props: {Plan: {Name: string, Photo: string, Price: number|string, Sub: string[]}, Select: string|null, setSelect: Function, ItemKeys: string}) => {
    const {t} = useTranslation()
    return(
        <Grid item xs={4} sx={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            <Typography variant='h6'>{`${props.Plan.Name}`}</Typography>
            <Paper sx={{width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column', border: (props.Select === props.ItemKeys ? '2px solid rgb(60, 60, 200)': ''), 
                        boxShadow: (props.Select === props.ItemKeys ? '0px 0px 5px rgb(60, 60, 200)': ''), ":hover": {backgroundColor: 'rgb(230, 230,230)', cursor: 'pointer'}}} 
                        onClick={() => props.setSelect(props.ItemKeys)}>
                <Box sx={{width: '100%', height: '120px', backgroundColor: 'rgb(150, 220, 125)', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <img src={props.Plan.Photo} alt='small company' style={{objectFit: 'contain', height: '90%'}}/>
                </Box>
                <Typography variant='h6' sx={{padding: '10px'}}>${props.Plan.Price}{t("AccountInformation.MonthUnit")}</Typography>
                <div style={{borderTop: '1px solid rgb(200,200,200)', width: '100%'}}/>
                {props.Plan.Sub.map((item, index) => {
                    return(
                        <Typography key={index} variant='body1' sx={{padding: '10px'}}>{item}</Typography>
                    )
                })}          
            </Paper>
        </Grid>
    )
}

const PlanSelection = (props: {Open: boolean, StepFunction: Function, Select: string|null, setSelect:Function}) =>{
    const {t} = useTranslation()
    const PlanLists: {[keys: string]: {Name: string, Photo: any, Price: number, Sub: any[]}} = SubscribeMethodLists() 
    return(
        <Dialog open={props.Open} onClose={()=> props.StepFunction(null)} fullWidth maxWidth='md'>
            <DialogTitle>{t("AccountInformation.SubscribeRenewTitle")}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    {Object.keys(PlanLists).map((item, index) => {
                        return(
                            <PlanItem key={index} Plan={PlanLists[item]} Select={props.Select} setSelect={props.setSelect} ItemKeys={item}/>
                        )
                    })}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.StepFunction(null)} variant='contained'>{t("AccountInformation.Cancel")}</Button>
                <Button onClick={() => props.StepFunction(1)} variant='contained' disabled={props.Select === null}>{t("AccountInformation.Continue")}</Button>
            </DialogActions>
        </Dialog>
    )
}

const SubscribeType = (props: {Plan: {Name: string, Offer: number}, SubscribePlan: number|null, setSubscribePlan: Function, ItemKeys: number}) =>{
    const {t} = useTranslation()
    return(
        <Grid item xs={4} sx={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            <Paper sx={{width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column', border: (props.SubscribePlan === props.ItemKeys ? '2px solid rgb(60, 60, 200)': ''),  
                        boxShadow: (props.SubscribePlan === props.ItemKeys ? '0px 0px 5px rgb(60, 60, 200)': ''), ":hover": {backgroundColor: 'rgb(230, 230,230)', cursor: 'pointer'}}}
                        onClick={() => props.setSubscribePlan(props.ItemKeys)}>
                <Typography variant='h6'>{props.Plan.Name}</Typography>
                <Box sx={{width: '100%', height: '50px', backgroundColor: 'rgb(200, 220, 125)', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Typography variant='body1' sx={{padding: '10px'}}>{props.Plan.Offer}{t("AccountInformation.DiscountUnit")}</Typography>
                </Box>
            </Paper>
        </Grid>
    )
}

const SubscribePlanSelect = (props: {Open: boolean, StepFunction: Function, Select: string, SubscribePlan: number|null, setSubscribePlan: Function}) =>{
    const {t} = useTranslation()
    const PlanLists: {[keys: string]: {Name: string, Photo: any, Price: number, Sub: any[]}} = SubscribeMethodLists() 
    const SubscribeMethod : {[keys: number]: {Name: string,Offer: number,Range: number,}} = SubscribeMethodDurationLists()

    return(
        <Dialog open={props.Open} onClose={()=> props.StepFunction(null)} fullWidth maxWidth='md'>
            <DialogTitle>{t("AccountInformation.SubscribeRenewTitle")}</DialogTitle>
            <DialogContent>
                <TextField label={t("AccountInformation.SubscribePlanSelect")} InputProps={{readOnly: true}} value={PlanLists[props.Select].Name} sx={{mt: '5px', mb: '5px'}} fullWidth focused color='success'/>
                <TextField label={t("AccountInformation.TotalPrice")} InputProps={{readOnly: true}} sx={{mt: '5px', mb: '5px'}} fullWidth focused color='secondary'
                           value={`$${CountTotalPrice({Select: props.Select, SubscribePlan: props.SubscribePlan})}`}/>
                <Grid container spacing={2}>
                    {Object.entries(SubscribeMethod).map((item, index) => {
                        return(
                            <SubscribeType key={index} Plan={item[1]} SubscribePlan={props.SubscribePlan} setSubscribePlan={props.setSubscribePlan} ItemKeys={parseInt(item[0])}/>
                        )
                    })}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.StepFunction(0)} variant='contained'>{t("AccountInformation.Previous")}</Button>
                <Button onClick={() => props.StepFunction(2)} variant='contained' disabled={props.SubscribePlan === null}>{t("AccountInformation.Continue")}</Button>
            </DialogActions>
        </Dialog>
    )
}

const ConfirmSubscribe = (props: {Open: boolean, StepFunction: Function, Select: string, SubscribePlan: number, RefetchUserFunction: Function,
                                  SubscribeData: {SubscribeDate: string, SubscribeEnd: string, SubscribePlan: string}|undefined}) =>{
    const [Cookies] = useCookies(['access']);
    const [ConfirmOverride, setConfirmOverride] = useState<boolean>(false);
    const {t} = useTranslation()
    const PlanLists: {[keys: string]: {Name: string, Photo: any, Price: number, Sub: any[]}} = SubscribeMethodLists() 
    const SubscribeMethod : {[keys: number]: {Name: string,Offer: number,Range: number,}} = SubscribeMethodDurationLists()


    function ConfirmAndPay(){
        if(props.Select!== null && props.SubscribePlan !== null){
            Account_API.Subscribe({access: Cookies['access'], Subscribe_Month: SubscribeMethod[props.SubscribePlan].Range, Subscribe_Plan: props.Select}).then((res) =>{
                if(res.status === 200){
                    props.StepFunction(3)
                    props.RefetchUserFunction()
                }
            })
        }
    }

    const PreviousSubscription =(props: {SubscribeData: {SubscribeDate: string, SubscribeEnd: string, SubscribePlan: string} }) =>{
        return(
            <>
                <TextField label={t("AccountInformation.PreviousSubscriptionSelection")} InputProps={{readOnly: true}} value={t(`AccountInformation.${props.SubscribeData.SubscribePlan}`)} sx={{mt: '5px', mb: '5px'}} fullWidth focused color='primary'/>
                <TextField label={t("AccountInformation.SubscribeDate")} InputProps={{readOnly: true}} value={props.SubscribeData.SubscribeDate} sx={{mt: '5px', mb: '5px'}} fullWidth focused color='primary'/>
                <TextField label={t("AccountInformation.SubscribeEndDate")} InputProps={{readOnly: true}} value={props.SubscribeData.SubscribeEnd} sx={{mt: '5px', mb: '5px'}} fullWidth focused color='primary'/>
            </>
        )
    }

    const ConfirmOverrideDialog = () =>{
        const [Confirm, setConfirm] = useState<string>('');
        return(
            <Dialog open={ConfirmOverride} onClose={()=> setConfirmOverride(false)} fullWidth maxWidth='sm'>
                <DialogTitle>{t("AccountInformation.ConfirmOverride")}</DialogTitle>
                <DialogContent>
                    <Alert severity="warning">
                        <AlertTitle>{t("AccountInformation.Warning")}</AlertTitle>
                        Please make sure you have read the <strong>Terms and Conditions</strong> and you agree to them. 
                        <br/><br/>Once confirmed, you will immediately change the previous plan and cannot revert <strong>(All Previous Remaining Durations will be Overwritten)</strong>.
                        <br/><br/>If you are sure, you can enter <strong>CONFIRM</strong> in the field below to confirm.
                    </Alert>
                    <TextField label='Confirm' sx={{mt: '15px'}} fullWidth focused color='primary' value={Confirm} onChange={(e) => setConfirm(e.target.value)}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOverride(false)} variant='contained'>{t("AccountInformation.Cancel")}</Button>
                    <Button onClick={() => {setConfirmOverride(false); ConfirmAndPay()}} variant='contained' disabled={Confirm !== 'CONFIRM'}>{t("AccountInformation.Apply")}</Button>
                </DialogActions>
            </Dialog>
        )
    }

    function CheckOverride(){
        if (props.SubscribeData && props.SubscribeData.SubscribePlan !== props.Select){
            return true
        }else{
            return false
        }
    }

    return(
        <>
            <Dialog open={props.Open} onClose={()=> props.StepFunction(null)} fullWidth maxWidth='md'>
                <DialogTitle>{t("AccountInformation.ConfirmPayment")}</DialogTitle>
                <DialogContent>
                    {props.SubscribeData && <PreviousSubscription SubscribeData={props.SubscribeData}/>}
                    <TextField label={t("AccountInformation.SubscribePlanSelection")} InputProps={{readOnly: true}} value={PlanLists[props.Select].Name} sx={{mt: '5px', mb: '5px'}} 
                            fullWidth focused color='secondary'/>
                    <TextField label={t("AccountInformation.SubscribeDurationSelection")} InputProps={{readOnly: true}} value={SubscribeMethod[props.SubscribePlan].Name} sx={{mt: '5px', mb: '5px'}} 
                            fullWidth focused color='secondary'/>
                    <TextField label={t("AccountInformation.TotalPrice")} InputProps={{readOnly: true}} value={`$${CountTotalPrice({Select: props.Select, SubscribePlan: props.SubscribePlan})}`} sx={{mt: '5px', mb: '5px'}} 
                            fullWidth focused color='success'/>
                    {props.SubscribeData && 
                    <Typography variant='caption' sx={{mt: '5px', mb: '5px'}}>
                        {t("AccountInformation.PaymentWarningStatement")}
                    </Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => props.StepFunction(1)} variant='contained'>{t("AccountInformation.Previous")}</Button>
                    <Button onClick={() => CheckOverride() ? setConfirmOverride(true): ConfirmAndPay()} variant='contained'>{t("AccountInformation.Submit")}</Button>
                </DialogActions>
            </Dialog>
            {ConfirmOverride && <ConfirmOverrideDialog/>}
        </>
    )
}

const SuccessSubscribe = (props: {Open: boolean, StepFunction: Function, Select: string, SubscribePlan: number}) =>{
    const {t} = useTranslation()
    const PlanLists: {[keys: string]: {Name: string, Photo: any, Price: number, Sub: any[]}} = SubscribeMethodLists() 
    const SubscribeMethod : {[keys: number]: {Name: string,Offer: number,Range: number,}} = SubscribeMethodDurationLists()

    return(
        <Dialog open={true} onClose={()=> {}} fullWidth maxWidth='md'>
            <DialogTitle>{t("AccountInformation.SubscriptionSuccessTitle")}</DialogTitle>
            <DialogContent>
                <TextField label={t("AccountInformation.SubscribePlanSelection")} InputProps={{readOnly: true}} value={PlanLists[props.Select].Name} sx={{mt: '5px', mb: '5px'}} 
                           fullWidth focused color='secondary'/>
                <TextField label={t("AccountInformation.SubscribeDurationSelection")} InputProps={{readOnly: true}} value={SubscribeMethod[props.SubscribePlan].Name} sx={{mt: '5px', mb: '5px'}} 
                           fullWidth focused color='secondary'/>
                <TextField label={t("AccountInformation.TotalPrice")} InputProps={{readOnly: true}} value={`$${CountTotalPrice({Select: props.Select, SubscribePlan: props.SubscribePlan})}`} sx={{mt: '5px', mb: '5px'}} 
                           fullWidth focused color='secondary'/>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.StepFunction(null)} variant='contained'>{t("AccountInformation.Confirm")}</Button>
            </DialogActions>
        </Dialog>
    )
}


const SubscribeDialog = (props: {Open: number, Onclose: Function, SubscribeData: {SubscribeDate: string, SubscribeEnd: string, SubscribePlan: string}|undefined, RefetchUserFunction: Function}) => {
    const [Select, setSelect] = useState<string|null>(null)
    const [SubscribePlan, setSubscribePlan] = useState<number|null>(null)

    function StepFunction(step: number){
        switch (step) {
            case 0:
                return (<PlanSelection Open={props.Open === 0} StepFunction={props.Onclose} Select={Select} setSelect={setSelect}/>)
            case 1:
                if (Select !== null){
                    return (<SubscribePlanSelect Open={props.Open === 1} StepFunction={props.Onclose} Select={Select} SubscribePlan={SubscribePlan} setSubscribePlan={setSubscribePlan}/>)
                }
                break;
            case 2:
                if (Select !== null && SubscribePlan !== null){
                    return(<ConfirmSubscribe Open={props.Open === 2} StepFunction={props.Onclose} Select={Select} SubscribePlan={SubscribePlan} 
                                             SubscribeData={props.SubscribeData} RefetchUserFunction={props.RefetchUserFunction}/>)
                }
                break;
            case 3:
                if (Select !== null && SubscribePlan !== null){
                    return(<SuccessSubscribe Open={props.Open === 3} StepFunction={props.Onclose} Select={Select} SubscribePlan={SubscribePlan}/>)
                }
                break;
            default:
                break;
        }
    }

    return (
        <>
            {StepFunction(props.Open)}
        </>
    )
}

export default SubscribeDialog