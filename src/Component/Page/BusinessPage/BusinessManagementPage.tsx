import { gql, useLazyQuery } from '@apollo/client'
import { Box, Typography, Button, List, ListItem, Grid , Divider, ListItemText, LinearProgress, Pagination, Tabs, Tab} from '@mui/material'
import React, { useEffect, useState } from 'react'
import NotFound from '../../../assets/NotFound.png'
import ModifyProductDialog from '../../Dialog/Business/ModifyProductDialog'
import ModifyStockDialog from '../../Dialog/Business/ModifyStockDialog'
import { User_Object, Management_Product_Object } from '../../Public_Data/Interfaces'
import { ParseGraphQLData } from '../../Public_Data/Public_Application'
import { useTranslation } from 'react-i18next'

const GetUserProduct = gql`
query UserProduct($start: Int!, $end: Int!, $username: String!, $Type: String) {
    PersonalProduct(Start: $start, End: $end, User: $username, StockType: $Type) {,
        Product{
          Description,
          id,
          Author,
          ProductName,
          ShippingLocation,
          Images,
          DescriptionImages,
          Category,
          SubItem
        }
        Count
    },
}
`

const ProductItem = (props: {item: Management_Product_Object, ProductIndex: number, setProductLocation: Function, setOpenStock: Function, setOpenProduct: Function}) =>{
  const {t} = useTranslation()
  return(
    <ListItem>
      <Grid container>
        <Grid item xs={2}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <img src={props.item.Images[0] ? props.item.Images[0] : NotFound} alt="order" style={{maxHeight: '80px', width: '80px', objectFit: 'contain'}}/>
            <ListItemText sx={{ml: '10px'}} primary={props.item.ProductName} primaryTypographyProps={{noWrap: true}}/> 
          </Box>
        </Grid>
        <Grid item xs={8} sx={{display: 'flex', flexDirection: 'column'}}>
          {props.item.SubItem.map((item) => {
            return (
                <Grid container sx={{mb: '10px'}} key={Math.random()}>
                  <Grid item xs={4} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Typography variant='body1' noWrap>{item.Name}</Typography>
                  </Grid>
                  <Grid item xs={2} sx={{display: 'flex', alignItems: 'center'}}>
                    <Typography variant='body1' noWrap>HKD${item.Price}{t("Business.ItemUnit")}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Box sx={{width: '80%'}}>
                      <LinearProgress variant="determinate" value={item.Quantity*100/(item.Quantity+item.Sell)} sx={{height: '15px', mt: '15px'}}/>
                      <Typography variant='body1' sx={{fontWeight: 'bold'}}>{item.Quantity}/{item.Quantity+item.Sell}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={3}>
                    <Box sx={{width: '80%'}}>
                      <LinearProgress variant="determinate" value={item.Sell*100/(item.Quantity+item.Sell)} sx={{height: '15px', mt: '15px'}}/>
                      <Typography variant='body1' sx={{fontWeight: 'bold'}}>{item.Sell}/{item.Quantity+item.Sell}</Typography>
                    </Box>
                  </Grid>
                </Grid>
            )
          })}
        </Grid>
        <Grid item xs={2} sx={{display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
          <Button variant='contained' sx={{mb: '15px'}} onClick={() => {props.setProductLocation(props.ProductIndex); props.setOpenProduct(true)}}>{t("Business.ModifyProduct")}</Button>
          <Button variant='contained' color='success' onClick={() => {props.setProductLocation(props.ProductIndex); props.setOpenStock(true)}}>{t("Business.ModifyStock")}</Button>
        </Grid>
      </Grid>
    </ListItem>
  )
}

const BusinessManagementPage = (props: {User: User_Object|undefined}) => {
  const [ProductDataFunction] = useLazyQuery<{PersonalProduct: {Product: any, Count: number}}>(GetUserProduct)
  const [ProductData , setProductData] = useState<Management_Product_Object[]>([])
  const [ProductCount, setProductCount] = useState<number>(0)
  const [Page, setPage] = useState<number>(1)
  const [OpenModifyStockDialog, setOpenModifyStockDialog] = useState<boolean>(false)
  const [OpenModifyProductDialog, setOpenModifyProductDialog] = useState<boolean>(false)
  const [IndicateProduct, setIndicateProduct] = useState<number>(0)
  const [Type, setType] = useState<string>('All')
  const {t} = useTranslation()

  function Refresh(){
    ProductDataFunction({variables: {start: (Page-1)*5, end: 5*(Page), username: props.User?.username, Type: Type}}).then((res) =>{
      if (res.data){
        const DataList = res.data.PersonalProduct.Product.map((item:any) => {
          return(
            ParseGraphQLData(item)
          )     
        })
        setProductData(DataList)
        setProductCount(res.data.PersonalProduct.Count)
      }  
    })
  }

  useEffect(() =>{
    ProductDataFunction({variables: {start: (Page-1)*5, end: 5*(Page), username: props.User?.username, Type: Type}}).then((res) =>{
      if (res.data){
        const DataList = res.data.PersonalProduct.Product.map((item:any) => {
          return(
            ParseGraphQLData(item)
          )     
        })
        setProductData(DataList)
        setProductCount(res.data.PersonalProduct.Count)
      }  
    })
  },[ProductDataFunction, props.User, Page, Type])

  return (
    <>
      <Box sx={{border: 'solid 1px rgb(220,220,220)', width: '80%', ml: 'auto', mr: 'auto', borderRadius: '10px', 
                backgroundColor: 'rgb(250,250,250)', marginTop: '150px' ,minWidth: '1200px', display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', marginLeft: '2%', marginTop: '50px', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'end'}}>
            <Typography variant="h4" fontWeight='bold' sx={{mr: '10px'}}>{t("Business.ProductStock")}</Typography>
          </div>  
        </div>
        <Box sx={{marginLeft: '2%' }}>
          <Tabs value={Type} onChange={(e, value)=> {setType(value)}}>
            <Tab label={t("Business.AllProduct")} value={'All'} />
            <Tab label={t("Business.EnoughStock")} value={'Enough'}/>
            <Tab label={t("Business.SmallStock")} value={'Small'}/>
            <Tab label={t("Business.SellOut")} value={'SellOut'}/>
          </Tabs>
        </Box>
        <Grid container>
          <Grid item xs={12}>
            <List sx={{ml: '1%', mr: '1%'}}>
              <ListItem>
                <Grid container>
                  <Grid item xs={2} sx={{display: 'flex', justifyContent: 'flex-start'}}>
                    <Typography variant='body1' sx={{fontWeight: 'bold'}}>{t("Business.ProductDetails")}</Typography>
                  </Grid>
                  <Grid item xs={8} sx={{display: 'flex', justifyContent: 'flex-start'}}>
                    <Grid container>
                      <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center'}}>
                        <Typography variant='body1' sx={{fontWeight: 'bold'}}>{t("Business.Type")}</Typography>
                      </Grid>
                      <Grid item xs={2} sx={{display: 'flex', justifyContent: 'flex-start'}}>
                        <Typography variant='body1' sx={{fontWeight: 'bold'}}>{t("Business.Price")}</Typography>
                      </Grid>
                      <Grid item xs={3} sx={{display: 'flex', justifyContent: 'flex-start'}}>
                        <Typography variant='body1' sx={{fontWeight: 'bold'}}>{t("Business.Stock")}</Typography>
                      </Grid>
                      <Grid item xs={3} sx={{display: 'flex', justifyContent: 'flex-start'}}>
                        <Typography variant='body1' sx={{fontWeight: 'bold'}}>{t("Business.Sell")}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>       
              </ListItem>
              <Divider sx={{mb: '5px'}}/>
              {ProductData.map((item, index) => {
                return(
                  <React.Fragment key={Math.random()}>
                    <ProductItem item={item} ProductIndex={index} setProductLocation={setIndicateProduct} setOpenStock={setOpenModifyStockDialog} setOpenProduct={setOpenModifyProductDialog}/>
                    <Divider sx={{mb: '5px'}}/>
                  </React.Fragment>       
                )
              })}     
            </List> 
          </Grid>
          <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
            <Pagination count={Math.ceil(ProductCount/5)} sx={{transform: 'scale(1.2)', mb: '15px'}} onChange={(e, value) => {setPage(value); window.scrollTo(0, 0)}} page={Page} size='large'/>
          </Grid>
        </Grid>
      </Box>
      {OpenModifyStockDialog && <ModifyStockDialog Open={OpenModifyStockDialog} setOpen={setOpenModifyStockDialog} ProductData={ProductData[IndicateProduct]} RefreshFunction ={Refresh}/>}
      {OpenModifyProductDialog && <ModifyProductDialog Open={OpenModifyProductDialog} setOpen={setOpenModifyProductDialog} ProductData={ProductData[IndicateProduct]}/>}
    </>
  )
}

export default BusinessManagementPage