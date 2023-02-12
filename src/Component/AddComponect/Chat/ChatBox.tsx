import { Box, IconButton, Typography, Button, Paper, Avatar, Chip, InputBase, ListItemText, Alert} from '@mui/material'
import React, { useEffect, useReducer, useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { gql, useLazyQuery } from '@apollo/client';
import { useCookies } from 'react-cookie';
import { useChatsocket } from '../../Public_Data/Public_Application';
import { Chat_API } from '../../../API/Request';
import { ChatDataContent } from './ChatComponent';
import ImageIcon from '@mui/icons-material/Image';
import { useTranslation } from 'react-i18next';


const GetChatData = gql`
query ChatRecord($target: String!, $Start: Int!, $End: Int!) {
    ChatRecord(target: $target, Start: $Start, End: $End)
}
`

const ChatBox = (props: {Target: string, onClose: Function}) => {
  const [GetChatFunction] = useLazyQuery<{ChatRecord: any}>(GetChatData);
  const [ChatData, setChatData] = useState<{id: number, Date: string, Message: string, SenderName: string, Time: string, Type: string}[]>([])
  const [cookies] = useCookies(['access'])
  const [AlertMessage, setAlertMessage] = useState<string>('')
  const inputFileRef = useRef<HTMLInputElement>(null)
  const {Send, ResponseData, Status, setTarget, Target} = useChatsocket({URL: 'ws://127.0.0.1:8000/ws/connect', Param: {Authorization: cookies['access']}})
  const [Message, setMessage] = useState<string>('')
  const bottomRef = useRef<any>(null);
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  const [previous, setprevious] = useState<string[]>([])
  const [ExistRecord, setExistRecord] = useState<boolean>(true)
  const [Initial, setInitial] = useState<boolean>(false)
  const [ChatCount, setChatCount] = useState<{Begin: number, End: number}>({Begin: 0, End: 15}) 
  const [Finish, setFinish] = useState<boolean>(false)
  const {t} = useTranslation()
  

  useEffect(() => {setTarget(props.Target)}, [setTarget, props.Target])

  function Scroll(e: any){
    if(e.target.scrollTop === 0 && ExistRecord && ChatData.length !== 0){
        if (!Initial){setInitial(true)}
        setChatCount({Begin: ChatCount.End, End: ChatCount.End + 15})
        //bottomRef.current.scrollTo(0, 200)
    }
  }
  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    var diff = bottomRef.current?.scrollHeight - bottomRef.current?.clientHeight
    if((diff <= bottomRef.current?.scrollTop+100 || !Initial )) {
        bottomRef.current.scrollTo(0, bottomRef.current?.scrollHeight)
    }
  }, [ResponseData, ChatData, Initial, Finish]);

  useEffect(() =>{
    GetChatFunction({variables: {target: Target, Start: ChatCount.Begin, End: ChatCount.End}}).then((res)=>{
      if (res.data?.ChatRecord !== null && res.data){
        const Data = JSON.parse(res.data.ChatRecord) 
        if (Data.length === 0){
            setExistRecord(false)
        }else{
            setChatData((prev) =>{
                return(
                    [...Data, ...prev]
                )
            })
            bottomRef.current.scrollTo(0, Math.min(300*ChatCount.End/30, 250))           
        }
        setprevious([])
        setFinish(true)
    }
    })
  },[GetChatFunction, Target, ChatCount])

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({behavior: 'auto', block: 'end', inline: 'nearest'});
  }, [ChatData, ResponseData]);

  function SendMessage(Data: {Message: string,  Target: string}){
    Send({message: Data.Message, target: Data.Target, type: 'String'})
    setMessage('')
  }

  function SendFiles(Files: FileList ){
      if (Files.length > 5){
          setAlertMessage('You can only upload 5 files at once')
          setTimeout(() => setAlertMessage(''), 3000);
      }else{
          const FilesInput = Object.values(Files).map((File) => (File))
          Chat_API.FileChat({Access_Token: cookies['access'], Files: FilesInput, Target: Target})
      }
  }

  function DeleteMessageFunction(data: {id: number|string, position: number, From: string, Date: string, Time: string}){
      const CurrentTime = new Date()
      const CreateTime = new Date(data.Date + ' ' + data.Time)
      if(CurrentTime.getTime() - CreateTime.getTime() > 60*60*1000){
          setAlertMessage('You can only delete messages within 1 hour')
          setTimeout(() => setAlertMessage(''), 3000);
      }else{
          Chat_API.DeleteChat({Access_Token: cookies['access'], id: data.id}).then((res) =>{
              if (data.From === 'Prev'){
                  ChatData[data.position].Type = 'Delete'
              }else if (data.From === 'Now'){
                  ResponseData[data.position].Type = 'Delete'
              }
              forceUpdate()
          })
      }
  }

  return (
        <Box sx={{position: 'fixed', width: '500px', bottom: '3%', right: '3%', backgroundColor: 'rgb(250,250,250)',
                  border: 'solid 1px rgb(220,220,220)', borderRadius: '5px', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            <div>
              <IconButton sx={{position: 'absolute', right: '0%'}} onClick={() => props.onClose(null)}>
                  <CloseIcon/>
              </IconButton>
              <Chip label={t(`Chat.${Status}`)} sx={{position: 'absolute', right: '10%', mt: '5px'}} color='success'/>
              <Typography variant='body2' sx={{marginTop: '10px', display: 'flex', alignItems:'center', justifyContent: 'center'}}>
                  {t("Chat.ChatBox")}
              </Typography>            
            </div>  
            {AlertMessage && <Alert sx={{position: 'absolute', top: '7.5%', width: '60%', zIndex: '999'}} severity="error">{AlertMessage}</Alert>}
            <Paper sx={{width: '95%', height: '500px', mt: '15px', overflowY: "scroll"}} onScroll={Scroll} ref={bottomRef} >
              <ChatDataContent ChatData={ChatData} previous={previous} Target={Target} DeleteMessageFunction={DeleteMessageFunction} From={'Prev'}/>
              <ChatDataContent ChatData={ResponseData} previous={previous} Target={Target} DeleteMessageFunction={DeleteMessageFunction} From={'Now'}/>
            </Paper>
            <div style={{display: 'flex', width: '98%', marginTop: '10px', marginBottom: '10px',  alignItems: 'center', height: '5%'}}>
              <InputBase sx={{ ml: '10px', width: '100%'}} placeholder="Type Here" value={Message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => {if(e.key === 'Enter' && Message !== ''){SendMessage({Message: Message, Target: Target})}}}/>
              <IconButton type="submit" sx={{ padding: '10px' }} onClick={() => {inputFileRef.current?.click()}}>
                  <input ref={inputFileRef} type="file" id="files" name="files" multiple style={{display: 'none'}} onChange={(e) => {if (e.target.files) {SendFiles(e.target.files)}}} accept="image/*" />
                  <ImageIcon />
              </IconButton>
            </div>  
                  
        </Box>
  )
}

export default ChatBox