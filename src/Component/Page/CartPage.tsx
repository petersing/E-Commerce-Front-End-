import { Typography, Box, Grid, List , ListItem, TextField, Button, Divider} from "@mui/material"
import CartProductItem from "../Product/Cart_Product_Item"
import { useEffect, useState } from "react"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckIcon from '@mui/icons-material/Check';
import PurchaseDialog from "../Dialog/Payment/PurchaseDialog";
import { Cart_Object } from "../Public_Data/Interfaces";
import { gql, useLazyQuery, useMutation} from "@apollo/client";
import { useCookies } from "react-cookie";
import { ParseGraphQLData } from "../Public_Data/Public_Application";
import NotfoundCart from '../../assets/NoCartFound.png'
import { useTranslation } from "react-i18next";

const GetCartDetial = gql`
query CartDetail {
    CartDetail
}
`
const CartPage = () => {
    const [CartDataFunction, {data}] = useLazyQuery(GetCartDetial);
    const [CartDataList, setCartDataList] = useState<Cart_Object[]>([]);
    const [Discount, setDiscount] = useState(0)
    const [TotalPrice, setTotalPrice] = useState<number>(0)
    const [SetPuchaseDialogOpen, setPuchaseDialogOpen] = useState(false)
    const {t} = useTranslation()

    useEffect(() =>{
        CartDataFunction().then(()=>{     
            if (data?.CartDetail && data?.CartDetail !== "[]"){
                const ParseData: Cart_Object[] = ParseGraphQLData(data)["CartDetail"]
                setCartDataList(ParseData)
                setTotalPrice(ParseData.length > 1 ? ParseData.reduce((prev, item)=> prev + item.SubTotalPrice, 0): ParseData[0].SubTotalPrice)
            }
        })
    },[ CartDataFunction, data])

    function UpdateCart(Data: Cart_Object[]){
        setCartDataList(Data)
        setTotalPrice(Data.length > 1 ? Data.reduce((prev, item)=> prev + item.SubTotalPrice, 0): Data[0].SubTotalPrice)
    }

    
    return (
        <>
            <Box height='130px' sx={{backgroundColor: 'rgb(237, 247, 250)', width: '100%', mt: '100px', left: 0, top: 0, display: 'flex', alignItems: 'center', minWidth: '1200px'}} position= 'absolute'>
                <Typography variant="h4" sx={{width: '80%', textAlign: 'left', ml: 'auto', mr: 'auto'}}>{t("Cart.Title")}</Typography>
            </Box>
            <Grid container spacing={3} sx={{mt: '235px', width: '80%', ml: 'auto', mr: 'auto', minWidth: '1200px'}}>
                <Grid item sm={9}>
                    <List sx={{border: 'solid 1px rgb(200, 200, 200)', borderRadius: '10px'}}>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={5}>
                                        <Typography display='flex' sx={{flexGrow: 1}}>{t("Cart.Product")}</Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography display='flex'>{t("Cart.Type")}</Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography display='flex'>{t("Cart.Quantity")}</Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <Typography display='flex'>{t("Cart.Price")}</Typography>
                                    </Grid>
                                    <Grid item xs={2}/>
                                </Grid>              
                            </ListItem>
                            {CartDataList.length > 0?
                            CartDataList.map((item, key)=>(
                                <CartProductItem key={key} Item={item} RefreshCart={UpdateCart}/>
                            )): 
                            <ListItem sx={{display: 'flex', justifyContent: 'center'}}>
                                <img src={NotfoundCart} alt='No Cart Found'/>
                            </ListItem>}
                    </List>    
                </Grid>
                <Grid item sm={3}>
                    <Box sx={{border: 'solid 1px rgb(220,220,220)', display: 'flex',flexDirection: 'column', borderRadius: '10px'}}>
                        <Typography sx={{width: '80%', ml: 'auto', mr: 'auto', mt: '25px'}}>{t("Cart.AddCoupon")}</Typography>
                        <TextField label={t("Cart.Coupon")} sx={{width: '80%', ml: 'auto', mr: 'auto', mt: '15px', mb: '15px'}} size='small'/>
                        <Button variant='contained' sx={{minWidth: '20%', ml: 'auto', mr: '15px', mb:'15px'}}><AddCircleIcon sx={{mr: '10px'}}/>{t("Cart.Apply")}</Button>
                    </Box>
                    <Box sx={{border: 'solid 1px rgb(200, 200, 200)', borderRadius: '10px', mt: '30px', display: 'flex', flexDirection: 'column'}}>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', width: '80%', marginTop: '30px'}}>
                            <Typography >{t("Cart.TotalPrice")}</Typography>
                            <Typography >${TotalPrice}</Typography>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', width: '80%', marginTop: '15px'}}>
                            <Typography >{t("Cart.Discount")}</Typography>
                            <Typography >${Discount}</Typography>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', width: '80%', marginTop: '15px', marginBottom: '15px'}}>
                            <Typography >{t("Cart.Total")}</Typography>
                            <Typography fontWeight='bold' >${TotalPrice - Discount}</Typography>
                        </div> 
                        <Divider/>
                        <Button sx={{minWidth: '20%' ,backgroundColor: 'green'}} variant="contained" onClick={() => setPuchaseDialogOpen(true)}>{t("Cart.MakePurchaseButton")}<CheckIcon sx={{ml: '10px'}}/></Button>    
                    </Box>
                </Grid>
            </Grid>
            {SetPuchaseDialogOpen && <PurchaseDialog Open={SetPuchaseDialogOpen} setOpen={setPuchaseDialogOpen} CartData={CartDataList} Clear={true}/>}
        </>
  )
}

export default CartPage