import { Typography, Box, Grid, Avatar, Button, Card, CardContent, CardMedia, CircularProgress, Pagination} from "@mui/material"
import { deepPurple } from "@mui/material/colors"
import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ProductItemProfile from "../Product/Product_Item_Profile";
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import { Product_Display_Object } from "../Public_Data/Interfaces";
import NotFoundPage from "./StatusPage/404NotFound";
import { useCookies } from "react-cookie";
import NotFoundProduct from '../../assets/no-product-found.png'
import EditProfileDialog from "../Dialog/User/EditProfileDialog";
import Avataaars from '../../assets/avataaars.png'
import { useTranslation } from "react-i18next";

const GetUserData = gql`
query UserData($username: String!) {
    PublicUserData(username: $username) {
        username,
        isSubscriber,
        DateJoin,
        ProfileIcon
    },
    CheckIsUser(username: $username)
}
`

const GetUserProduct = gql`
query PersonalProduct($start: Int!, $end: Int!, $username: String!) {
    PersonalProduct(Start: $start, End: $end, User: $username) {,
      Product{
        id,
        Author,
        ProductName,
        FirstImage,
        DateCreate,
        MinPrice
      }
      Count
    },
}
`

const ItemData = (props: {username: string }) => {
    const [GetPublicDataFunction] = useLazyQuery<{PersonalProduct: {Product: any, Count: number}}>(GetUserProduct)  
    const [Page, setPage] = useState<number>(1)
    const [Finish, setFinish] = useState<boolean>(false)
    const [ProductLists, setProductLists] = useState<Product_Display_Object[]>([])
    const [ProductCount, setProductCount] = useState<number>(0)

    useEffect(() =>{
        GetPublicDataFunction({variables: {start: 0 + (Page-1)*12, end: 12*Page, username: props.username}}).then((res) =>{
            if (res.data){
                setProductLists(res.data.PersonalProduct.Product);
                setProductCount(res.data.PersonalProduct.Count);
                setFinish(true)
            }else{
                setFinish(true)
            }
        })    
    },[GetPublicDataFunction, Page, props.username])

    if (!Finish){
        return(
            <>
                <div style={{width: '100%', height: '100%', backgroundColor: 'black', position: 'fixed', top: 0, left: 0, zIndex: 40, opacity: 0.2}}/>
                <CircularProgress  sx={{ position: 'fixed', left: '50%', top: '50%', }} color="secondary"/>
            </>
        )      
    }else{
        return (
            <Grid item xs={9} sx={{border: 'solid 1px rgb(200,200,200)', mt: '20px', borderRadius: '3px', boxShadow: ' 0px 0px 5px rgb(170, 170, 170)'}}>
                <Grid container sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'row', padding: '25px'}} spacing={2}>
                    {ProductLists.length ?
                    ProductLists.map((item:any, index: number) => (
                        <ProductItemProfile key={index} {...item}/>
                    )): 
                    <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
                        <img src={NotFoundProduct} alt="Not Found" style={{height: '100%', objectFit: 'contain'}}/>
                    </Grid>}
                    {ProductLists.length !== 0 &&
                    <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
                        <Pagination count={Math.ceil(ProductCount/12)} sx={{transform: 'scale(1.5)'}} onChange={(e, value) => setPage(value)} page={Page}/>
                    </Grid>}
                </Grid>  
            </Grid>
        )
    }
    
}


const ProfilePage = () => {
  const {Username} = useParams()
  const [UserDataFunction, {data, loading, refetch}] = useLazyQuery(GetUserData)
  const [OpenEdit, setOpenEdit] = useState<boolean>(false)
  const {t} = useTranslation()

  useEffect(() =>{
    UserDataFunction({variables: {username: Username}})  
  }, [UserDataFunction, Username, data])

  function RefetchUserData(){
    refetch({username: Username}) 
  }

  if (loading || !data) {
    return (
        <>
            <div style={{width: '100%', height: '100%', backgroundColor: 'black', position: 'fixed', top: 0, left: 0, zIndex: 40, opacity: 0.2}}/>
            <CircularProgress  sx={{ position: 'fixed', left: '50%', top: '50%', }} color="secondary"/>
        </>
        
      )
  }else{
    return (
        <>
            {data.PublicUserData ?
            <Grid container sx={{width: '80%', ml: 'auto', mr: 'auto', minWidth: '1300px'}}> 
                <Box sx={{width: '100%', height: '130px', backgroundColor: 'primary.dark', ml: 'auto', mr: 'auto', mt: '130px'}}/>
                <Box sx={{width: '100%', height: '80px', ml: 'auto', mr: 'auto', borderBottom: 'solid 1px rgb(200, 200, 200)', display: 'flex',alignItems: 'center'}}>
                    <Box sx={{flexGrow: '1'}}/>
                    {data.CheckIsUser ? <Button sx={{height: '60%'}} variant='outlined' onClick={() => setOpenEdit(true)}>{t("Profile.EditProfileButton")}<AssignmentIndIcon sx={{ml: '1px'}}/></Button>: <></>}
                </Box>
                <Grid item xs={3} sx={{display: 'flex' , flexDirection: 'row', justifyContent: 'center', mt: '-125px'}}>
                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Avatar sx={{width : '200px', height: '200px', bgcolor: deepPurple[50], mb: '25px', border: 'solid 1px rgb(220,220,220)'}} 
                                src={data.PublicUserData.ProfileIcon ? data.PublicUserData.ProfileIcon + '?Width=200': Avataaars}/>
                        <Typography variant='h4'>{data.PublicUserData ? data.PublicUserData.username: '--------'}</Typography>
                        <Typography>{data.PublicUserData ? '@' +data.PublicUserData.username: '--------'}</Typography>
                        <Typography>{`${t("Profile.JointedAt")} ${data.PublicUserData ? data.PublicUserData.DateJoin: '--------'}`} </Typography>
                        <Typography>{data.PublicUserData ? data.PublicUserData.isSubscriber ? t("Profile.Seller"): t("Profile.Buyer"): "-----------"}</Typography>
                    </Box>
                </Grid>
                <ItemData username={data.PublicUserData.username}/>
            </Grid>: <NotFoundPage/>}
            {OpenEdit && 
            <EditProfileDialog Open={OpenEdit} OnClose={setOpenEdit} RefetchFunction={RefetchUserData}
                               UserIcon={data.PublicUserData.ProfileIcon ? data.PublicUserData.ProfileIcon + '?Width=150': Avataaars}/>}
            
        </>
        )
  }                                        
}

export default ProfilePage