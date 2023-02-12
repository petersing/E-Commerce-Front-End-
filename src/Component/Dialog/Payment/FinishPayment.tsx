import { Typography, TextField,  Button } from "@mui/material"
import { useTranslation } from "react-i18next"

const FinishPayment = (props: {Payment_Response_Data: {orderID: string, Create_Date: string, PaymentMethod: string}|undefined, 
                               onCloseFunction: Function}) => {
  const {t} = useTranslation()
  
  return (
    <>
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Typography variant='h5'>{t("Purchase.SuccessOrder")}</Typography>
        </div>
        <TextField fullWidth label={t("Purchase.PaymentID")} InputProps={{readOnly: true}} defaultValue={props.Payment_Response_Data?.orderID} sx={{mt: '15px', mb: '15px'}} focused/>
        <TextField fullWidth label={t("Purchase.OrderCreatedTime")} InputProps={{readOnly: true}} defaultValue={props.Payment_Response_Data?.Create_Date} sx={{mt: '15px', mb: '15px'}} focused/>
        <TextField fullWidth label={t("Purchase.PaymentMethod")} InputProps={{readOnly: true}} defaultValue={t(`Purchase.${props.Payment_Response_Data?.PaymentMethod}`)} sx={{mt: '15px', mb: '15px'}} focused/>
        <Button variant='contained' color='primary' sx={{width: '100%', mt: '20px'}} onClick={() => props.onCloseFunction(false)}>{t("Purchase.Finish")}</Button>
    </>
  )
}

export default FinishPayment