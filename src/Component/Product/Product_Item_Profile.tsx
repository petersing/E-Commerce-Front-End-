import { Typography, Box, Grid, Avatar, Card, CardContent, CardMedia} from "@mui/material"
import NotFound from '../../assets/NotFound.png'
import { Product_Display_Object } from "../Public_Data/Interfaces"

const ProductItemProfile = (props: Product_Display_Object) => {
  return (
    <Grid item sm={3}>
        <Card sx={{ maxWidth: '380px', height: '380px',":hover": {'backgroundColor': 'rgb(230,230,230)', 'cursor': 'pointer'}}} onClick={() => window.location.assign(`/Product/${props.id}`)}>
            <CardMedia component="img" height="200px" image={props.FirstImage ? props.FirstImage + '?Width=200': NotFound} alt="green iguana"/>
            <CardContent>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Typography gutterBottom variant="h5" noWrap>{props.ProductName}</Typography>
                    <Typography gutterBottom variant="h5">{'$' + props.MinPrice}</Typography>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between', flexFlow: 'nowrap'}}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Avatar sx={{mr: '10px'}}>{props.Author}</Avatar>
                        <Typography variant="body2" color="text.secondary">{props.Author}</Typography>
                    </div>
                    <Typography variant="body2" color="text.secondary">{props.DateCreate}</Typography>
                </Box>
            </CardContent>
        </Card>
    </Grid>
  )
}

export default ProductItemProfile