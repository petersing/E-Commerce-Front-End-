import { Grid, Typography , Box, Pagination, CircularProgress, TextField, Button, InputAdornment, Chip, Menu, FormGroup, FormControlLabel, Checkbox} from "@mui/material"
import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { Product_Display_Object } from "../Public_Data/Interfaces"
import ProductItemRow from "../Product/Product_Item_Row"
import { gql, useLazyQuery } from "@apollo/client"
import NotFoundPage from "./StatusPage/404NotFound"
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { ParseGraphQLData } from "../Public_Data/Public_Application"
import { useTranslation } from "react-i18next"
import { useCookies } from "react-cookie"

const GetPublicData = gql`
query PublicProduct($start: Int!, $end: Int!, $search: String, $PriceStart: Float, $PriceEnd: Float, $QueueMethod: String, $category: String, $ads: String) {
    PublicProduct(Start: $start, End: $end, Search: $search, PriceStart: $PriceStart, PriceEnd: $PriceEnd, QueueMethod: $QueueMethod, Category: $category, adsToken: $ads) {,
      Product{
        id,
        Author,
        ProductName,
        FirstImage,
        DateCreate,
        MinPrice,
        Score,
        SellingRecord,
        AuthorIcon
      }
      Count
    }
}
`

const FilterPriceChip = (props: {PriceRange: number[], setPriceRange: Function, AddChange: Function}) =>{
    const [anchorEl, setanchorEl] = useState<null | HTMLElement>(null)
    const {t} = useTranslation()

    return(
        <>
            <Chip label={t("Search.PriceSetting")} variant="outlined" color="secondary"  sx={{width: '100%'}} onClick={(e) => setanchorEl(e.currentTarget)}/>
            <Menu open={Boolean(anchorEl)} onClose={() => {setanchorEl(null)}} keepMounted anchorEl={anchorEl} disableScrollLock={true} sx={{mt: '15px', maxWidth: '500px'}}>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <TextField label={t("Search.Lower")} sx={{margin: '10px'}} InputProps={{startAdornment: (<InputAdornment position="start"><AttachMoneyIcon /></InputAdornment>)}}
                                value={props.PriceRange[0]} onChange={(e) => props.setPriceRange([parseInt(e.target.value), props.PriceRange[1]])}/>
                    <TextField label={t("Search.Upper")} sx={{margin: '10px 0px', marginRight: '10px'}} InputProps={{startAdornment: (<InputAdornment position="start"><AttachMoneyIcon /></InputAdornment>)}}
                                value={props.PriceRange[1]} onChange={(e) => props.setPriceRange([props.PriceRange[0], parseInt(e.target.value)])}/>
                </div>
                <div style={{display: 'flex'}}>
                    <div style={{display: 'flex', flexGrow: 1}}></div>
                    <Button sx={{display: 'flex', mr: '10px'}} variant='contained' onClick={() => {props.setPriceRange([0, 0])}} color='warning'>{t("Search.Clear")}</Button>
                    <Button sx={{display: 'flex', mr: '10px'}} variant='contained' onClick={() => props.AddChange({Refresh: true})}>{t("Search.Apply")}</Button>
                </div>
            </Menu>
        </>
    )
}

const FilterQueueChip = (props: {QueueSelect: string, setQueueSelect: Function, AddChange: Function}) =>{
    const [anchorEl, setanchorEl] = useState<null | HTMLElement>(null)
    const {t} = useTranslation()

    return(
        <>
            <Chip label={t("Search.QueueSetting")} variant="outlined" color="secondary"  sx={{width: '100%', mt: '15px'}} onClick={(e) => setanchorEl(e.currentTarget)}/>
            <Menu open={Boolean(anchorEl)} onClose={() => {setanchorEl(null)}} keepMounted anchorEl={anchorEl} disableScrollLock={true} sx={{mt: '15px', maxWidth: '500px'}}>
                <FormGroup sx={{margin: '0px 15px'}}>
                    <FormControlLabel control={<Checkbox checked={props.QueueSelect === 'Recent'}/>} label={t("Search.Recent")} onChange={(e) => {props.setQueueSelect('Recent'); props.AddChange({QueueMethod: 'Recent'})}}/>
                    <FormControlLabel control={<Checkbox checked={props.QueueSelect === 'PHL'}/>} label={t("Search.PriceHToL")} onChange={(e) => {props.setQueueSelect('PHL'); props.AddChange({QueueMethod: 'PHL'})}}/>
                    <FormControlLabel control={<Checkbox checked={props.QueueSelect === 'PLH'}/>} label={t("Search.PriceLToH")} onChange={(e) => {props.setQueueSelect('PLH'); props.AddChange({QueueMethod: 'PLH'})}}/>
                    <FormControlLabel control={<Checkbox checked={props.QueueSelect === 'SHL'}/>} label={t("Search.ScoreHToL")} onChange={(e) => {props.setQueueSelect('SHL'); props.AddChange({QueueMethod: 'SHL'})}}/>
                    <FormControlLabel control={<Checkbox checked={props.QueueSelect === 'SLH'}/>} label={t("Search.ScoreLToH")} onChange={(e) => {props.setQueueSelect('SLH'); props.AddChange({QueueMethod: 'SLH'})}}/>
                </FormGroup>
            </Menu>
        </>
    )
}

const StandardPage = () => {
    const [searchParams] = useSearchParams()
    const {CategoriesType} = useParams()
    const [GetPublicDataFunction] = useLazyQuery<{PublicProduct: {Product: any, Count: number}}>(GetPublicData)
    const [ProductLists, setProductLists] = useState<Product_Display_Object[]>([])
    const [ProductCount, setProductCount] = useState<number>(0)
    const [Page, setPage] = useState<number>(1)
    const [Finish, setFinish] = useState<boolean>(false)
    const [PriceRange, setPriceRange] = useState<number[]>([0,0])
    const [QueueSelect, setQueueSelect] = useState<string>('Recent')
    const {t} = useTranslation()
    const [cookies] = useCookies(['ads'])


    function AddChange(data:{Refresh?: boolean, QueueMethod?: string, Page?: number}){
        if (data.Refresh){
            setPage(1)
        }
        let PageNumber = data.Page ? data.Page : Page
        GetPublicDataFunction({variables: {start: 0 + (PageNumber-1)*10, end: 10*PageNumber, search: searchParams.get("s") ? searchParams.get("s"): '', 
                                           PriceStart: PriceRange[0], PriceEnd: PriceRange[1], QueueMethod: data.QueueMethod ? data.QueueMethod : QueueSelect, 
                                           category: CategoriesType, ads: cookies['ads']}}).then((res) =>{
            if (res.data){
                setProductLists(res.data.PublicProduct.Product.map((item: any) => ParseGraphQLData(item)));
                setProductCount(res.data.PublicProduct.Count)
                setFinish(true)
            }
        }) 
    }
    
    ////Initialize
    useEffect(() =>{
        GetPublicDataFunction({variables: {start: 0,  end: 10, search: searchParams.get("s") ? searchParams.get("s"): '', category: CategoriesType, ads: cookies['ads']}}).then((res) =>{
            if (res.data){
                setProductLists(res.data.PublicProduct.Product.map((item: any) => ParseGraphQLData(item)));
                setProductCount(res.data.PublicProduct.Count)
                setFinish(true)
            }
        })    
    },[searchParams, GetPublicDataFunction, CategoriesType, cookies])
    
    if (!Finish) {
        return (
            <>
                <div style={{width: '100%', height: '100%', backgroundColor: 'black', position: 'fixed', top: 0, left: 0, zIndex: 40, opacity: 0.2}}/>
                <CircularProgress  sx={{ position: 'fixed', left: '50%', top: '50%', }} color="secondary"/>
            </>
            
          )
    }else{  
        return (
                <>
                    {ProductCount> 0 ? 
                    <div style={{width: '80%', marginLeft: 'auto', marginRight: 'auto', marginTop: '150px'}}>
                        <Grid container spacing={5}>
                            <Grid item sm={2}>
                                <FilterPriceChip PriceRange={PriceRange} setPriceRange={setPriceRange} AddChange={AddChange}/>
                                <FilterQueueChip QueueSelect={QueueSelect} setQueueSelect={setQueueSelect} AddChange={AddChange}/>
                            </Grid>
                            <Grid item sm={10}>
                                <Typography variant="h4" sx={{mb: '10px'}}>{t("Search.Result")}</Typography>
                                {ProductLists.map((item: Product_Display_Object, index: number) => (
                                    <ProductItemRow id={item['id']} key={index} ProductName={item.ProductName} MinPrice={item.MinPrice} Author={item.Author} Score={item.Score}
                                                    DateCreate={item.DateCreate} FirstImage={item.FirstImage? item.FirstImage + '?Width=200': undefined} SellingRecord={item.SellingRecord}
                                                    AuthorIcon={item.AuthorIcon}/>
                                ))}        
                            </Grid>
                        </Grid>    
                        <Box sx={{display: 'flex', mt: '20px', mb: '20px'}}>
                            <Pagination count={Math.ceil(ProductCount/10)} page={Page}  sx={{transform: 'scale(1.5)', marginLeft: 'auto', marginRight: 'auto'}} 
                                        onChange={(e, value) => {setPage(value); AddChange({Page: value}); window.scrollTo(0, 0)}} />
                        </Box>  
                    </div>:
                    <NotFoundPage/>}
                </>
                )       
}
}

export default StandardPage