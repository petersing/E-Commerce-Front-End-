import { Dialog, DialogTitle, DialogContent, Typography, Divider, Grid, Paper, Stepper, Step, StepLabel, ListItemText} from "@mui/material"
import React, { useState, useEffect } from "react"
import { useCookies } from "react-cookie"
import { Full_Order_Object } from "../../Public_Data/Interfaces"
import { gql, useQuery } from "@apollo/client"
import { useTranslation } from "react-i18next"

const GetOrderDetail = gql`
query OrderDetail($id: Int!) {
    OrderDetail(id: $id) {
        id, DateCreate, TransportCode, DeliveryMethod, PaymentMethod,OrderProcess, SellerName, SellerID, Address,
        OrderList{
            ProductTitle, OrderImage,
            SubItem{
                Name, Count, Price, Status
            }
        }
    }
}
`

const OrderDetailDialog = (props: {Open: boolean, Onclose: Function, Order_ID: string|number}) => {
    const {data, loading} = useQuery<{OrderDetail: Full_Order_Object}>(GetOrderDetail, {variables: {id: typeof(props.Order_ID) === 'string' ? parseInt(props.Order_ID) : props.Order_ID}})
    const {t} = useTranslation()

    return (
    <>{!loading && data?.OrderDetail ?
        <Dialog open={props.Open} onClose={() => props.Onclose(false)} maxWidth='md' fullWidth PaperProps={{style: {backgroundColor: 'rgb(245,245,245)'}}}>
            <DialogTitle>
                <Typography fontWeight='bold' fontSize='25px'>{t("Order.OrderDetail")}</Typography>
            </DialogTitle>
            <Divider/>
            <DialogContent>
                <Grid container spacing={0.5}>
                    <Grid item sm={4}>
                        <Paper sx={{padding: '15px'}}>
                            <Typography fontWeight='10' variant='body1' sx={{ml: '15px'}}>{t("Order.OrderID")}</Typography>
                            <Typography fontWeight='bold' variant='body1' sx={{ml: '15px'}}>{props.Order_ID}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item sm={4}>
                        <Paper sx={{padding: '15px'}}>
                            <Typography fontWeight='10' variant='body1' sx={{ml: '15px'}}>{t("Order.CreatedTime")}</Typography>
                            <Typography fontWeight='bold' variant='body1' sx={{ml: '15px'}}>{data.OrderDetail.DateCreate}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item sm={4}>
                        <Paper sx={{padding: '15px'}}>
                            <Typography fontWeight='10' variant='body1' sx={{ml: '15px'}}>{t("Order.PaymentMethod")}</Typography>
                            <Typography fontWeight='bold' variant='body1' sx={{ml: '15px'}}>{data.OrderDetail.PaymentMethod}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
                <Paper>
                    <Stepper activeStep={data.OrderDetail.OrderProcess ? data.OrderDetail.OrderProcess : 0} alternativeLabel sx={{padding: '15px', mt: '15px'}}>
                        <Step>
                            <StepLabel>{t("Order.CreatedAt")} {data.OrderDetail.DateCreate}</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>{t("Order.Payment")}</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>{t("Order.ReadyToPickup")}</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>{t("Order.Transport")}</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>{t("Order.Complete")}</StepLabel>
                        </Step>
                    </Stepper>
                </Paper>
                <Typography fontWeight='700' fontSize='18px' sx={{mt: '15px'}}>{t("Order.OrderInfo")}</Typography>
                <Paper sx={{padding: '15px'}}>
                    <Grid container spacing={0.5}>
                        <Grid item sm={6}>
                            <Typography fontWeight='10' variant='body1' sx={{ml: '15px'}}>{t("Order.Seller")}</Typography>
                            <Typography fontWeight='bold' variant='body1' sx={{ml: '15px'}}>{data.OrderDetail.SellerName}</Typography>
                            <Typography fontWeight='10' variant='body1' sx={{ml: '15px', mt: '15px'}}>{t("Order.DeliveryAddress")}</Typography>
                            <Typography fontWeight='bold' variant='body1' sx={{ml: '15px'}}>{data.OrderDetail.Address ? data.OrderDetail.Address: t("Order.AddressErrorStatment")}</Typography>
                            <Typography fontWeight='10' variant='body1' sx={{ml: '15px', mt: '15px'}}>{t("Order.TransportCode")}</Typography>
                            <Typography fontWeight='bold' variant='body1' sx={{ml: '15px'}}>{data.OrderDetail.TransportCode ? data.OrderDetail.TransportCode: t("Order.Unknown")}</Typography>
                        </Grid>
                        <Grid item sm={6}>
                            <Typography fontWeight='10' variant='body1' sx={{ml: '15px'}}>{t("Order.SellerID")}</Typography>
                            <Typography fontWeight='bold' variant='body1' sx={{ml: '15px'}}>{data.OrderDetail.SellerID}</Typography> 
                            <Typography fontWeight='10' variant='body1' sx={{ml: '15px', mt: '15px'}}>{t("Order.DeliveryMethod")}</Typography>
                            <Typography fontWeight='bold' variant='body1' sx={{ml: '15px'}}>{data.OrderDetail.DeliveryMethod}</Typography>  
                            <Typography fontWeight='10' variant='body1' sx={{ml: '15px', mt: '15px'}}>{t("Order.TransportCompany")}</Typography>
                            <Typography fontWeight='bold' variant='body1' sx={{ml: '15px'}}>{data.OrderDetail.TransportCode ? t("Order.ExistTransportStatement") : t("Order.UnExistTransportStatement")}</Typography>
                        </Grid>
                    </Grid> 
                </Paper>
                <Paper sx={{mt: '15px', padding: '15px'}}>
                    <Grid container spacing={0.5}>
                        <Grid item sm={5}>
                            <Typography fontWeight='10' variant='body1' sx={{ml: '15px'}}>{t("Order.ProductDetail")}</Typography>
                        </Grid>
                        <Grid item sm={2}>
                            <Typography fontWeight='10' variant='body1' sx={{ml: '15px'}}>{t("Order.Quantity")}</Typography>
                        </Grid>
                        <Grid item sm={3}>
                            <Typography fontWeight='10' variant='body1' sx={{ml: '15px'}}>{t("Order.Price")}</Typography>
                        </Grid>
                        <Grid item sm={2}>
                            <Typography fontWeight='10' variant='body1' sx={{ml: '15px'}}>{t("Order.Status")}</Typography>
                        </Grid>   
                    </Grid>
                </Paper>
                <Divider/>
                <Paper sx={{padding: '15px'}}>
                    {data.OrderDetail.OrderList.map((item, index) => {
                        return(
                            <React.Fragment key={index}>
                                {item.SubItem.map((sub, secondindex)=>{
                                    return(
                                        <Grid container spacing={0.5} key={secondindex} sx={{mt: '5px'}}>
                                            <Grid item xs={5} sx={{display: 'flex', flexDirection: 'row', alignItems: 'center',  justifyContent: 'flex-start'}}>
                                                <img src={item.OrderImage} alt='ProductImage' style={{width: '60px', objectFit: 'contain', marginRight: '10px'}}/>
                                                <ListItemText primary={item.ProductTitle} secondary={sub.Name}/>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <Typography fontWeight='10' variant='body1' sx={{ml: '15px'}}>{sub.Count}</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography fontWeight='10' variant='body1' sx={{ml: '15px'}}>HKD${sub.Price}{t("Order.Unit")}</Typography>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <Typography fontWeight='10' variant='body1' sx={{ml: '15px'}}>{t(`Order.${sub.Status}`)}</Typography>
                                            </Grid>
                                        </Grid>
                                    )
                                })}
                            </React.Fragment>
                        )
                    })}
                </Paper>
            </DialogContent>
        </Dialog>
    : null}
    </>
  )
}

export default OrderDetailDialog