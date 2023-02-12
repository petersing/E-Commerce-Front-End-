import { useMutation, gql } from '@apollo/client';
import {useState} from 'react'
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { useCookies } from 'react-cookie';

const AddTransportCode = gql`
mutation AddReturnTransportCode($TransportCode: String!, $ReturnID: Int!) {
    AddReturnTransportCode(TransportCode: $TransportCode, ReturnID: $ReturnID){
        status
    }
}
`

const AddReturnTransportCodeDialog = (props: {ItemKey: number, onClose: Function, Refresh: Function}) => {
    const [AddReturnTransportCodeFunction] = useMutation<{AddReturnTransportCode: {status: boolean}}>(AddTransportCode);
    const [TransportCode, setTransportCode] = useState<string>('');

    function AddTransport(){
        AddReturnTransportCodeFunction({variables: {ReturnID: props.ItemKey, TransportCode: TransportCode}}).then((res) =>{
            if (res.data?.AddReturnTransportCode.status){
                props.onClose(null)
                setTransportCode('')
                props.Refresh()
            }
        })
    }

    return(
        <Dialog open={Boolean(props.ItemKey)} onClose={() => props.onClose(null)}>
            <DialogTitle>Add Transport Code</DialogTitle>
            <DialogContent>
                <TextField label="Item ID" variant='filled' fullWidth value={props.ItemKey} disabled/>
                <TextField label="Transport Code" variant="outlined" fullWidth={true} sx={{mt: '10px'}} onChange={(e) => setTransportCode(e.target.value)} value={TransportCode}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => AddTransport()} variant='contained'>Add</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddReturnTransportCodeDialog