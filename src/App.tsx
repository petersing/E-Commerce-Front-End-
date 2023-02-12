import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import MainPage from './Component/Page/MainPage';
import ProductDetailPage from './Component/Page/ProductDetailPage';
import CartPage from './Component/Page/CartPage';
import OrderPage from './Component/Page/OrderPage';
import ProfilePage from './Component/Page/ProfilePage';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Account_API } from './API/Request';
import {ParseCookies} from'./Component/Public_Data/Public_Application'
import { gql, useLazyQuery } from '@apollo/client';
import { User_Object } from './Component/Public_Data/Interfaces';
import BusinessManagementNavBar from './Component/AddComponect/Navbar/BusinessManagementNavBar';
import UnauthorizedPage from './Component/Page/StatusPage/401Unauthorized';
import TopNavBar from './Component/AddComponect/Navbar/TopNavBar';
import SearchNavBar from './Component/AddComponect/Navbar/SearchNavBar';
import BusinessManagementPage from './Component/Page/BusinessPage/BusinessManagementPage';
import OrderManagementPage from './Component/Page/BusinessPage/OrderManagementPage';
import ReturnManagementPage from './Component/Page/BusinessPage/ReturnManagementPage';
import ReturnOrderPage from './Component/Page/ReturnOrderPage';
import AnalysisMangementPage from './Component/Page/BusinessPage/AnalysisMangementPage';
import ChatPage from './Component/Page/ChatPage';
import StandardPage from './Component/Page/StandardProductPage';
import AccountInformationPage from './Component/Page/AccountInformationPage';
import AccountSetting from './Component/Page/SettingPage/AccountSetting';
import SellerCenter from './Component/Page/SettingPage/SellerCenter';
import Tail from './Component/AddComponect/Tail/Tail';
import AddressSetting from './Component/Page/SettingPage/AddressSetting';
import { CircularProgress } from '@mui/material';
import PrivacyPolicyPage from './Component/Page/HelpingPage/PrivacyPolicyPage';
import TermsofUsePage from './Component/Page/HelpingPage/TermsofUsePage';
import { useTranslation } from 'react-i18next';

const PrivateUserData = gql`
query PrivateUserData {
    PrivateUserData{
        id, username, isSubscriber, email, dateJoined, RemainPublish, ProfileIcon,
        Subscribe{SubscribeDate, SubscribeEnd, SubscribePlan}
    }
}
`

function Initial_Information(){
  console.clear()
  console.log("%cSTOP", "color: yellow; font-style: italic; background-color: blue;padding: 2px");
  console.log('(C) 2023 E-commerce\nBuild 20231004-2 (BETA)')
  console.log("%cDon't Send Any Data to Console", "color: yellow; font-style: italic; background-color: blue;padding: 2px");
}

const UserRoute = (props: {loading: boolean, data: User_Object| undefined}) =>{
  if(props.loading){
    return(
      <>
        <div style={{width: '100%', height: '100%', backgroundColor: 'black', position: 'fixed', top: 0, left: 0, zIndex: 40, opacity: 0.2}}/>
        <CircularProgress  sx={{ position: 'fixed', left: '50%', top: '50%', }} color="secondary"/>
      </>      
    )
  }else if(props.data) {
    return(
      <div>
        <TopNavBar UserData={props.data}/>
        <SearchNavBar/>
        <Outlet/>
        <Tail/>
      </div>
    )
  }else{
    return(
      <div>
        <TopNavBar UserData={props.data}/>
        <SearchNavBar/>
        <UnauthorizedPage/>
        <Tail/>
      </div>
    )
  }
}

const ManagementSystemRoute = (props: {loading: boolean, data: User_Object| undefined}) => {
  if(props.loading){
    return(
      <>
        <div style={{width: '100%', height: '100%', backgroundColor: 'black', position: 'fixed', top: 0, left: 0, zIndex: 40, opacity: 0.2}}/>
        <CircularProgress  sx={{ position: 'fixed', left: '50%', top: '50%', }} color="secondary"/>
      </>      
    )
  }else if (props.data?.isSubscriber){
    return (
      <div>
        <TopNavBar UserData={props.data}/>
        <BusinessManagementNavBar/>
        <Outlet/>
        <Tail/>
      </div>
    )
  }else{
    return(
      <div>
        <TopNavBar UserData={props.data}/>
        <SearchNavBar/>
        <UnauthorizedPage/>
        <Tail/>
      </div>
    )
  }
}

const NavBarWithComponent = (props: {loading: boolean, data: User_Object| undefined}) => {
  if(props.loading){
    return(
      <>
        <div style={{width: '100%', height: '100%', backgroundColor: 'black', position: 'fixed', top: 0, left: 0, zIndex: 40, opacity: 0.2}}/>
        <CircularProgress  sx={{ position: 'fixed', left: '50%', top: '50%', }} color="secondary"/>
      </>      
    )
  }else{
    return(
      <div>
        <TopNavBar UserData={props.data}/>
        <SearchNavBar/>
        <Outlet/>
        <Tail/>
      </div>
    )
  }
}

const App : React.FC = () =>{
  const [cookies, setCookie, removeCookie] = useCookies();
  const [GetUserData, { data , refetch, loading}] = useLazyQuery<{PrivateUserData: User_Object}>(PrivateUserData);
  const {i18n, ready} = useTranslation()

  function RefetchUserData(){
    refetch({access: cookies.access});
  }

  useEffect(() =>{
    if (cookies['Language']){
      i18n.changeLanguage(cookies['Language'])
    }else{
      i18n.changeLanguage('en_US')
      setCookie('Language', 'en_US', { path: '/' , expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)})
    }
  }, [cookies, i18n, setCookie])


  useEffect(() => {
    Initial_Information()
  }, [])

  useEffect(() =>{
    GetUserData() 
  }, [GetUserData])

  useEffect(() => {
    function CookiesFunction(){
      const Cookies_List = ParseCookies(window.document.cookie);
      if(Cookies_List['refresh'] && !Cookies_List['access']){
        Account_API.Refresh_Token(Cookies_List['refresh'])
      }else if(Cookies_List['access'] && !Cookies_List['refresh']){
        removeCookie('access', { path: '/' })
        removeCookie('refresh', { path: '/' })
        removeCookie('ads', { path: '/' })
      }
      if (Cookies_List['access'] && !Cookies_List['ads']){
        Account_API.Ads_Token(Cookies_List['access'])
      }
    }
    CookiesFunction()
    const RefreshCookies = setInterval(() =>{CookiesFunction()}, 1000*60)
    return () => {clearInterval(RefreshCookies)}

  },[setCookie, cookies, removeCookie])

  return(
    <Router>
        <Routes>
          <Route element={NavBarWithComponent({loading: !ready, data: data?.PrivateUserData})} >
            <Route path='/' element={<MainPage/>}/>
            <Route path='/Search' element={<StandardPage/>}/> 
            <Route path='/Categories/:CategoriesType' element={<StandardPage/>}/>
            <Route path='/Product/:ID' element={<ProductDetailPage/>}/>
            <Route path='/Profile/:Username' element={<ProfilePage/>}/>
            <Route path='/Help/Privacy' element={<PrivacyPolicyPage/>}/>
            <Route path='/Help/TermsAndUse' element={<TermsofUsePage/>}/>
          </Route>
          <Route element={UserRoute({loading: loading && !ready, data: data?.PrivateUserData})}>
            <Route path='/ChatBox' element={<ChatPage/>}/>
            <Route path='/ReturnOrder' element={<ReturnOrderPage/>}/>
            <Route path='/Cart' element={<CartPage/>}/>
            <Route path='/Order' element={<OrderPage/>}/>
            <Route path='/AccountInformation' element={<AccountInformationPage/>}/>
            <Route path='/AccountSetting' element={<AccountSetting UserData={data?.PrivateUserData} RefetchUserFunction={RefetchUserData}/>}/>
            <Route path='/SellerCenter' element={<SellerCenter UserData={data?.PrivateUserData} RefetchUserFunction={RefetchUserData}/>}/>
            <Route path='/Address' element={<AddressSetting/>}/>
          </Route>
          <Route element={ManagementSystemRoute({loading: loading && !ready, data: data?.PrivateUserData})}>
            <Route path='/Business' element={<BusinessManagementPage User={data?.PrivateUserData}/>}/>
            <Route path='/Business/Orders' element={<OrderManagementPage/>}/>
            <Route path='/Business/ReturnOrExchange' element={<ReturnManagementPage/>}/>
            <Route path='/Business/Analysis' element={<AnalysisMangementPage/>}/>
          </Route>
        </Routes>
    </Router>
  )
}
export default App;
