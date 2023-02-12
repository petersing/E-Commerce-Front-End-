import { Grid, Stack, Typography, Divider, TextField, MenuItem, Button, Alert, CircularProgress, Rating, LinearProgress, Avatar, ListItemText, Pagination, IconButton} from "@mui/material"
import { Box } from "@mui/system"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import NotFound from '../../assets/NotFound.png'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { gql,  useLazyQuery, useMutation } from "@apollo/client"
import { ParseGraphQLData } from "../Public_Data/Public_Application"
import { Product_Detail_Object, Cart_Object } from "../Public_Data/Interfaces"
import NotFoundPage from "./StatusPage/404NotFound"
import { useCookies } from "react-cookie"
import PurchaseDialog from "../Dialog/Payment/PurchaseDialog"
import ChatBox from "../AddComponect/Chat/ChatBox"
import Des1 from '../../assets/Description/Des1.jpg'
import Des2 from '../../assets/Description/Des2.jpg'
import Avataaars from '../../assets/avataaars.png'
import { useTranslation } from 'react-i18next';


const GetProductDetail = gql`
query ProductDetail($id: Int!, $CommentStart: Int!, $CommentEnd: Int!, $ads: String) {
    ProductDetail(id: $id, adsToken: $ads) {
        Description,
        id,
        Author,
        ProductName,
        ShippingLocation,
        Images,
        DescriptionImages
        SimilarProduct,
        SubItem
        Score
        Comment(Start: $CommentStart, End: $CommentEnd) {
            CommentTitle
            CommentContent
            Score
            CreateDate
            CommentProductName
            User{
                username
                ProfileIcon
            }
        }
        
    }
}
`


const ModifyCartFunction = gql`
mutation ModifyCartFunction($ProductID: Int!, $SubItemKey: Int!, $Change: Int!) {
    ModifyCartFunction(ProductID: $ProductID, SubItemKey: $SubItemKey, Change: $Change){
        ResponseCart
    }
}
`

const ProductDetailLeftSide = (props: {ProductDetail: Product_Detail_Object}) =>{
    const [ImageOnFocus, setImageOnFocus] = useState<number>(0)
    return(
        <Grid item xs={7} sx={{display: 'flex', flexDirection: 'row'}} id='Left Side Image Bar + Image'>
            <Stack style={{display: 'flex', flexDirection: 'column', width: '50px'}}>
                {props.ProductDetail.Images.map((item: string, index: number) => (
                    <Box key={index} component="img" src={item + '?Width=50'} sx={{':hover': {cursor: 'pointer'}, border: 'solid 1px rgb(220,220,220)', mb: '10px', borderRadius: '5px',
                         boxShadow: (ImageOnFocus === index ? '0px 0px 5px orange': null)}} onMouseEnter={() => setImageOnFocus(index)}/>
                ))}  
            </Stack>
            <Box sx={{ml: '25px'}}>
                <img src={props.ProductDetail.Images.length > 0 ? props.ProductDetail.Images[ImageOnFocus]: NotFound} 
                     style={{objectFit: 'contain', width: '100%' ,left: 0, top: 0}} alt='MainImage'/>
            </Box>
        </Grid>
    )
}

const ProductDetailCenterSide = (props: {ProductDetail: Product_Detail_Object, SubProductSelect: number, setSubProductSelect: Function}) => {
    const { t } = useTranslation();
    return(
        <Grid item xs={9} id='Center Product Description'> 
            <Typography variant="h4" sx={{mb: '10px'}}>{props.ProductDetail?.ProductName}</Typography>
            <Typography variant='body1' sx={{mb: '10px'}}>
                {t('Product.Publish')}
                <Link to={`/Profile/${props.ProductDetail?.Author}`} style={{marginLeft: '5px', color: 'burlywood'}}>{props.ProductDetail?.Author}</Link>
            </Typography>
            <Divider/>
            <div style={{marginBottom: '10px', marginTop: '10px', display: 'flex', flexDirection: 'row'}}>
                <Typography variant='h6'>{t('Product.Price')}:</Typography>
                <Typography variant='h6' sx={{color: 'royalblue', ml: '5px'}}>HKD${props.ProductDetail.SubItem[props.SubProductSelect].Price}</Typography>
            </div>
            <Typography variant='caption' sx={{mb: '10px'}}>{t('Product.PriceStatement')}</Typography>
            <div style={{marginBottom: '10px', display: 'flex', flexDirection: 'row'}}>
                <Typography variant='h6'>{t('Product.Type')}:</Typography>
                <Typography variant='h6' fontWeight='bold' sx={{ml: '5px'}} >{props.ProductDetail.SubItem[props.SubProductSelect].Name}</Typography>          
            </div>
            <Stack direction="row" sx={{display: 'flex', flexWrap: 'wrap'}}>
                {props.ProductDetail.SubItem.map((item, index) => (
                    <Box key={item.id} component={Typography} sx={{border: (props.SubProductSelect=== index? 'solid 1px orange' :'solid 1px rgb(200,200,200)'), mr: '20px', 
                                                                mb:'20px', padding: '10px', borderRadius:'5px', ':hover': {opacity: 0.7, cursor: 'pointer'}, 
                                                                boxShadow: (props.SubProductSelect === index ?'0px 0px 5px orange': null), 
                                                                backgroundColor: (props.SubProductSelect === index ?'rgb(245, 240, 241)' :'white'),}}
                                                                onClick={()=> props.setSubProductSelect(index)}>
                        {item.Name}
                    </Box>
                ))}
            </Stack>
            <Stack>
                {Object.entries(props.ProductDetail.SubItem[props.SubProductSelect].Properties).map((item, index: number) => {
                    return(<div style={{display: 'flex', flexDirection: 'row', marginBottom: '15px'}} key={index}>
                        <Typography variant="body1" sx={{mr: '20px'}} fontWeight={700}>{item[0]}</Typography>
                        <Typography variant="body1">{item[1]}</Typography>
                    </div>)
                })}
            </Stack>
            <Divider/>
            <Typography variant='h5' sx={{mb: '10px'}}>{t('Product.AboutProduct')}</Typography>
            {props.ProductDetail.Description.length> 0?  props.ProductDetail.Description.map((item: string, index: number) => (
                <Typography key={index} variant='body1' sx={{mb: '10px', display: 'list-item'}}>{item}</Typography>
            )): null}     
        </Grid>
    )
}

const ProductDetailRightSide = (props: {ProductDetail: Product_Detail_Object, SubProductSelect: number, ProductID: number|string, setError: Function, 
                                        setAfterAddCart: Function}) =>{
    const [ModifyFunction] = useMutation(ModifyCartFunction, {onCompleted: ()=> props.setAfterAddCart(true), onError: ()=> {props.setAfterAddCart(true); props.setError(true);}})
    const [Quantity, setQuantity] = useState<number>(1)
    const [ChatSeller, setChatSeller] = useState<string|null>(null)
    const [OpenPurchaseDialog, setOpenPurchaseDialog] = useState<boolean>(false)
    const { t } = useTranslation();
    
    function Modify(data: {Change?: number, ProductID: number|string, SubItemKey: number|string}){
        ModifyFunction({variables: {ProductID: typeof(data.ProductID) === 'string' ? parseInt(data.ProductID): data.ProductID, 
                                    Change: data.Change, 
                                    SubItemKey: typeof(data.SubItemKey) === 'string'? parseInt(data.SubItemKey): data.SubItemKey}})
    }

    function CartData():Cart_Object[] {
        var SubItems: {[subKey: string]: {Count: number}} =  {}
        SubItems[props.ProductDetail.SubItem[props.SubProductSelect].id] = {Count: Quantity}
        const AllOption: {[subKey: string|number]: any} = {}
        props.ProductDetail.SubItem.forEach((item) =>{
            AllOption[item.id] = item
        })
        return(
            [
                {
                    image: props.ProductDetail.Images[0],
                    ProductName: props.ProductDetail.ProductName,
                    id: props.ProductDetail.id,
                    SubTotalPrice: props.ProductDetail.SubItem[props.SubProductSelect]?.Price* Quantity,
                    AllOption: AllOption,
                    SubItems: SubItems,
                    Author: props.ProductDetail.Author
                }
            ]
        )
    }

    return (
        <>
            <Grid item xs={4} id='Right Panel'>
                <Box id='Right First Panel' border='solid 1px rgb(220,220,220)' borderRadius='10px'>
                    <TextField label={t('Product.Price')} variant='outlined' sx={{width: '80%', ml: 'auto', mr: 'auto', display: 'flex', mt: '20px'}} 
                            value={`HKD$${props.ProductDetail.SubItem[props.SubProductSelect].Price*Quantity}`}
                            size="small"
                            InputProps={{readOnly: true}} color="secondary" focused />
                    <TextField label={t('Product.Stock')} variant='outlined' sx={{width: '80%', ml: 'auto', mr: 'auto', display: 'flex', mt: '20px'}} 
                            value={props.ProductDetail.SubItem[props.SubProductSelect].Quantity > 0? t('Product.OnStock'): t('Product.SoldOut')}
                            size="small"
                            InputProps={{readOnly: true}} color={props.ProductDetail.SubItem[props.SubProductSelect].Quantity > 0? 'success': 'error'} focused />
                    <TextField label={t('Product.Quantity')} variant='outlined' sx={{width: '80%', ml: 'auto', mr: 'auto', display: 'flex', mt: '20px'}} select 
                            size="small" 
                            disabled={props.ProductDetail.SubItem[props.SubProductSelect].Quantity > 0? false: true} 
                            value={Math.min(Quantity, props.ProductDetail.SubItem[props.SubProductSelect].Quantity)} 
                            onChange={(e)=> setQuantity(parseInt(e.target.value))}>
                        
                        {[...Array(props.ProductDetail.SubItem[props.SubProductSelect].Quantity).keys()].map((item: number) => (
                            <MenuItem key={item} value={item+1}>{item+1}</MenuItem>
                        ))}
                        
                    </TextField>
                    <Button variant='contained' sx={{mt: '15px', width: '90%', ml: 'auto', mr: 'auto', borderRadius: '5px', display: 'flex'}}
                            onClick={()=> Modify({Change: Quantity, ProductID: (props.ProductID? props.ProductID: 1), SubItemKey: props.ProductDetail.SubItem[props.SubProductSelect].id})}>
                        <AddShoppingCartIcon sx={{mr: '10px'}}/> 
                        {t('Product.AddCart')}
                    </Button>
                    <Button variant='contained' sx={{mt: '15px', width: '90%', ml: 'auto', mr: 'auto', borderRadius: '5px', display: 'flex', backgroundColor: 'green'}} 
                            onClick={() => setOpenPurchaseDialog(true)}>
                        <ShoppingCartIcon sx={{mr: '10px'}}/> 
                        {t('Product.Buy')}
                    </Button>
                    <div style={{marginTop: '15px', marginLeft: '10%', display: 'flex', flexDirection: 'row'}}>
                        <Typography variant='body1'>{t('Product.ShippingLocation')}</Typography>
                        <Typography variant='body1' sx={{ml: '10px', fontWeight: 600, color: 'green'}}>{props.ProductDetail.ShippingLocation}</Typography>
                    </div>
                    <div style={{marginTop: '15px', marginLeft: '10%', display: 'flex', flexDirection: 'row'}}>
                        <Typography variant='body1'>{t('Product.Seller')}</Typography>
                        <Typography variant='body1' sx={{ml: '10px', fontWeight: 600, color: 'green'}}>{props.ProductDetail.Author}</Typography>
                    </div>
                    <Button variant='contained' sx={{mt: '15px', width: '90%', ml: 'auto', mr: 'auto', borderRadius: '5px', display: 'flex', 
                                                    backgroundColor: 'yellowgreen', mb:'20px'}} onClick={() => setChatSeller(props.ProductDetail?.Author)}>
                        <LocalPhoneIcon sx={{mr: '10px'}}/> 
                        {t('Product.ContactSeller')}
                    </Button>
                </Box>
                <Box id ='Right Second Panel' border='solid 1px rgb(220,220,220)' borderRadius='10px' sx={{mt: '20px'}}>
                    <Typography variant='body1' sx={{textAlign: 'center', padding: '10px'}}>{t('Product.SimilarProduct')}</Typography>
                    {props.ProductDetail.SimilarProduct.map((item, index: number) => (
                        <div key={index}>
                            <Divider/>
                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '10px'}}>
                                <Typography variant='h6' sx={{color: 'green'}}>HKD${item.Price}</Typography>
                                <Button variant='contained' onClick={() => window.location.assign(`/Product/${item.id}`)}>{t('Product.SimilarProductButton')}</Button>
                            </div>
                            <Typography variant='body1' sx={{paddingLeft: '10px'}}>{t('Product.Seller')} : {item.Author}</Typography>
                        </div>
                    ))}
                </Box>
            </Grid>
            {OpenPurchaseDialog && <PurchaseDialog Open={OpenPurchaseDialog} setOpen={setOpenPurchaseDialog} CartData={CartData()} Clear={false}/>}
            {ChatSeller && <ChatBox Target={ChatSeller} onClose={setChatSeller}/>}
        </>
    )
}

const CommentScoreBar = (props: {score: number, StarLevel: number}) => {
    const { t } = useTranslation();
    return(
        <div style={{display: 'flex', flexDirection: 'row', marginTop: '5px'}}>
            <Typography variant='body1' sx={{mr: '10px'}}>{`${props.StarLevel} ${t('Product.CommentStar')}`}</Typography>
            <LinearProgress variant="determinate" value={props.score} sx={{height: '20px', width: '40%'}}/>
            <Typography variant='body1' sx={{color: 'green', ml: '10px'}}>{`${props.score} %`}</Typography>
        </div>
    )
}

const ClientComment = (props: {ProfileIcon?: string, UserName: string, date: string, score: number, Comment_Title: string, Comment_Content: string, CommentProductName: string}) =>{
    const { t } = useTranslation();
    return(
        <>
            <div id={props.UserName + 'Comment'} style={{display: 'flex', alignItems: 'center', marginTop: '10px'}}>
                <Avatar src={props.ProfileIcon ? props.ProfileIcon + '?Width=30': Avataaars}/>
                <ListItemText primary={props.UserName} secondary={props.date} sx={{ml: '10px'}}/>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <Rating value={props.score} readOnly sx={{ml: '10px', mb: '3px'}}/>
                    <Typography variant='caption' sx={{color: 'green', ml: '10px'}}>{t('Product.CommentCategory')}: {props.CommentProductName}</Typography>
                </div>
                
            </div>
            <Typography variant='body1' fontWeight='bold' sx={{color: 'grey', marginTop: '10px'}}>{props.Comment_Title}</Typography>
            <Typography variant='body2' sx={{color: 'grey', marginTop: '10px'}}>{props.Comment_Content}</Typography>
        </>
    )
}

const DescriptionImages = (props: {DescriptionImages: string[]}) => {
    const width = window.innerWidth*0.625;
    const height = width*0.5625;
    return(
        <>
            <img src={Des1} alt='des1' style={{marginLeft: '10%',width: '80%', objectFit: 'contain', marginTop: '20px'}}/>
            <img src={Des2} alt='des2' style={{marginLeft: '10%',width: '80%', objectFit: 'contain', marginBottom: '20px'}}/>
            <iframe style={{marginLeft: '10%', width: `${width}px`, height: `${height}px` , objectFit: 'contain', marginBottom: '20px'}}
                    src={`https://www.youtube-nocookie.com/embed/${"ONbimNA_mEM"}`} 
                    title="YouTube video player" 
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            />
            {props.DescriptionImages.map((item, index) => {
                return(
                    <img key={index} src={item} alt='des' style={{marginLeft: '10%',width: '80%', objectFit: 'contain', marginBottom: '20px'}}/>
                )
            })}
        </>
    )
}

const CommentGrid = (props: {ProductDetail: Product_Detail_Object, CommentPage: number, setCommentPage: Function}) => {
    const { t } = useTranslation();
    return(
        <Grid container spacing={3} id="Comment Grid" >
            <Grid item xs={3}>
                <Typography variant='h6' sx={{color: 'green'}}>{t('Product.CommentTitle')}</Typography>
                <div style={{display : 'flex', flexDirection: 'row'}}>
                    <Rating value={props.ProductDetail.Score.TotalScore} readOnly />
                    <Typography variant='body1' sx={{color: 'grey', ml: '10px'}}>{`${props.ProductDetail.Score.TotalScore}/5`}</Typography>
                </div>  
                <Typography variant='body1' sx={{color: 'grey', marginTop: '10px'}}>{`${t('Product.TotalComment')}: ${props.ProductDetail.Score.TotalComment}`}</Typography>              
                {Object.entries(props.ProductDetail.Score.Distribution).map((item, index: number) => {
                    return(
                        <CommentScoreBar key={index} score={item[1]} StarLevel={parseInt(item[0])}/>
                    )
                })}
            </Grid>
            <Grid item xs={9}>
                {props.ProductDetail.Score.TotalComment !== 0 && 
                <>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                        {props.ProductDetail.Comment.map((item, index: number) => {
                            return(
                                <ClientComment key={index} CommentProductName={item.CommentProductName} ProfileIcon={item.User.ProfileIcon} UserName={item.User.username} date={item.CreateDate} score={item.Score} Comment_Title={item.CommentTitle} Comment_Content={item.CommentContent}/>
                            )
                        })}
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Pagination count={Math.ceil(props.ProductDetail.Score.TotalComment/5)} sx={{mt: '10px'}} page={props.CommentPage} onChange={(e, v) => {props.setCommentPage(v)}}/>
                    </div>            
                </>
                }       
            </Grid>
        </Grid>
    )
}

function CheckID(ID: string|number|undefined) {
    if (typeof(ID) === 'string' && !isNaN(parseInt(ID))) {
        return parseInt(ID)
    }else if (typeof(ID) === 'number'){
        return ID
    }else{
        return false
    }
}


const ProductDetailPage =() => {
    const {ID} = useParams()
    const [SubProductSelect, setSubProductSelect] = useState<number>(0)
    const [ProductDetail, setProductDetail] = useState<Product_Detail_Object| null>(null)
    const [ProductDataFunction, {error}] = useLazyQuery<{ProductDetail: any}>(GetProductDetail)
    const [AfterAddCart, setAfterAddCart] = useState<boolean>(false)
    const [Finish, setFinish] = useState<boolean>(false)
    const [Error, setError] = useState<boolean>(false)
    const [CommentPage, setCommentPage] = useState<number>(1)
    const { t } = useTranslation();
    const [cookies] = useCookies(['ads'])


    useEffect(() => {
        const IDNumber = CheckID(ID)
        if (IDNumber !== false) {
            ProductDataFunction({variables: {id: IDNumber, CommentStart: (CommentPage-1)*5, CommentEnd: CommentPage*5, ads: cookies['ads']}}).then((res) =>{  
                if (res.data){
                    setProductDetail(ParseGraphQLData(res.data.ProductDetail))  
                    setFinish(true)
                }          
            })
        }else{
            setFinish(true)
        }
    }, [ID, ProductDataFunction, CommentPage, cookies])

    useEffect(() =>{
        let AlertMessage = setTimeout(() => setAfterAddCart(false), 5 * 1000);
        return () => {
            clearTimeout(AlertMessage);
        };
    }, [AfterAddCart])


    return(
        <>
            {(!Finish) ? 
                <>
                    <div style={{width: '100%', height: '100%', backgroundColor: 'black', position: 'fixed', top: 0, left: 0, zIndex: 40, opacity: 0.2}}/>
                    <CircularProgress  sx={{ position: 'fixed', left: '50%', top: '50%', }} color="secondary"/>
                </>    
            : (!error && Finish && ProductDetail)? 
                <div style={{width: '80%', marginLeft: 'auto', marginRight: 'auto', minWidth: '1200px', marginTop: '150px'}} id="Product Detail">
                    {AfterAddCart ? 
                    <Alert severity={Error? "error" :"success"} sx={{mb: '15px'}} 
                           action={ <IconButton onClick={() => window.location.assign('/Cart')}>
                                        <ShoppingCartIcon/>
                                    </IconButton>}>
                        {Error? t("Product.AddCartFail"): t("Product.AddCartSuccess")}
                    </Alert>
                    : null}                 
                    <Grid container spacing={3} id="Main Grid" columns={20}>
                        <ProductDetailLeftSide ProductDetail={ProductDetail}/>
                        <ProductDetailCenterSide ProductDetail={ProductDetail} SubProductSelect={SubProductSelect} setSubProductSelect={setSubProductSelect}/>
                        <ProductDetailRightSide ProductDetail={ProductDetail} SubProductSelect={SubProductSelect} ProductID={ID ? ID : 1} setError={setError} setAfterAddCart={setAfterAddCart}/>
                    </Grid>
                    <Divider sx={{mt: '25px'}}/>
                    <DescriptionImages DescriptionImages={ProductDetail.DescriptionImages}/>
                    <Divider/>
                    <CommentGrid ProductDetail={ProductDetail} CommentPage={CommentPage} setCommentPage={setCommentPage}/>
                </div>  
            : <NotFoundPage ID={ID}/>}
        </>

    )
}

export default ProductDetailPage