import { Dialog, DialogContent, TextField, Button, MenuItem, DialogTitle, Grid, Badge, Typography, Box, FormControl, InputAdornment ,Menu, ListItemText, List, ListItem, ListItemAvatar, Avatar, IconButton} from '@mui/material';
import { useReducer, useRef, useState } from 'react';
import { Management_Product_Object } from '../../Public_Data/Interfaces'
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import NestedMenu from '../SellProduct/NestedMenu';
import { Categories_Data } from '../../Public_Data/Categories_List';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ChildrenProduct from '../SellProduct/ChildrenProduct';
import { Product_API} from '../../../API/Request';
import { Modify_Product_Object } from '../../Public_Data/Interfaces';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';

const PreviousImages = (props: {Images: string[], RemoveList: string[], forceUpdate: Function}) => {
    const ImageList = props.Images.map((image, index) =>{
        if (props.RemoveList.indexOf(image) !== -1){return null}
        else{
            return(
                <ListItem key={Math.random()}>
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`Image ${index}`} sx={{overflow: 'clip'}}/>
                <img src={image} alt={'Not Found'} style={{width: '50px', marginLeft: '15px', pointerEvents: 'none'}}/>
                <IconButton onClick={() => {props.RemoveList.push(image); props.forceUpdate()}}>
                    <DeleteIcon/>
                </IconButton>
              </ListItem>
            )
        }
        
    })
    return ImageList
}

const NewImage = (props: {Images: File[], RenderList: String[], forceUpdate: Function}) =>{
    const ImageList = props.Images.map((image, index) =>{
        const objectUrl = URL.createObjectURL(image)
        props.RenderList.push(objectUrl) // This Function is to make sure that the image is deleted when the component is unmounted
        return(
            <ListItem key={image.name+ Math.random()}>
                <ListItemAvatar>
                <Avatar>
                    <FolderIcon />
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`Image ${index}`} sx={{overflow: 'clip'}}/>
                <img src={objectUrl} alt={'Not Found'} style={{width: '50px', marginLeft: '15px', pointerEvents: 'none'}}/>
                <IconButton onClick={() => {props.Images.splice(index, 1); props.forceUpdate();}}>
                    <DeleteIcon/>
                </IconButton>
            </ListItem>
        )
    })
    return ImageList
}

function ModifyProductFunction(data: Modify_Product_Object, setOpen: React.Dispatch<React.SetStateAction<boolean>>){
    Product_API.ModifyProduct(data).then((res) =>{
        if(res.status === 200){
            setOpen(false)
            window.location.reload()
        }
    })
}

const ImageGrid = (props: {Name: string, PreviousImages: string[], Images: File[], RenderList: string[], RemoveList: string[], forceUpdate: Function}) => {

    const inputImageRef = useRef<HTMLInputElement>(null)
    const {t} = useTranslation()

    return(
        <>
            <ListItemText primary={props.Name}/>
            <List>
                {PreviousImages({Images: props.PreviousImages, RemoveList: props.RemoveList, forceUpdate: props.forceUpdate})}
            </List>
            <ListItemText primary={t("SellProduct.NewImages")}/>
            <List>
                {NewImage({Images: props.Images, RenderList: props.RenderList, forceUpdate: props.forceUpdate})}
            </List>
            <input type="file" ref={inputImageRef} style={{display: 'none'}} onChange={(e) => {if (e.target.files) {props.Images.push(e.target.files[0]); props.forceUpdate()}}}/>
            <Button onClick={() => {inputImageRef.current?.click()}} variant='contained'>{t("SellProduct.AddImage")}</Button>
        </>
    )
}

const ModifyProductDialog = (props: {Open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, ProductData: Management_Product_Object}) => {
    const CategoriesSplit: string[] = props.ProductData.Category.split('/')
    const [cookies] = useCookies()

    ///New Data
    const [RemoveSubItem] = useState<string[]>([])
    const [ProductType, setProductType] = useState<string>(CategoriesSplit.splice(CategoriesSplit.length - 1, 1)[0])
    const [Categories, setCategories] = useState<Array<string>>(CategoriesSplit)
    const [MainName, setMainName] = useState<string>(props.ProductData.ProductName)
    const [Shipping, setShipping] = useState<string>(props.ProductData.ShippingLocation)
    const [Children_Product] = useState<any>(props.ProductData.SubItem)
    const [AboutProduct, setAboutProduct] = useState<string>(props.ProductData.Description.join('\n'))


    ///Input Function
    const [, forceUpdate] = useReducer(x => x + 1, 0)

    ///Interface Item
    const [AnchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
    const [Open, setOpen] = useState<boolean>(false);

    ///Children Item
    const [DisplayAdd, setDisplayAdd] = useState<boolean>(false)
    const [EditKey, setEditKey] = useState<number>()

    ///Description Images
    const [DescriptionImages] = useState<File[]>([])
    const [RemoveDescriptionImages] = useState<string[]>([])

    ///Images
    const [Images] = useState<File[]>([])
    const [RemoveImages] = useState<string[]>([])
    const [RenderList] = useState<string[]>([])

    const {t} = useTranslation()

    return (
        <Dialog open={props.Open} onClose={() => props.setOpen(false)} fullWidth maxWidth={'lg'} sx={{minWidth: '1200px'}}>
            <DialogTitle sx={{display: 'flex', justifyContent: 'center'}}>{t("SellProduct.ModifyProduct")}</DialogTitle>
            <DialogContent>
                <Grid container>
                    <Grid item xs={5}>
                        <ImageGrid Name={t("SellProduct.PreviousImages")} PreviousImages={props.ProductData.Images} Images={Images} RenderList={RenderList} RemoveList={RemoveImages} forceUpdate={forceUpdate}/>
                        <ImageGrid Name={t("SellProduct.PreviousDescriptionImages")} PreviousImages={props.ProductData.DescriptionImages} Images={DescriptionImages} RenderList={RenderList} RemoveList={RemoveDescriptionImages} forceUpdate={forceUpdate}/>
                    </Grid>
                    <Grid item xs={7}>
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

                            <Grid container sx={{display: 'flex', justifyContent: 'flex-start', flexDirection: 'row', mt: '5px'}} spacing={2}>
                                {Object.keys(Children_Product).map((key: any) =>(
                                    <Grid item key={key}  lg={4} onClick={() => {setDisplayAdd(true); setEditKey(key)}}>
                                        <Box sx={{position: 'relative', display: 'flex', alignItems: 'center', flexDirection: 'column', padding: '10px', border: 'solid 1px rgb(220,220,220)', borderRadius: '10px'}}>
                                            <Typography variant='h6' sx={{overflow: 'clip', width: '100%',  textAlign: 'center'}}>{Children_Product[key].Name}</Typography>
                                            <Typography variant='body1' sx={{overflow: 'clip', width: '100%',textAlign: 'center'}}>$HKD {Children_Product[key].Price}</Typography>
                                        </Box>                                       
                                    </Grid>
                                ))}
                            </Grid>

                            <Typography variant='body2' sx={{color: 'rgb(180,180,180)', mt: '15px'}}>{t("SellProduct.SplitStatement")}</Typography>

                            <ChildrenProduct Product={Children_Product} setDisplay={setDisplayAdd} Display={DisplayAdd} subkey={EditKey} setsubkey={setEditKey} RemoveList={RemoveSubItem}/>
                        
                            <Button sx={{mt: '15px'}} variant='contained' onClick={() => {setDisplayAdd(true); setEditKey(undefined)}}>{t("SellProduct.AddChildrenButton")}</Button>

                            <TextField label={t("SellProduct.AboutProduct")} sx={{mt: '20px'}} value={AboutProduct} multiline rows={4} 
                                    onChange={(e) => {setAboutProduct(e.target.value)}}/>
                            <Button sx={{mt: '15px'}} variant='contained' color='secondary' onClick={() => {setDisplayAdd(true); setEditKey(undefined)}}>{t("SellProduct.ModifyDescriptionImages")}</Button>

                            <Button color="primary" variant='contained' sx={{mt:'10px'}} 
                                    onClick={() => {ModifyProductFunction({Description: AboutProduct, ProductName: MainName, ShippingLocation: Shipping, id: props.ProductData.id,
                                                                           SubItem: Children_Product, Category: Categories.join('/') + '/'+ ProductType, Access_Token: cookies['access'], 
                                                                           RemoveImages: RemoveImages, RemoveSubItem: RemoveSubItem, RemoveDescriptionImages: RemoveDescriptionImages,
                                                                           DescriptionImages: DescriptionImages, Images: Images}, props.setOpen)}}>                    
                                {t("SellProduct.ConfirmModify")}
                            </Button>
                            <Button color='error' variant='contained' sx={{mt: '10px'}} onClick={() => console.log()}>
                                {t("SellProduct.DeleteProduct")}
                            </Button>
                        </FormControl>
                        
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}

export default ModifyProductDialog