import { Dialog, DialogTitle, DialogContent, TextField, MenuItem, Button } from "@mui/material"
import { useState } from "react";
import { useCookies } from "react-cookie";
import { Product_API} from "../../../API/Request";
import { Management_Product_Object } from "../../Public_Data/Interfaces"
import { useTranslation } from "react-i18next";

const ModifyStockDialog = (props: {Open: boolean, setOpen: Function, ProductData: Management_Product_Object, RefreshFunction: Function}) => {
    const [ProductKey, setProductKey] = useState<number>(0);
    const [AddStock, setAddStock] = useState<string>('0')
    const [Cookies] = useCookies()
    const {t} = useTranslation()

    function AddStockFunction(SubKey: number, modify: number){
        props.ProductData.SubItem[SubKey].Quantity += modify;
        const {Author, Description, Images, DescriptionImages, ...other} = props.ProductData;
        Product_API.ModifyProduct({Access_Token: Cookies['access'], Description: Description.join('\r\n') ,...other}).then((res) =>{
            if(res.status === 200){
                props.setOpen(false)
                props.RefreshFunction()
            }
        })
    }
    return (
        <Dialog open={props.Open} onClose={() => props.setOpen(false)} maxWidth='md' fullWidth >
            <DialogTitle>{t("SellProduct.ModifyStock")}</DialogTitle>
            <DialogContent>
                <TextField select onChange={(e) => setProductKey(parseInt(e.target.value))} value={ProductKey} label={t("SellProduct.SelectSubProduct")} fullWidth sx={{mt: '15px'}}>
                    {props.ProductData.SubItem.map((item, index) => (
                        <MenuItem key={item.id} value={index} >{item.Name}</MenuItem>
                    ))}
                </TextField>
                <TextField label={t("SellProduct.Stock")} fullWidth sx={{mt: '15px'}} value={props.ProductData.SubItem[ProductKey].Quantity} color='secondary' focused InputProps={{ readOnly: true,}}/>
                <TextField label={t("SellProduct.AddStock")} fullWidth sx={{mt: '15px'}} helperText={t("SellProduct.AddStockHelpMessage")}
                           value={AddStock} onChange={(e) => {setAddStock(e.target.value)}} color='success' focused/>
                <Button variant='contained' fullWidth sx={{mt: '10px'}} onClick={() => AddStockFunction(ProductKey, parseInt(AddStock))}>{t("SellProduct.AddStock")}</Button>
            </DialogContent>
        </Dialog>
    )
}

export default ModifyStockDialog