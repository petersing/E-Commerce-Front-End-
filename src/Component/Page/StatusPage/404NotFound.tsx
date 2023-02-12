import { Box, Typography } from "@mui/material"
import NotFound from '../../../assets/NotFound.png'

const NotFoundPage = (props: {ID?: string| null}) => {
  return (
      <>

        <Box sx={{display: 'flex', flexDirection:'column', mt: '150px', height: '550px', border: 'solid 2px rgb(200,200,200)', borderRadius: '15px', width: '70%', ml: 'auto', mr: 'auto', justifyContent: 'center', alignItems:'center'}}>
            <img src={NotFound} alt="Not Found" width='220px'  />
            <Typography variant='h5' sx={{mt: '20px'}} >There were no matching for your search.</Typography>
        </Box>    
      </>
  )
}

export default NotFoundPage