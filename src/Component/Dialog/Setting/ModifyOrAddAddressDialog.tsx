import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, TextField } from '@mui/material'
import { useState } from 'react'
import { gql, useMutation} from '@apollo/client';
import { useCookies } from 'react-cookie';
import { Address_Object } from '../../Public_Data/Interfaces';
import { useTranslation } from 'react-i18next';

const CreateOrUpdateAddress = gql`
mutation CreateOrUpdateAddress($access: String!, $ReceiverName: String!, $Address: String!, $City: String!, $Country: String!, $Phone: String!, $id: Int, $Default: Boolean) {
    CreateOrUpdateAddress(access: $access, ReceiverName: $ReceiverName, Address: $Address, City: $City, Country: $Country, Phone: $Phone, id: $id, Default: $Default) {
        status
    }
}
`



const ModifyOrAddAddressDialog = (props: {open: boolean,  CloseDialog: Function, refetch: Function, Data?: Address_Object}) => {
    const [ReceiverName, setReceiverName] = useState<string>(props.Data?.ReceiverName || '')
    const [Address, setAddress] = useState<string>(props.Data?.Address || '')
    const [City, setCity] = useState<string>(props.Data?.City || '')
    const [Country, setCountry] = useState<string>(props.Data?.Country || '')
    const [Phone, setPhone] = useState<string>(props.Data?.Phone || '')
    const [Default, setDefault] = useState<boolean>(props.Data?.isDefault || false)
    const [CreateOrUpdateAddressFunction] = useMutation<{CreateOrUpdateAddress: {status: boolean}}>(CreateOrUpdateAddress)
    const [cookies] = useCookies()
    const {t} = useTranslation()

    function AddAddressFunction(){
        CreateOrUpdateAddressFunction({variables: {access: cookies['access'], id: props.Data?.id, ReceiverName: ReceiverName, 
                                                   Address: Address, City: City, Country: Country, Phone: Phone, Default: Default}}).then((res) =>{
            if (res.data?.CreateOrUpdateAddress.status){
                props.CloseDialog()
                props.refetch()
            }
        })
    }
    
    return (
        <Dialog open={props.open || Boolean(props.Data)} onClose={() => props.CloseDialog()} maxWidth='sm' fullWidth>
            <DialogTitle>{t("Profile.AddAddress")}</DialogTitle>
            <DialogContent >
                <TextField label={t("Profile.ReceiverName")} fullWidth sx={{mb: '10px',mt: '10px'}} value={ReceiverName} onChange={(e) => setReceiverName(e.target.value)}/>
                <TextField label={t("Profile.Address")} fullWidth sx={{mb: '10px'}} value={Address} onChange={(e) => setAddress(e.target.value)}/>
                <TextField label={t("Profile.City")} fullWidth sx={{mb: '10px'}} value={City} onChange={(e) => setCity(e.target.value)}/>
                <TextField label={t("Profile.Country")} fullWidth sx={{mb: '10px'}} value={Country} onChange={(e) => setCountry(e.target.value)}/>
                <TextField label={t("Profile.Phone")} fullWidth sx={{mb: '10px'}} value={Phone} onChange={(e) => setPhone(e.target.value)}/>      
                <FormControlLabel control={<Checkbox value={Default} onChange={(e) => setDefault(e.target.checked)}/>} label={t("Profile.SetDefault")} />
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color='warning' onClick={() => props.CloseDialog()}>{t("Profile.Cancel")}</Button>
                <Button variant='contained' onClick={() => {AddAddressFunction()}}>{t("Profile.Add")}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ModifyOrAddAddressDialog