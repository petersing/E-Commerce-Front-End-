import { TextField, InputAdornment, Button, Dialog, DialogContent, DialogTitle, Grid, Table, TableHead, TableBody, TableCell, TableContainer, Paper, Typography, TableRow} from "@mui/material"
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ChildrenProduct = (props: {Product: any, setDisplay: Function, Display: boolean, subkey? : number, setsubkey : Function, RemoveList?: string[]}) => {
    const [Price, setPrice] = useState<number>(0)
    const [Name, setName] = useState<string>('')
    const [Quantity, setQuantity] = useState<number>(0)
    const [ItemName, setItemName] = useState<string>('')
    const [ItemProperties, setItemProperties] = useState<string>('')
    const [ItemList, setItemList] = useState<{[keys: string]: string}>({})
    const {t} = useTranslation()

    useEffect(() => {
        setPrice(props.subkey !== undefined ? props.Product[props.subkey].Price: 0)
        setName(props.subkey !== undefined ? props.Product[props.subkey].Name: '')
        setItemList(props.subkey !== undefined ? props.Product[props.subkey].Properties: {})
        setQuantity(props.subkey !== undefined? props.Product[props.subkey].Quantity: 0)
    }, [props.subkey, props.Product])

    function Add(price: number|undefined, name: string|undefined, properties: {[keys: string]: string}|undefined){
        if (price && name && properties && props.subkey !== undefined){
            props.Product[props.subkey] = {"Name": name, "Price": price, 'Properties': properties, "Quantity": Quantity, 'id': props.Product[props.subkey].id}
        }else if(price && name && properties){
            props.Product.push({"Name": name, "Price": price, 'Properties': properties, "Quantity": Quantity})
        }
        setPrice(0); setName('');  props.setsubkey(undefined); setItemName(''); setItemProperties(''); setItemList({}); setQuantity(0)
        props.setDisplay(false)
    }

    function remove(key: number|undefined){
        if (key){
            if (props.RemoveList){
                props.RemoveList.push(props.Product[key].id)
            }
            props.Product.splice(key, 1)
        }
        props.setDisplay(false)
    }

    return (
        <Dialog open={props.Display} onClose={() => {props.setDisplay(false)}} maxWidth='sm' fullWidth>
            <DialogTitle>{props.subkey ? t("SellProduct.ModifySubItem"): t("SellProduct.AddSubItem")}</DialogTitle>
            <DialogContent sx={{display: 'flex', flexDirection: 'column'}}>
                <TextField label={t("SellProduct.Price")}  sx={{mt: '20px'}} value={Price} onChange={(e) => setPrice(e.target.value ? parseInt(e.target.value): 0)} 
                                                                        InputProps={{startAdornment: (
                                                                        <InputAdornment position='start'>
                                                                        <AttachMoneyIcon />
                                                                        </InputAdornment>)}}/>
                <TextField label={t("SellProduct.ChildProductName")} sx={{mt: '15px', mb: '15px'}} value={Name} onChange={(e) => setName(e.target.value)}/>
                <TextField label={t("SellProduct.Quantity")} sx={{mb: '15px'}} value={Quantity} onChange={(e) => setQuantity(parseInt(e.target.value))}/>
                <Grid container sx={{mt: '15px'}} spacing={2}>
                    <Grid item xs={8}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{t("SellProduct.ItemName")}</TableCell>
                                        <TableCell>{t("SellProduct.ItemProperties")}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.keys(ItemList).map((key: string) => (
                                        <TableRow key={key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                            <TableCell>{key}</TableCell>
                                            <TableCell>{ItemList[key]}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant='h6'>{t("SellProduct.AddItem")}</Typography>
                        <TextField label={t("SellProduct.ItemName")} fullWidth  sx={{mb: '10px'}} value={ItemName} onChange={(e) => setItemName(e.target.value)}/>
                        <TextField label={t("SellProduct.ItemProperties")} fullWidth sx={{mb: '10px'}} value={ItemProperties} onChange={(e) => setItemProperties(e.target.value)}/>
                        <Button sx={{ml: 'auto', display: 'flex'}} variant='contained' onClick={() => {
                            if (ItemName && ItemProperties){
                                ItemList[ItemName] = ItemProperties
                                setItemName('')
                                setItemProperties('')
                            }
                        }}>{t("SellProduct.Add")}</Button>
                    </Grid>
                </Grid>
                <Button sx={{ml: 'auto', mt: '15px'}} fullWidth variant='contained' onClick={() => Add(Price, Name, ItemList)}>{props.subkey !== undefined? t("SellProduct.Modify"): t("SellProduct.AddSubProduct")}</Button>
                {props.subkey !== undefined? <Button sx={{ml: 'auto', mt: '15px'}} fullWidth variant='contained' color='error' onClick={() => remove(props.subkey)}>{t("SellProduct.Delete")}</Button>: null}
            </DialogContent>
        </Dialog>
  )
}

export default ChildrenProduct