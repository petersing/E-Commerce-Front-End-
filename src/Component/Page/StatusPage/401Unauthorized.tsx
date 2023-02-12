import { Box, Typography } from "@mui/material"
import UnauthorizedImage from '../../../assets/401.png'

const UnauthorizedPage = () => {
    return (
        <>
  
          <Box sx={{display: 'flex', flexDirection:'column', mt: '150px', height: '550px', border: 'solid 2px rgb(200,200,200)', borderRadius: '15px', width: '70%', ml: 'auto', mr: 'auto', justifyContent: 'center', alignItems:'center'}}>
              <img src={UnauthorizedImage} alt="Not Found" width='220px'  />
              <Typography variant='h5' sx={{mt: '20px'}} >You have not permission to access this page</Typography>
          </Box>    
        </>
    )
}

export default UnauthorizedPage