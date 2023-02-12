import { useMutation, gql } from '@apollo/client';
import {useState} from 'react'
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const AddTransportCode = gql`
mutation AddTransportCodeFunction($TransportCode: String!, $OrderID: Int!) {
    AddTransportCodeFunction(TransportCode: $TransportCode, OrderID: $OrderID){
        status
    }
}
`

const AddTransportCodeDialog = (props: {ItemKey: string, onClose: Function, Refresh: Function}) =>{
    const [AddTransportCodeFunction] = useMutation<{AddTransportCodeFunction: {status: boolean}}>(AddTransportCode);
    const [TransportCode, setTransportCode] = useState<string>('');
    const {t} = useTranslation()

    function AddTransport(){
        AddTransportCodeFunction({variables: {OrderID: parseInt(props.ItemKey), TransportCode: TransportCode}}).then((res) =>{
            if (res.data?.AddTransportCodeFunction.status){
                props.onClose(null)
                setTransportCode('')
                props.Refresh()
            }
        })
    }

    return(
        <Dialog open={Boolean(props.ItemKey)} onClose={() => props.onClose(null)}>
            <DialogTitle>{t("Order.AddTransportCode")}</DialogTitle>
            <DialogContent>
                <TextField label={t("Order.ItemID")} variant='filled' fullWidth value={props.ItemKey} disabled/>
                <TextField label={t("Order.TransportCode")} variant="outlined" fullWidth={true} sx={{mt: '10px'}} onChange={(e) => setTransportCode(e.target.value)} value={TransportCode}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => AddTransport()} variant='contained'>{t("Order.Add")}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddTransportCodeDialog