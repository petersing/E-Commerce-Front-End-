import { Box, Button, Divider, Grid, Paper, Typography } from '@mui/material'
import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import ModifyOrAddAddressDialog from '../../Dialog/Setting/ModifyOrAddAddressDialog';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useCookies } from 'react-cookie';
import { Address_Object } from '../../Public_Data/Interfaces';
import { useTranslation } from 'react-i18next';

const UserAddress = gql`
query PrivateUserData {
    PrivateUserData {
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
const ModifyAddress = gql`
mutation CreateOrUpdateAddress($id: Int!, $Default: Boolean, $Delete: Boolean) {
    CreateOrUpdateAddress(id: $id, Default: $Default, Delete: $Delete) {
        status
    }
}
`


const AddressSetting = () => {
    const [AddAddress, setAddAddress] = useState<boolean>(false)
    const [cookies] = useCookies()
    const {data, refetch} = useQuery<{PrivateUserData: {ShoppingAddress: Address_Object[]}}>(UserAddress, {fetchPolicy: 'network-only'})
    const [ModifyAddressFunction] = useMutation<{CreateOrUpdateAddress: {status: boolean}}>(ModifyAddress)
    const [Select, setSelect] = useState<number>(0)
    const [EditAddress, setEditAddress] = useState<Address_Object|undefined>()
    const {t} = useTranslation()

    function SetDefaultAddressFunction(id: number){
        ModifyAddressFunction({variables: {access: cookies['access'], id: id, Default: true}}).then((res) => {
            if (res.data?.CreateOrUpdateAddress.status){
                setSelect(0)
                refetch()   
            }
        })
    }
    function RemoveAddress(id: number){
        ModifyAddressFunction({variables: {access: cookies['access'], id: id, Delete: true}}).then((res) => {
            if (res.data?.CreateOrUpdateAddress.status){
                setSelect(0)
                refetch()   
            }
        })
    }

    function CloseDialog(){
        setAddAddress(false)
        setEditAddress(undefined)
    }

    return (
        <>
            <div style={{marginTop: '120px', width: '50%', marginLeft: 'auto', marginRight: 'auto', position: 'relative'}}>
                <Typography variant='h6' >{t("AccountInformation.Address")}</Typography>
                <Grid container spacing={2} sx={{mt: '20px'}}>
                    {data?.PrivateUserData.ShoppingAddress.map((Address, position) => {
                        return(
                            <Grid item sm={3} key={position}>
                                <Paper sx={{padding: '7.5%', height: '150px', position: 'relative', backgroundColor: (position === Select ? 'rgb(171, 210, 255)': 'rgb(255,255,255)'), 
                                            ":hover": {cursor: 'pointer', backgroundColor: 'rgb(220,220,220)'}}} elevation={3} onClick={() => setSelect(position)}>
                                    {Address.isDefault && 
                                        <>
                                            <Typography variant='caption' fontWeight='bold'>{t("AccountInformation.Default")}</Typography>
                                            <Divider sx={{mb: '5px'}}/>
                                        </>    
                                    }
                                    <Typography variant='body2' fontWeight='bold'>{Address.ReceiverName}</Typography>
                                    <Typography variant='body2'>{`${Address.Address}, ${Address.City}, ${Address.Country}`}</Typography>
                                    <Typography variant='body2'>{Address.Phone}</Typography>
                                    <div style={{position: 'absolute', right: '7.5px', bottom: '7.5px'}}>
                                        <Button size='small' onClick={() => {setEditAddress(Address)}}>{t("AccountInformation.Edit")}</Button>
                                        <Button size='small' onClick={() => {RemoveAddress(Address.id)}}>{t("AccountInformation.Remove")}</Button>
                                    </div>
                                </Paper>
                            </Grid>
                        )
                    })}
                    <Grid item sm={3}>
                        <Paper onClick={() => setAddAddress(true)} 
                               sx={{padding: '7.5%', height: '150px', position: 'relative', backgroundColor: 'rgb(210,210,212)', 
                                    display: 'flex', justifyContent: 'center', alignItems: 'center', 
                                    ":hover": {cursor: 'pointer', backgroundColor: 'rgb(230,230,230)'},
                                    }}>
                            <AddIcon sx={{fontSize: '50px', color: 'rgb(150,150,150)'}}/>
                        </Paper>
                    </Grid>
                </Grid>
                <div style={{marginTop: '10px', display: 'flex', justifyContent: 'flex-end'}}>
                    <Button variant='contained' onClick={() => {data && SetDefaultAddressFunction(data?.PrivateUserData.ShoppingAddress[Select].id)}}>{t("AccountInformation.SetDefault")}</Button>                  
                </div>    
            </div>
            {(AddAddress || Boolean(EditAddress))  && <ModifyOrAddAddressDialog open={AddAddress}  CloseDialog={CloseDialog} refetch={refetch} Data={EditAddress}/>}
        </>
    )
}

export default AddressSetting