import { Box, Button, Typography } from '@mui/material'
import ManagementImage from '../../../assets/Management.png'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useTranslation } from 'react-i18next';

const BusinessManagementNavBar = () => {
  const {t} = useTranslation()
  return (
    <>
      <Box position='fixed' sx={{width: '100%',backgroundColor: 'rgb(200,200,150)', height: '60px', left: '0', top: '0', zIndex: 5, minWidth: '1200px', mt: '40px'}}>
        <div style={{position: 'relative' , display: 'flex', flexDirection: 'row', marginLeft: 'auto', width: '70%', marginRight: 'auto'}}>
          <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '80%', mt: '10px'}}>
            <Typography variant='body1' sx={{color: 'rgb(50,50,50)', display: 'flex', flexDirection: 'row', alignItems: 'center',
                                                        ':hover': {opacity: 0.8, cursor: 'pointer'}}} onClick={() => window.location.replace('/Business')}>
              <img src={ManagementImage} alt='logo' style={{maxHeight: '35px' , objectFit: 'contain', marginRight: '10px'}}/>
              {t("Business.MainTitle")}
            </Typography>
          </Box>  
          <div style={{display: 'flex', flexGrow: '1'}}/>
          <Box sx={{mt: '7.5px', display: 'flex', flexDirection: 'row'}}>
            <Button variant='contained' color="secondary" sx={{mr: '15px', whiteSpace: "nowrap"}} onClick={() => window.location.assign('/Business/Orders')}>
              <BookmarkBorderIcon/>
              {t("Business.Orders")}
            </Button>
            <Button variant='contained' color="error" sx={{mr: '15px', whiteSpace: "nowrap"}} onClick={() => window.location.assign('/Business/ReturnOrExchange')}>
              <KeyboardReturnIcon/>
              {t("Business.ExchangeReturn")}
            </Button>
            <Button variant='contained' color="success" sx={{whiteSpace: "nowrap"}} onClick={() => window.location.assign('/Business/Analysis')}>
              <BarChartIcon/>
              {t("Business.Analysis")}
            </Button>
          </Box>
        </div>  
      </Box>
    </>
  )
}

export default BusinessManagementNavBar