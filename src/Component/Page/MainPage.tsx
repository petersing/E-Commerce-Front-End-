import { Grid, Paper, Typography, IconButton} from "@mui/material"
import { useEffect, useState} from "react"
import SelectCategoriesList from "../AddComponect/Categories/SelectCategoriesList"
import ProductItemColumn from "../Product/Product_Item_Column"
import { Categories_List } from "../Public_Data/Categories_List"
import { Product_Display_Object} from "../Public_Data/Interfaces"
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { gql, useLazyQuery } from "@apollo/client"
import TopImage1 from '../../assets/store_9.jpg'
import TopImage2 from '../../assets/store_8.jpg'
import { ParseGraphQLData } from "../Public_Data/Public_Application"
import { Cookies, useCookies } from "react-cookie"
import { useTranslation } from 'react-i18next';

const ImagePool = [TopImage1, TopImage2, TopImage1, TopImage1, TopImage2, TopImage1, TopImage2]

const GetPublicData = gql`
query SuggestionProduct($count: Int!, $category: String!) {
    SuggestionProduct(Count: $count, CategoryType: $category) {,
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
}
`
const PersonalSuggestData = gql`
query PersonalSuggestionProduct($count: Int!) {
  PersonalSuggestionProduct(Count: $count) {
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
}
`
const PopularSuggestData = gql`
query PopularSuggestionProduct($count: Int!) {
  PopularSuggestionProduct(Count: $count) {,
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
}
`
const BuyAgainData = gql`
query BuyAgainProduct($count: Int!) {
  BuyAgainProduct(Count: $count) {,
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
}
`

const SuggestionList = (props: {Item:{Category: string, Image: any, SearchKey: string}}) => {
  const [width, setWidth] = useState(window.innerWidth)
  const [DisplayItemIndexRange, setDisplayItemIndexRange] = useState<number[]>([0, 5])
  const [GetProductData, {data}] = useLazyQuery<{SuggestionProduct: Product_Display_Object[]}>(GetPublicData)
  const [ProductLists, setProductLists] = useState<Product_Display_Object[]>([])
  const [ImageSize, setImageSize] = useState<number>(6)
  const [AlreadyLoad, setAlreadyLoad] = useState<number>(5)

  useEffect(() => {
    function handleResize() {setWidth(window.innerWidth)}
    
    function CheckCurrentDisplayItem(){
      if(width*0.8 >= 1500){
        setDisplayItemIndexRange([0, 5])
        setImageSize(6)
      }else{
        setDisplayItemIndexRange([0, Math.max(Math.floor(width*0.8/250)-1, 0)])
        setImageSize(Math.max(Math.floor(width*0.8/250)-1, 0))
      }
    }
    CheckCurrentDisplayItem()
    window.addEventListener("resize", handleResize)    
    return () => { 
      window.removeEventListener("resize", handleResize)
    }
  }, [setWidth, width])

  useEffect(() => {
    GetProductData({variables: {count: 30, category: props.Item.SearchKey}}).then(()=>{
      if (data){
        setProductLists(data.SuggestionProduct.map((item) => ParseGraphQLData(item)))
      }     
    })
  },[GetProductData, data, props.Item.SearchKey])

  return (
      <Paper sx={{height: '585px', backgroundColor: 'rgb(245,245,245)', mt: '20px', padding: '40px', 
                  display: 'flex', justifyContent: 'center', flexDirection: 'column', width: `${(DisplayItemIndexRange[1]- DisplayItemIndexRange[0] +1)*250}px`, 
                  ml: 'auto', mr: 'auto', position: 'relative'}}>
        <Typography variant="h5" fontWeight='bold' sx={{mb: '10px'}}>{props.Item.Category}</Typography>
        <Grid container spacing={3}>
            {ProductLists.map((item: Product_Display_Object, index: number) => {
                return(
                  <Grid item columns={{ lg: 12, md: 10 }} key={index} sx={{width: '250px', alignItems: 'center'}} display={index >= DisplayItemIndexRange[0] && index <= DisplayItemIndexRange[1] ? '' : 'none'}>
                    <ProductItemColumn id={item.id} ProductName={item.ProductName} MinPrice={item.MinPrice} Author={item.Author} Score={item.Score} DateCreate={item.DateCreate} Loaded={index <= AlreadyLoad}
                                       FirstImage={item.FirstImage? item.FirstImage + '?Width=150': undefined} SellingRecord={item.SellingRecord} AuthorIcon={item.AuthorIcon}/>
                  </Grid>
                )
            })}
        </Grid>
        {DisplayItemIndexRange[0] > 0 ? 
          <IconButton sx={{position: 'absolute', top: '50%', left: 0}} onClick={() => {setDisplayItemIndexRange([DisplayItemIndexRange[0]-ImageSize, DisplayItemIndexRange[1]-ImageSize])}}>
            <KeyboardArrowLeftIcon/>
          </IconButton>
        : null}
        {ProductLists.length -1 > DisplayItemIndexRange[1] ? 
          <IconButton sx={{position: 'absolute', top: '50%', right: 0}} onClick={() => {setDisplayItemIndexRange([DisplayItemIndexRange[0]+ImageSize, DisplayItemIndexRange[1]+ImageSize]); setAlreadyLoad((pre) => {return Math.max(pre, DisplayItemIndexRange[1]+ImageSize)})}}>
            <ChevronRightIcon/>
          </IconButton>
        : null}
      </Paper>
  )
}

const PersonalSuggestionList = () => {
  const [width, setWidth] = useState(window.innerWidth)
  const [DisplayItemIndexRange, setDisplayItemIndexRange] = useState<number[]>([0, 5])
  const [GetProductData, {data}] = useLazyQuery<{PersonalSuggestionProduct: Product_Display_Object[]}>(PersonalSuggestData)
  const [ProductLists, setProductLists] = useState<Product_Display_Object[]>([])
  const [ImageSize, setImageSize] = useState<number>(6)
  const [AlreadyLoad, setAlreadyLoad] = useState<number>(5)
  const { t } = useTranslation();
  

  useEffect(() => {
    function handleResize() {setWidth(window.innerWidth)}
    
    function CheckCurrentDisplayItem(){
      if(width*0.8 >= 1500){
        setDisplayItemIndexRange([0, 5])
        setImageSize(6)
      }else{
        setDisplayItemIndexRange([0, Math.max(Math.floor(width*0.8/250)-1, 0)])
        setImageSize(Math.max(Math.floor(width*0.8/250)-1, 0))
      }
    }
    CheckCurrentDisplayItem()
    window.addEventListener("resize", handleResize)    
    return () => { 
      window.removeEventListener("resize", handleResize)
    }
  }, [setWidth, width])

  useEffect(() => {
    GetProductData({variables: {count: 30}}).then(()=>{
      if (data){setProductLists(data.PersonalSuggestionProduct.map((item) => ParseGraphQLData(item)))}     
    })
  },[GetProductData, data])


  return (
      <Paper sx={{height: '585px', backgroundColor: 'rgb(245,245,245)', mt: '20px', padding: '40px', 
                  display: 'flex', justifyContent: 'center', flexDirection: 'column', width: `${(DisplayItemIndexRange[1]- DisplayItemIndexRange[0] +1)*250}px`, 
                  ml: 'auto', mr: 'auto', position: 'relative'}}>
        <Typography variant="h5" fontWeight='bold' sx={{mb: '10px'}}>{t('MainPage.SuggestionProduct')}</Typography>
        <Grid container spacing={3}>
            {ProductLists.map((item: Product_Display_Object, index: number) => {
                return(
                  <Grid item columns={{ lg: 12, md: 10 }} key={index} sx={{width: '250px', alignItems: 'center'}} display={index >= DisplayItemIndexRange[0] && index <= DisplayItemIndexRange[1] ? '' : 'none'}>
                    <ProductItemColumn id={item.id} ProductName={item.ProductName} MinPrice={item.MinPrice} Author={item.Author} Score={item.Score} DateCreate={item.DateCreate} Loaded={index <= AlreadyLoad}
                                       FirstImage={item.FirstImage? item.FirstImage + '?Width=150': undefined} SellingRecord={item.SellingRecord} AuthorIcon={item.AuthorIcon}/>
                  </Grid>
                )
            })}
        </Grid>
        {DisplayItemIndexRange[0] > 0 ? 
          <IconButton sx={{position: 'absolute', top: '50%', left: 0}} onClick={() => {setDisplayItemIndexRange([DisplayItemIndexRange[0]-ImageSize, DisplayItemIndexRange[1]-ImageSize])}}>
            <KeyboardArrowLeftIcon/>
          </IconButton>
        : null}
        {ProductLists.length -1 > DisplayItemIndexRange[1] ? 
          <IconButton sx={{position: 'absolute', top: '50%', right: 0}} onClick={() => {setDisplayItemIndexRange([DisplayItemIndexRange[0]+ImageSize, DisplayItemIndexRange[1]+ImageSize]); setAlreadyLoad((pre) => {return Math.max(pre, DisplayItemIndexRange[1]+ImageSize)})}}>
            <ChevronRightIcon/>
          </IconButton>
        : null}
      </Paper>
  )
}

const PopularSuggestionList = () => {
  const [width, setWidth] = useState(window.innerWidth)
  const [DisplayItemIndexRange, setDisplayItemIndexRange] = useState<number[]>([0, 5])
  const [GetProductData, {data}] = useLazyQuery<{PopularSuggestionProduct: Product_Display_Object[]}>(PopularSuggestData)
  const [ProductLists, setProductLists] = useState<Product_Display_Object[]>([])
  const [ImageSize, setImageSize] = useState<number>(6)
  const [AlreadyLoad, setAlreadyLoad] = useState<number>(5)
  const { t } = useTranslation();

  useEffect(() => {
    function handleResize() {setWidth(window.innerWidth)}
    
    function CheckCurrentDisplayItem(){
      if(width*0.8 >= 1500){
        setDisplayItemIndexRange([0, 5])
        setImageSize(6)
      }else{
        setDisplayItemIndexRange([0, Math.max(Math.floor(width*0.8/250)-1, 0)])
        setImageSize(Math.max(Math.floor(width*0.8/250)-1, 0))
      }
    }
    CheckCurrentDisplayItem()
    window.addEventListener("resize", handleResize)    
    return () => { 
      window.removeEventListener("resize", handleResize)
    }
  }, [setWidth, width])

  useEffect(() => {
    GetProductData({variables: {count: 30}}).then(()=>{
      if (data){setProductLists(data.PopularSuggestionProduct.map((item) => ParseGraphQLData(item)))}     
    })
  },[GetProductData, data])

  return (
      <Paper sx={{height: '585px', backgroundColor: 'rgb(245,245,245)', mt: '20px', padding: '40px', 
                  display: 'flex', justifyContent: 'center', flexDirection: 'column', width: `${(DisplayItemIndexRange[1]- DisplayItemIndexRange[0] +1)*250}px`, 
                  ml: 'auto', mr: 'auto', position: 'relative'}}>
        <Typography variant="h5" fontWeight='bold' sx={{mb: '10px'}}>{t('MainPage.PopularProduct')}</Typography>
        <Grid container spacing={3}>
            {ProductLists.map((item: Product_Display_Object, index: number) => {
                return(
                  <Grid item columns={{ lg: 12, md: 10 }} key={index} sx={{width: '250px', alignItems: 'center'}} display={index >= DisplayItemIndexRange[0] && index <= DisplayItemIndexRange[1] ? '' : 'none'}>
                    <ProductItemColumn id={item.id} ProductName={item.ProductName} MinPrice={item.MinPrice} Author={item.Author} Score={item.Score} DateCreate={item.DateCreate} Loaded={index <= AlreadyLoad}
                                       FirstImage={item.FirstImage? item.FirstImage + '?Width=150': undefined} SellingRecord={item.SellingRecord} AuthorIcon={item.AuthorIcon}/>
                  </Grid>
                )
            })}
        </Grid>
        {DisplayItemIndexRange[0] > 0 ? 
          <IconButton sx={{position: 'absolute', top: '50%', left: 0}} onClick={() => {setDisplayItemIndexRange([DisplayItemIndexRange[0]-ImageSize, DisplayItemIndexRange[1]-ImageSize])}}>
            <KeyboardArrowLeftIcon/>
          </IconButton>
        : null}
        {ProductLists.length -1 > DisplayItemIndexRange[1] ? 
          <IconButton sx={{position: 'absolute', top: '50%', right: 0}} onClick={() => {setDisplayItemIndexRange([DisplayItemIndexRange[0]+ImageSize, DisplayItemIndexRange[1]+ImageSize]); setAlreadyLoad((pre) => {return Math.max(pre, DisplayItemIndexRange[1]+ImageSize)})}}>
            <ChevronRightIcon/>
          </IconButton>
        : null}
      </Paper>
  )
}

const BuyAgainList = () => {
  const [width, setWidth] = useState(window.innerWidth)
  const [DisplayItemIndexRange, setDisplayItemIndexRange] = useState<number[]>([0, 5])
  const [GetProductData, {data}] = useLazyQuery<{ BuyAgainProduct: Product_Display_Object[]}>(BuyAgainData)
  const [ProductLists, setProductLists] = useState<Product_Display_Object[]>([])
  const [ImageSize, setImageSize] = useState<number>(6)
  const [AlreadyLoad, setAlreadyLoad] = useState<number>(5)
  const { t } = useTranslation();

  useEffect(() => {
    function handleResize() {setWidth(window.innerWidth)}
    
    function CheckCurrentDisplayItem(){
      if(width*0.8 >= 1500){
        setDisplayItemIndexRange([0, 5])
        setImageSize(6)
      }else{
        setDisplayItemIndexRange([0, Math.max(Math.floor(width*0.8/250)-1, 0)])
        setImageSize(Math.max(Math.floor(width*0.8/250)-1, 0))
      }
    }
    CheckCurrentDisplayItem()
    window.addEventListener("resize", handleResize)    
    return () => { 
      window.removeEventListener("resize", handleResize)
    }
  }, [setWidth, width])

  useEffect(() => {
    GetProductData({variables: {count: 30}}).then(()=>{
      if (data){setProductLists(data.BuyAgainProduct.map((item) => ParseGraphQLData(item)))}     
    })
  },[GetProductData, data])

  return (
      <Paper sx={{height: '585px', backgroundColor: 'rgb(245,245,245)', mt: '20px', padding: '40px', 
                  display: 'flex', justifyContent: 'center', flexDirection: 'column', width: `${(DisplayItemIndexRange[1]- DisplayItemIndexRange[0] +1)*250}px`, 
                  ml: 'auto', mr: 'auto', position: 'relative'}}>
        <Typography variant="h5" fontWeight='bold' sx={{mb: '10px'}}>{t('MainPage.BuyAgainProduct')}</Typography>
        <Grid container spacing={3}>
            {ProductLists.map((item: Product_Display_Object, index: number) => {
                return(
                  <Grid item columns={{ lg: 12, md: 10 }} key={index} sx={{width: '250px', alignItems: 'center'}} display={index >= DisplayItemIndexRange[0] && index <= DisplayItemIndexRange[1] ? '' : 'none'}>
                    <ProductItemColumn id={item.id} ProductName={item.ProductName} MinPrice={item.MinPrice} Author={item.Author} Score={item.Score} DateCreate={item.DateCreate} Loaded={index <= AlreadyLoad}
                                       FirstImage={item.FirstImage? item.FirstImage + '?Width=150': undefined} SellingRecord={item.SellingRecord} AuthorIcon={item.AuthorIcon}/>
                  </Grid>
                )
            })}
        </Grid>
        {DisplayItemIndexRange[0] > 0 ? 
          <IconButton sx={{position: 'absolute', top: '50%', left: 0}} onClick={() => {setDisplayItemIndexRange([DisplayItemIndexRange[0]-ImageSize, DisplayItemIndexRange[1]-ImageSize])}}>
            <KeyboardArrowLeftIcon/>
          </IconButton>
        : null}
        {ProductLists.length -1 > DisplayItemIndexRange[1] ? 
          <IconButton sx={{position: 'absolute', top: '50%', right: 0}} onClick={() => {setDisplayItemIndexRange([DisplayItemIndexRange[0]+ImageSize, DisplayItemIndexRange[1]+ImageSize]); setAlreadyLoad((pre) => {return Math.max(pre, DisplayItemIndexRange[1]+ImageSize)})}}>
            <ChevronRightIcon/>
          </IconButton>
        : null}
      </Paper>
  )
}

const ImageScroll = () =>{
  const [Select, setSelect] = useState<number[]>([0, 1])

  useEffect(() => {
    const interval = setInterval(() => {
      setSelect([Select[1] % ImagePool.length, (Select[1]+1)% ImagePool.length])
    }, 5000);
    return () => clearInterval(interval);
  })

  return(
    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', position: 'relative'}}>
        <img src={ImagePool[Select[0]]} alt='Store 1' style={{width: '50%', maxHeight: '300px', objectFit: 'contain', borderRadius: '15px', marginRight: '10px'}}/>
        <img src={ImagePool[Select[1]]} alt='Store 2' style={{width: '50%', maxHeight: '300px',objectFit: 'contain', borderRadius: '15px'}}/> 
        <IconButton sx={{position: 'absolute', right: "2%", top: '43%'}} disabled={Select[1] === ImagePool.length -1} onClick={() => {setSelect([Select[1], Select[1]+1])}}>
          <ChevronRightIcon/>
        </IconButton>
        <IconButton sx={{position: 'absolute', left: "2%", top: '43%'}} disabled={Select[0] === 0} onClick={() => {setSelect([Select[0]-1, Select[0]])}}>
          <KeyboardArrowLeftIcon/>
        </IconButton>
    </div> 
  )
}

const MainPage = () => {
  const [cookies] = useCookies(['access'])
  return (
    <div style={{width: '80%', marginLeft: 'auto', marginRight: 'auto',marginTop: '120px'}}>
      <ImageScroll/>     
      <SelectCategoriesList/>
      {cookies['access'] && <PersonalSuggestionList/>}
      {cookies['access'] && <BuyAgainList/>}
      <PopularSuggestionList/>
      {Categories_List().map((item, index) => (
        <SuggestionList key={index} Item={item}/>
      ))}
    </div>
  )
}

export default MainPage