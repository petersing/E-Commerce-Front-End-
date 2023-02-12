import { Box, Typography, TextField, Button, Grid, Paper, Divider } from '@mui/material'
import { useEffect, useState } from 'react'
import { gql, useQuery} from '@apollo/client';
import { useCookies } from "react-cookie";
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';

const UserAddress = gql`
query PrivateUserData {
    PrivateUserData {
        email,
        ShoppingAddress{
            id,
            Address,
            Phone,
            City,
            isDefault,
            Country,
            ReceiverName,
        }  
    }
}
`

const AddAddress = (props:{setClientInformation: Function, setActiveStep: Function, setOpen: Function}) =>{

  const [Name, setName] = useState<string>('')
  const [Address, setAddress] = useState<string>('')
  const [City, setCity] = useState<string>('')
  const [Country, setCountry] = useState<string>('')
  const [Email, setEmail] = useState<string>('')
  const [Phone, setPhone] = useState<string>('')
  const [Finish, setFinish] = useState<boolean>(false)
  const {t} = useTranslation()

  function Submit(){
    if (Finish){
      props.setClientInformation({Name: Name, Email: Email, Phone: Phone, Address: `${Address}, ${City}, ${Country}`})
      props.setActiveStep(2)
    }
  }
  function UseAddress(){
    props.setClientInformation()
    props.setOpen(false)
  }

  useEffect(() =>{
    if (Name && Address && City && Country && Email && Phone){
      setFinish(true)
    }
  },[Name, Address, City, Country, Email, Phone])

  return(
      <Box sx={{display: 'flex', flexDirection: 'column', width: '70%', ml: 'auto', mr: 'auto'}}>
        <Typography fontWeight='bold' variant='h6' sx={{mb: '10px'}}>{t("Purchase.ReceiveAddress")}</Typography>

        <Typography sx={{mb: '10px'}}>{t("Purchase.PersonalInformation")}</Typography>
        <TextField size='small' label={t("Purchase.FullName")} onChange={(e) => setName(e.target.value)} value={Name} id='Client_Name' type='text' error={Name ? false: true} helperText={Name? '': 'Input Name'}/>
        <TextField size='small'  label={t("Purchase.EmailAddress")} onChange={(e) => setEmail(e.target.value)} value={Email} sx={{mt: '20px'}} id='Client_Email' type='email' error={Email ? false: true} helperText={Email? '': 'Input Email'}/>
        <TextField size='small'  label={t("Purchase.PhoneNumber")} onChange={(e) => setPhone(e.target.value)} value={Phone} sx={{mt: '20px'}} id='Client_Phone' type='text' error={Phone ? false: true} helperText={Phone? '': 'Input Phone'}/>

        <Typography sx={{mb: '10px', mt: '10px'}}>{t("Purchase.Address")}</Typography>
        <TextField size='small'  label="Address" onChange={(e) => setAddress(e.target.value)} value={Address} multiline maxRows={3} error={Address ? false: true} helperText={Address? '': 'Input Address'}/>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '20px'}}>
          <TextField size='small'  label='City' value={City} onChange={(e) => setCity(e.target.value)}  sx={{width: '45%'}} error={City ? false: true} helperText={City? '': 'Input City'}/>
          <TextField size='small'  label='Country' value={Country} onChange={(e) => setCountry(e.target.value)}  sx={{width: '45%'}} error={Country ? false: true} helperText={Country? '': 'Input Country'}/>
        </div>
        <Typography variant="caption">{t("Purchase.AddressStatement")}</Typography>

        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '15px'}}>
          <Button variant='contained' sx={{minWidth: '10%'}} onClick={() => UseAddress()}>{t("Purchase.UseAddress")}</Button>
          <Button variant='contained' sx={{minWidth: '10%'}}  onClick={() => Submit()} disabled={Finish? false: true}>{t("Purchase.Submit")}</Button>
        </div>
        
      </Box>
  )
}

const ReceiverAddress = (props: {setClientInformation: Function, setActiveStep: Function}) =>{
    const [CreateNew, setCreateNew] = useState<boolean>(false)
    const {data} = useQuery<{PrivateUserData: {email: string, ShoppingAddress: {id: number, Address: string, Phone: string, City: string, isDefault: boolean, Country: string, ReceiverName: string}[]}}>(UserAddress)
    const {t} = useTranslation()

    function Submit(Select: number){
      const Address = data?.PrivateUserData.ShoppingAddress[Select]
      const email = data?.PrivateUserData.email
      props.setClientInformation({Name: Address?.ReceiverName, Email: email, Phone: Address?.Phone, Address: `${Address?.Address}, ${Address?.City}, ${Address?.Country}`})
      props.setActiveStep(2)

    }
    function Previous(){
      props.setClientInformation()
      props.setActiveStep(0)
    }

    return (
      <>
        <Grid container spacing={2} display={CreateNew ? 'none': 'flex'}>
          {data?.PrivateUserData.ShoppingAddress.map((Address, position) => {
              return(
                  <Grid item sm={3} key={position}>
                      <Paper sx={{padding: '7.5%', height: '150px', position: 'relative', ":hover": {cursor: 'pointer', backgroundColor: 'rgb(220,220,220)'}}} elevation={3} onClick={() => Submit(position)}>
                          {Address.isDefault && 
                              <>
                                  <Typography variant='caption' fontWeight='bold'>{t("Purchase.Default")}</Typography>
                                  <Divider sx={{mb: '5px'}}/>
                              </>    
                          }
                          <Typography variant='body2' fontWeight='bold'>{Address.ReceiverName}</Typography>
                          <Typography variant='body2'>{`${Address.Address}, ${Address.City}, ${Address.Country}`}</Typography>
                          <Typography variant='body2'>{Address.Phone}</Typography>
                      </Paper>
                  </Grid>
              )
          })}
          <Grid item sm={3}>
              <Paper onClick={() => setCreateNew(true)} 
                      sx={{padding: '7.5%', height: '150px', position: 'relative', backgroundColor: 'rgb(210,210,212)', 
                            display: 'flex', justifyContent: 'center', alignItems: 'center', 
                            ":hover": {cursor: 'pointer', backgroundColor: 'rgb(230,230,230)'},
                            }}>
                  <AddIcon sx={{fontSize: '50px', color: 'rgb(150,150,150)'}}/>
              </Paper>
          </Grid>
        </Grid>
        <div style={{display: (CreateNew ? 'none': 'flex'), flexDirection: 'row', justifyContent: 'space-between', marginTop: '15px'}}>
            <Button variant='contained' sx={{minWidth: '10%'}} onClick={() => Previous()}>{t("Purchase.Previous")}</Button>
            <Button variant='contained' sx={{minWidth: '10%'}}  onClick={() => Submit(0)} disabled={data && data.PrivateUserData.ShoppingAddress.length > 0? false: true}>{t("Purchase.UseDefault")}</Button>
        </div>
        {CreateNew && <AddAddress setClientInformation={props.setClientInformation} setActiveStep={props.setActiveStep} setOpen={() => setCreateNew(false)}/>}
      </>
  
    )
  
}

export default ReceiverAddress