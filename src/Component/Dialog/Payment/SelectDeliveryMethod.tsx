import { Grid, Typography } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import { useTranslation } from 'react-i18next';

const SelectDeliveryMethod = (props: {setActiveStep: Function, setDeliveryMethod: Function}) =>{
  const {t} = useTranslation()
    return(
      <>
        <Grid container sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', border: 'solid 1px rgb(210, 210,210)', 
                             borderRadius: '10px', ":hover": {boxShadow: '0px 0px 3px rgb(200,200,200)', cursor: 'pointer' , backgroundColor: 'rgb(230,230,230)'}, 
                             backgroundColor: 'white'}} onClick={() => {props.setActiveStep(1); props.setDeliveryMethod("Free")}}>
          <Grid item sm={1} sx={{display: 'flex', justifyContent: 'flex-end'}}>
            <LocalShippingOutlinedIcon />
          </Grid>
          <Grid item sm={11}>
            <Typography variant="body1" sx={{ml: '30px', mt: '15px'}} fontWeight='bold'>{t("Purchase.FreeStandardDelivery")}</Typography>
            <Typography variant="body2" sx={{ml: '30px', mb: '15px'}} >{t("Purchase.FreeStandardDeliveryStatement")}</Typography>
          </Grid>
        </Grid>
        <Grid container sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', border: 'solid 1px rgb(210, 210,210)', 
                            borderRadius: '10px', ":hover": {boxShadow: '0px 0px 3px rgb(200,200,200)', cursor: 'pointer' , backgroundColor: 'rgb(230,230,230)'}, 
                            backgroundColor: 'white', mt: '15px'}} onClick={() => {props.setActiveStep(1); props.setDeliveryMethod("Express")}}>
          <Grid item sm={1} sx={{display: 'flex', justifyContent: 'flex-end'}}>
            <DirectionsCarFilledIcon />
          </Grid>
          <Grid item sm={11}>
            <Typography variant="body1" sx={{ml: '30px', mt: '15px'}} fontWeight='bold'>{t("Purchase.ExpressStandardDelivery")}</Typography>
            <Typography variant="body2" sx={{ml: '30px', mb: '15px'}} >{t("Purchase.ExpressStandardDeliveryStatement")}</Typography>
          </Grid>
        </Grid>
        <Grid container sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', border: 'solid 1px rgb(210, 210,210)', 
                            borderRadius: '10px', ":hover": {boxShadow: '0px 0px 3px rgb(200,200,200)', cursor: 'pointer' , backgroundColor: 'rgb(230,230,230)'}, 
                            backgroundColor: 'white', mt: '15px'}} onClick={() => {props.setActiveStep(1); props.setDeliveryMethod("Speed")}}>
          <Grid item sm={1} sx={{display: 'flex', justifyContent: 'flex-end'}}>
            <AirplanemodeActiveIcon />
          </Grid>
          <Grid item sm={11}>
            <Typography variant="body1" sx={{ml: '30px', mt: '15px'}} fontWeight='bold'>{t("Purchase.SpeedStandardDelivery")}</Typography>
            <Typography variant="body2" sx={{ml: '30px', mb: '15px'}} >{t("Purchase.SpeedStandardDeliveryStatement")}</Typography>
          </Grid>
        </Grid>
      </>
    )
  }

export default SelectDeliveryMethod
