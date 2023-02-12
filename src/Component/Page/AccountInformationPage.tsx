import { Box, Drawer, Grid, List, ListItem, ListItemButton, ListItemText, Paper, Typography, SvgIcon, Avatar } from '@mui/material'
import InventoryIcon from '@mui/icons-material/Inventory';
import HomeIcon from '@mui/icons-material/Home';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

const AccountInformationPage = () => {
  const {t} = useTranslation()
  
  const ItemList = [{Name: t("AccountInformation.Order"), content: t("AccountInformation.OrderStatement"), Icon: InventoryIcon, link: '/Order'}, 
                  {Name: t("AccountInformation.Address"), content: t("AccountInformation.AddressStatement"), Icon: HomeIcon, link: '/Address'}, 
                  {Name: t("AccountInformation.LoginAndSecurity"), content: t("AccountInformation.LoginAndSecurityStatement"), Icon: ContactMailIcon, link: '/AccountSetting'},
                  {Name: t("AccountInformation.SellerCenter"), content:  t("AccountInformation.SellerCenterStatement"), Icon: StorefrontIcon, link: '/SellerCenter'}]

  return (
    <div style={{marginTop: '120px', width: '50%', marginLeft: 'auto', marginRight: 'auto', minWidth: '700px'}}>
      <Typography variant='h6'>{t("AccountInformation.AccountInformation")}</Typography>
      <Grid container sx={{mt: '10px'}} spacing={2}>
        {ItemList.map((item, index) => {
          return(
            <Grid key={index} item xs={4}>
              <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', border: '1px solid rgb(210,210,210)', minHeight: '80px',
                        borderRadius: '8px', padding: '10px', ':hover': {cursor: 'pointer', backgroundColor: 'rgb(210,210,210)'}}} onClick={() => {item.link && window.location.assign(item.link)}}>
                <Avatar sx={{ bgcolor: 'rgb(200,180,200)' }}>
                  <SvgIcon key={item.Name + 'image'} component={item.Icon}/>
                </Avatar>      
                <ListItemText sx={{ml: '20px'}} primary={item.Name} secondary={item.content}/>
              </Box>
            </Grid>
          )
        })}
      </Grid>
    </div>
  )
}

export default AccountInformationPage