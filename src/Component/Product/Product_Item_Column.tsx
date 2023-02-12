import { Card, CardContent, CardMedia, Typography, Link, Rating, Avatar, Box } from "@mui/material"
import NotFound from '../../assets/NotFound.png'
import { Product_Display_Object } from "../Public_Data/Interfaces"
import { useTranslation } from 'react-i18next';


const ProductItemColumn = (props: Product_Display_Object) => {
  const { t } = useTranslation();
  return (
    <Card sx={{ maxWidth: '350px', height: '500px', ':hover': {opacity: 0.5, cursor: 'pointer'}}} onClick={() => window.location.assign(`/Product/${props.id}`)}>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: "center", margin: "8px 3px"}}>
            <Avatar alt="Remy Sharp" src={props.AuthorIcon + '?Width=35'} sx={{width: 36, height: 36, ml: '5px'}}/>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: "left"}}>
              <Typography variant="body2" color="rgb(21, 68, 115)" component="p" sx={{ml: '5px'}} fontSize={10}>{props.Author}</Typography>
              <Typography variant="body2" color="rgb(34, 21, 115)" component="p" sx={{ml: '5px'}} fontSize={10}>{`${t("Product.Postedon")} ${props.DateCreate}`}</Typography>
            </div>
        </div>
        <CardMedia component="img" image={props.Loaded ? props.FirstImage: ''} alt="green iguana" sx={{height: '200px', objectFit: 'contain', backgroundColor: 'rgb(200,200,200)'}}/>
        <CardContent>
            <Typography gutterBottom variant="h6" style={{ wordWrap: "break-word" }} >{`${props.ProductName.slice(0, 15)}${props.ProductName.length > 15 ? "...": ""}`}</Typography>
            <div style={{display: 'flex', flexDirection: 'row', marginTop: "5px"}}>
                <div style={{display: 'flex', alignItems: 'flex-start'}}>
                    <Typography fontSize={12}>HK$</Typography>
                </div>
                <Typography variant="body1" fontWeight='bold' fontSize={20} >{props.MinPrice}</Typography>
                <div style={{display: 'flex', alignItems: 'center', marginLeft: '5px'}}>
                  <Typography variant="body1" color="rgb(227, 192, 14)"fontSize={12}>{"HKD$" + props.MinPrice + t("Product.ItemUnit")}</Typography>
                </div>  
            </div>
            <div style={{display: 'flex'}}>
              <Rating defaultValue={props.Score.TotalScore} size="small" readOnly/>
              <Typography variant="body2" color="rgb(116, 109, 252)" component="p" sx={{ml: '5px'}}>{props.Score.TotalComment} {t("Product.comments")}</Typography>
            </div>
            <div style={{display: 'flex', justifyContent: 'left', marginTop: "10px"}}>
              <Typography variant="body2" color="rgb(80, 199, 141)" fontSize={13}>{`${t("Product.AlreadySellingRecord")}`.replace("$SellingRecord", props.SellingRecord.toString())}</Typography>
            </div>
                             
            
      </CardContent>

    </Card>
  )
}

export default ProductItemColumn