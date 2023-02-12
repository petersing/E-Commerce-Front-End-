import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { Box, Typography, Button, Grid, List, ListItem, Divider, Pagination, MenuItem, ListItemText, Chip, Tabs, Tab, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Menu} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { Seller_Order_List_Object } from '../../Public_Data/Interfaces'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import ChatBox from '../../AddComponect/Chat/ChatBox'
import ReturnPaymentDialog from '../../Dialog/Payment/ReturnPaymentDialog'
import AddTransportCodeDialog from '../../Dialog/Order/AddTransportCodeDialog'
import { useTranslation } from 'react-i18next'


const GetOrderData = gql`
query OrderListSeller($Start: Int!, $End: Int!,$Filter: String) {
    OrderListSeller(Start:$Start, End:$End, Filter:$Filter) {
        Orders{
            id, BuyerName, DateCreate, OrderProcess, Phone, Address, DeliveryMethod, Status, TransportCode, PaymentStatus,
            OrderList{
                ProductTitle, OrderImage, id,
                SubItem{
                    Name, Status, Price, Count, id
                }
            }  
        }
        Count
    }
}
`

const OrderItem = (props: {OrderItem: Seller_Order_List_Object, setChatBuyer: Function, AddTransportCodeKey: Function, setOpenReturnPayment: Function}) =>{
    const {t} = useTranslation()
    return(
        <>
            <ListItem>
                <Grid container spacing={5} columns={15}>
                    <Grid item xs={15} sx={{display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                            <Chip label={props.OrderItem.BuyerName} sx={{minWidth: '100px'}}/>
                        </div>
                        <div>
                            <Button startIcon={<LocalPhoneIcon/>} sx={{ml: '10px'}} variant='contained' onClick={() => {props.setChatBuyer(props.OrderItem.BuyerName)}}>{t("Business.ContactBuyer")}</Button>
                            {props.OrderItem.PaymentStatus === 'paid' && props.OrderItem.OrderProcess !== 4 &&
                            <Button variant='contained' color="success" sx={{ml: '10px'}} onClick={() => props.AddTransportCodeKey(props.OrderItem.id)}>
                                {props.OrderItem.OrderProcess < 3? t("Business.AddTransportCode"): t("Business.ChangeTransportCode")}
                            </Button>}
                            {props.OrderItem.PaymentStatus === 'paid' && props.OrderItem.OrderProcess !== 4 &&
                            <Button variant='contained' color='error' sx={{ml: '10px'}} onClick={() => props.setOpenReturnPayment(props.OrderItem)}>{t("Business.ReturnPayment")}</Button>
                            }
                        </div>                   
                    </Grid>
                    <Grid item xs={7}>                   
                        {props.OrderItem.OrderList.map((sub, MainIndex) => {
                            return(
                                <React.Fragment key={MainIndex}>
                                    {sub.SubItem.map((item, index) => {
                                        return(
                                            <Grid container sx={{mt: '10px', display: 'flex', alignItems: 'flex-start'}} key={index}>
                                                <Grid item xs={5} sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                                    <img src={sub.OrderImage} alt="" style={{width: '60px', objectFit: 'contain'}}/>
                                                    <ListItemText primary={sub.ProductTitle} secondary={item.Name}  sx={{ml: '5px'}}/>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <ListItemText primary={`${item.Count} ${t("Business.Units")}`} secondary={`HKD$${item.Price}`}  sx={{ml: '5px'}}/>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <ListItemText primary={`${t(`Business.${item.Status}`)}`} sx={{ml: '5px'}}/>
                                                </Grid>
                                            </Grid>
                                        )
                                    })}
                                </React.Fragment>
                            )
                        })}
                    </Grid>
                    <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                        <Chip label={`${t("Business.BuyerName")} : ${props.OrderItem.BuyerName}`} sx={{mb: '10px'}} color="primary"/>
                        <Chip label={`${t("Business.BuyerPhone")} : ${props.OrderItem.Phone}`} sx={{mb: '10px'}} color='secondary'/>
                        <Chip label={`${t("Business.Address")} : ${props.OrderItem.Address}`} sx={{mb: '10px'}} color="success"/>
                        <Chip label={`${t("Business.DeliveryMethod")} : ${t(`Business.${props.OrderItem.DeliveryMethod}`)}`} sx={{mb: '10px'}} color="secondary"/>
                    </Grid>    
                    <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                        <Chip label={props.OrderItem.TransportCode ? `${t("Business.TransportCode")}: ${props.OrderItem.TransportCode}`: t("Business.Unknown")} sx={{mb: '10px'}} color="primary"/>
                        <Chip label={`${t("Business.OrderStatus")} : ${props.OrderItem.OrderProcess === 4 ? t("Business.Finish"): props.OrderItem.Status === 'cancel'? t("Business.Cancel"): t("Business.StillProcess")}`} sx={{mb: '10px'}} 
                                    color={props.OrderItem.OrderProcess === 4 ? "primary": "error"}/>
                        <Chip label={`${t("Business.ShippingStatus")} : ${props.OrderItem.OrderProcess < 3 ? t("Business.NotYetShipped"): t("Business.AlreadyShipped")}`} sx={{mb: '10px'}} color="primary"/>
                        <Chip label={`${t("Business.PaymentStatus")} : ${t(`Business.${props.OrderItem.PaymentStatus}`)}`} sx={{mb: '10px'}} color="primary"/>
                    </Grid>
                </Grid>
            </ListItem>
        </>
    )
}

const OrderManagementPage = () => {
    const [GetOrderDataFunction] = useLazyQuery<{OrderListSeller: {Orders: Seller_Order_List_Object[], Count:number}}>(GetOrderData, {fetchPolicy: 'network-only'});
    const [OrderList, setOrderList] = useState<Seller_Order_List_Object[]>([]);
    const [OrderListCount, setOrderListCount] = useState<number>(0);
    const [Page, setPage] = useState<number>(1);
    const [Type, setType] = useState<string>('All');
    const [ChatBuyer, setChatBuyer] = useState<string|null>(null);
    const [AddTransportCodeKey, setAddTransportCodeKey] = useState<string|null>(null);
    const [ReturnPaymentOrder, setReturnPaymentOrder] = useState<Seller_Order_List_Object|null>(null)
    const {t} = useTranslation()

    function RefreshOrderData(){
        GetOrderDataFunction({variables: {Start: (Page-1)*5, End: (Page)*5, Filter: Type}}).then((res) =>{
            if (res.data){
                setOrderList(res.data.OrderListSeller.Orders)
                setOrderListCount(res.data.OrderListSeller.Count)
            }         
        })
    }

    useEffect(() =>{
        GetOrderDataFunction({variables: {Start: (Page-1)*5, End: (Page)*5, Filter: Type}}).then((res) =>{
            if (res.data){
                setOrderList(res.data.OrderListSeller.Orders)
                setOrderListCount(res.data.OrderListSeller.Count)
            }         
        })
    },[GetOrderDataFunction, Page, Type])

    return (
        <>
            <Box sx={{border: 'solid 1px rgb(220,220,220)', width: '80%', ml: 'auto', mr: 'auto', borderRadius: '10px', 
                        backgroundColor: 'rgb(250,250,250)', marginTop: '150px' ,minWidth: '1200px', display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex', marginLeft: '2%', marginTop: '50px', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'end'}}>
                    <Typography variant="h4" fontWeight='bold' sx={{mr: '10px'}}>{t("Business.Orders")}</Typography>
                </div>  
                </div>
                <Box sx={{ ml: '2%' }}>
                    <Tabs value={Type} onChange={(e, value)=> {setType(value)}}>
                        <Tab label={t("Business.AllOrder")} value={'All'} />
                        <Tab label={t("Business.Shipping")} value={'Shipping'}/>
                        <Tab label={t("Business.WaitForShipping")} value={'WFS'}/>
                        <Tab label={t("Business.Finish")} value={'Finish'}/>
                        <Tab label={t("Business.Cancel")} value={'Cancel'}/>
                    </Tabs>
                </Box>
                <Grid container>
                    <Grid item xs={12}>
                        <List sx={{ml: '1%', mr: '1%'}}>
                        <ListItem>
                            <Grid container spacing={5} columns={15}>
                                <Grid item xs={7}>
                                    <Grid container>
                                        <Grid item xs={5}>
                                            <Typography variant="body1" fontWeight='bold' sx={{mr: '10px'}}>{t("Business.ProductInformation")}</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="body1" fontWeight='bold' sx={{mr: '10px'}}>{t("Business.ProductProperties")}</Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Typography variant="body1" fontWeight='bold' sx={{mr: '10px'}}>{t("Business.Status")}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center'}}>
                                    <Typography variant="body1" fontWeight='bold' sx={{mr: '10px'}}>{t("Business.BuyerInformation")}</Typography>                
                                </Grid>
                                <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center'}}>
                                    <Typography variant="body1" fontWeight='bold' sx={{mr: '10px'}}>{t("Business.OrderInformation")}</Typography>
                                </Grid>
                            </Grid>      
                        </ListItem>
                        <Divider sx={{mb: '5px'}}/>
                        {OrderList.map((item, index) => {
                            return(
                                <OrderItem OrderItem={item} key={index} setChatBuyer={setChatBuyer} AddTransportCodeKey={setAddTransportCodeKey} setOpenReturnPayment={setReturnPaymentOrder}/>
                            )
                        })}
                        </List> 
                    </Grid>
                    <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
                        <Pagination count={Math.ceil(OrderListCount/5)} sx={{transform: 'scale(1.2)', mb: '15px'}} size='large' onChange={(e, value) => setPage(value)} page={Page}/>
                    </Grid>
                </Grid>
            </Box>
            {ChatBuyer && <ChatBox Target={ChatBuyer} onClose={setChatBuyer}/>}
            {AddTransportCodeKey && <AddTransportCodeDialog ItemKey={AddTransportCodeKey} onClose={setAddTransportCodeKey} Refresh={RefreshOrderData}/>}
            {ReturnPaymentOrder && <ReturnPaymentDialog Open={Boolean(ReturnPaymentOrder)} setOpen={setReturnPaymentOrder} OrderDetail={ReturnPaymentOrder} Refresh={RefreshOrderData}/>}
        </>
    )
}

export default OrderManagementPage