import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Rating, Typography } from '@mui/material'
import React from 'react'
import { useCookies } from 'react-cookie'
import { useMutation, gql } from '@apollo/client'
import { useTranslation } from 'react-i18next'

const MakeCommentMutation = gql`
mutation MakeComment($OrderID: Int!, $OrderItemID: Int!, $SubItemID: Int!, $CommentTitle: String!, $CommentContent: String!, $Score: Int!){
    MakeComment(OrderID: $OrderID, OrderItemID: $OrderItemID, SubItemID: $SubItemID, CommentTitle: $CommentTitle, CommentContent: $CommentContent, Score: $Score){
        status
    }
}
`

const CommentOrderDialog = (props: {OrderData: {Order_ID: number, OrderItem_ID: number, SubItem_ID: number}|null|undefined, setOrderData: Function, Refetch_OrderList: Function}) => {
    const [CommentTitle, setCommentTitle] = React.useState<string>('')
    const [CommentContent, setCommentContent] = React.useState<string>('')
    const [Score, setScore] = React.useState<number|null>(0)
    const [MakeCommentFunction] = useMutation(MakeCommentMutation)
    const {t} = useTranslation()

    function MakeComment(){
        if (props.OrderData && Score !== null){
            MakeCommentFunction({variables: {OrderID: props.OrderData.Order_ID, OrderItemID: props.OrderData.OrderItem_ID, 
                                 SubItemID: props.OrderData.SubItem_ID, CommentTitle: CommentTitle, CommentContent: CommentContent, Score: Score}}).then(res =>{
                if (res.data && res.data.MakeComment.status){
                    props.setOrderData(null);
                    props.Refetch_OrderList();
                    setCommentTitle('');
                    setCommentContent('');
                    setScore(null);
                }
            })
        }    
    }

    return (
    <Dialog open={Boolean(props.OrderData)} onClose={() => props.setOrderData(null)}>
        <DialogTitle>{t("Order.CommentOrder")}</DialogTitle>
        <DialogContent>
            <TextField label={t("Order.Title")} value={CommentTitle} onChange={(e) => setCommentTitle(e.target.value)} fullWidth sx={{mt: '10px'}}/>
            <TextField label={t("Order.Content")} value={CommentContent} onChange={(e) => setCommentContent(e.target.value)} fullWidth sx={{mt: '10px'}} multiline rows={5}/>
            <div style={{marginTop: '10px'}}>
                <Typography variant='body1'>{t("Order.ProductScore")}</Typography>
                <Rating value={Score} onChange={(e, v) => setScore(v)} size="large"/>
            </div>        
        </DialogContent>
        <DialogActions>
            <Button variant='contained' onClick={() => MakeComment()}>{t("Order.Submit")}</Button>
        </DialogActions>
    </Dialog>
    )
}

export default CommentOrderDialog