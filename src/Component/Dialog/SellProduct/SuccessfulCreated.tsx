import { Grid, FormControl, Typography, ListItem, ListItemAvatar, Avatar, ListItemText, TextField, Button } from "@mui/material"
import ScreenSearchDesktopOutlinedIcon from '@mui/icons-material/ScreenSearchDesktopOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import { useTranslation } from "react-i18next";


const SuccessfulCreated = (props: {SuccessResponse: {FirstImage: string, Product_Name: string}|undefined, setOpenFunction: Function}) => {
  const {t} = useTranslation()
    return(
      <Grid item sm={12} display={props.SuccessResponse ? 'flex' : 'none'}>
        <FormControl fullWidth sx={{mt: '20px'}}>
          <Typography variant='h5' display='flex' sx={{justifyContent: 'center'}}>{props.SuccessResponse? t("SellProduct.SuccessStatement") : t("SellProduct.FailureStatement1")}</Typography>
          <ListItem sx={{'media': {height: '50px'}}}>
            <ListItemAvatar>
              <Avatar>
                <ScreenSearchDesktopOutlinedIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={'Profile Page Image'}/>
            <img src={props.SuccessResponse? props.SuccessResponse['FirstImage']: ''} alt={'Not Found'} style={{maxHeight: '50px'}}/>
          </ListItem>
          <TextField label={t("SellProduct.ProductName")} color="secondary" InputProps={{readOnly: true,}} focused value={props.SuccessResponse? props.SuccessResponse["Product_Name"]: t("SellProduct.FailureStatement2")} sx={{mt: '15px'}} />
          <Button onClick={()=> props.setOpenFunction(false)}>
            <DoneOutlinedIcon/>
          </Button>
        </FormControl>
      </Grid>
    )
  }

export default SuccessfulCreated