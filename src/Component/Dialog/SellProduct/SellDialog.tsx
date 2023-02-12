import { useReducer, useState } from 'react';
import { Dialog, DialogContent, DialogTitle,Button, Typography, Grid, Box, Alert} from '@mui/material';
import SuccessfulCreated from './SuccessfulCreated';
import ProductImageDropZone from './ProductImageDropZone';
import { Management_Product_Object, User_Object } from '../../Public_Data/Interfaces';
import ProductInformation from './ProductInformation';
import { useTranslation } from 'react-i18next';

const SellDialog = (props: {Open: boolean, setOpenFunction: React.Dispatch<React.SetStateAction<boolean>>, Product?: Management_Product_Object, UserData: User_Object}) => {
  const [SuccessResponse, setSuccessResponse] = useState<{FirstImage: string, Product_Name: string}>()

  ///Force Update
  const [, forceUpdate] = useReducer(x => x + 1, 0)

  ///Images Input
  const [ImageList] = useState<File[]>([])
  const [ItemRender] = useState<Array<string>>([])

  const {t} = useTranslation()
  
  return (
      <Dialog open={props.Open} onClose={() => props.setOpenFunction(false)} fullWidth maxWidth={'md'} sx={{minWidth: '1200px'}}>
        <DialogTitle sx={{display: 'flex', justifyContent: 'center'}}>{t("SellProduct.Title")}</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{mb: '10px'}} 
                 action={<Button color="inherit" size="small"><strong>{t("SellProduct.UpdateHere")}</strong></Button>}>
                {`${t("SellProduct.ProductRemindStatement1")} ${props.UserData.RemainPublish} ${t("SellProduct.ProductRemindStatement2")}`}
          </Alert>
          <Grid container columns={12}>
            <ProductImageDropZone ImageList={ImageList} ItemRender={ItemRender} SuccessResponse={Boolean(SuccessResponse)} forceUpdate={forceUpdate}/>
            <ProductInformation setSuccessResponse={setSuccessResponse} SuccessResponse={SuccessResponse} ImageList={ImageList} ItemRender={ItemRender}/>       
            {SuccessResponse && <SuccessfulCreated SuccessResponse={SuccessResponse} setOpenFunction={props.setOpenFunction}/>}
          </Grid>
        </DialogContent>
      </Dialog>
  )
}

export default SellDialog