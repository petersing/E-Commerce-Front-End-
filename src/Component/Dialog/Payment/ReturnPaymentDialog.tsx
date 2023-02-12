import { Dialog, DialogTitle, DialogContent, Typography, TextField, MenuItem, DialogActions, Button, CircularProgress } from "@mui/material"
import { useState } from "react"
import { Seller_Order_List_Object } from "../../Public_Data/Interfaces"
import { useCookies } from "react-cookie"
import { gql, useMutation } from "@apollo/client"
import { useTranslation } from "react-i18next"


const RefundPaymentFunction = gql`
mutation RefundPaymentFunction($OrderID: Int!, $OrderSubID: Int!, $OrderSubItemID: Int!) {
    RefundPaymentFunction(OrderID: $OrderID, OrderSubID: $OrderSubID, OrderSubItemID: $OrderSubItemID) {
        status
    }
}
`

const LoadingItem = () => {
    return(
        <div style={{zIndex: 40}}>
            <div style={{width: '100%', height: '100%', backgroundColor: 'black', position: 'fixed', top: 0, left: 0, opacity: 0.2}}/>
            <CircularProgress sx={{ position: 'fixed', left: '50%', top: '50%', }} color="secondary"/>    
        </div>
    )
}

const ReturnPaymentDialog = (props: {Open: boolean, setOpen: Function, OrderDetail: Seller_Order_List_Object|null, Refresh: Function}) => {
    const [SelectProduct, setSelectProduct] = useState<number>(-1)
    const [SelectSubProduct, setSelectSubProduct] = useState<number>(-1)
    const [Success, setSuccess] = useState<boolean>(false)
    const [ReturnFunction] = useMutation(RefundPaymentFunction, {onCompleted: (data)=> {props.setOpen(null); setSuccess(true)}})
    const [Loading , setLoading] = useState<boolean>(false)
    const {t} = useTranslation()

    function Return_Product_Function(SubProduct: number|string|undefined, SubProductItem: string|undefined){
        setLoading(true)
        if (SubProduct !== undefined && SubProductItem !== undefined && props.OrderDetail?.id){
            ReturnFunction({variables: {OrderID: props.OrderDetail.id, OrderSubID: SubProduct, OrderSubItemID: SubProductItem}}).then((res)=>{
                setLoading(false);
                setSelectProduct(-1)
                setSelectSubProduct(-1) 
                props.Refresh()
            })
        }
    }

    return (
        <Dialog fullWidth maxWidth='sm' open={props.Open} onClose={() => props.setOpen(null)}>
            {Loading && <LoadingItem/>}
            <DialogTitle>{t("Return.Title")}</DialogTitle>
            {!Success ?
            <DialogContent >
                <TextField label='Return Product' sx={{mt: '10px'}} select fullWidth focused color='secondary' value={SelectProduct} onChange={(e) => {setSelectProduct(parseInt(e.target.value)); setSelectSubProduct(-1)}}>
                    <MenuItem value={-1}>{t("Return.SelectItem")}</MenuItem>
                    {props.OrderDetail?.OrderList.map((item, index) => {
                        return(<MenuItem key={item.ProductTitle+ Math.random()} value={index}>{item.ProductTitle}</MenuItem>)
                    })}
                </TextField>
                {SelectProduct> -1 ? 

                <TextField label='SubItem' sx={{mt: '10px'}} select fullWidth focused value={SelectSubProduct} color='warning' onChange={(e) => {setSelectSubProduct(parseInt(e.target.value))}}>
                    <MenuItem value={-1}>{t("Return.SelectItem")}</MenuItem>
                    {props.OrderDetail?.OrderList[SelectProduct].SubItem.map((item, index) => {
                    if (item.Status === 'normal'){return(<MenuItem key={item.Name} value={index}>{item.Name}</MenuItem>) }else{return(null)}
                    })}
                </TextField>:       
                <TextField label='SubItem' value='No Product can Return' color='warning' sx={{mt: '10px'}} focused fullWidth InputProps={{readOnly: true}}/>}
                <Typography variant='caption' sx={{mt: '10px'}}>{t("Return.ReturnStatement")}</Typography>
                <DialogActions>
                    {SelectProduct > -1 && SelectSubProduct > -1?
                        <Button variant='contained' onClick={() => {Return_Product_Function(props.OrderDetail?.OrderList[SelectProduct].id, props.OrderDetail?.OrderList[SelectProduct].SubItem[SelectSubProduct].id)}}>
                            {t("Return.Apply")}
                        </Button>
                    : null}  
                </DialogActions>              
            </DialogContent>
            : null}
            {Success ? 
            <DialogContent>
                <Typography variant='h6'>{t("Return.Success")}</Typography>
            </DialogContent>
            :null}

        </Dialog>
    )
}

export default ReturnPaymentDialog