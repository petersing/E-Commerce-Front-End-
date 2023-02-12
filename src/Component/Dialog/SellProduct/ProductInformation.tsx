import {FormControl, Menu, InputAdornment} from '@mui/material'
import {useReducer, useState } from 'react';
import {TextField,Button, Typography, Grid, Box} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useCookies } from 'react-cookie';
import NestedMenu from './NestedMenu';
import ChildrenProduct from './ChildrenProduct';
import { Categories_Data } from '../../Public_Data/Categories_List';
import {Product_API} from '../../../API/Request'
import DescriptionImageDialog from './DescriptionImageDialog';
import { useTranslation } from 'react-i18next';
import DescriptionVideoDialog from './DescriptionVideoDialog';

//// Clear Buffer Function
function ClearAllImageBuffer(ItemRender: string[]){
    for (let i = 0; i < ItemRender.length; i++){
      console.log(ItemRender[i])
      URL.revokeObjectURL(ItemRender[i])
    }
}

const ProductInformation = (props: {setSuccessResponse: Function, ImageList: File[], ItemRender: Array<string>, SuccessResponse?: {FirstImage: string, Product_Name: string}}) => {
    const [cookie] = useCookies()
    const [AnchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
    const [Open, setOpen] = useState<boolean>(false);

    const [DisplayAdd, setDisplayAdd] = useState<boolean>(false)
    const [EditKey, setEditKey] = useState<number>()

    ///OtherContent
    const [MainName, setMainName] = useState<string>('')
    const [AboutProduct, setAboutProduct] = useState<string>('')
    const [Shipping, setShipping] = useState<string>('')
    const [Children_Product] = useState<{Name: string, Price: number, Quantity: number, Sell: number, Properties: {[keys: string]: string}|undefined}[]>([])

    //Description Images
    const [OpenDescriptionImages, setOpenDescriptionImages] = useState<boolean>(false);
    const [DescriptionImageList] = useState<File[]>([])
    const [DescriptionItemRender] = useState<Array<string>>([])

    ///Description Video
    const [OpenDescriptionVideo, setOpenDescriptionVideo] = useState<boolean>(false);
    const [DescriptionVideoList] = useState<string[]>([])
    
    

    ///Categories
    const [Categories, setCategories] = useState<Array<string>>([])
    const [ProductType, setProductType] = useState<string>('')

    ///Force Update
    const [, forceUpdate] = useReducer(x => x + 1, 0)

    const {t} = useTranslation()

    function Publish_Product(){
      Product_API.CreateProduct({Description: AboutProduct, ProductName: MainName, ShippingLocation: Shipping, 
                     SubItem: Children_Product, Category: Categories.join('/') + '/'+ ProductType, Access_Token: cookie['access'],
                     Images: props.ImageList, DescriptionImages: DescriptionImageList}).then(res => {
       props.setSuccessResponse({...res.data})
       ClearAllImageBuffer(props.ItemRender)
       ClearAllImageBuffer(DescriptionItemRender)
     })}

    return (
      <>
        <Grid item sm={6} display={(props.ImageList.length > 0 && !props.SuccessResponse) ? '' : 'none'}>
          <FormControl fullWidth sx={{mt: '20px'}}>
            <TextField size='small' value={Categories.map((i) => t(`SellProduct.CategoriesType.${i}`)).join(' > ')} sx={{mb: '10px'}} label={t("SellProduct.Categories")} color="success"  InputProps={{readOnly: true}} focused />


            <TextField size='small' value={t(`SellProduct.CategoriesType.${ProductType}`)} sx={{mb: '10px'}} inputProps={{ style: {cursor: 'pointer'}}} autoFocus label={t("SellProduct.ProductType")} focused 
                        onClick={(event) => {setAnchorElement(event.currentTarget); setOpen(true)}} 
                        InputProps={{endAdornment: (
                        <InputAdornment position='start'>
                          <ArrowDropDownIcon />
                        </InputAdornment>), readOnly: true}}/>
            

            <Menu anchorEl={AnchorElement} open={Open} onClose={() => setOpen(false)} MenuListProps={{sx: { width: AnchorElement && AnchorElement.offsetWidth } }} >
              {Object.keys(Categories_Data).map((key: string) => (
                  <NestedMenu key={key} Nested_Data={Categories_Data[key]} Item_Key={key} ml={0} setCategories={setCategories} setProductType={setProductType} setClose={setOpen}/>
              ))}
            </Menu>

            <TextField size="small" error={MainName.length > 30 || MainName.length === 0? true: false} 
                      label={t("SellProduct.ProductName")} sx={{mt: '20px'}} value={MainName} 
                      onChange={(e) => {setMainName(e.target.value)}}/>

            <TextField size="small" error={Shipping.length > 50 || Shipping.length === 0? true: false} 
                       label={t("SellProduct.ShippingLocation")} sx={{mt: '20px'}} value={Shipping} onChange={(e) => {setShipping(e.target.value)}}/>

            
            <Typography variant='h6' sx={{mt: '20px'}}>{t("SellProduct.AboutThisProduct")}</Typography>

            <Grid container sx={{display: 'flex', justifyContent: 'flex-start', flexDirection: 'row'}} spacing={2}>
              {Children_Product.map((item, index) =>(
                <Grid item key={index}  lg={4} onClick={() => {setDisplayAdd(true); setEditKey(index)}}>
                  <Box sx={{display: 'flex', alignItems: 'center', flexDirection: 'column', padding: '10px', border: 'solid 1px rgb(220,220,220)', borderRadius: '10px'}}>
                    <Typography variant='h6' sx={{overflow: 'clip', width: '100%',  textAlign: 'center'}}>{item.Name}</Typography>
                    <Typography variant='body1' sx={{overflow: 'clip', width: '100%',textAlign: 'center'}}>$HKD {item.Price}</Typography>
                  </Box>     
                </Grid>
              ))}
            </Grid>
            <Typography variant='body2' sx={{color: 'rgb(180,180,180)', mt: '15px'}}>{t("SellProduct.SplitStatement")}</Typography>

            <ChildrenProduct Product={Children_Product} setDisplay={setDisplayAdd} Display={DisplayAdd} subkey={EditKey} setsubkey={setEditKey}/>
          
            <Button sx={{mt: '15px'}} variant='contained' onClick={() => {setDisplayAdd(true); setEditKey(undefined)}}>{t("SellProduct.AddChildrenButton")}</Button>

            <TextField label={t("SellProduct.AboutProduct")} sx={{mt: '20px'}} value={AboutProduct} multiline={true} rows={4} onChange={(e) => {setAboutProduct(e.target.value)}}/>

            <Typography variant='body2' sx={{color: 'rgb(180,180,180)', mt: '15px'}}>{t("SellProduct.AddVideoStatement2")}</Typography>
            <Button color="success" variant='contained' sx={{mt:'10px'}} onClick={() => setOpenDescriptionVideo(true)}>{t("SellProduct.DescriptionVideo")}</Button>
            <Button color="secondary" variant='contained' sx={{mt:'10px'}} onClick={() => setOpenDescriptionImages(true)}>{t("SellProduct.DescriptionImages")}</Button>
            <Button color="primary" variant='contained' sx={{mt:'10px'}} onClick={() => Publish_Product()}>{t("SellProduct.Publish")}</Button>
          </FormControl>
        </Grid>
        <DescriptionVideoDialog open={OpenDescriptionVideo} onclose={setOpenDescriptionVideo} forceUpdate={forceUpdate} VideoList={DescriptionVideoList}/>
        <DescriptionImageDialog open={OpenDescriptionImages} onclose={setOpenDescriptionImages} ImageList={DescriptionImageList} ItemRender={DescriptionItemRender} forceUpdate={forceUpdate}/>
      </>
  )}

export default ProductInformation