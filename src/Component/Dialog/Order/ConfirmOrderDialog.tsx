import { gql,useMutation } from '@apollo/client';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next';

const ConfirmOrder = gql`
mutation ConfirmOrder($OrderSubItemKey: Int!) {
  ConfirmOrder(OrderSubItemKey: $OrderSubItemKey){
    status
  }
}`

const ConfirmOrderDialog = (props: {Open: {MainName: string, Name: string; Count: number; Price: number; Status: string; id: string;}|null, setOpen: Function, Refresh: Function}) => {
    const [ConfirmOrderFunction] = useMutation<{ConfirmOrder: {status: boolean}}>(ConfirmOrder)
    const {t} = useTranslation()

    function ClickConfirmOrder(){
        if (props.Open){
            ConfirmOrderFunction({variables: {OrderSubItemKey:parseInt(props.Open.id)}}).then((res) =>{
                console.log(res.data?.ConfirmOrder)
                if (res.data && res.data.ConfirmOrder.status){
                    props.setOpen(null)
                    props.Refresh()
                }
            })
        }
    }
    return (
        <Dialog open={Boolean(props.Open)} onClose={() => props.setOpen(null)}>
            <DialogTitle>{t("Order.ConfirmOrder")}</DialogTitle>
            <DialogContent dividers>
                <TextField label={t("Order.ProductName")} fullWidth sx={{mb: '10px'}} value={props.Open?.MainName} InputProps={{readOnly : true}} focused/>
                <TextField label={t("Order.ProductSubName")} fullWidth sx={{mb: '10px'}} value={props.Open?.Name} InputProps={{readOnly : true}} focused/>
                <TextField label={t("Order.ProductCount")} fullWidth sx={{mb: '10px'}} value={props.Open?.Count} InputProps={{readOnly : true}} focused/>
                <TextField label={t("Order.ProductPrice")} fullWidth sx={{mb: '10px'}} value={`HKD$${props.Open?.Price}`} InputProps={{readOnly : true}} focused/>
                <Typography variant='caption' color='GrayText'>{t("Order.ConfirmPaymentStatement")}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => ClickConfirmOrder()}>{t("Order.Confirm")}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmOrderDialog