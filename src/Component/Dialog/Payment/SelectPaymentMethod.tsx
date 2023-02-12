import { Box, Grid, Typography } from "@mui/material";
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined';
import Visa from '../../../assets/Visa.png';
import Master from '../../../assets/master.png';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import { useTranslation } from "react-i18next";


const SelectPaymentMethod = (props: {setPaymentMethod: Function , setActiveStep: Function}) =>{
  const {t} = useTranslation()
    return(
      <>
        <Grid container sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', border: 'solid 1px rgb(210, 210,210)', 
                             borderRadius: '10px', ":hover": {boxShadow: '0px 0px 3px rgb(200,200,200)', cursor: 'pointer' , backgroundColor: 'rgb(230,230,230)'}, 
                             backgroundColor: 'white'}} onClick={() => {props.setPaymentMethod("CreditCard"); props.setActiveStep(3)}}>
          <Grid item sm={1} sx={{display: 'flex', justifyContent: 'flex-end'}}>
            <CreditCardOutlinedIcon />
          </Grid>
          <Grid item sm={11}>
            <Typography variant="body1" sx={{ml: '30px', mt: '15px'}} fontWeight='bold'>{t("Purchase.CreditCard")}</Typography>
            <Box sx={{ml: '30px', mb: '15px', display: 'flex', alignItems: 'center'}} >
              <img src={Visa} alt='visa' style={{height: '30px', objectFit: 'contain', marginRight: '10px'}}/>
              <img src={Master} alt='master' style={{height: '30px', objectFit: 'contain'}}/>
            </Box>
          </Grid>
        </Grid>
        <Grid container sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', border: 'solid 1px rgb(210, 210,210)', 
                             borderRadius: '10px', ":hover": {boxShadow: '0px 0px 3px rgb(200,200,200)', cursor: 'pointer' , backgroundColor: 'rgb(230,230,230)'}, 
                             backgroundColor: 'white', mt: '15px'}} onClick={() => {props.setActiveStep(1)}}>
          <Grid item sm={1} sx={{display: 'flex', justifyContent: 'flex-end'}}>
            <UndoOutlinedIcon />
          </Grid>
          <Grid item sm={11}>
            <Typography variant="body1" sx={{ml: '30px', mt: '15px'}} fontWeight='bold'>{t("Purchase.Previous")}</Typography>
            <Typography variant="body2" sx={{ml: '30px', mb: '15px'}} >{t("Purchase.OverwritePersonalData")}</Typography>
          </Grid>
        </Grid>
      </>
    )
  
  }

export default SelectPaymentMethod