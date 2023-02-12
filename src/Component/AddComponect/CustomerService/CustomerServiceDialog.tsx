import { Box, IconButton , Typography, Button} from '@mui/material'
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PermPhoneMsgIcon from '@mui/icons-material/PermPhoneMsg';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CloseIcon from '@mui/icons-material/Close';

const CustomerServiceDialog = (props: {Open: boolean, setOpen: Function}) => {
    return (
        <>
            <Box sx={{position: 'fixed', width: '210px', bottom: '30%', right: '1%', backgroundColor: 'rgb(250,250,250)',
                    border: 'solid 1px rgb(220,220,220)', borderRadius: '5px', display: props.Open ? 'flex': 'none', alignItems: 'center', flexDirection: 'column', opacity: '0.8'}}>
                <IconButton sx={{position: 'absolute', right: '0%'}} onClick={() => props.setOpen(false)}>
                    <CloseIcon/>
                </IconButton>
                <Typography variant='body2' sx={{marginTop: '10px', display: 'flex', alignItems:'center', justifyContent: 'center'}}>
                    <SupportAgentIcon/>
                    Customer Service
                </Typography>
                <Button startIcon={<QuestionMarkIcon/>} variant='contained' sx={{margin: '5px'}} size='small' style={{fontSize: '10px'}} color='warning'>Common Problems</Button>
                <Button startIcon={<ReportProblemIcon/>} variant='contained' sx={{margin: '5px'}} size='small' style={{fontSize: '10px'}} color='error' >Complaints Seller</Button>
                <Button startIcon={<PermPhoneMsgIcon/>} variant='contained' sx={{margin: '5px', mb: '10px'}} size='small' style={{fontSize: '10px'}}>Contact Our Service</Button>
            </Box>
        </>
    )
}

export default CustomerServiceDialog