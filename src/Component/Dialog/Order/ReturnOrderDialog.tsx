import { Dialog, DialogTitle, DialogContent, Typography, TextField, MenuItem, DialogActions, Button } from "@mui/material"
import { useState } from "react"
import { Order_SubList } from "../../Public_Data/Interfaces"
import { ReturnReason } from "../../Public_Data/ReturnReason"
import { useCookies } from "react-cookie"
import { gql, useMutation } from "@apollo/client"
import { useTranslation } from "react-i18next"

const ReturnProductFunction = gql`
mutation ReturnProductFunction( $SubProduct: Int!, $SubProductItem: Int!, $ErrorMessage: String!) {
    ReturnProductFunction(SubProduct: $SubProduct, SubProductItem: $SubProductItem, ErrorMessage: $ErrorMessage) {
        status
    }
}
`

const ReturnOrderDialog = (props: {Open: boolean, setOpen: Function, OrderDetail: Order_SubList|null, Refresh: Function}) => {
    const [SelectProduct, setSelectProduct] = useState<number>(-1)
    const [SelectSubProduct, setSelectSubProduct] = useState<number>(-1)
    const [SelectReturnReason, setSelectReturnReason] = useState<number>(0)
    const [OtherReason, setOtherReason] = useState<string>("")
    const [Success, setSuccess] = useState<boolean>(false)
    const [ReturnFunction] = useMutation(ReturnProductFunction, {onCompleted: (data)=> {props.setOpen(null); setSuccess(true)}})
    const {t} = useTranslation()
    const ReturnReasons: string[] = ReturnReason()



    function Return_Product_Function(SubProduct: number|undefined, SubProductItem: number|undefined, ErrorMessage: string){
        if (SubProduct !== undefined && SubProductItem !== undefined && SelectSubProduct > -1 && SelectProduct> -1){
            ReturnFunction({variables: {SubProduct: SubProduct, SubProductItem: SubProductItem, ErrorMessage: ErrorMessage}}).then((data) =>{
                if (data.data.ReturnProductFunction.status){
                    props.Refresh()
                }
            })
        }
    }

    return (
        <Dialog fullWidth maxWidth='sm' open={props.Open} onClose={() => props.setOpen(null)}>
            <DialogTitle>{t("Order.ReturnOrder")}</DialogTitle>
            {!Success ?
            <DialogContent >
                <TextField label={t("Order.SellerName")} value={props.OrderDetail?.SellerName} sx={{mt: '10px'}} focused fullWidth InputProps={{readOnly: true}}/>
                <TextField label={t("Order.ReturnProduct")} sx={{mt: '10px'}} select fullWidth focused color='secondary' value={SelectProduct} onChange={(e) => {setSelectProduct(parseInt(e.target.value)); setSelectSubProduct(-1)}}>
                    <MenuItem value={-1}>{t("Order.PleaseSelectItem")}</MenuItem>
                    {props.OrderDetail?.OrderList.map((item, index) => {
                        return(<MenuItem key={item.ProductTitle} value={index}>{item.ProductTitle}</MenuItem>)
                    })}
                </TextField>
                {SelectProduct> -1 ? 

                <TextField label={t("Order.SubItem")} sx={{mt: '10px'}} select fullWidth focused value={SelectSubProduct} color='warning' onChange={(e) => {setSelectSubProduct(parseInt(e.target.value))}}>
                    <MenuItem value={-1}>{t("Order.PleaseSelectItem")}</MenuItem>
                    {props.OrderDetail?.OrderList[SelectProduct].SubItem.map((item, index) => {
                       if (item.Status !== 'return' || 'cancel'){return(<MenuItem key={item.Name} value={index}>{item.Name}</MenuItem>) }else{return(null)}
                    })}
                </TextField>:
                
                <TextField label={t("Order.SubItem")} value={t("Order.NoProductCanReturn")} color='warning' sx={{mt: '10px'}} focused fullWidth InputProps={{readOnly: true}}/>
                
                }

                <TextField label={t("Order.Reason")} sx={{mt: '10px'}} select fullWidth focused value={SelectReturnReason} onChange={(e) => setSelectReturnReason(parseInt(e.target.value))}>
                    {ReturnReasons.map((item, index) => {
                        return(<MenuItem key={item} value={index}>{item}</MenuItem>)
                    })}
                </TextField>
                {SelectReturnReason === 0 ? 
                <TextField label={t("Order.OtherReason")} sx={{mt: '10px'}} fullWidth multiline rows={4} value={OtherReason} onChange={(e) => setOtherReason(e.target.value)}/>
                : null}              
            </DialogContent>
            : null}
            {Success ? 
            <DialogContent>
                <Typography variant='h6'>{t("Order.Success")}</Typography>
            </DialogContent>
            :null}

            <DialogActions>
                {SelectProduct > -1 && SelectSubProduct > -1?
                    <Button variant='contained' onClick={() => {Return_Product_Function(props.OrderDetail?.OrderList[SelectProduct].id, 
                                                                props.OrderDetail?.OrderList[SelectProduct].SubItem[SelectSubProduct].id,
                                                                 SelectReturnReason === 0? OtherReason: ReturnReasons[SelectReturnReason])}}>
                        {t("Order.ApplyReturn")}
                    </Button>
                : null}
            </DialogActions>
        </Dialog>
    )
}

export default ReturnOrderDialog