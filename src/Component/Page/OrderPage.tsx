import {Box, Grid, Typography, List, ListItem, Divider, Button, Pagination, Chip, ListItemText, IconButton, Paper, Tabs, Tab} from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import React, { useState, useEffect, useReducer } from 'react';
import NotFound from '../../assets/NotFound.png'
import OrderDetailDialog from '../Dialog/Order/OrderDetailDialog';
import { useCookies } from 'react-cookie';
import { Order_Object, Order_SubList } from '../Public_Data/Interfaces';
import PaymentIcon from '@mui/icons-material/Payment';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import AddCardIcon from '@mui/icons-material/AddCard';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { gql, useLazyQuery, useMutation} from "@apollo/client"
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ReturnOrderDialog from '../Dialog/Order/ReturnOrderDialog';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import ConfirmOrderDialog from '../Dialog/Order/ConfirmOrderDialog';
import ConfirmOrdersDialog from '../Dialog/Order/ConfirmOrdersDialog';
import CommentOrderDialog from '../Dialog/Order/CommentOrderDialog';
import { useTranslation } from 'react-i18next';

const GetPaymentData = gql`
query PaymentList($Start: Int!, $End: Int!, $Filter: String) {
    PaymentList(Start:$Start, End:$End, Filter: $Filter) {
      Payments{
        PaymentID, PaymentStatus,
        Order{
            SellerName, TransportCode, id,
            OrderList{
                  ProductTitle, id, OrderImage, ProductKey,
                  SubItem{
                      Name, Count,Price, Status, id,
                      Comment
                  }
              }
        }
      }
      Count
    }
}
`
const RetrievePayment = gql`
mutation RetrievePayment($PaymentID: Int!) {
    RetrievePayment(PaymentID: $PaymentID){
      StripeCode
    }
}
`

const CancelOrder= gql`
mutation CancelPayment($PaymentID: Int!) {
  CancelPayment(PaymentID: $PaymentID){
    status
  }
}
`

const OrderItem = (props: {keys: string|number, order: Order_Object, setOpen: Function, setOrder: Function, setOrderReturnData: Function, 
                           setConfirmOrder: Function, setConfirmOrders: Function, Refetch_OrderList: Function}) => {
  const [RetrieveFunction] = useMutation<{RetrievePayment: {StripeCode: string}}>(RetrievePayment)
  const [CancelOrderFunction] = useMutation<{CancelPayment: {status: Boolean}}>(CancelOrder)
  const [CommentOrderData, setCommentOrderData] = useState<{Order_ID: number, OrderItem_ID: number, SubItem_ID: number}|null>()
  const {t} = useTranslation()

  function RetrievePaymentAgain(){
    RetrieveFunction({variables: {PaymentID: props.order.PaymentID}}).then((res) =>{
      if (res.data?.RetrievePayment){
        window?.open(res.data?.RetrievePayment.StripeCode, '_blank')
      } 
    })
  }

  function RunCancelOrder(){
    CancelOrderFunction({variables: {PaymentID: props.order.PaymentID}}).then((res) =>{
      if (res.data?.CancelPayment.status){
        window.location.reload()
      }
    })
  }


  function CheckOrderAlreadyFinish(order: Order_SubList){
    for (let i = 0; i < order.OrderList.length; i++) {
      for (let ii =0; ii< order.OrderList[i].SubItem.length; ii++) {
        if(order.OrderList[i].SubItem[ii].Status === "normal"){
          return false
        }
      }
    }
    return true
  }

  function CheckOrderExistReturnItem(order: Order_SubList){
    for (let i = 0; i < order.OrderList.length; i++) {
      for (let ii =0; ii< order.OrderList[i].SubItem.length; ii++) {
        if(order.OrderList[i].SubItem[ii].Status !== "return"){
          return true
        }
      }
    }
    return false
  }

  return (
    <>
      {props.order.Order.map((order, Mainindex)=>{
        return(
        <React.Fragment key={Mainindex}>
          <ListItem  sx={{display: 'flex' , flexDirection: 'column', alignItems: 'flex-start'}}>
                <div style={{display: 'flex'}}>
                  <Chip label={`${t("Order.Seller")}: ${order.SellerName}`} sx={{minWidth: '100px', ":hover": {cursor: 'pointer', backgroundColor: 'rgb(200,200,200)'}, mr: '10px'}} 
                        onClick={() => window.location.assign(`/Profile/${order.SellerName}`)}/>

                  <Chip label={order.TransportCode ? `${t("Order.TransportCode")}: ${order.TransportCode}` : t("Order.Unknown")} sx={{mr: '10px'}} 
                        icon={order.TransportCode ?<DirectionsCarFilledIcon/> :<QuestionMarkIcon/>}/>

                  <Chip label={t("Order." + props.order.PaymentStatus)} icon={props.order.PaymentStatus === 'paid' ? <CreditScoreIcon/>: <PaymentIcon/>} 
                        color={props.order.PaymentStatus === 'paid' ? "primary": 'warning'} size='medium'/>
                </div>
                  <Grid container columns={14}>
                    <Grid item xs={12}>
                      {order.OrderList.map((sub, secondindex)=>{
                        return(
                          <Grid container key={secondindex}>
                            <Grid item xs={2} sx={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start', mt: '15px'}}>
                              <Typography variant="body1" fontWeight='bold'>{sub.ProductTitle}</Typography>
                            </Grid>
                            <Grid item xs={10}>
                                  {sub.SubItem.map((item, index)=>{
                                    return(
                                    <Grid container sx={{padding: '10px'}} key={index}>
                                      <Grid item xs={5} sx={{display: 'flex', flexDirection: 'row', alignItems: 'center',  justifyContent: 'flex-start', ":hover":{cursor: 'pointer'}}} onClick={() => window.location.assign(`/product/${sub.ProductKey}`)}>
                                        <img src={sub.OrderImage + '?Width=60'} alt='ProductImage' style={{width: '60px', objectFit: 'contain', marginRight: '10px'}}/>
                                        <Typography variant='body1'>{item.Name}</Typography>
                                      </Grid>
                                      <Grid item xs={2} sx={{display: 'flex', flexDirection: 'row', alignItems: 'center',  justifyContent: 'center'}}>
                                        <Typography variant='body1'>HKD${item.Price}{t("Order.ItemUnit")}</Typography>
                                      </Grid>
                                      <Grid item xs={1} sx={{display: 'flex', flexDirection: 'row', alignItems: 'center',  justifyContent: 'center'}}>
                                        <Typography variant='body1'>{item.Count}</Typography>
                                      </Grid>
                                      <Grid item xs={2} sx={{display: 'flex', flexDirection: 'row', alignItems: 'center',  justifyContent: 'center'}}>
                                        <Typography variant='body1'>HKD${item.Price * item.Count}</Typography>
                                      </Grid>
                                      <Grid item xs={2} sx={{display: 'flex', flexDirection: 'row', alignItems: 'center',  justifyContent: 'center'}}>
                                        {props.order.PaymentStatus !== 'cancel' && order.TransportCode &&  item.Status === 'normal' && <Button variant='contained' color='success' sx={{mt: '10px'}} onClick={() => {props.setConfirmOrder({...item, MainName: sub.ProductTitle})}}>{t("Order.ConfirmButton")}</Button>}
                                        {item.Status === 'finish' ?
                                          <div style={{display: 'flex', flexDirection: 'column'}}>
                                            <Chip label={t("Order.Finish")} color='primary' sx={{mb: '5px'}}/>
                                            {!item.Comment ? 
                                            <Chip label={t("Order.MakeComment")} sx={{":hover": {backgroundColor: 'rgb(220,220,220)', cursor: 'pointer'}}} onClick={() => setCommentOrderData({Order_ID : order.id, OrderItem_ID : sub.id, SubItem_ID: item.id})}/>:
                                            <Chip label={t("Order.AlreadyComment")} color='success'/>}
                                          </div>
                                        : item.Status === 'return' && 
                                          <Chip label={t("Order.Return")} color='warning'/>
                                        }
                                      </Grid>
                                    </Grid>)
                                  })}
                            </Grid>
                          </Grid>               
                        )
                      })}
                    </Grid> 
                    <Grid item xs={2} sx={{display: 'flex', alignItems: 'center'}}>
                        <Box sx={{display: 'flex', flexDirection: 'column'}}>
                          <Button variant='contained' color='secondary' onClick={() => {props.setOpen(true); props.setOrder(order.id)}}>{t("Order.DetailsButton")}</Button>
                          {props.order.PaymentStatus !== 'cancel' && CheckOrderExistReturnItem(order) && <Button variant='contained' sx={{mt: '10px'}} onClick={() => {props.setOrderReturnData(order)}}>{t("Order.ReturnButton")}</Button>}
                          {props.order.PaymentStatus !== 'cancel' && order.TransportCode && !CheckOrderAlreadyFinish(order) &&
                            <Button variant='contained' color='success' sx={{mt: '10px'}} onClick={() => {props.setConfirmOrders(order)}}>
                              {t("Order.ConfirmAllButton")}
                            </Button>
                          }
                          {props.order.PaymentStatus === 'unpaid' ? <Button sx={{mt: '15px'}} variant='contained' color='success' onClick={() => {RetrievePaymentAgain() }}><AddCardIcon/>{t("Order.PayButton")}</Button>: null}
                          {props.order.PaymentStatus === 'unpaid' ? <Button sx={{mt: '15px'}} variant='contained' color='error' onClick={() => RunCancelOrder()}><AddCardIcon/>{t("Order.CancelButton")}</Button>: null}
                        </Box>
                    </Grid>
                  </Grid>
          </ListItem>
          {CommentOrderData && <CommentOrderDialog OrderData={CommentOrderData} setOrderData={setCommentOrderData} Refetch_OrderList={props.Refetch_OrderList}/> }
        </React.Fragment>
        )
      })}
      <Divider sx={{mt: '15px'}}/>
    </>
  )
}

const OrderPage = () => {
  const [GetOrderListFunction] = useLazyQuery<{PaymentList: {Payments: Order_Object[], Count: number}}>(GetPaymentData, {fetchPolicy: 'network-only'})
  const [OrderList, setOrderList]= useState<Order_Object[]>([])
  const [OrderListCount, setOrderListCount] = useState<number>(0)
  const [Page, setPage] = useState<number>(1)
  const [Open, setOpen] = useState<boolean>(false)
  const [OrderID, setOrderID] = useState<string|number>(0)
  const [Type, setType] = useState<string>('All')
  const [OrderReturnData, setOrderReturnData] = useState<Order_SubList|null>(null)
  const [ConfirmOrder, setConfirmOrder] = useState<{MainName: string, Name: string; Count: number; Price: number; Status: string; id: string;}|null>(null)
  const [ConfirmOrders, setConfirmOrders] = useState<Order_SubList| null>(null)
  const {t} = useTranslation()


  function Refetch_OrderList(){
    GetOrderListFunction({variables: {Start: (Page-1)*5, End: Page*5, Filter: Type}}).then((res)=>{
      if (res.data){
        setOrderList(res.data?.PaymentList.Payments)
        setOrderListCount(res.data?.PaymentList.Count)
      }   
    })
  }

  useEffect(() => {
    GetOrderListFunction({variables: {Start: (Page-1)*5, End: Page*5, Filter: Type}}).then((res)=>{
      if (res.data){
        setOrderList(res.data?.PaymentList.Payments)
        setOrderListCount(res.data?.PaymentList.Count)
      }   
    })
  }, [Page, GetOrderListFunction, Type])


  return (
    <>
      {OrderList ?
      <Box sx={{border: 'solid 1px rgb(220,220,220)', width: '80%', ml: 'auto', mr: 'auto', borderRadius: '10px', backgroundColor: 'rgb(250,250,250)', marginTop: '150px' ,minWidth: '1200px'}}>
        <div style={{display: 'flex', marginLeft: '2%', marginTop: '50px', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'end'}}>
            <Typography variant="h4" fontWeight='bold' sx={{mr: '10px'}}>{t("Order.Order")}</Typography>
            <Typography variant='body1' sx={{color: 'rgb(100,100,100)'}}>{`${OrderListCount} ${t("Order.OrderFound")}`}</Typography>
          </div>
          <div>
            <Button variant='contained' sx={{mr: '15px'}} onClick={() => window.location.assign('/ReturnOrder')} startIcon={<BookmarkBorderIcon/>}>{t("Order.ReturnOrderButton")}</Button>     
          </div>           
        </div>
        <Box sx={{marginLeft: '2%' }}>
          <Tabs value={Type} onChange={(e, value)=> {setType(value); setPage(1)}}>
            <Tab label={t("Order.AllOrder")} value={'All'} />
            <Tab label={t("Order.WaitforPayment")} value={'WFP'}/>
            <Tab label={t("Order.FinishPayment")} value={'Paid'}/>
            <Tab label={t("Order.Cancel")} value={'Cancel'}/>
          </Tabs>
        </Box>
        <List sx={{ml: '1%', mr: '1%'}}>
          <ListItem>
            <Grid container columns={14}>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={2}>
                  </Grid>
                  <Grid item xs={10}>
                    <Grid container>
                      <Grid item xs={5} sx={{display: 'flex', justifyContent: 'flex-start'}}>
                        <Typography variant='body1' sx={{fontWeight: 'bold'}}>{t("Order.ProductDetails")}</Typography>
                      </Grid>
                      <Grid item xs={2} sx={{display: 'flex',  justifyContent: 'center'}}>
                        <Typography variant='body1' sx={{fontWeight: 'bold'}}>{t("Order.PriceEach")}</Typography>
                      </Grid>
                      <Grid item xs={1} sx={{display: 'flex',  justifyContent: 'center'}}>
                        <Typography variant='body1' sx={{fontWeight: 'bold'}}>{t("Order.Quantity")}</Typography>
                      </Grid>
                      <Grid item xs={2} sx={{display: 'flex',  justifyContent: 'center'}}>
                        <Typography variant='body1' sx={{fontWeight: 'bold'}}>{t("Order.TotalPrice")}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>       
          </ListItem>
          <Divider sx={{mb: '5px'}}/>
          {OrderList?.map((order, index) => 
          <OrderItem keys={index} order={order} key={`Order ${index}`} setOpen={setOpen} setOrder={setOrderID} setOrderReturnData={setOrderReturnData} setConfirmOrder={setConfirmOrder} setConfirmOrders={setConfirmOrders} Refetch_OrderList={Refetch_OrderList}/>
          )}
        </List>
        <Box sx={{display: 'flex', mt: '20px', mb: '20px'}}>
          <Pagination count={Math.ceil((OrderListCount ? OrderListCount: 1)/5)} sx={{transform: 'scale(1.5)', marginLeft: 'auto', marginRight: 'auto'}} 
          onChange={(e, value) => {setPage(value);window.scrollTo(0, 0);} }/>
        </Box>
        {Open ? <OrderDetailDialog Open={Open} Onclose={setOpen} Order_ID={OrderID}/>: null}  
      </Box>: null}
      {Boolean(OrderReturnData) ? <ReturnOrderDialog Open={Boolean(OrderReturnData)} setOpen={setOrderReturnData} OrderDetail={OrderReturnData} Refresh={Refetch_OrderList}/>: null}
      {ConfirmOrder ? <ConfirmOrderDialog Open={ConfirmOrder} setOpen={setConfirmOrder} Refresh={Refetch_OrderList}/>: null}
      {ConfirmOrders ? <ConfirmOrdersDialog Open={ConfirmOrders} setOpen={setConfirmOrders} Refresh={Refetch_OrderList}/>: null}
    </>
  )
}



export default OrderPage