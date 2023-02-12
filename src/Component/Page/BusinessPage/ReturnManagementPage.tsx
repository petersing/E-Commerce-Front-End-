import { gql, useLazyQuery, useMutation } from "@apollo/client";
import {Box,  Grid,Typography, Tabs, Tab, List, ListItem, Divider, Pagination, ListItemText, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress} from "@mui/material";
import { useEffect, useState } from "react";
import { ReturnItem } from "../../Public_Data/Interfaces";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { useCookies } from "react-cookie";
import CheckIcon from '@mui/icons-material/Check';
import CustomerServiceDialog from "../../AddComponect/CustomerService/CustomerServiceDialog";
import ChatBox from "../../AddComponect/Chat/ChatBox";
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { useTranslation } from "react-i18next";

const GetReturnData = gql`
query ReturnProduct($Start: Int!, $End: Int!, $Filter: String!) {
    ReturnProduct(Start: $Start, End: $End, Filter: $Filter, Identity: "Seller") {
        ReturnProduct{
            BuyerName, ReturnStatus, ReturnStatusState, id, ReturnTransportCode,
            SubItem {
                Name, Price, Count
            },
            Order{
                ProductTitle, OrderImage
            }
        }
        Count
    }
}
`

const ConfirmReturn = gql`
mutation RefundItem($ReturnID: Int!) {
    RefundItem(ReturnID: $ReturnID){
        Result
    }
}
`

const ReturnItems = (props: {Item: ReturnItem, setChatBuyer: Function}) =>{
    const [ConfrimReturnFunction] = useMutation<{RefundItem: string}>(ConfirmReturn, {onCompleted: ()=> {window.location.reload()}});
    const [Open, setOpen] = useState<boolean>(false);
    const [load, setload] = useState<boolean>(false);
    const {t} = useTranslation()

    function Confirm(){
        setload(true)
        setOpen(false)
        ConfrimReturnFunction({variables: {ReturnID: props.Item.id}})
    }
    return(
        <>
            <ListItem sx={{display: 'flex' , flexDirection: 'column', alignItems: 'flex-start'}}>
                <div style={{display: 'flex'}}>
                    <Chip label={`${t("Business.Buyer")}: ${props.Item.BuyerName}`} sx={{minWidth: '100px', ":hover": {cursor: 'pointer', backgroundColor: 'rgb(200,200,200)'}, mr: '10px'}} 
                            onClick={() => window.location.assign(`/Profile/${props.Item.BuyerName}`)}/>

                    <Chip label={props.Item.ReturnTransportCode ? `${t("Business.TransportCode")}: ${props.Item.ReturnTransportCode }` : 'Unknown'} sx={{mr: '10px'}} 
                            icon={props.Item.ReturnTransportCode  ?<DirectionsCarFilledIcon/> :<QuestionMarkIcon/>}/>

                </div>
                <Grid container >
                    <Grid item xs={3} sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <img src={ props.Item.Order.OrderImage} alt='ReturnImage' style={{width: '60px', objectFit: 'contain'}}/>
                        <ListItemText sx={{ml: '10px'}} primary={props.Item.Order.ProductTitle} secondary={props.Item.SubItem.Name}/>
                    </Grid>
                    <Grid item xs={3} sx={{display: 'flex', alignItems: 'center'}}>
                        <ListItemText sx={{ml: '10px'}} primary={`HKD$ ${props.Item.SubItem.Price}`} secondary={`${props.Item.SubItem.Count} ${t("Business.Units")}`}/>
                    </Grid>
                    <Grid item xs={3} sx={{display: 'flex', alignItems: 'center'}}>
                        <Chip sx={{mt: '10px'}} color='warning' label={t(`Business.${props.Item.ReturnStatusState}`)}/>
                    </Grid>
                    <Grid item xs={3} sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                        <Button sx={{mb: '10px'}} variant='contained' startIcon={<LocalPhoneIcon/>} onClick={() => props.setChatBuyer(props.Item.BuyerName)}>{`${t("Business.ContactBuyer")} (${props.Item.BuyerName})`}</Button>
                        {props.Item.ReturnStatusState === 'Wait for Process' || props.Item.ReturnStatusState === 'Returning' ?
                            <Button sx={{mb: '10px'}} variant='contained' startIcon={<CheckIcon/>} color='warning' onClick={() => setOpen(true)}>{t("Business.ConfirmAndReturnPrice")}</Button>
                        : null}
                    </Grid>
                </Grid>
            </ListItem>
            <Dialog open={Open} onClose={() => setOpen(false)}>
                <DialogTitle>{t("Business.ConfirmReturn")}</DialogTitle>
                <DialogContent>
                    <Typography variant='body1'>{t("Business.ConfirmReturnStatement")}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>{t("Business.Cancel")}</Button>
                    <Button onClick={() => {Confirm()}}>{t("Business.Confirm")}</Button>
                </DialogActions>
            </Dialog>
            <div style={{display: load? 'flex': 'none'}}>
                <div style={{width: '100%', height: '100%', backgroundColor: 'black', position: 'fixed', top: 0, left: 0, zIndex: 40, opacity: 0.2}}/>
                <CircularProgress sx={{ position: 'fixed', left: '50%', top: '50%', }} color="secondary"/>
            </div>
        </>
    )
}

const ReturnManagementPage = () => {
    const [Type, setType] = useState<string>("All");
    const [Page, setPage] = useState<number>(1);
    const [ReturnData, setReturnData] = useState<ReturnItem[]>([]);
    const [ReturnCount, setReturnCount] = useState<number>(0);
    const [GetReturnDataFunction] = useLazyQuery<{ReturnProduct: {ReturnProduct: ReturnItem[], Count: number}}>(GetReturnData) 
    const [OpenCustomerService, setOpenCustomerService] = useState<boolean>(true);
    const [ChatBuyer, setChatBuyer] = useState<string|null>(null)
    const {t} = useTranslation()

    useEffect(() =>{
        GetReturnDataFunction({variables: {Start: (Page-1)*10, End: Page*10, Filter: Type}}).then((res) =>{
            if (res.data){
                setReturnData(res.data.ReturnProduct.ReturnProduct)
                setReturnCount(res.data.ReturnProduct.Count)
            }
        })
    },[GetReturnDataFunction, Page, Type])

    return (
        <>
            <Box sx={{border: 'solid 1px rgb(220,220,220)', width: '80%', ml: 'auto', mr: 'auto', borderRadius: '10px', 
                        backgroundColor: 'rgb(250,250,250)', marginTop: '150px' ,minWidth: '1200px', display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex', marginLeft: '2%', marginTop: '50px', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'end'}}>
                    <Typography variant="h4" fontWeight='bold' sx={{mr: '10px'}}>{t("Business.ReturnExchange")}</Typography>
                </div>  
                </div>
                <Box sx={{ ml: '2%' }}>
                    <Tabs value={Type} onChange={(e, value)=> {setType(value)}}>
                        <Tab label={t("Business.AllRecord")} value={'All'} />
                        <Tab label={t("Business.Cancel")} value={'Cancel'}/>
                        <Tab label={t("Business.Finish")} value={'Finish'}/>
                    </Tabs>
                </Box>
                <Grid container>
                    <Grid item xs={12}>
                        <List sx={{ml: '1%', mr: '1%'}}>
                        <ListItem>
                            <Grid container spacing={5}>
                                <Grid item xs={6}>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography variant="body1" fontWeight='bold' sx={{mr: '10px'}}>{t("Business.ProductInformation")}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1" fontWeight='bold' sx={{mr: '10px'}}>{t("Business.ProductProperties")}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body1" fontWeight='bold' sx={{mr: '10px'}}>{t("Business.BuyerInformation")}</Typography>                
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body1" fontWeight='bold' sx={{mr: '10px'}}>{t("Business.OrderInformation")}</Typography>
                                </Grid>
                            </Grid>      
                        </ListItem>
                        <Divider sx={{mb: '5px'}}/>
                        {ReturnData?.map((Item, index) => {
                            return(
                                <ReturnItems key={index} Item={Item} setChatBuyer={setChatBuyer}/>
                            )
                        })}
                        </List> 
                    </Grid>
                    <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
                        <Pagination count={Math.ceil(ReturnCount/10)} sx={{transform: 'scale(1.2)', mb: '15px'}} size='large' onChange={(e, value) => setPage(value)} page={Page}/>
                    </Grid>
                </Grid>
            </Box>
            {OpenCustomerService && <CustomerServiceDialog Open={OpenCustomerService} setOpen={setOpenCustomerService}/>}
            {ChatBuyer && <ChatBox Target={ChatBuyer} onClose={setChatBuyer}/>}
        </>
    )
}

export default ReturnManagementPage