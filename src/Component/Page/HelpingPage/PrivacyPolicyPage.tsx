import { Box, Typography } from '@mui/material'
import Logo from '../../../assets/commerce.png'


const PrivacyPolicyPage = () => {
  return (
    <div style={{width: '60%', marginLeft: 'auto', marginRight: 'auto',marginTop: '120px'}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <img src={Logo} alt='logo' style={{maxHeight: '30px' , objectFit: 'contain'}}/> 
            <Typography variant='h6' sx={{ml: '15px'}}>E-Commerce Help Center</Typography>     
        </div>
        <Typography variant='h4' sx={{mt: '50px', mb: '20px'}}>Privacy Policy</Typography>
        <Typography variant='body1' sx={{mb: '20px'}}>
            <strong>1. Scope of the Privacy Policy</strong>
            <br/>
            The Privacy Policy covers how E-commerce-Tech.com (the "Site") handles personal data collected or received on this website, 
            including information about users' browsing of this website and the use of this website's services. 
            Personal data refers to data that can identify you (such as your name, email address or telephone number), 
            and generally non-public data. The Privacy Policy does not apply to the policies of companies not owned or controlled by this website, 
            nor to persons not employed or managed by this website.
        </Typography>
        <Typography variant='body1' sx={{mb: '20px'}}>
            <strong>2. Data collection and use</strong>
            <br/>
            When you register on this website, we will ask for your name, email address, date of birth and gender, 
            etc. When it comes to certain services on this website, we may ask for your other personal information, 
            such as phone number and identification number etc. After you successfully register on this website and log in to use our services, 
            we will know your identity. This website will use the information for the following general purposes: to provide you with the products or services you have requested, 
            to improve our services and to contact you, to provide more suitable web content or advertisements for you.
        </Typography>
        <Typography variant='body1' sx={{mb: '20px'}}>
            <strong>3. Information confidentiality</strong>
            <br/>
            All personal data held by this website, unless required by law, are kept confidential and only for internal use of this website.
            <br/>
            Except for personal data, any posts, comments or other information made by registered members and visitors on this page are considered non-confidential. 
            This website reserves the right to use, reproduce, publish, publish, broadcast and/or post non-confidential material anywhere.
        </Typography>
        <Typography variant='body1' sx={{mb: '20px'}}>
            <strong>4. Amendments to the Privacy Ordinance Statement</strong>
            <br/>
            This website will revise the Privacy Policy Statement from time to time, please read this policy regularly to ensure that you are aware of the latest content
        </Typography>    
        <Typography variant='body1' sx={{mb: '20px'}}>
            <strong>5. Inquiries about Privacy Policy</strong>
            <br/>
            If you have any questions or comments about our Privacy Statement, please contact us at admin@E-commerce-Tech.com.
        </Typography>
    </div>
  )
}

export default PrivacyPolicyPage