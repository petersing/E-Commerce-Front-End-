import { Grid, Typography, Box, Button, ListItem, ListItemText, Divider, TextField, MenuItem, Alert } from "@mui/material"
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import NotFound from '../../assets/NotFound.png'
import { gql, useMutation } from "@apollo/client";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { ParseGraphQLData } from "../Public_Data/Public_Application";
import { Cart_Object } from "../Public_Data/Interfaces";
import { useTranslation } from "react-i18next";


const ModifyCartFunction = gql`
mutation ModifyCartFunction($ProductID: Int!, $SubItemKey: Int!, $Change: Int, $Clear: Boolean, $Response: Boolean, $ToOther: Int) {
    ModifyCartFunction(ProductID: $ProductID, SubItemKey: $SubItemKey, Change: $Change, Clear: $Clear, Response: $Response, ToOther: $ToOther){
        ResponseCart
    }
}
`

function OnCompletedFunction(data: any, RefreshFunction: Function){
    if (data.ModifyCartFunction ){
        RefreshFunction(ParseGraphQLData(data.ModifyCartFunction).ResponseCart)
    }

}

const SubItem = (props: {SubItemKey: string, Item_ID: number|string,  Location: number, ExistOption:{[key: string] : { Count: number}},
                         AllOption: {[key: string] :{Name: string, Price: number, Quantity: number}}, RefreshCart: Function}) =>{
    const [ModifyFunction] = useMutation(ModifyCartFunction, {onCompleted: (data)=> OnCompletedFunction(data, props.RefreshCart)})
    const {t} = useTranslation()

    function Modify(data: {Change?: number, ProductID: number|string, Response: boolean, SubItemKey: string, ToOther?: string}){
        ModifyFunction({variables: {Response: data.Response, 
                                    ProductID: typeof(data.ProductID) === 'string'? parseInt(data.ProductID) : data.ProductID,
                                    Change: data.Change, 
                                    SubItemKey: typeof(data.SubItemKey) === 'string'? parseInt(data.SubItemKey): data.SubItemKey, 
                                    ToOther: typeof(data.ToOther) === 'string'? parseInt(data.ToOther): data.ToOther}})
    }

    return(
        <>
            {Boolean(props.Location) ? <Grid item xs={5}/>: null}
            <Grid item xs={2} sx={{mb: '15px'}}>
                <TextField select sx={{width: '80%'}} size='small' label={t("Cart.Type")} value={props.SubItemKey} >
                    {Object.keys(props.AllOption).map((key) => {
                        if (key in props.ExistOption){
                            return(<MenuItem key={key} value={key} disabled>{props.AllOption[key].Name}</MenuItem>)
                        }else{
                            return(<MenuItem key={key} value={key} onClick={()=> {Modify({ProductID: props.Item_ID, SubItemKey: props.SubItemKey, ToOther: key, Response: true })}}>{props.AllOption[key].Name}</MenuItem>)}
                    })}
                </TextField>
            </Grid>
            <Grid item xs={2} sx={{mb: '15px'}}>
                <Box display='flex' sx={{flexDirection: 'row', ml: '-30px', alignItems: 'center'}}>
                    <Button onClick={() => Modify({Change: -1, ProductID: props.Item_ID, Response: true, SubItemKey: props.SubItemKey})}>-</Button>
                    <Typography>{props.ExistOption[props.SubItemKey].Count}</Typography>
                    <Button onClick={() => Modify({Change: 1, ProductID: props.Item_ID, Response: true, SubItemKey: props.SubItemKey})}>+</Button>
                </Box>
            </Grid>
            <Grid item xs={1} sx={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', mb: '15px'}}>
                <Typography fontWeight='bold'>${props.AllOption[props.SubItemKey].Price * props.ExistOption[props.SubItemKey].Count}</Typography>
                <Typography color='rgb(150, 150, 150)'>{`${props.AllOption[props.SubItemKey].Price}${t("Cart.CartItemUnit")}`}</Typography>
            </Grid>
            <Grid item xs={2} sx={{display: 'flex', justifyContent: 'flex-end', mb: '15px'}}>
                <Button sx={{border: 'solid 1px rgb(200,200,200)'}} onClick={() => Modify({Change: -props.ExistOption[props.SubItemKey].Count, ProductID: props.Item_ID, Response: true, SubItemKey: props.SubItemKey})}><DeleteOutlineOutlinedIcon/>{t("Cart.Remove")}</Button>
            </Grid>
        </>
    )
}

const CartProductItem = (props: {RefreshCart: Function, Item: Cart_Object}) => {
    const [hover, sethover] = useState<boolean>(false)
    const {t} = useTranslation()
    return (
        <>
            <Divider/>
            <ListItem sx={{backgroundColor: (hover? 'rgb(220,220,220)': '')}}>
                    <Grid container sx={{display: 'flex', alignItems: 'center'}}>
                        <Grid item xs={5}>
                            <Box sx={{display: 'flex', flexDirection: 'row', ':hover': {cursor: 'pointer'}, width: '80%'}} onMouseEnter={() => sethover(true)} onMouseLeave={() => sethover(false)} onClick={() => window.location.assign(`/Product/${props.Item.id}`)}>
                                <img src={props.Item.image? props.Item.image + '?Width=80': NotFound} alt='item' style={{maxHeight: '80px', width: '80px', objectFit: 'contain'}}/> 
                                <ListItemText sx={{position: 'relative', ml: '20px'}} primary={props.Item.ProductName} secondary={props.Item.Author} /> 
                            </Box>                   
                        </Grid>
                        {Object.keys(props.Item.SubItems).map((item, key)=>(
                            <SubItem key={key} Location={key} Item_ID={props.Item.id} SubItemKey={item}
                                    AllOption={props.Item.AllOption} ExistOption={props.Item.SubItems}
                                    RefreshCart={props.RefreshCart}/>
                        ))} 
                    </Grid>
            </ListItem>
            {Object.keys(props.Item.SubItems).map((item, key)=>{
                if (props.Item.SubItems[item].Count > props.Item.AllOption[item].Quantity){
                    return(
                        <Alert key={key} severity="error" sx={{border: 'solid 1px rgb(220,220,220)', borderRadius: '10px', mb: '15px'}}>
                            {`Insufficient stock to provide ${props.Item.SubItems[item].Count} products ${props.Item.AllOption[item].Name}`}
                        </Alert>
                    )
                }else{return(null)}
            })}
                     
        </>
  )
}

export default CartProductItem