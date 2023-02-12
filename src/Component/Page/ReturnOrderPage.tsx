import { gql, useLazyQuery } from "@apollo/client";
import { Box, Typography, Tabs, Tab, List, ListItem, Grid, Divider, Pagination, ListItemText, Chip, Button, IconButton} from "@mui/material";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { ReturnItem } from "../Public_Data/Interfaces";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CustomerServiceDialog from "../AddComponect/CustomerService/CustomerServiceDialog";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AddReturnTransportCodeDialog from "../Dialog/Order/AddReturnTransportCodeDialog";
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { useTranslation } from "react-i18next";

const GetReturnData = gql`
query ReturnProduct($Start: Int!, $End: Int!, $Filter: String!) {
    ReturnProduct(Start: $Start, End: $End, Filter: $Filter, Identity: "Buyer") {
        ReturnProduct{
            SellerName, ReturnStatus, ReturnStatusState, id, ReturnTransportCode,
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

const ReturnItems = (props: {Item: ReturnItem, OpenAddCode: Function}) =>{
    const {t} = useTranslation()
    return(
        <ListItem sx={{display: 'flex' , flexDirection: 'column', alignItems: 'flex-start'}}>
            <div style={{display: 'flex'}}>
                <Chip label={`${t("ReturnOrder.Seller")}: ${props.Item.SellerName}`} sx={{minWidth: '100px', ":hover": {cursor: 'pointer', backgroundColor: 'rgb(200,200,200)'}, mr: '10px'}} 
                        onClick={() => window.location.assign(`/Profile/${props.Item.SellerName}`)}/>

                <Chip label={props.Item.ReturnTransportCode ? `${t("ReturnOrder.TransportCode")}: ${props.Item.ReturnTransportCode }` : 'Unknown'} sx={{mr: '10px'}} 
                        icon={props.Item.ReturnTransportCode  ?<DirectionsCarFilledIcon/> :<QuestionMarkIcon/>}/>

            </div>
            <Grid container spacing={2}>
                <Grid item xs={4} sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <img src={props.Item.Order.OrderImage + '?Width=60'} alt='ReturnImage' style={{width: '60px', objectFit: 'contain'}}/>
                    <ListItemText sx={{ml: '10px'}} primary={props.Item.Order.ProductTitle} secondary={props.Item.SubItem.Name}/>
                </Grid>
                <Grid item xs={3} sx={{display: 'flex', alignItems: 'center'}}>
                    <ListItemText sx={{ml: '10px'}} primary={`HKD$ ${props.Item.SubItem.Price}`} secondary={`${props.Item.SubItem.Count} Units`}/>
                </Grid>
                <Grid item xs={2} sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                        <Chip label={t("ReturnOrder." + props.Item.ReturnStatus)} color='success'/>
                        <Chip sx={{mt: '10px'}} color='warning' label={t("ReturnOrder." + props.Item.ReturnStatusState)}/>
                    </div>
                </Grid>
                <Grid item xs={3} sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    {props.Item.ReturnStatusState === 'Wait for Return' &&
                    <Button sx={{mb: '10px'}} variant='contained' color='primary' size='small' startIcon={<LocalShippingIcon/>} onClick={() => props.OpenAddCode(props.Item.id)}>
                        {t("ReturnOrder.AddTransportCodeButton")}
                    </Button>}
                    <Button sx={{mb: '10px'}} variant='contained' size='small'  startIcon={<LocalPhoneIcon/>}>{`${t("ReturnOrder.ContactSeller")} (${props.Item.SellerName})`}</Button>
                </Grid>
            </Grid>
        </ListItem>
    )
}

const ReturnOrderPage = () => {
    const [Type, setType] = useState<string>("All");
    const [Page, setPage] = useState<number>(1);
    const [ReturnData, setReturnData] = useState<ReturnItem[]>([]);
    const [ReturnCount, setReturnCount] = useState<number>(0);
    const [CustomerService, setCustomerService] = useState<boolean>(true);
    const [GetReturnDataFunction] = useLazyQuery<{ReturnProduct: {ReturnProduct: ReturnItem[], Count: number}}>(GetReturnData, {fetchPolicy: 'network-only'}) 
    const [OpenAddCode, setOpenAddCode] = useState<number|null>(null);
    const {t} = useTranslation()

    function Refresh_Data(){
        GetReturnDataFunction({variables: {Start: (Page-1)*10, End: Page*10, Filter: Type}}).then((res) =>{
            if (res.data){
                setReturnData(res.data.ReturnProduct.ReturnProduct)
                setReturnCount(res.data.ReturnProduct.Count)
            }
        })
    }

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
        <Box sx={{border: 'solid 1px rgb(220,220,220)', width: '80%', ml: 'auto', mr: 'auto', borderRadius: '10px', backgroundColor: 'rgb(250,250,250)', marginTop: '150px' ,minWidth: '1200px'}}>
            <div style={{display: 'flex', marginLeft: '2%', marginTop: '50px', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'end'}}>
                    <Typography variant="h4" fontWeight='bold' sx={{mr: '10px'}}>{t("ReturnOrder.Title")}</Typography>
                </div> 
                <div>
                    <Button variant='contained' sx={{mr: '15px'}} onClick={() => window.location.assign('/Order')} startIcon={<BookmarkBorderIcon/>}>{t("ReturnOrder.OrderButton")}</Button>
                    <Button variant='contained' sx={{mr: '15px'}} startIcon={<CalendarMonthIcon/>}>Function Still Develop</Button>         
                </div>             
            </div>
            <Box sx={{marginLeft: '2%' }}>
            <Tabs value={Type} onChange={(e, value)=> {setType(value)}}>
                <Tab label={t("ReturnOrder.AllRecord")} value={'All'} />
                <Tab label={t("ReturnOrder.WaitforReturn")} value={'WFR'}/>
                <Tab label={t("ReturnOrder.WaitforConfirm")} value={'WFC'}/>
                <Tab label={t("ReturnOrder.Finish")} value={'Finish'}/>
                <Tab label={t("ReturnOrder.Cancel")} value={'Cancel'}/>
            </Tabs>
            </Box>
            <List sx={{ml: '1%', mr: '1%'}}>
            <ListItem>
                <Grid container>
                    <Grid item xs={4} sx={{display: 'flex', justifyContent: 'flex-start'}}>
                        <Typography variant='body1' sx={{fontWeight: 'bold'}}>{t("ReturnOrder.ProductDetails")}</Typography>
                    </Grid>
                    <Grid item xs={3} sx={{display: 'flex',  justifyContent: 'flex-start'}}>
                        <Typography variant='body1' sx={{fontWeight: 'bold'}}>{t("ReturnOrder.PriceEach")}</Typography>
                    </Grid>
                    <Grid item xs={2} sx={{display: 'flex',  justifyContent: 'center'}}>
                        <Typography variant='body1' sx={{fontWeight: 'bold'}}>{t("ReturnOrder.Status")}</Typography>
                    </Grid>
                    <Grid item xs={3} sx={{display: 'flex',  justifyContent: 'center'}}>
                    </Grid>
                </Grid>       
            </ListItem>
            <Divider sx={{mb: '5px'}}/>
            {ReturnData?.map((Item, index) => {
                return(
                    <ReturnItems key={index} Item={Item} OpenAddCode={setOpenAddCode}/>
                )
            })}
            </List>
            <Box sx={{display: 'flex', mt: '20px', mb: '20px'}}>
            <Pagination count={Math.ceil(ReturnCount/10)} sx={{transform: 'scale(1.5)', marginLeft: 'auto', marginRight: 'auto'}} 
            onChange={(e, value) => setPage(value)}/>
            </Box>
        </Box>
        <CustomerServiceDialog Open={CustomerService} setOpen={setCustomerService}/>
        {OpenAddCode !== null ? <AddReturnTransportCodeDialog ItemKey = {OpenAddCode} onClose={setOpenAddCode} Refresh={Refresh_Data}/> : null}
    </>
    )
}

export default ReturnOrderPage