import { gql, useMutation } from '@apollo/client'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, ListItemText, TextField, Typography } from '@mui/material'
import React from 'react'
import { Order_SubList } from '../../Public_Data/Interfaces'
import { useTranslation } from 'react-i18next'

const ConfirmOrder = gql`
mutation ConfirmOrder($OrderRecordKey: Int!) {
  ConfirmOrder(OrderRecordKey: $OrderRecordKey){
    status
  }
}`



const ConfirmOrdersDialog = (props: {Open: Order_SubList|null, setOpen: Function, Refresh: Function}) => {
    const [ConfirmOrderFunction] = useMutation<{ConfirmOrder: {status: boolean}}>(ConfirmOrder)
    const {t} = useTranslation()

    function ClickConfirmOrder(){
        if (props.Open){
            ConfirmOrderFunction({variables: {OrderRecordKey:props.Open.id}}).then((res) =>{
                if (res.data && res.data.ConfirmOrder.status){
                    props.setOpen(null)
                    props.Refresh()
                }
            })
        }
    }

    return (
        <Dialog open={Boolean(props.Open)} onClose={() => props.setOpen(null)}>
            <DialogTitle>{t("Order.ConfirmOrders")}</DialogTitle>
            <DialogContent dividers>
                {props.Open?.OrderList.map((order, index) => {
                    return(
                        <Grid container key={index}>
                            {order.SubItem.map((SubItem, subindex) => {
                                return(
                                    <Grid item xs={6} sx={{display: 'flex', flexDirection: 'row'}} key={subindex}>
                                        <img src={order.OrderImage + '?Width=60'} alt='ProductImage' style={{width: '60px', objectFit: 'contain', marginRight: '10px'}}/>
                                        <ListItemText primary={order.ProductTitle} secondary={SubItem.Name} />
                                    </Grid>
                                )
                            })}
                        </Grid>
                    )
                })}
                <Typography variant='caption' color='GrayText'>{t("Order.ConfirmPaymentStatement")}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {ClickConfirmOrder()}}>{t("Order.Confirm")}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmOrdersDialog