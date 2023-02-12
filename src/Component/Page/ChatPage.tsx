import { Box, Typography, Button, Paper, Avatar, List , ListItem, ListItemButton, ListItemText, Badge, ListItemAvatar, Divider, InputBase, IconButton, Alert, Menu, MenuItem, Dialog, DialogContent, CircularProgress} from '@mui/material'
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { gql, useLazyQuery} from '@apollo/client';
import { useCookies } from 'react-cookie';
import { useChatsocket } from '../Public_Data/Public_Application';
import { Chat_API} from '../../API/Request';
import { ChatDataContent, TypeMessageBox } from '../AddComponect/Chat/ChatComponent';
import BlockIcon from '@mui/icons-material/Block';
import FlagIcon from '@mui/icons-material/Flag';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTranslation } from 'react-i18next';

const GetChatData = gql`
query ChatRecord($target: String!, $Start: Int!, $End: Int!) {
    ChatRecord(target: $target, Start: $Start, End: $End)
}
`

const GetChatRecordList = gql`
query ChatUserList{
    ChatUserList
}
`

const ChatPage = () => {
    const [GetChatFunction] = useLazyQuery<{ChatRecord: any}>(GetChatData, {fetchPolicy: 'network-only'});
    const [GetChatListFunction] = useLazyQuery<{ChatUserList: string}>(GetChatRecordList);
    const [ChatData, setChatData] = useState<{id: number, Date: string, Message: string, SenderName: string, Time: string, Type: string}[]>([]);
    const [ChatList, setChatList] = useState<{[Target: string]: {Date: string, Message: string, Time: string, Sender: string, Read: number}}>({})
    const [ChatCount, setChatCount] = useState<{Begin: number, End: number}>({Begin: 0, End: 15})  
    const [ExistRecord, setExistRecord] = useState<boolean>(true)
    const [Initial, setInitial] = useState<boolean>(false)
    const [cookies] = useCookies()
    const {ResponseData, MessageList, Target, setTarget, Reset, Send} = useChatsocket({URL: 'ws://127.0.0.1:8000/ws/connect', Param: {Authorization: cookies['access']}})
    const [AlertMessage, setAlertMessage] = useState<string>('')
    const [UserInformationAnchorEI, setUserInformationAnchorEI] = useState<null | HTMLElement>(null)
    const bottomRef = useRef<any>(null);
    const [previous, setprevious] = useState<string[]>([])
    const [Finish, setFinish] = useState<boolean>(false)
    const [, forceUpdate] = useReducer(x => x + 1, 0)
    const {t} = useTranslation()

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

    useEffect(() =>{
        setFinish(false)
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
                    bottomRef.current.scrollTo(0, 200)           
                }
                setprevious([])
                setFinish(true)
            }
        })
    },[GetChatFunction, ChatCount, Target])

    useEffect(() =>{
        GetChatListFunction().then((res)=>{
          if (res.data){
            if (JSON.parse(res.data.ChatUserList)){
                setChatList(JSON.parse(res.data.ChatUserList)) 
            }
          }    
        })
      }, [GetChatListFunction])

    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        var diff = bottomRef.current?.scrollHeight - bottomRef.current?.clientHeight
        if((diff <= bottomRef.current?.scrollTop+100 || !Initial )) {
            bottomRef.current.scrollTo(0, bottomRef.current?.scrollHeight)
        }
    }, [ResponseData, ChatData, Initial, Finish]);

    function Scroll(e: any){
        if(e.target.scrollTop === 0 && ExistRecord && ChatData.length !== 0){
            if (!Initial){setInitial(true)}
            setChatCount({Begin: ChatCount.End, End: ChatCount.End + 15})
            //bottomRef.current.scrollTo(0, 200)
        }
    }


    function OnClickTab(TargetName: string){
        if (TargetName in MessageList){
            MessageList[TargetName]['Read'] = 0
        }
        if (TargetName in ChatList){
            ChatList[TargetName]['Read'] = 0
        }       
        Reset()
        setExistRecord(true)
        setChatData([])
        setprevious([])
        setInitial(false)
        setChatCount({Begin: 0, End: 15})
        setTarget(TargetName)
    }
            
    return (
            <div style={{height: `${window.screen.height - 230}px`, display: 'flex', flexDirection: 'row', marginTop: '105px'}}>
                <Paper sx={{width: '20%', height: '100%', overflow: 'auto', minWidth: '300px'}}>
                    <List>
                        {Object.entries(MessageList).map((item, index) => (
                            <React.Fragment key={index}>
                                <ListItem onClick={() => OnClickTab(item[0])}>
                                    <ListItemButton>
                                        <ListItemAvatar>
                                            <Badge badgeContent={item[1].Read} color="success" >
                                                <Avatar/>
                                            </Badge>                            
                                        </ListItemAvatar>
                                        <ListItemText primary={item[0]} secondary={`${item[1].Sender}: ${item[1].Message.slice(0, 15)}`}/>
                                        <Typography>{item[1].Time.substring(0, 5)}</Typography>
                                    </ListItemButton>
                                </ListItem>
                                <Divider/>
                            </React.Fragment>
                        ))}
                        {Object.entries(ChatList).map((item, index) => {
                            if (item[0] in MessageList){return (null)}
                            else{
                                return(
                                    <React.Fragment key={index}>
                                        <ListItem onClick={() => OnClickTab(item[0])}>
                                            <ListItemButton>
                                                <ListItemAvatar>
                                                    <Badge badgeContent={item[1].Read} color="success" >
                                                        <Avatar/>
                                                    </Badge>                            
                                                </ListItemAvatar>
                                                <ListItemText primary={item[0]} secondary={`${item[1].Sender}: ${item[1].Message.slice(0, 15)}`}/>
                                                <Typography>{item[1].Time.substring(0, 5)}</Typography>
                                            </ListItemButton>
                                        </ListItem>
                                        <Divider/>
                                    </React.Fragment>
                                )
                            }
                        })}
                    </List>
                </Paper>
                <Box sx={{width: '80%', height: '100%', backgroundColor: 'rgb(250,250,250)', position: 'relative',
                        border: 'solid 1px rgb(220,220,220)', borderRadius: '5px', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                    <Box sx={{width: '100%', height: '10%', display: 'flex', alignItems: 'center', backgroundColor: 'rgb(230,230,230)', justifyContent: 'space-between'}}>
                        {Target &&
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Avatar sx={{ml: '15px', ":hover": {backgroundColor: 'rgb(150,150,200)', cursor: 'pointer'}}} onClick={() => window.location.assign(`/Profile/${Target}`)} />
                            <ListItemText sx={{ml: '15px'}} primary={Target}/>
                        </div>}
                        {Target &&
                        <div onClick={(e: React.MouseEvent<HTMLDivElement>) => setUserInformationAnchorEI(e.currentTarget)}>
                            <MoreVertIcon sx={{":hover": {cursor: 'pointer'}, mr: '15px'}}/>
                        </div>}
                    </Box>
                    <Menu anchorEl={UserInformationAnchorEI} open={Boolean(UserInformationAnchorEI)} onClose={() => setUserInformationAnchorEI(null)} keepMounted disableScrollLock={true}>
                        <MenuItem>
                            <BlockIcon sx={{mr: '10px'}}/>
                            <Typography textAlign="center">{t("Chat.BlockUser")}</Typography>
                        </MenuItem>
                        <MenuItem>
                            <FlagIcon sx={{mr: '10px'}}/>
                            <Typography textAlign="center">{t("Chat.ReportUser")}</Typography>
                        </MenuItem>
                    </Menu>
                    {AlertMessage && <Alert sx={{position: 'absolute', top: '20%', width: '60%', zIndex: '999'}} severity="error">{AlertMessage}</Alert>}
                    {Target&& !Finish && <CircularProgress  sx={{ position: 'absolute', left: '50%', top: '50%', }} color="secondary"/>}
                    <Paper sx={{width: '100%', height: '84%', overflowY: "scroll", backgroundColor: 'rgb(252,252,252)'}} onScroll={Scroll} ref={bottomRef}>
                        <ChatDataContent ChatData={ChatData} previous={previous} Target={Target} DeleteMessageFunction={DeleteMessageFunction} From='Prev'/>
                        <ChatDataContent ChatData={ResponseData} previous={previous} Target={Target} DeleteMessageFunction={DeleteMessageFunction} From='Now'/>
                    </Paper>
                    <TypeMessageBox Target={Target} cookies={cookies} setAlertMessage={setAlertMessage} SocketSendFunction={Send}/>         
                </Box>
            </div>
    )

  }

export default ChatPage