import { Card, CardMedia, CardContent, Typography, Link, Rating, Avatar, Box } from '@mui/material'
import NotFound from '../../assets/NotFound.png'
import { Product_Display_Object } from '../Public_Data/Interfaces'
import { useTranslation } from 'react-i18next'

const ProductItemRow = (props: Product_Display_Object) => {
    const {t} = useTranslation()
    
    return (
        <Card sx={{ display: 'flex' , mb: '10px', ':hover': {opacity: 0.5, cursor: 'pointer'}, height: '200px'}} onClick={() => window.location.assign(`/Product/${props.id}`)}>
            <CardMedia component="img" sx={{ width: '200px' , objectFit: 'contain', backgroundColor: 'rgb(240,240,240)'}} image={props.FirstImage? props.FirstImage: NotFound} alt="Live from space album cover"/>   
            <CardContent sx={{width: "100%"}}>      
                <div style={{display: 'flex', flexDirection: 'row', alignItems: "center", margin: "8px 3px"}}>
                    <Typography gutterBottom variant="h5">{props.ProductName}</Typography>
                    <Box sx={{flexGrow: 1}}/>
                    <Avatar alt="Remy Sharp" src={props.AuthorIcon + '?Width=35'} sx={{width: 36, height: 36, ml: '5px'}}/>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Typography variant="body2" color="rgb(21, 68, 115)" component="p" sx={{ml: '5px'}} fontSize={10}>{props.Author}</Typography>
                        <Typography variant="body2" color="rgb(34, 21, 115)" component="p" sx={{ml: '5px'}} fontSize={10}>{`${t("Product.Postedon")} ${props.DateCreate}`}</Typography>
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <div style={{display: 'flex', alignItems: 'flex-start'}}>
                        <Typography color="rgb(227, 192, 14)" fontSize={13}>HK$</Typography>
                    </div>
                    <Typography fontWeight='bold' fontSize={20} color="rgb(227, 192, 14)">{props.MinPrice}</Typography>
                    <div style={{display: 'flex', alignItems: 'center', marginLeft: '5px'}}>
                        <Typography variant="body1" color="rgb(227, 192, 14)"fontSize={15}>{`(HKD$${props.MinPrice}${t("Product.ItemUnit")})`}</Typography>
                    </div>  
                </div>
                <div style={{display: 'flex'}}>
                    <Rating value={props.Score.TotalScore} size="small" readOnly/>
                    <Typography variant="body2" color="rgb(116, 109, 252)" component="p" sx={{ml: '5px'}}>{props.Score.TotalComment} {t('Product.comments')}</Typography>
                </div>
                <div style={{display: 'flex', justifyContent: 'left', marginTop: "10px"}}>
                    <Typography variant="body2" color="rgb(80, 199, 141)" fontSize={13}>{`${t("Product.AlreadySellingRecord")}`.replace("$SellingRecord", props.SellingRecord.toString())}</Typography>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProductItemRow