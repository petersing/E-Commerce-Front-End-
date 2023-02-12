import { TextField, List, Grid, ListItem, ListItemText, Typography, Button, Divider, CircularProgress } from "@mui/material"
import { useState, useEffect } from "react"
import { Cart_Object} from "../../Public_Data/Interfaces"
import NotFound from '../../../assets/NotFound.png'
import { Order_API } from "../../../API/Request"
import { useCookies } from "react-cookie"
import { gql, useLazyQuery, useMutation } from "@apollo/client"
import { useTranslation } from "react-i18next"
import { DeliveryMethodLists, PaymentMethodLists } from "../../Public_Data/PaymentMethodList";

const ModifyCartFunction = gql`
mutation ModifyCartFunction($access: String!, $Clear: Boolean!) {
    ModifyCartFunction(access:$access, Clear: $Clear) {
        ResponseCart
    }
}
`

const CheckPaymentStatus = gql`
query CheckPaymentStatus($access: String!, $StripeID: String!) {
    CheckPaymentStatus(access:$access, StripeID: $StripeID)
}
`

const ConfirmAndPay = (props:{setActiveStep: Function, DeliveryMethod: string, Client_Information: {Name: string, Email: string, Phone: string, Address: string}
                             , PaymentMethod: string, Cart_Items: Cart_Object[], Clear: boolean, setPayment_Response_Data: Function})=>{

    const [cookies] = useCookies()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [StripeKey, setStripeKey] = useState<string>("")
    const [BeginTime] = useState<number>(new Date().valueOf())
    const [ModifyFunction] = useMutation(ModifyCartFunction)
    const [CheckPaymentStatusFucntion] = useLazyQuery<{CheckPaymentStatus: string}>(CheckPaymentStatus, {fetchPolicy: "network-only"})
    const {t} = useTranslation()
    const DeliveryMethodList : { [name: string]: string }  = DeliveryMethodLists()
    const PaymentMethodList : { [name: string]: string } = PaymentMethodLists()

    useEffect(() =>{
      let CheckPaymentFinish: any;
      if (isLoading){
        CheckPaymentFinish = setInterval(()=>{     
          CheckPaymentStatusFucntion({variables: {access: cookies.access, StripeID: StripeKey}}).then(res =>{
            if (res.data?.CheckPaymentStatus === 'paid'){
              props.setActiveStep(4)
              clearInterval(CheckPaymentFinish)
              setIsLoading(false)
            }else if (new Date().valueOf() - BeginTime > 300000){
              props.setActiveStep(4)
              clearInterval(CheckPaymentFinish)
              setIsLoading(false)
            }
          })
        }, 10000)
      }
      return () => {clearInterval(CheckPaymentFinish)}
    }, [isLoading, StripeKey, cookies, props, BeginTime, CheckPaymentStatusFucntion])

    function CreatePayment(){
        setIsLoading(true)
        Order_API.CreateOrder({access: cookies['access'], 
                               OrderDetail: props.Cart_Items, 
                               ClientInformation: {...props.Client_Information, 
                               PaymentMethod: props.PaymentMethod, 
                               DeliveryMethod: props.DeliveryMethod}}).then((res)=>{
          ModifyFunction({variables: {access: cookies['access'], Clear: props.Clear}})
          props.setPayment_Response_Data(res.data)
          if (window.open){
            setStripeKey(res.data['ID'])
            window.open(res.data['URL'], '_blank')
          }        
        })
    }
  
    return(
      <> 
        {isLoading?
          <>
            <div style={{width: '100%', height: '100%', backgroundColor: 'black', position: 'fixed', top: 0, left: 0, zIndex: 40, opacity: 0.2}}/>
            <CircularProgress  sx={{ position: 'fixed', left: '50%', top: '50%', }} color="secondary"/>
          </>
        :null}

        <TextField fullWidth label={t("Purchase.DeliveryMethod")} value={DeliveryMethodList[props.DeliveryMethod]} InputProps={{readOnly: true}} 
                   sx={{mb: '20px', mt: '20px'}} color='info' focused/>
        <TextField fullWidth label={t("Purchase.PaymentMethod")} value={PaymentMethodList[props.PaymentMethod]} InputProps={{readOnly: true}} sx={{mb: '20px'}} color='info' focused/>
        {props.Client_Information ? <>
          <TextField fullWidth label={t("Purchase.DeliveryAddress")} value={props.Client_Information.Address} InputProps={{readOnly: true}} sx={{mb: '20px'}} color='info' focused/>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '20px'}}>
            <TextField fullWidth label={t("Purchase.Name")} value={props.Client_Information.Name} InputProps={{readOnly: true}} sx={{width: '49%'}} color='info' focused/>
            <TextField fullWidth label={t("Purchase.Phone")} value={props.Client_Information.Phone} InputProps={{readOnly: true}} sx={{width: '49%'}} color='info' focused/>
          </div>
          <TextField fullWidth label={t("Purchase.Email")} value={props.Client_Information.Email} InputProps={{readOnly: true}} color='info' focused/>      
        </>: null}
        <TextField label={t("Purchase.TotalPrice")}InputProps={{readOnly: true}} sx={{mt: '20px', mb: '20px'}} fullWidth color="success" focused
                   value={props.Cart_Items ? `HKD$${props.Cart_Items?.reduce((prev, item) => prev + item.SubTotalPrice, 0)}`: `HKD$${123}`}/>
        <List sx={{border: 'solid 1px rgb(200, 200, 200)', borderRadius: '10px'}}>
          <ListItem>
            <Grid container>
              <Grid item xs={6}>
                <Typography display='flex' sx={{flexGrow: 1}}>{t("Purchase.Product")}</Typography>
              </Grid>
              <Grid item xs={6}>
                    <Grid container display="flex" sx={{flexDirection: 'row'}}>
                        <Grid item xs={4}>
                            <Typography>{t("Purchase.Type")}</Typography>         
                        </Grid>
                        <Grid item xs={4}>
                            <Typography>{t("Purchase.Quantity")}</Typography>         
                        </Grid>
                        <Grid item xs={4}>
                            <Typography>{t("Purchase.Price")}</Typography>         
                        </Grid>
                    </Grid>     
              </Grid>
            </Grid>
          </ListItem>
          {props.Cart_Items?.map((item: Cart_Object, key: any)=>(
            <div key={'Checkout' + key}>
              <Divider/>
              <ListItem  sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                <Grid container>
                  <Grid item xs={6} sx={{display: 'flex', flexDirection: 'row'}}>
                    <img src={item.image? item.image: NotFound} alt='item' style={{maxHeight: '80px', width: '80px', objectFit: 'contain'}}/> 
                    <ListItemText sx={{position: 'relative', ml: '20px'}} primary={item.ProductName} secondary="Jan 9, 2014" />         
                  </Grid>
                  <Grid item xs={6}>
                      {Object.keys(item.SubItems).map((key)=>(
                          <Grid container key={key}>
                              <Grid item xs={4}>
                                  <Typography>{item.AllOption[key].Name}</Typography>         
                              </Grid>
                              <Grid item xs={4}>
                                  <Typography>{item.SubItems[key].Count}</Typography>         
                              </Grid>
                              <Grid item xs={4}>
                                  <Typography>HKD${item.AllOption[key].Price}</Typography>         
                              </Grid>
                          </Grid>
                      ))}
                  </Grid>
                </Grid>
                <Typography sx={{display: 'flex', flexDirection: 'row', mt: '15px', color: 'green'}}>{`${t("Purchase.TotalPrice")}: HKD${item.SubTotalPrice}`}</Typography>
              </ListItem>
            </div>
          ))}
        </List>
        <div style={{marginTop: '15px', display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
          <Button onClick={() => {props.setActiveStep(2)}} variant='contained' sx={{width: '10%'}}>{t("Purchase.Previous")}</Button>
          <Button onClick={() => {CreatePayment();}}  variant='contained' sx={{width: '10%'}}>{t("Purchase.Submit")}</Button>
        </div>
        
      </>
    )
  }

export default ConfirmAndPay